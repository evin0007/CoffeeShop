import React from 'react';

const ViewOrderModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;
    const parseOrderString = (orderStr) => {
        if (!orderStr) return [];
        const itemsArray = orderStr.split(',').map(item => item.trim().replace(/'/g, ""));
        return itemsArray.map(item => {
            const parts = item.split(' ');
            const price = parts.pop(); 
            const qty = parts.pop(); 
            const name = parts.join(' '); 
            return {
                name: name,
                qty: qty,
                price: price
            };
        });
    };
    const items = parseOrderString(order.all_order);
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-4 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pt-2 pb-1 border-b border-gray-100 w-full text-center">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Order Details</h2>
                </div>
                <div className="text-left font-sans text-gray-800 mt-4">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Order Ref</p>
                            <p className="text-sm font-bold text-gray-700">{order.code}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Server</p>
                            <p className="text-sm font-bold text-gray-700">{order.staff}</p>
                        </div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase bg-gray-50 px-2 py-1.5 rounded-t-lg border border-gray-100 border-b-0">
                        <span>Items</span>
                        <span>Price</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-gray-100 border-t-0 rounded-b-lg mb-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center px-2 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-semibold text-gray-800 uppercase leading-tight">
                                        {item.name}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                        Quantity: <span className="font-bold">{item.qty}</span>
                                    </span>
                                </div>
                                <span className="text-[13px] font-bold text-gray-900 font-mono">
                                    ₱{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="px-1 space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                    order.status?.toLowerCase() === 'completed' 
                                    ? 'bg-green-50 text-green-600 border-green-200' 
                                    : 'bg-orange-50 text-orange-600 border-orange-200'
                                }`}>
                                    {order.status || 'Pending'}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total Amount</p>
                                <p className="text-2xl font-black text-gray-900">
                                    ₱{parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 text-sm font-bold rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors uppercase tracking-widest shadow-md active:scale-[0.98]"
                    >
                        Close Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;