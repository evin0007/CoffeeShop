import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  Mail, Phone, MapPin, Globe, Edit3, Shield, Hash, 
  Lock, X, Save, RotateCcw
} from 'lucide-react';
import logo from '../../assets/images/coffee.png';
import logo2 from '../../assets/images/back.jpg';

const API_BASE_URL = 'http://localhost:8000'; 

const AdminAccountPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [verifyPass, setVerifyPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [adminData, setAdminData] = useState({
    id: null,
    legal_name: "",
    corporate_email: "",
    phone: "",
    primary_hub: "",
    timezone: "",
    access_level: ""
  });

  const loadProfile = () => {
    fetch(`${API_BASE_URL}/api/admin/profile`)
      .then(res => res.json())
      .then(data => setAdminData(data))
      .catch(err => {
        console.error("Profile load error:", err);
        Swal.fire({ icon: 'error', title: 'Fetch Failed', text: 'Could not connect to the server.' });
      });
  };

  useEffect(() => { loadProfile(); }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminData.corporate_email, password: verifyPass })
      });

      // 1. Success
      if (res.ok) {
        setIsEditable(true);
        setIsModalOpen(false);
        setVerifyPass("");
        Swal.fire({
          icon: 'success',
          title: 'Identity Verified',
          timer: 1500,
          showConfirmButton: false
        });
      } 
      else if (res.status === 401 || res.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Incorrect Password',
          text: 'The administrative password you entered is invalid.',
          confirmButtonColor: '#ef4444'
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Connection Failed',
        text: 'Unable to reach the server. Please check if the backend is running.',
      });
    }
  };

  const handleSave = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...adminData, new_password: newPassword })
    });

    if (res.ok) {
      setIsEditable(false);
      setNewPassword("");
      Swal.fire({
        icon: 'success',
        title: 'Changes Saved',
        text: 'Database has been successfully updated.',
        confirmButtonColor: '#4f46e5'
      });
      loadProfile();
    } else {
      Swal.fire('Update Failed', 'Please check your connection and try again.', 'error');
    }
  };

  return (
    <div className="pb-5 bg-[#F8FAFC] rounded-2xl text-[#1E293B] antialiased font-sans">
      <header className="w-full bg-[#4b2c20] rounded-t-2xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[58px]">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Shield size={22} />
                </div>
                <span className="text-xl font-serif tracking-tight text-stone-50 hidden sm:block">CoreAdmin</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-stone-50">{adminData.legal_name || 'Administrator'}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Status: Active</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200 uppercase">
              <img src={logo} alt="Brand Logo" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
              <div className="h-32"><img src={logo2} alt="Brand Logo" className="w-full h-full" /></div>
              <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-6">
                  <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl">
                    <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center">
                      <img src={logo} alt="Brand Logo" className="w-12 h-12" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900">{adminData.legal_name || 'Admin User'}</h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-100">
                  {adminData.access_level || 'System Admin'}
                </div>

                <div className="mt-8 space-y-4">
                  {isEditable ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Leave blank to keep current" 
                          className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-300 text-sm"
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <button onClick={handleSave} className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        <Save size={18} /> Save Changes
                      </button>
                      <button onClick={() => {setIsEditable(false); loadProfile();}} className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-600 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all">
                        <RotateCcw size={18} /> Discard
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-md">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900">Account Details</h3>
                <p className="text-slate-500 text-sm mt-1">Manage your administrative information and regional settings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <DataField label="Legal Full Name" value={adminData.legal_name} icon={<Hash />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, legal_name: v})} />
                <DataField label="Corporate Email" value={adminData.corporate_email} icon={<Mail />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, corporate_email: v})} />
                <DataField label="Phone Number" value={adminData.phone} icon={<Phone />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, phone: v})} />
                <DataField label="Primary Hub" value={adminData.primary_hub} icon={<MapPin />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, primary_hub: v})} />
                <DataField label="Regional Timezone" value={adminData.timezone} icon={<Globe />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, timezone: v})} />
                <DataField label="Access Level" value={adminData.access_level} icon={<Shield />} isEditable={isEditable} onChange={(v) => setAdminData({...adminData, access_level: v})} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Lock size={28} /></div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Security Verification</h3>
            <p className="text-slate-500 mb-8">Please enter your password to unlock profile editing.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <input 
                autoFocus type="password" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                placeholder="Password"
                required
                onChange={(e) => setVerifyPass(e.target.value)}
              />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 mt-2">
                Verify Identity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DataField = ({ label, value, icon, isEditable, onChange }) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-3 text-slate-400 group-focus-within:text-indigo-500">
      {React.cloneElement(icon, { size: 14 })}
      <label className="text-[11px] font-bold uppercase tracking-wider">{label}</label>
    </div>
    {isEditable ? (
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-slate-900 font-semibold outline-none focus:bg-white focus:border-indigo-500 transition-all" 
      />
    ) : (
      <div className="px-1 border-l-2 border-slate-100 ml-1">
        <p className="text-base font-semibold text-slate-700 leading-none">{value || 'Not Set'}</p>
      </div>
    )}
  </div>
);

export default AdminAccountPanel;