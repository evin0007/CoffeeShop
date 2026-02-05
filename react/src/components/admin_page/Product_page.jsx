import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Filter } from "lucide-react";
import ProductModal from "./ProductModal";
import Swal from "sweetalert2";

const API_URL = window.location.origin + "/api/products";
const STORAGE_URL = window.location.origin + "/storage/";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All Menu");

  const fetchProducts = async () => {
    const { data } = await axios.get(API_URL).catch(console.error);
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (formData) => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));
    try {
      if (selectedProduct) data.append("_method", "PUT");
      await axios.post(selectedProduct ? `${API_URL}/${selectedProduct.id}` : API_URL, data);
      fetchProducts();
      setIsModalOpen(false);
      Swal.fire({ icon: "success", title: "Saved!", timer: 2000, showConfirmButton: false, background: '#fffcf9' });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: err.response?.data?.error || "Error" });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?", icon: "warning", width: '320px', showCancelButton: true,
      confirmButtonColor: "#4b2c20", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete it", background: '#fffcf9'
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(`${API_URL}/${id}`).catch(() => Swal.fire("Error!", "Failed", "error"));
        fetchProducts();
        Swal.fire({ title: "Deleted!", icon: "success", width: '300px', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const filtered = products.filter(p => categoryFilter === "All Menu" || p.category === categoryFilter);

  return (
    <div className="min-h-screen p-5 bg-[#F8F5F2] rounded-2xl font-sans text-[#2d1b14]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-xl font-serif font-bold leading-tight">Product Inventory</h1>
          <p className="text-[10px] text-[#8c7e7a] font-bold tracking-[0.2em] uppercase">Management & Control</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select id="category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="appearance-none bg-white border border-[#eaddcf] py-1.5 pl-3 pr-8 rounded-xl text-[11px] font-bold uppercase cursor-pointer focus:outline-none">
              {["All Menu", "Hot Coffee", "Ice Coffee", "Milktea", "Meal", "Appetizer"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Filter size={12} className="absolute right-2.5 top-2.5 text-[#a3958f] pointer-events-none" />
          </div>
          <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="bg-[#2d1b14] hover:bg-[#4b2c20] text-[#fcf9f4] px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 text-[11px] font-bold uppercase">
            <Plus size={14} /> New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className={`group bg-white p-2.5 rounded-[1.8rem] shadow-sm border border-[#f0e8e0] transition-all hover:shadow-lg ${p.status === "inactive" ? "opacity-60 grayscale" : ""}`}>
            <div className="aspect-square mb-2 overflow-hidden rounded-[1.4rem] bg-[#f8f3ed]">
              <img src={STORAGE_URL + p.picture} className="w-full h-full object-cover" alt={p.product_name} />
            </div>
            <div className="px-1 pb-1">
              <h3 className="font-bold text-[12px] truncate leading-none mb-3">{p.product_name}</h3>
              <div className="flex gap-1.5">
                <button onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }} className="flex-1 py-1.5 bg-[#fcf9f4] text-[#4b2c20] rounded-lg border border-[#eaddcf] hover:bg-[#4b2c20] hover:text-white transition-all">
                  <Pencil size={12} className="mx-auto" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 py-1.5 bg-[#fff5f5] text-[#c94a4a] rounded-lg border border-[#fee2e2] hover:bg-[#c94a4a] hover:text-white transition-all">
                  <Trash2 size={12} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editingProduct={selectedProduct} />
    </div>
  );
};

export default ProductList;