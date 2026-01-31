import React from 'react';

const NotFound = () => {
  return (
    <div className="h-screen w-full bg-[#FDF8F1] flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <div className="relative flex-1 flex justify-center">
          <span className="absolute -top-10 text-[#3C2F2F] opacity-5 text-[180px] font-black select-none">
            404
          </span>
          <div className="relative z-10 text-[#3C2F2F]">
            <svg viewBox="0 0 24 24" fill="none" className="w-48 h-48 md:w-64 md:h-64" stroke="currentColor" strokeWidth="1">
              <path d="M17 8H7c-1.1 0-2 .9-2 2v6c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4v-6c0-1.1-.9-2-2-2zM5 8h14M18 11h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2" strokeLinecap="round"/>
              <path d="M12 2v2M9 3v1M15 3v1" strokeLinecap="round"/>
              <circle cx="8" cy="14" r="1" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <h3 className="text-amber-700 font-bold tracking-[0.2em] text-sm uppercase">Error</h3>
            <h1 className="text-5xl md:text-6xl font-serif italic text-[#3C2F2F]">Spilled Beans!</h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
          <a href='/home'> 
              <button className="px-8 py-3 bg-[#3C2F2F] text-white font-bold rounded-lg hover:bg-amber-900 transition-all shadow-lg active:scale-95">
              Take me home
            </button>
          </a>
          <a href='/order'> 
            <button className="px-8 py-3 border-2 border-[#3C2F2F] text-[#3C2F2F] font-bold rounded-lg hover:bg-[#3C2F2F] hover:text-white transition-all active:scale-95">
              View Menu
            </button>
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;