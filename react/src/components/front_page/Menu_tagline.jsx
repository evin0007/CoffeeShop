import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MenuTagline = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340; 
      const scrollTo = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };



  return (
    <div className="max-w-6xl mx-auto px-2 py-3"> 
      <div className="flex justify-end mb-4 gap-2">
        <button onClick={() => scroll('left')} className="p-2 rounded-full border bg-white border-gray-200 hover:bg-gray-50 active:scale-90 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button onClick={() => scroll('right')} className="p-2 rounded-full border bg-white border-gray-200 hover:bg-gray-50 active:scale-90 transition-all shadow-sm">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory select-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className={`min-w-[260px] md:min-w-[300px] snap-start group cursor-pointer ${product.status === "inactive" && "hidden"}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img 
                src={`${window.location.origin}/storage/${product.picture}`}
                alt={product.product_name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button 
                onClick={() => navigate(`/order`)} 
                className="absolute bottom-4 left-4 right-4 bg-white py-2.5 rounded-lg text-sm font-bold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
              >
                Quick Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuTagline;