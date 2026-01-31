import React, { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";

const ProductModal = ({ isOpen, onClose, onSave, editingProduct }) => {
  const [formData, setFormData] = useState({ product_name: "", price: "", code: "", notes: "", picture: null, status: "active", category: "" });
  const [preview, setPreview] = useState(null);
  
  const categories = ['Hot Coffee', 'Ice Coffee', 'Milktea', 'Meal', 'Appetizer'];

  useEffect(() => {
    if (editingProduct) {
      setFormData({ 
        ...editingProduct, 
        picture: null, 
        status: editingProduct.status || "active",
        category: editingProduct.category || "" 
      });
      setPreview(editingProduct.picture ? `http://127.0.0.1:8000/storage/${editingProduct.picture}` : null);
    } else {
      setFormData({ 
        product_name: "", price: "", code: "", notes: "", picture: null, status: "active", category: "" 
      });
      setPreview(null);
    }
  }, [editingProduct, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-gray-200 overflow-hidden" data-aos="zoom-in">
        <div className="px-4 py-3 border-b flex justify-between items-center bg-orange-50/50">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight">
            {editingProduct ? 'Edit Item' : 'New Item'}
          </h2>
          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded-full transition-colors"><X size={16}/></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-4 space-y-3">
          <div className="flex gap-4">
            <div className="relative group w-24 h-24 flex-shrink-0">
              <div className="w-full h-full bg-gray-100 rounded-lg border overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <Camera className="text-gray-300" size={24} />
                )}
              </div>
              <input 
                type="file"
                id="picture"
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange} 
                accept="image/*"
              />
              <div className="absolute bottom-0 w-full bg-black/50 text-[8px] text-white text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                CHANGE
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <label htmlFor="product-name" className="block text-[10px] font-bold text-gray-400 uppercase">Name</label>
                <input required type="text" id="product-name" className="w-full border-b focus:border-orange-500 outline-none text-sm py-1" 
                  value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <div className="w-full">
                  <label htmlFor="product-price" className="block text-[10px] font-bold text-gray-400 uppercase">Price</label>
                  <input required type="number" id="product-price" className="w-full border-b focus:border-orange-500 outline-none text-sm py-1" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-[10px] font-bold text-gray-400 uppercase">Category</label>
            <select 
              required
              id="category"
              className="w-full border-b bg-transparent focus:border-orange-500 outline-none text-sm py-1 cursor-pointer"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="" >Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="note" className="block text-[10px] font-bold text-gray-400 uppercase">Notes</label>
            <textarea id="note" className="w-full border rounded p-2 text-xs mt-1 focus:ring-1 focus:ring-orange-500 outline-none" rows="2"
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>

          {editingProduct && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                  formData.status === 'active' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
                }`}
              >
                {formData.status}
              </button>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg border transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-md transition-all">
              {editingProduct ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;