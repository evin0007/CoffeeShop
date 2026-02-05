import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BestMenu = () => {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(window.location.origin + "/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };
  return (
    <section className="bg-amber-200 py-2 px-4 font-serif">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#5C4033] font-bold">Favorites</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2A1B12]">Best Sellers</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-[#2A1B12]/20 hover:bg-[#2A1B12] hover:text-white transition-colors"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-[#2A1B12]/20 hover:bg-[#2A1B12] hover:text-white transition-colors"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[200px] md:min-w-[240px] snap-start bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <img 
               src={`${window.location.origin}/storage/${product.picture}`}
                alt={product.name} 
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-[#2A1B12] font-bold text-sm">{product.product_name}</h3>
              <div className="flex justify-between items-center mt-2">
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestMenu;