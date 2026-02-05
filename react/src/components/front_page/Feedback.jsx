import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

function Feedback() {
  const [rateData, setRateData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(window.location.origin + "/api/showratings");
        const data = await res.json();
        setRateData(Array.isArray(data) ? [...data, ...data] : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-20 text-center font-serif italic text-stone-500">Brewing stories...</div>;
  if (!rateData.length) return null;

  return (
    <div className="w-full bg-[#fdfcf7] py-16 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-5xl font-serif text-stone-800 leading-tight">
            What our <br /> <span className="italic text-orange-700">Guests say</span>
          </h2>
          <p className="text-stone-500 max-w-xs">
            Real stories from our coffee lovers. We take pride in every cup we brew and every smile we share.
          </p>
        </div>
        <div className="relative h-[300px] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#fdfcf7] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#fdfcf7] to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex flex-col gap-4"
            animate={{ y: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            whileHover={{ transition: { duration: 60 } }}
          >
            {rateData.map((item, i) => (
              <div key={`${item.id}-${i}`} className="bg-white border border-stone-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={12} className={s < item.rate ? "fill-orange-400 text-orange-400" : "text-stone-200"} />
                    ))}
                  </div>
                  <Quote size={16} className="text-stone-200" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-4 italic">"{item.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
                    {item.name ? item.name[0].toUpperCase() : 'G'}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.name || "Verified Guest"}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;