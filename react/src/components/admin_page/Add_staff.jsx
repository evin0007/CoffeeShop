import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddStaffForm = ({ onStaffUpdated }) => {
  const initialForm = { id: '', first_name: '', last_name: '', email: '', phone_number: '', role: '', gender: '', age: '', staff_code: '' };
  const [searchCode, setSearchCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#fffaf5', color: '#3E271F', timerProgressBar: true });
  
  const resetForm = () => { setFormData(initialForm); setSearchCode(''); setIsEditing(false); };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleLookup = async () => {
    if (!searchCode) return Swal.fire({ title: 'Entry Required', text: 'Please input a staff code.', icon: 'info', confirmButtonColor: '#4a3728' });
    try {
      const res = await fetch(`${window.location.origin}/api/staff/search?code=${searchCode.replace('#', '')}`);
      if (!res.ok) throw new Error();
      setFormData(await res.json());
      setIsEditing(true);
      Toast.fire({ icon: 'success', title: 'Record Synchronized' });
    } catch { Swal.fire({ title: 'Not Found', text: 'Code not in roastery logs.', icon: 'error', confirmButtonColor: '#4a3728' }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation Logic
    const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'role', 'gender', 'age'];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      return Swal.fire({
        title: 'Incomplete Entry',
        text: 'All operational fields must be populated before synchronization.',
        icon: 'warning',
        confirmButtonColor: '#4a3728'
      });
    }

    const res = await fetch(isEditing ? `http://localhost:8000/api/staff/${formData.id}` : 'http://localhost:8000/api/staff', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      await Swal.fire({ title: isEditing ? 'Log Updated' : 'Entry Confirmed', icon: 'success', confirmButtonColor: '#4a3728' });
      resetForm();
      onStaffUpdated?.();
    }
  };

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({ title: 'Void Record?', text: "Permanent removal.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#8b0000', confirmButtonText: 'Yes, Void' });
    if (isConfirmed && (await fetch(`http://localhost:8000/api/staff/${formData.id}`, { method: 'DELETE' })).ok) {
      Swal.fire({ title: 'Voided!', icon: 'success', confirmButtonColor: '#4a3728' });
      resetForm();
      onStaffUpdated?.();
    }
  };

  const InputField = ({ label, id, ...props }) => (
    <div className={`flex flex-col gap-2 ${id === 'email' ? 'md:col-span-2' : ''}`}>
      <label htmlFor={id} className="text-[10px] font-black text-[#3E271F] uppercase ml-1">{label}</label>
      {props.type === 'select' ? (
        <select id={id} value={formData[id]} onChange={handleInputChange} className="w-full p-1.5 text-sm bg-white border border-[#e7e5e4] rounded-2xl outline-none appearance-none cursor-pointer text-[#3E271F]" {...props}>
          {props.children}
        </select>
      ) : (
        <input id={id} value={formData[id]} onChange={handleInputChange} className="w-full p-1.5 text-sm bg-white border border-[#e7e5e4] rounded-2xl focus:border-[#c19a6b] transition-all outline-none text-[#3E271F]" {...props} />
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden bg-[#fffaf5] shadow-2xl rounded-2xl">
      <div className="flex flex-col bg-[#4b2c20] items-center justify-between gap-6 p-2 border-b border-[#e7e5e4] md:flex-row">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-50">{isEditing ? `Staff Terminal: #${formData.staff_code}` : 'Registration Terminal'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`h-2 w-2 rounded-full ${isEditing ? 'bg-amber-600 animate-pulse' : 'bg-[#4a3728]'}`}></span>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{isEditing ? 'Live Operational Oversight' : 'System Ready'}</p>
          </div>
        </div>
        <div className="flex gap-3 p-1 bg-[#f5f5f4] rounded-2xl border border-[#e7e5e4]">
          <input id="search" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} placeholder="Staff Code (#1TL51)" className="w-full px-2 text-sm bg-transparent outline-none text-[#3E271F] md:w-48" />
          <button onClick={handleLookup} className="px-2 py-1 text-[10px] font-black text-white bg-[#4a3728] rounded-xl uppercase hover:bg-[#3E271F]">Find Record</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 lg:p-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[#c19a6b]">Identity Details</h3>
            <p className="mt-2 text-xs text-stone-500 italic">Record official personal data. Match government-issued ID.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-8">
            <InputField label="First Name" id="first_name" autoComplete="given-name" />
            <InputField label="Last Name" id="last_name" autoComplete="family-name" />
            <InputField label="Official Email" id="email" type="email" autoComplete="email" />
          </div>
          <div className="lg:col-span-12 border-t mt-[-20px] border-stone-100"></div>
          <div className="lg:col-span-4 mt-[-50px]">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[#c19a6b]">Logistics Stats</h3>
            <p className="mt-2 text-xs text-stone-500 italic">Assign departmental roles and demographics.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-8">
            <InputField label="Contact Phone" id="phone_number" autoComplete="tel" />
            <InputField label="Assigned Role" id="role" />
            <InputField label="Gender" id="gender" type="select">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </InputField>
            <InputField label="Age" id="age" type="number" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4 pt-5 mt-6 border-t border-[#e7e5e4]">
          {isEditing && <button type="button" onClick={handleDelete} className="px-8 py-1.5 text-xs font-black text-white bg-[#8b0000] rounded-2xl hover:bg-red-800">Void Record</button>}
          <button type="button" onClick={resetForm} className="px-8 py-1.5 text-xs font-black text-stone-500 bg-white border border-stone-200 rounded-2xl">Clear</button>
          <button type="submit" className="px-14 py-1.5 text-xs font-black text-white bg-[#4a3728] rounded-2xl shadow-xl hover:bg-[#3E271F] transition-all">{isEditing ? 'Sync Changes' : 'Confirm Entry'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;