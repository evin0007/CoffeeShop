import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ViewOrderModal from './ViewOrderModal'; 

const API_BASE_URL = window.location.origin + "/api/customers-records";

const CustomersRecord = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(API_BASE_URL);
            setRecords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (order) => {
        console.log("Selected Order Data:", order); 
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Discard Order?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4b2c20',
            cancelButtonColor: '#967259',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_BASE_URL}/${id}`);
                    setRecords(prev => prev.filter(item => item.id !== id));
                    Swal.fire('Deleted!', 'Order has been removed.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Failed to connect to server.', 'error');
                }
            }
        });
    };

    const getStatusStyle = (s) => {
        const status = s?.toLowerCase();
        if (status === 'completed') return 'bg-green-100 text-green-800 border border-green-200';
        if (status === 'pending') return 'bg-orange-100 text-orange-800 border border-orange-200';
        return 'bg-stone-100 text-stone-600 border border-stone-200';
    };

    const dt = (str, type) => {
        if (!str) return type === 'd' ? 'N/A' : '';
        const d = new Date(str);
        return type === 'd' 
            ? d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="p-20 text-center text-stone-500 italic animate-pulse">Brewing your data...</div>;

    return (
        <div className="mx-auto rounded-2xl shadow-lg overflow-hidden bg-white border border-stone-200">
            <ViewOrderModal 
                isOpen={isModalOpen} 
                order={selectedOrder} 
                onClose={() => setIsModalOpen(false)} 
            />

            <div className="p-2 bg-[#4b2c20] flex justify-between items-center text-stone-50">
                <div>
                    <h2 className="text-xl font-serif tracking-wide">Coffee Shop Logs</h2>
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Transaction History</p>
                </div>
                <span className="text-[10px] bg-stone-700/50 px-3 py-1 rounded-full uppercase tracking-widest border border-stone-600">
                    Live Feed
                </span>
            </div>
            <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100">
                <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-wider border-b border-stone-100">
                            <th className="px-6 py-4 text-left">Ticket</th>
                            <th className="px-6 py-4 text-center">Staff</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-left">Total</th>
                            <th className="px-6 py-4 text-left">Timestamp</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {records.length > 0 ? records.map((item) => (
                            <tr key={item.id} className="hover:bg-stone-50/80 transition-colors group">
                                <td className="px-6 py-2 font-mono text-xs font-bold text-amber-900">
                                    #{item.code}
                                </td>
                                <td className="px-6 py-2 text-stone-700 text-center font-medium text-sm whitespace-nowrap">
                                    {item.staff}
                                </td>
                                <td className="px-6 py-2 text-center">
                                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getStatusStyle(item.status)}`}>
                                        {item.status || 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-2 font-bold text-stone-900 text-sm">
                                    ₱{parseFloat(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                    <div className="text-xs text-stone-800 font-medium">{dt(item.created_at, 'd')}</div>
                                    <div className="text-[10px] text-stone-400">{dt(item.created_at, 't')}</div>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center justify-center gap-3">

                                        <button 
                                            onClick={() => handleView(item)}
                                            className="bg-stone-800 text-white hover:bg-[#4b2c20] shadow-sm transition-all px-4 py-1.5 rounded-lg text-xs font-bold"
                                        >
                                            View
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDelete(item.id)} 
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                                        >
                                            Void
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-20 text-center text-stone-400 italic font-serif">No orders in the hopper...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-stone-50 text-center border-t border-stone-100 sm:hidden">
                <span className="text-[10px] text-stone-400 italic font-medium tracking-wide">
                    ← Swipe table to view all records →
                </span>
            </div>
        </div>
    );
};

export default CustomersRecord;