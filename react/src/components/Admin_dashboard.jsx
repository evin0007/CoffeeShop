import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { LayoutDashboard, ShoppingBag, BarChart3, LineChart, Users, Settings, ChevronDown, ChevronRight, Menu, X, Coffee, LogOut } from 'lucide-react';
import logo from './../assets/images/coffee.png';

import ProductPage from "./admin_page/Product_page"; 
import CustomersRecord from './admin_page/Customers_record';
import Dashboard from './admin_page/Dashboard';
import Analysis from './admin_page/Analysis_tab';
import AddStaffForm from './admin_page/Add_staff';
import AdminAccountPanel from './admin_page/admin_account';
import StaffList from './admin_page/Staff_record';
import Login from "../components/Staff_login";

const MySwal = withReactContent(Swal);

const CoffeeDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_user');
    if (!session) {
        navigate('/Admin');
    } else {
        setStaff(JSON.parse(session));
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: <span className="text-base font-black uppercase">Exit Terminal?</span>,
      text: "You will need to login again to access management systems.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C2A21',
      cancelButtonColor: '#d33',
      confirmButtonText: 'LOGOUT',
      cancelButtonText: 'CANCEL'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('admin_user');
      navigate('/Adminlogin');
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { label: 'Product', icon: <ShoppingBag size={20}/> },
    { label: 'Customers Record', icon: <BarChart3 size={20}/> },
    { label: 'Analysis', icon: <LineChart size={20}/> },
    { label: 'Staff', icon: <Users size={20}/> }
  ];

  const handleNav = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    const views = {
      'Dashboard': <Dashboard changeTab={setActiveTab} />,
      'Product': <ProductPage />,
      'Customers Record': <CustomersRecord />,
      'Analysis': <Analysis />,
      'Staff': <StaffList />,
      'Cashier': <div className='mb-[-60px] mt-[-60px]'><Login /></div>,
      'Add User': <AddStaffForm />,
      'Admin': <AdminAccountPanel />,
    };
    return views[activeTab] || <Panel title={`${activeTab} Settings`} desc={`Configure ${activeTab} preferences.`} />;
  };

  return (
    <div className="flex h-screen bg-[#FDF8F5] overflow-hidden text-[#3C2A21]">
      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#3C2A21] text-[#E4D1B9] transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#4F392E]">
          <div className="flex items-center gap-2">
            <Coffee className="text-[#D4A373]" size={24} />
            <h1 className="text-xl font-bold text-[#F5F5DC]">Bean & Brew</h1>
          </div>
          <X className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)} />
        </div>

        <nav className="mt-6 px-3 text-sm space-y-1 h-[calc(100%-160px)] overflow-y-auto">
          {navItems.map(item => (
            <NavItem key={item.label} {...item} active={activeTab === item.label} onClick={() => handleNav(item.label)} />
          ))}
          
          <button onClick={() => setSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between px-4 py-3 text-[#BFA89E] hover:bg-[#4F392E] rounded-lg transition-colors">
            <div className="flex items-center"><Settings size={20} /><span className="ml-3 font-medium">Settings</span></div>
            {isSettingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'max-h-40' : 'max-h-0'}`}>
            <ul className="ml-9 space-y-1">
              {['Cashier', 'Add User', 'Admin',].map(sub => (
                <SubNavItem key={sub} label={sub} active={activeTab === sub} onClick={() => handleNav(sub)} />
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-1 border-t border-[#4F392E]">
            <button onClick={handleLogout} className="flex mt-4 ml-2 transition-all">
              <LogOut size={18} />
              <span className="font-bold text-[10px] mt-0.5 ml-1 uppercase tracking-widest hover:text-gray-300 cursor-pointer">Logout</span>
            </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between min-h-[64px] px-4 bg-white border-b border-[#E4D1B9] lg:px-8 shadow-sm">
          <Menu className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(true)} />
          <h2 className="flex-1 px-4 font-bold text-lg">{activeTab}</h2>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-[#D4A373] uppercase leading-none">Administrator</p>
                <p className="text-xs font-semibold">{staff?.name || 'Active Session'}</p>
            </div>
            <button onClick={() => setActiveTab('Admin')}>
             <img src={logo} className="w-9 h-9 hover:scale-110 cursor-pointer rounded-full border border-[#D4A373] bg-[#FDF8F5]" alt="User" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-2 md:p-5 bg-[#FDF8F5]">
          <div className="mx-auto bg-white rounded-2xl border border-[#E4D1B9] shadow-sm min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-[#D4A373] text-white shadow-md' : 'text-[#BFA89E] hover:bg-[#4F392E] hover:text-[#F5F5DC]'}`}>
    {icon} <span className="ml-3 font-semibold">{label}</span>
  </button>
);

const SubNavItem = ({ label, active, onClick }) => (
  <li>
    <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded-md transition-colors ${active ? 'text-[#D4A373] font-bold bg-[#4F392E]/50' : 'text-[#BFA89E] hover:text-[#F5F5DC]'}`}>
      {label}
    </button>
  </li>
);

const Panel = ({ title, desc }) => (
  <div className='animate-in fade-in duration-500 p-6'>
    <h2 className="text-xl font-bold mb-4 text-[#3C2A21]">{title}</h2>
    <div className="p-10 border-2 border-dashed border-[#E4D1B9] rounded-xl text-center text-[#BFA89E]">{desc}</div>
  </div>
);

export default CoffeeDashboard;