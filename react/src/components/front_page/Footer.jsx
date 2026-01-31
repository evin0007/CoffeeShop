import React from 'react';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, Coffee } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-5 pb-2 px-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-2">
              <Coffee className="text-orange-400" size={24} />
              <span className="text-xl font-serif italic tracking-wider font-bold">The Daily Grind</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Crafting specialty moments one cup at a time. Join us for your morning ritual or your afternoon escape.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">Our Menu</a></li>
              <li><a href="#beans" className="hover:text-orange-400 transition-colors">Wholesale Beans</a></li>
              <li><a href="#locations" className="hover:text-orange-400 transition-colors">Locations</a></li>
              <li><a href="#careers" className="hover:text-orange-400 transition-colors">Join the Team</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-400 shrink-0" />
                <span>123 Espresso Lane,<br />Brew City, BC 50210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>(555) 123-4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Stay Roasted</h4>
            <p className="text-xs text-stone-500 mb-4">Subscribe for brewing tips and first dibs on new bean drops.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Email address" 
                className="bg-stone-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-orange-400 outline-none"
              />
              <button className="bg-stone-100 text-stone-900 px-4 py-2 rounded-lg hover:bg-orange-400 hover:text-white transition-all">
                <Mail size={18} />
              </button>
            </form>
          </div>

        </div>

        <div className="pt-2 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-stone-500">
            © {currentYear} The Daily Grind Coffee Co. All Rights Reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-stone-500 hover:text-white transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer