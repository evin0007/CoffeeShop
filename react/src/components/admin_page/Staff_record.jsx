import React, { useEffect, useState } from 'react';

const StaffList = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await fetch(window.location.origin + "/api/staff/record");
      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  if (loading) return <div className="p-10 text-center font-serif text-[#4a3728]">Loading Staff Records...</div>;

  return (
    <div className="bg-[#fcfaf8] rounded-2xl font-sans">
      <div className="p-2 bg-[#4b2c20] rounded-t-2xl flex justify-between items-center text-stone-50">
                <div>
                    <h2 className="text-xl font-serif tracking-wide">Staff Management</h2>
                    <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Detailed Personnel Records</p>
                </div>
     </div>
      <div className="bg-white shadow-sm border-x border-b border-gray-100  rounded-b-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100 bg-stone-50/30">
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">ID</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">First Name</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Last Name</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Role</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Gender</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Age</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Phone Number</th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Email Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="p-5 text-[#c19a6b] font-bold text-xs">{staff.staff_code}</td>
                <td className="p-5 text-[#4a3728] font-bold text-sm">{staff.first_name}</td>
                <td className="p-5 text-[#4a3728] font-bold text-sm">{staff.last_name}</td>
                <td className="p-5">
                  <span className="bg-[#f4f1ee] text-[#4a3728] text-[10px] font-bold px-3 py-1 rounded-full border border-stone-200 uppercase whitespace-nowrap">
                    {staff.role}
                  </span>
                </td>
                <td className="p-5 text-gray-600 text-sm italic">{staff.gender}</td>
                <td className="p-5 text-[#4a3728] font-medium text-sm">{staff.age}</td>
                <td className="p-5 text-[#4a3728] font-bold text-sm tabular-nums">
                  {staff.phone_number || '---'}
                </td>
                <td className="p-5 text-stone-400 text-xs font-medium">{staff.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;