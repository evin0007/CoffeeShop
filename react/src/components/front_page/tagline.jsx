import React, { useState } from 'react';
import logo from '../../assets/images/coffee.png';
import background from '../../assets/images/background.jpg';
import MenuTagline from './Menu_tagline';
import { useNavigate } from "react-router-dom";

function Tagline() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#feedback' },
    { name: 'Contact Us', href: '#footer' },
  ];
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-center bg-cover bg-no-repeat relative overflow-hidden" style={{ backgroundImage: `url(${background})` }}>
      
      <nav className="w-full h-16 bg-white/30 backdrop-blur-xl flex items-center justify-between px-4 z-50 relative"> 
        <img src={logo} alt="Coffee Logo" className="w-[55px]" />
    
        <div className='hidden lg:flex space-x-15 text-white font-medium'>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className='hover:text-amber-200 transition-colors'> {link.name} </a>
          ))}
        </div>
        <div className='block lg:hidden'>
          <button onClick={() => setIsMenuOpen(true)} className="text-white text-3xl p-2">
            <i className="fa fa-bars"></i>
          </button>
        </div>
      </nav>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className={`fixed top-0 right-0 h-full w-56 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="text-gray-800 text-2xl hover:text-amber-700 transition-colors"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="flex flex-col px-6 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4">NAVIGATION</p>
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)}
              className='text-gray-800 text-sm font-bold py-3 border-b border-gray-100 last:border-0 hover:text-amber-700 transition-colors'
            > 
              {link.name} 
            </a>
          ))}
        </div>
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div className="text-white mt-25 mx-auto ml-5 lg:text-left lg:ml-20" data-aos="fade-right">
          <p className="text-amber-700 font-bold">WELCOME</p>
          <p className="font-serif italic text-4xl md:text-5xl lg:text-6xl mb-2">Start your day with a Coffee</p>
          <p>ROASTED WITH LOVE</p>
          <br />
          <p className='italic text-sm max-w-sm opacity-90'>
            Where every cup is carefully brewed to bring comfort, warmth, and calm to your day.
          </p>
          <br />
          <button onClick={() => navigate("/order")} className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition duration-300">
            Order Now
          </button>
        </div>
        <div className="hidden lg:block w-150 ml-20 mt-5" data-aos="fade-left">
          <MenuTagline />
        </div>
      </div>
    </div>
  );
}

export default Tagline;