import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { showOrderSuccess, showRatingModal } from './RatingModal';

const STORAGE_URL = window.location.origin + "/storage/";

export default function OrderSummary({ cart, total, onBack, onUpdate }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderType, setOrderType] = useState('DINE-IN');

  const handleCheckout = async () => {
    if (!cart.length) return;

    const { isConfirmed } = await Swal.fire({
      title: 'CONFIRM ORDER?',
      text: `Place ${orderType} order for ₱${total.toLocaleString()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1c1917',
      confirmButtonText: 'YES',
    });

    if (!isConfirmed) return;
    setIsProcessing(true);

    const itemsFormatted = cart.map(({ product_name, selectedSize, quantity, finalPrice }) => 
      `'${product_name} ${selectedSize} x${quantity} ${finalPrice * quantity}'`
    ).join(',');

    try {
      const res = await fetch(window.location.origin + "/api/checkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all_order: itemsFormatted, status: orderType, total_price: total, staff: 'Customer App' }),
      });

      const data = await res.json();
      
      if (res.ok) {
        await showOrderSuccess(data.code);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await showRatingModal();
        
        window.location.reload();
      }
    } catch (error) {
      Swal.fire('Error', 'Connection failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto flex flex-col min-h-screen border-x border-stone-100">
        <div className="p-2 flex items-center justify-between border-b border-stone-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full font-black">←</button>
          <h2 className="text-lg font-black text-stone-900 uppercase">My Order</h2>
          <span className="text-xs font-bold text-stone-400">{cart.length} Items</span>
        </div>

        <div className="px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Service</p>
            <div className="flex gap-1 p-0.5 bg-stone-100 rounded-lg w-40">
                {['DINE-IN', 'TAKE-OUT'].map((type) => (
                    <button key={type} onClick={() => setOrderType(type)} className={`flex-1 py-1 rounded-md font-black text-[9px] ${orderType === type ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>{type}</button>
                ))}
            </div>
        </div>
        <div className="flex-1 p-2 space-y-2 bg-amber-50/30 overflow-y-auto">
          {cart.map(item => (
            <div key={item.cartItemId} className="flex items-center bg-white border border-stone-100 rounded-2xl p-1 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-stone-100 rounded-xl overflow-hidden">
                    {item.picture && <img src={`${STORAGE_URL}${item.picture}`} className="w-full h-full object-cover" alt="" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.product_name} {item.selectedSize && <span className="text-[10px] bg-stone-900 text-white px-1 rounded">{item.selectedSize}</span>}</h4>
                  <p className="text-xs text-amber-700 font-bold">₱{item.finalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2">
                <button onClick={() => onUpdate(item.cartItemId, -1)} className="p-1 font-bold">-</button>
                <span className="text-xs font-black">{item.quantity}</span>
                <button onClick={() => onUpdate(item.cartItemId, 1)} className="p-1 font-bold">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 bg-white">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs mb-2 font-black text-stone-400 uppercase">Total Bill</span>
            <span className="text-3xl font-black">₱{total.toLocaleString()}</span>
          </div>
          <button 
            disabled={isProcessing || !cart.length}
            onClick={handleCheckout}
            className="w-full bg-stone-900 text-white py-2 mb-2 rounded-2xl font-black text-xs tracking-widest disabled:bg-stone-200">
            {isProcessing ? 'PROCESSING...' : `CONFIRM ${orderType}`}
          </button>
        </div>
      </div>
    </div>
  );
}