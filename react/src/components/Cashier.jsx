import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Minus, ShoppingCart, ReceiptText, Search, PlusCircle, Coffee, ChevronLeft, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { showOrderDetailsAlert, showErrorAlert } from '../components/cashier_tab/OrderSearchModal';
import { useNavigate } from 'react-router-dom';
import logo from './../assets/images/coffee.png';

const MySwal = withReactContent(Swal);
const API_BASE = window.location.origin + "/api";
const STORAGE_URL = window.location.origin + "/storage/";
const SIZES = [{ label: 'S', extra: 0 }, { label: 'M', extra: 20 }, { label: 'L', extra: 35 }];
const DRINK_CATS = ['Hot Coffee', 'Ice Coffee', 'Milktea'];

const getPrice = (p, sizeLabel) => 
  parseFloat(p.price) + (DRINK_CATS.includes(p.category) ? (SIZES.find(s => s.label === sizeLabel)?.extra || 0) : 0);

const Cashier = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('DINE-IN');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [onlineSearchCode, setOnlineSearchCode] = useState(''); 
  const [selectedSizes, setSelectedSizes] = useState({});
  const [custom, setCustom] = useState({ name: '', price: '' });

  useEffect(() => {
    const session = localStorage.getItem('staff_user');
    if (!session) return navigate('/staffLogin');
    setStaff(JSON.parse(session));
    axios.get(`${API_BASE}/products`).then(res => setProducts(res.data)).catch(showErrorAlert);
  }, [navigate]);

  const handleLogout = async () => {
    const { isConfirmed } = await MySwal.fire({
      title: <span className="text-base font-black uppercase">Exit Terminal?</span>,
      text: "You will need to login again to process orders.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C2A21',
      cancelButtonColor: '#d33',
      confirmButtonText: 'LOGOUT',
      cancelButtonText: 'CANCEL'
    });

    if (isConfirmed) {
      localStorage.removeItem('staff_user');
      navigate('/staffLogin');
    }
  };

  const handleSearchOnlineOrder = async () => {
    if (!onlineSearchCode.trim()) return;
    try {
      const { data } = await axios.get(`${API_BASE}/orders/search/${onlineSearchCode}`, {
        params: { first_name: staff.first_name, last_name: staff.last_name }
      });
      data ? (showOrderDetailsAlert(data), setOnlineSearchCode('')) : showErrorAlert("Order not found.");
    } catch { showErrorAlert("Could not find that order code."); }
  };

  const addToCart = (p) => {
    const isDrink = DRINK_CATS.includes(p.category);
    const sizeLabel = isDrink ? (selectedSizes[p.id] || 'S') : '';
    const cartItemId = isDrink ? `${p.id}-${sizeLabel}` : `${p.id}`;
    setCart(prev => {
      const exists = prev.find(i => i.cartItemId === cartItemId);
      if (exists) return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, cartItemId, selectedSize: sizeLabel, finalPrice: getPrice(p, sizeLabel), quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => setCart(prev => prev.map(i => i.cartItemId === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  
  const addCustomItem = () => {
    if (!custom.name || !custom.price) return;
    setCart([...cart, { product_name: custom.name, cartItemId: `c-${Date.now()}`, selectedSize: '', finalPrice: parseFloat(custom.price), quantity: 1, picture: logo }]);
    setCustom({ name: '', price: '' });
  };

  const total = useMemo(() => cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const handlePayment = async () => {
    const { isConfirmed } = await MySwal.fire({
      title: <span className="text-base font-black">Confirm Payment?</span>,
      html: <p className="text-xs font-bold uppercase">Amount: ₱{total.toLocaleString()}</p>,
      icon: 'question', showCancelButton: true, confirmButtonColor: '#3C2A21', confirmButtonText: 'CONFIRM'
    });
  
    if (isConfirmed) {
      try {
        await axios.post(`${API_BASE}/orders`, {
          code: Math.random().toString(36).substring(2, 7).toUpperCase(),
          staff: `${staff.first_name} ${staff.last_name}`, 
          total_price: total, status: orderType,
          all_order: cart.map(i => `'${i.product_name} ${i.selectedSize} ${i.quantity}x ${i.finalPrice * i.quantity}'`).join(", ")
        });
        MySwal.fire({ icon: 'success', title: 'Order Saved', timer: 1000, showConfirmButton: false });
        setCart([]); setIsCartOpen(false);
      } catch { showErrorAlert('Error saving order.'); }
    }
  };

  if (!staff) return null;

  return (
    <div className="flex h-screen bg-[#FDF8F1] overflow-hidden font-sans text-[#3C2A21]">
      <div className={`flex-1 flex flex-col min-w-0 ${isCartOpen ? 'hidden md:flex' : 'flex'}`}>
        <header className="px-6 pt-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-serif italic font-black text-[#3C2A21]">Bean & Brew</h1>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">Terminal • {staff.first_name} {staff.last_name}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="p-2 bg-white border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all shadow-sm active:scale-90">
              <LogOut size={16} />
            </button>
          </div>
          <div className="w-full sm:w-56 relative flex items-center bg-white rounded-lg border border-stone-200 p-0.5 shadow-sm">
            <Search size={12} className="absolute left-2.5 text-stone-400" />
            <input id="search" value={onlineSearchCode} onChange={e => setOnlineSearchCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearchOnlineOrder()} placeholder="Sync Order Code..." className="w-full pl-8 pr-2 py-1 text-[10px] font-bold outline-none bg-transparent" />
          </div>
        </header>

        <nav className="px-6 flex gap-2 overflow-x-auto h-8 mb-4 shrink-0">
          {['All', ...DRINK_CATS, 'Meal', 'Appetizer'].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#3C2A21] text-white shadow-md' : 'bg-white text-stone-400 border border-stone-100'}`}>{cat}</button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-6 pb-24 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
          {(activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)).map(p => (
            <ProductCard key={p.id} p={p} size={selectedSizes[p.id] || 'S'} setSize={(s) => setSelectedSizes(prev => ({ ...prev, [p.id]: s }))} onAdd={() => addToCart(p)} />
          ))}
        </div>

        {!isCartOpen && cart.length > 0 && (
          <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#3C2A21] text-white p-4 flex justify-between items-center rounded-t-3xl shadow-2xl z-40" onClick={() => setIsCartOpen(true)}>
             <div><p className="text-[8px] font-bold uppercase opacity-60">Total Amount</p><p className="text-lg font-black tracking-tight">₱{total.toLocaleString()}</p></div>
             <div className="flex items-center gap-3"><span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-md">{totalItems} ITEMS</span><div className="bg-white text-[#3C2A21] p-2 rounded-xl"><ShoppingCart size={20} /></div></div>
          </div>
        )}
      </div>

      <aside className={`fixed inset-0 z-50 bg-white flex flex-col transition-all duration-300 md:relative md:inset-auto md:w-80 lg:w-96 md:border-l md:border-stone-100 md:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-4 md:p-5 border-b border-stone-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(false)} className="md:hidden p-1 text-stone-400"><ChevronLeft size={24} /></button>
            <h2 className="text-[12px] md:text-[14px] font-black uppercase tracking-tight flex items-center gap-2"><ReceiptText size={16} /> Order Details</h2>
          </div>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-1 rounded-md">{totalItems} ITEMS</span>
        </div>

        <div className="p-2 shrink-0 flex bg-stone-100 m-2 rounded-xl">
          {['DINE-IN', 'TAKE-OUT'].map(t => <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${orderType === t ? 'bg-white shadow-sm text-[#3C2A21]' : 'text-stone-400'}`}>{t}</button>)}
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-2 bg-[#FDF8F1]/40 space-y-2">
          {!cart.length ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10"><Coffee size={40} /><p className="text-[10px] font-black mt-2">EMPTY CART</p></div>
          ) : cart.map(i => <CartItem key={i.cartItemId} item={i} onUpdate={updateQuantity} onRemove={(id) => setCart(cart.filter(x => x.cartItemId !== id))} />)}
        </div>

        <div className="p-4 bg-white border-t border-stone-50 shadow-sm shrink-0">
          <div className="mb-3 flex gap-2 items-center bg-stone-50 p-1 rounded-xl border border-stone-100">
            <input id="custom-name" value={custom.name} onChange={e => setCustom({...custom, name: e.target.value})} placeholder="Custom item..." className="flex-1 bg-white rounded-lg px-2 py-1 text-[10px] font-bold outline-none border border-stone-200" />
            <input id="custom-price" value={custom.price} onChange={e => setCustom({...custom, price: e.target.value})} type="number" placeholder="₱" className="w-14 bg-white rounded-lg px-2 py-1 text-[10px] font-bold outline-none border border-stone-200" />
            <button onClick={addCustomItem} className="bg-[#3C2A21] text-white p-1 rounded-lg active:scale-95"><PlusCircle size={20} /></button>
          </div>
          <div className="flex justify-between items-center mb-4">
             <div><p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Total Payable</p><p className="text-2xl font-black tracking-tighter">₱{total.toLocaleString()}</p></div>
             <button onClick={() => setCart([])} className="text-stone-400 border px-3 py-1 rounded hover:text-red-500 text-[10px] font-bold">Clear</button>
          </div>
          <button onClick={handlePayment} disabled={!cart.length} className={`w-full py-3 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase transition-all ${cart.length ? 'bg-[#3C2A21] text-white active:scale-95 shadow-lg shadow-[#3C2A21]/20' : 'bg-stone-100 text-stone-300'}`}>Process Payment</button>
        </div>
      </aside>
    </div>
  );
};

const ProductCard = ({ p, size, setSize, onAdd }) => {const disabled = p.status !== 'active';const isDrink = DRINK_CATS.includes(p.category);
  return (
    <div className={`p-1.5 rounded-2xl flex flex-col ${disabled ? 'bg-stone-100 opacity-50' : 'bg-white shadow-sm'}`}>
      <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2 relative">
        <img src={STORAGE_URL + p.picture} onError={e => e.target.src = p.picture} className="w-full h-full object-cover" alt="" />
        {isDrink && !disabled && (
          <div className="absolute bottom-1 flex w-[90%] left-[5%] bg-black/40 backdrop-blur-sm p-1 rounded-lg">
            {SIZES.map(s => <button key={s.label} onClick={e => {e.stopPropagation(); setSize(s.label)}} className={`flex-1 text-[9px] font-black rounded ${size === s.label ? 'bg-white' : 'text-white/60'}`}>{s.label}</button>)}
          </div>
        )}
        {disabled && <span className="absolute inset-0 flex items-center justify-center bg-white/20 font-black text-[8px] uppercase">Not Available</span>}
      </div>
      <h3 className="font-black text-[9px] truncate uppercase px-1">{p.product_name}</h3>
      <div className="flex justify-between items-center px-1 mt-1">
        <span className="font-black text-[10px]">₱{getPrice(p, size)}</span>
        <button onClick={onAdd} disabled={disabled} className={`w-7 h-7 rounded-lg flex items-center justify-center ${disabled ? 'bg-stone-300' : 'bg-[#3C2A21] text-white'}`}><Plus size={14} /></button>
      </div>
    </div>
  );
};

const CartItem = ({ item, onUpdate, onRemove }) => (
  <div className="flex gap-2 items-center bg-white p-1.5 rounded-2xl border border-stone-100 shadow-sm">
    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-50">
    <img src={STORAGE_URL + item.picture} className="w-full h-full object-cover" alt={item.name}onError={(e) => {if (e.target.src !== item.picture) {e.target.src = item.picture;} else {e.target.style.display = 'none';}}}/>
    </div>
    <div className="min-w-0 flex-1">
      <p className="font-black text-[10px] uppercase truncate">{item.product_name}</p>
      <div className="flex items-center gap-2">
         <p className="text-[10px] font-black">₱{(item.finalPrice * item.quantity).toLocaleString()}</p>
         {item.selectedSize && <span className="text-[7px] bg-stone-100 px-1 py-0.5 rounded font-black text-stone-500">{item.selectedSize}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg">
      <button onClick={() => item.quantity === 1 ? onRemove(item.cartItemId) : onUpdate(item.cartItemId, -1)} className="text-stone-400 hover:text-red-500"><Minus size={12} /></button>
      <span className="text-[10px] font-black w-3 text-center">{item.quantity}</span>
      <button onClick={() => onUpdate(item.cartItemId, 1)} className="text-stone-400 hover:text-[#3C2A21]"><Plus size={12} /></button>
    </div>
  </div>
);

export default Cashier;