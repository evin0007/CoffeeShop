import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Award, Smile, RefreshCw, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const CustomerRatingsBox = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0 });

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/showratings');
      if (data?.length > 0) {
        const avg = data.reduce((acc, curr) => acc + (Number(curr.rate) || 0), 0) / data.length;
        setStats({ average: Math.round(avg) || 0 });
        setRatings([...data, ...data]);
      } else { setStats({ average: 0 }); setRatings([]); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchRatings(); }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2D1B14' }).then(async (r) => {
      if (r.isConfirmed) {
        await axios.delete(`http://127.0.0.1:8000/api/showratings/${id}`);
        Swal.fire({ title: 'Deleted', icon: 'success', timer: 1000, showConfirmButton: false });
        fetchRatings();
      }
    });
  };

  const Stars = ({ val, size }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={size} fill={s <= val ? "#D4A373" : "none"} stroke={s <= val ? "#D4A373" : "#D1D5DB"} />)}
    </div>
  );

  return (
    <div className="w-full h-[300px] bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col font-sans text-[#2D1B14] relative">
      <style>{` @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } } .animate-scroll { animation: scrollUp 25s linear infinite; } .animate-scroll:hover { animation-play-state: paused; } `}</style>
      <div className="p-4 bg-white border-b border-stone-50 z-20">
        <div className="flex justify-between items-center mb-3">
          <div><h1 className="text-xs font-serif italic font-black">Community Feedback.</h1><p className="text-[6px] font-mono font-bold text-[#A69080] uppercase tracking-widest">Live Sentiment Analysis</p></div>
          <button onClick={fetchRatings} className="hover:rotate-180 transition-all duration-500 text-stone-300"><RefreshCw size={10}/></button>
        </div>
        <div className="flex items-center justify-between bg-[#2D1B14] px-4 py-2 rounded-xl shadow-md text-white">
          <div className="flex flex-col"><span className="text-[6px] font-mono uppercase tracking-widest opacity-50">Overall Rating</span><span className="text-[9px] font-serif italic text-[#D4A373] font-bold">{stats.average}.0 / 5.0</span></div>
          <Stars val={stats.average} size={12} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative bg-[#FBFBFB]">
        {loading ? <div className="text-[8px] text-center py-10 animate-pulse">Syncing...</div> : (
          <div className="p-3 animate-scroll">
            {ratings.map((item, i) => (
              <div key={`${item.id}-${i}`} className="group mb-2 bg-white p-2.5 rounded-xl border border-stone-100 flex items-center gap-3 relative">
                <div className="w-6 h-6 bg-[#F8F5F2] rounded-lg flex items-center justify-center text-[#D4A373]">{(Number(item.rate) || 0) >= 4 ? <Award size={12}/> : <Smile size={12}/>}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-0.5"><h4 className="text-[9px] font-bold truncate">{item.customer_name || "Guest"}</h4><div className="ml-2"><Stars val={item.rate} size={8} /></div></div>
                  <p className="text-[8px] text-stone-500 truncate italic">"{item.comment}"</p>
                </div>
                <button onClick={(e) => handleDelete(e, item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerRatingsBox;