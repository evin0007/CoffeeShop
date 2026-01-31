import React from 'react';

const Service = () => {
  const menuItems = [
    { title: "COFFEE", desc: "BREWED TO GROUND YOU." },
    { title: "FOODS", desc: "PREPPED FOR POUR-OVER." },
    { title: "ROASTED BEANS", desc: "DISCOVER YOUR ROAST." },
    { title: "TEA COLLECTION", desc: "LEAF-TO-CUP BLENDS." },
  ];

  return (
    <div className="w-full bg-amber-200 overflow-hidden flex flex-col md:flex-row md:h-[380px]">
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">

        <div className="space-y-4 md:max-w-md">
          {menuItems.map((item, index) => (
            <div key={index} className="border-b border-white/10 pb-2 last:border-0 group cursor-pointer">
              <h2 className="text-[#2A1B12] text-2xl md:text-3xl font-black tracking-tighter leading-none group-hover:pl-2 transition-all duration-300">
                {item.title}
              </h2>
              <p className="text-[#A39185] text-[10px] font-bold tracking-[0.15em] uppercase mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-[45%] h-64 md:h-full">
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
          alt="Coffee" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Service;