import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderItem = ({ name, id, status, price }) => (
  <div className="flex items-center justify-between p-2 border-b border-stone-50 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center font-bold text-s text-white uppercase">
        {name?.charAt(0) || 'C'}
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-800">{name}</p>
        <p className="text-[10px] text-stone-400 font-mono">#{id}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-stone-800">₱{price}</p>
      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-stone-100 text-stone-600">
        {status}
      </span>
    </div>
  </div>
);

function Recent_Order() {
  const [recieptrecord, Records] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/customers-records')
      .then(response => {
        Records(Array.isArray(response.data) ? response.data : []);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const [staffrecord, staff] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/staff/record')
      .then(response => {
        staff(Array.isArray(response.data) ? response.data : []);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-stone-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-serif italic">Recent Orders</h3>
        <span className="bg-[#FEF3F2] text-[#E76F51] px-3 py-1 rounded-full text-[9px] font-mono font-black uppercase tracking-widest">Live</span>
      </div>
      <div className="space-y-1 flex-1">
        {recieptrecord.length > 0 ? (recieptrecord.slice(0, 7).map((rec, index) => (<OrderItem key={rec.id || index} name={rec.staff} id={rec.code} status={rec.status} price={rec.total_price} />))) : (
          <p className="text-center text-stone-400 text-sm mt-10">No recent orders.</p>
        )}
      </div>

      <div className="mt-8 p-6 bg-[#2D1B14] rounded-[2rem] text-white">
        <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#D4A373] mb-4">Store Capacity</p>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div className="text-center flex-1">
            <p className="text-[8px] text-stone-400 font-mono uppercase">Staff</p>
            <p className="text-base font-bold">{staffrecord.length}</p>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="text-center flex-1">
            <p className="text-[8px] text-stone-400 font-mono uppercase">Occupancy</p>
            <p className="text-base font-bold">70%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recent_Order;