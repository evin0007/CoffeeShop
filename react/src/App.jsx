import { Routes, Route, Navigate } from "react-router-dom";
import Landing_page from './components/Landing_page';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
import Menu_page from "./components/Menu_page";
import NotFound from "./components/Not_found";
import Admin from "./components/Admin_dashboard";
import Login from "./components/Staff_login";
import AdminLogin from "./components/Admin_login";
import Cashier from './components/Cashier';

function App() {
  useEffect(() => {AOS.init({duration: 1200, once: false, mirror: true});
  }, []);
  return ( 
  <Routes>
  <Route path="/" element={<Landing_page to="/home" />} />
  <Route path="/home" element={<Landing_page />} />
  <Route path="/order" element={<Menu_page />} />
  <Route path="/adminAccount" element={<Admin />} />
  <Route path="/cashier" element={<Cashier />}/>
  <Route path="/admin" element={<AdminLogin />}/>
  <Route path="/staffLogin" element={<Login />}/>
  <Route path="*" element={<NotFound/>} />
  </Routes>
  )
}
export default App;
