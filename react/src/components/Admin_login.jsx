import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, Mail, ChevronRight, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminLogin = () => {
    const [creds, setCreds] = useState({ corporate_email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://127.0.0.1:8000/api/Adminlogin', creds);
            if (data.status === 'success') {
                localStorage.setItem('admin_user', JSON.stringify(data.user));
 
                navigate('/adminAccount'); 
            }
        } catch (err) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Authorization Failed', 
                text: 'Admin privileges not recognized.', 
                confirmButtonColor: '#1e293b' 
            });
        } finally { setLoading(false); }
    };

    const inputClass = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-slate-100">
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-500 rounded-lg"><ShieldCheck className="text-white" size={24} /></div>
                            <h1 className="text-xl font-bold tracking-tight text-white">Bean & Brew <span className="text-indigo-400">HQ</span></h1>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white leading-tight">Management Console.</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">Access the core administrative systems, manage inventory, and monitor performance.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-7/12 p-8 sm:p-16">
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-slate-900">Admin Authentication</h3>
                        <p className="text-slate-500 text-sm mt-2">Please enter your secure credentials to proceed.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor='email' className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input 
                                    id='email'
                                    type="email" 
                                    autoComplete="email"
                                    required 
                                    className={inputClass}
                                    onChange={e => setCreds({...creds, corporate_email: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label htmlFor='password' className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Password</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input 
                                    id='password'
                                    type="password" 
                                    required 
                                    className={inputClass}
                                    onChange={e => setCreds({...creds, password: e.target.value})} 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><span>Verify Identity</span><ChevronRight size={18} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;