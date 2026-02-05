import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Coffee, Key, Mail, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', staff_code: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(window.location.origin + "/api/login", creds);
            if (data.status === 'success') {
                localStorage.setItem('staff_user', JSON.stringify(data.user));
                navigate('/cashier');
            }
        } catch (err) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Access Denied', 
                text: 'Invalid credentials.', 
                confirmButtonColor: '#3C2A21' 
            });
        } finally { setLoading(false); }
    };

    const inputClass = "w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold outline-none focus:border-[#3C2A21] focus:bg-white transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-[#3C2A21]">
            <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-stone-100">
                <div className="hidden md:flex md:w-1/2 bg-[#3C2A21] p-12 flex-col justify-between relative">
                    <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4"><Coffee size={300} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Coffee className="text-[#D4A373]" size={32} />
                            <h1 className="text-2xl font-serif italic font-black text-white">Bean & Brew</h1>
                        </div>
                        <p className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">Terminal Access Control</p>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-white leading-tight mb-4">Brewing <br/>Excellence.</h2>
                    </div>
                    <div className="relative z-10 text-stone-500 text-[10px] font-medium uppercase tracking-widest">© 2026 Bean & Brew Co.</div>
                </div>
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="mb-10 text-center md:text-left">
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="bg-[#3C2A21] p-3 rounded-2xl text-white">
                                <Coffee size={28} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Sign In</h3>
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#3C2A21]" size={18} />
                                <input 
                                    id="email" 
                                    name="email"
                                    type="email" 
                                    required 
                                    autoComplete="email"
                                    placeholder="name@beanbrew.com" 
                                    className={inputClass}
                                    onChange={e => setCreds({...creds, email: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="staff_code" className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Staff Access Code</label>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#3C2A21]" size={18} />
                                <input 
                                    id="staff_code" 
                                    name="staff_code"
                                    type="password" 
                                    required 
                                    autoComplete="current-password"
                                    placeholder="••••••" 
                                    maxLength="6" 
                                    className={`${inputClass} tracking-[0.5em]`}
                                    onChange={e => setCreds({...creds, staff_code: e.target.value})} 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-[#3C2A21] hover:bg-[#2A1D17] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#3C2A21]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <p>Authorize Entry</p>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;