import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Plus, Bean, Command, Zap, FileText, ShoppingBag, Settings, Star, MessageSquare } from 'lucide-react';
import Recent_Order from './Dashboard/Recent_Orders';
import CustomerRatingsPage from './Dashboard/CustomerRatingsPage';

const Dashboard = ({ changeTab }) => {
  const [data, setData] = useState({ products: [], record: [], online: [], revenue: { latest: null, history: [] } });

  useEffect(() => {
    const endpoints = ['products', 'customers-records', 'online', 'revenue'];
    Promise.all(endpoints.map(e => axios.get(`window.location.origin + "/api"${e}`)))
      .then(res => setData({ products: res[0].data, record: res[1].data, online: res[2].data, revenue: res[3].data }));
  }, []);

  const { products, record, online, revenue } = data;
  const chartData = revenue.history?.slice(0, 7).reverse() || [];
  const maxPrice = Math.max(...chartData.map(d => d.total_price), 1000);
  
  const getY = (p) => 300 - (p / maxPrice * 250);
  const getX = (i) => i * (700 / (chartData.length - 1 || 1));

  const metrics = [
    { label: "Product Inventory", val: products.length, sub: "8 SKUs Low Stock", icon: <Bean size={18}/>, bg: "bg-[#EEF1EF]", text: "text-[#4A5D4E]" },
    { label: "Daily Revenue", val: revenue.latest?.total_price ? `₱${Number(revenue.latest.total_price).toLocaleString()}` : '₱0', sub: revenue.latest?.quantity ? `${revenue.latest.quantity} Orders Today` : "No orders yet", icon: <Zap size={18}/>, bg: "bg-[#FEF3F2]", text: "text-[#E76F51]" },
    { label: "Online Orders", val: online.length, sub: "24 Active Brews", icon: <ShoppingBag size={18}/>, bg: "bg-[#FDF8F3]", text: "text-[#D4A373]" },
    { label: "Receipt Records", val: record.length, sub: "Fully Synchronized", icon: <FileText size={18}/>, bg: "bg-[#F4F4F9]", text: "text-[#5C6BC0]" }
  ];

  return (
    <div className="min-h-screen rounded-2xl bg-[#F8F5F2] text-[#2D1B14] p-4 lg:p-5 font-sans selection:bg-[#D4A373]/30">
      <div className="max-w-[1650px] mx-auto space-y-8 md:space-y-12">
        <Header />
        <div className="grid grid-cols-12 gap-6 md:gap-8 mt-[-20px]">
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
          </div>
          <div className="col-span-12 xl:col-span-8 space-y-6 md:space-y-8">
            <RevenueChart chartData={chartData} getX={getX} getY={getY} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <InventoryCard changeTab={changeTab} />
              <CustomerRatingsPage />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4"><Recent_Order /></div>
        </div>
      </div>
    </div>
  );
};

const Header = () => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#2D1B14] rounded-2xl flex items-center justify-center text-[#D4A373] shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500"><Command size={24} /></div>
      <div>
        <h1 className="text-2xl md:text-3xl font-serif italic font-black">Roastery Command.</h1>
        <p className="text-[10px] font-mono font-bold text-[#A69080] uppercase tracking-[0.3em] mt-1">Live Operational Oversight</p>
      </div>
    </div>
    <div className="px-5 py-3 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
      <div>
        <p className="text-[9px] font-mono font-bold text-[#A69080] uppercase tracking-widest">System Status</p>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#4A5D4E]" /><span className="text-xs font-bold">All Systems Nominal</span></div>
      </div>
      <Settings size={18} className="text-stone-300 md:ml-4" />
    </div>
  </div>
);

const MetricCard = ({ label, val, sub, icon, bg, text }) => (
  <div className={`${bg} p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group cursor-pointer`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-white rounded-xl ${text} shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">{label}</span>
    </div>
    <h4 className="text-2xl font-serif italic font-black">{val}</h4>
    <p className="text-[9px] font-mono font-bold text-stone-400 mt-2 uppercase">{sub}</p>
  </div>
);

const RevenueChart = ({ chartData, getX, getY }) => (
  <div className="bg-white rounded-[2.5rem] p-6 border border-stone-100 shadow-sm overflow-hidden">
    <h2 className="text-2xl font-serif italic">Revenue Velocity</h2>
    <p className="text-[10px] font-mono text-stone-400 uppercase mb-6">Daily performance</p>
    <div className=" relative w-full">
      <svg viewBox="0 0 700 300" className="w-full h-full overflow-visible">
        <path d={`M 0 300 ${chartData.map((d, i) => `L ${getX(i)} ${getY(d.total_price)}`).join(' ')} L 700 300 Z`} fill="#D4A37322" />
        <path d={`M 0 ${getY(chartData[0]?.total_price || 0)} ${chartData.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.total_price)}`).join(' ')}`} fill="none" stroke="#2D1B14" strokeWidth="4" />
        {chartData.map((d, i) => (
          <g key={i} className="group/point">
            <text x={getX(i)} y={getY(d.total_price) - 20} textAnchor="middle" className="fill-[#2D1B14] text-[15px] font-mono font-bold opacity-0 group-hover/point:opacity-100 transition-opacity">
              ₱{Number(d.total_price).toLocaleString()}
            </text>
            <circle cx={getX(i)} cy={getY(d.total_price)} r="6" fill="white" stroke="#2D1B14" strokeWidth="3" className="group-hover/point:fill-[#E76F51] transition-colors cursor-pointer" />
          </g>
        ))}
      </svg>
      <div className="flex justify-between">
        {chartData.map((d, i) => <span key={i} className="text-[10px] font-mono font-bold text-stone-400 uppercase">{new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
      </div>
    </div>
  </div>
);

const InventoryCard = ({ changeTab }) => (
  <div className="bg-[#4A5D4E] text-[#FDFCF0] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4 text-[#D4A373]"><Bean size={18} /><span className="text-[10px] font-mono font-bold uppercase tracking-widest">Inventory</span></div>
      <h3 className="text-3xl font-serif italic leading-tight">Ethiopia <br/>Yirgacheffe.</h3>
      <p className="text-xs opacity-70 mt-4 leading-relaxed max-w-[220px]">Track every item and stay on top of your stock levels.</p>
    </div>
    <button onClick={() => changeTab('Product')} className="relative z-10 self-start mt-6 px-6 py-3 bg-white/10 hover:bg-white hover:text-[#4A5D4E] rounded-xl text-[10px] font-mono font-bold uppercase transition-all">Adjust Product</button>
    <Coffee size={200} className="absolute -right-12 -bottom-12 opacity-5 rotate-12" />
  </div>
);

export default Dashboard;