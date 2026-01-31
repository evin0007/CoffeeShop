import React, { useState, useEffect } from 'react';
import OrderSummary from './menu_tab/OrderSummary';

const CATEGORIES = ['All Menu', 'Hot Coffee', 'Ice Coffee', 'Milktea', 'Meal', 'Appetizer'];
const STORAGE_URL = "http://127.0.0.1:8000/storage/";
const SIZES = [{ label: 'S', extra: 0 }, { label: 'M', extra: 20 }, { label: 'L', extra: 35 }];
const DRINK_CATS = ['Hot Coffee', 'Ice Coffee', 'Milktea'];

const getPrice = (item, sizeLabel) => 
  parseFloat(item.price) + (DRINK_CATS.includes(item.category) ? (SIZES.find(s => s.label === sizeLabel)?.extra || 0) : 0);

export default function OrderingSystem() {
  const [menuData, setMenuData] = useState([]);
  const [activeTab, setActiveTab] = useState('All Menu');
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('menu');
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => { setMenuData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalBill = cart.reduce((acc, i) => acc + (i.finalPrice * i.quantity), 0);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const addToCart = (product) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700);

    const isDrink = DRINK_CATS.includes(product.category);
    const sizeLabel = isDrink ? (selectedSizes[product.id] || 'S') : '';
    const finalPrice = getPrice(product, sizeLabel);
    const cartItemId = isDrink ? `${product.id}-${sizeLabel}` : `${product.id}`;

    setCart(prev => {
      const exists = prev.find(i => i.cartItemId === cartItemId);
      return exists 
        ? prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, cartItemId, selectedSize: sizeLabel, finalPrice, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => 
    setCart(prev => prev.map(i => i.cartItemId === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));

  if (view === 'checkout') return <OrderSummary cart={cart} total={totalBill} onUpdate={updateQty} onBack={() => setView('menu')} />;

  const filteredMenu = activeTab === 'All Menu' ? menuData : menuData.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-32">
      {isAnimating && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none animate-bounce">
          <div className="bg-orange-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-4 border-white text-xl font-bold">+</div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md p-3 border-b border-stone-200">
        <h1 className="text-3xl font-serif italic text-stone-800">Menu Selection.</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-4">Live Operational Ordering</p>
        <div className="flex flex-nowrap gap-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`relative px-6 py-2 rounded-full text-[10px] font-bold transition-all duration-300 whitespace-nowrap uppercase tracking-widest ${activeTab === cat ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-200/50 text-stone-500 hover:bg-stone-200'}`}>{cat}</button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-3">
        {loading ? (
          <div className="text-center py-20 text-stone-400 animate-pulse italic text-lg">Grinding the beans...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMenu.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                curSize={selectedSizes[item.id] || 'S'} 
                onSizeChange={(size) => setSelectedSizes(p => ({...p, [item.id]: size}))}
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
        {totalItems > 0 && (
          <button onClick={() => setView('checkout')} className="w-full bg-stone-900 text-white flex items-center justify-between p-1 pl-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 active:scale-95 transition-transform">
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">Total Bill</span>
              <span className="text-xl font-serif italic text-stone-100">₱{totalBill.toLocaleString()}</span>
            </div>
            <div className="bg-orange-800 px-8 py-2 rounded-2xl font-black text-[11px] flex items-center gap-3">
              CHECKOUT <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">{totalItems}</span>
            </div>
          </button>
        )}
      </footer>
    </div>
  );
}

function ProductCard({ item, curSize, onSizeChange, onAdd }) {
  const isDrink = DRINK_CATS.includes(item.category);
  const inactive = item.status !== 'active';
  const price = getPrice(item, curSize);

  return (
    <div className={`group border p-2 rounded-[20px] transition-all duration-500 ${inactive ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-white border-stone-100 hover:shadow-2xl'}`}>
      <div className="relative aspect-square rounded-[20px] mb-1 overflow-hidden bg-stone-100 shadow-inner">
        {item.picture ? (
          <img src={STORAGE_URL + item.picture} onError={e => e.target.src = item.picture} className={`w-full h-full object-cover transition-transform duration-700 ${!inactive && 'group-hover:scale-110'}`} alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">☕</div>
        )}
        {isDrink && !inactive && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 bg-white/60 backdrop-blur-sm p-1 rounded-full shadow-sm">
            {SIZES.map(s => (
              <button key={s.label} onClick={() => onSizeChange(s.label)} className={`w-4 h-4 rounded-full text-[9px] font-black transition-all ${curSize === s.label ? 'bg-orange-900 text-white' : 'text-stone-500 hover:text-orange-900'}`}>{s.label}</button>
            ))}
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full text-[10px] font-black shadow-sm">₱{price}</div>
        {inactive && <div className="absolute inset-0 bg-black/5 flex items-center justify-center font-black text-[10px] uppercase">Unavailable</div>}
      </div>
      <h3 className="font-bold text-[12px] text-stone-800 h-10 line-clamp-2 px-1 mb-1 leading-snug">{item.product_name}</h3>
      <div className='mt-[-15px]'>
        <button 
          disabled={inactive} 
          onClick={onAdd} 
          className={`w-full py-2 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all duration-300 border ${inactive ? 'bg-stone-200 text-stone-400 border-stone-200' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-900 hover:text-white hover:border-stone-900'}`}>
          {inactive ? 'Out of Stock' : 'Add to Order'}
        </button>
      </div>
    </div>
  );
}