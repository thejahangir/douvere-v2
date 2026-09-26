import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { products as staticProducts, Product, categories } from '../../data/products';
import { Plus, Edit2, Trash2, X, Image, Check, AlertCircle, Upload } from 'lucide-react';

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category: 'Skincare',
  image: '',
  images: [],
  rating: 4.5,
  reviews: 0,
  ingredients: [],
  howToUse: '',
  stock: 0,
  isActive: true,
};

export const AdminProducts: React.FC = () => {
  const { adminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct, discounts } = useStore();
  const allProducts = [...staticProducts, ...adminProducts];

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setIngredientsInput('');
    setProductImages([]);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ ...p });
    setIngredientsInput((p.ingredients ?? []).join(', '));
    setProductImages(Math.max(p.images?.length || 0) > 0 ? p.images! : (p.image ? [p.image] : []));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIngredients = ingredientsInput.split(',').map(s => s.trim()).filter(Boolean);
    const mainImage = productImages.length > 0 ? productImages[0] : '';

    const productData = {
      ...form,
      image: mainImage,
      images: productImages,
      ingredients: parsedIngredients,
    };
    if (editProduct) {
      updateAdminProduct({ ...productData, id: editProduct.id });
    } else {
      const newId = `admin-${Date.now()}`;
      addAdminProduct({ ...productData, id: newId });
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); closeForm(); }, 800);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product?')) deleteAdminProduct(id);
  };

  const isAdminProduct = (id: string) => adminProducts.some(p => p.id === id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProductImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="text-white/40 text-sm mt-1">{allProducts.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#13131f] border border-white/10 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeForm} className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="field-label">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="admin-input" placeholder="e.g. Radiance Boost Cream" />
                </div>
                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="field-label">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="admin-input resize-none" placeholder="Product description..." />
                </div>
                {/* Price */}
                <div>
                  <label className="field-label">Price (₹) *</label>
                  <input required type="number" min="0" step="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                    className="admin-input" placeholder="0" />
                </div>
                {/* Category */}
                <div>
                  <label className="field-label">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="admin-input">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Stock */}
                <div>
                  <label className="field-label">Stock Quantity</label>
                  <input type="number" min="0" value={form.stock ?? 0} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))}
                    className="admin-input" placeholder="0" />
                </div>
                {/* Image Upload Area */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="field-label flex justify-between items-center mb-0">
                    <span>Product Images *</span>
                    <span className="text-[10px] text-white/40 normal-case tracking-normal">First image is the main cover</span>
                  </label>
                  
                  {/* Image thumbnails */}
                  {productImages.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {productImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                          <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => removeImage(i)} className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {i === 0 && (
                            <div className="absolute top-0 left-0 right-0 bg-purple-500/90 text-[9px] font-bold text-center py-0.5 text-white">COVER</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        id="image-url-input"
                        type="text" 
                        placeholder="Add image via URL..." 
                        className="admin-input pr-20"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              setProductImages(prev => [...prev, val]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('image-url-input') as HTMLInputElement;
                          const val = input.value.trim();
                          if (val) {
                            setProductImages(prev => [...prev, val]);
                            input.value = '';
                          }
                        }}
                        className="absolute right-1 top-1 bottom-1 px-3 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition-colors text-white"
                      >
                        Add URL
                      </button>
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                      <Upload size={16} /> Upload
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
                {/* Ingredients */}
                <div className="sm:col-span-2">
                  <label className="field-label">Ingredients (comma separated)</label>
                  <input value={ingredientsInput} onChange={e => setIngredientsInput(e.target.value)}
                    className="admin-input" placeholder="Vitamin C, Hyaluronic Acid, ..." />
                </div>
                {/* How to Use */}
                <div className="sm:col-span-2">
                  <label className="field-label">How to Use</label>
                  <textarea rows={2} value={form.howToUse ?? ''} onChange={e => setForm(f => ({ ...f, howToUse: e.target.value }))}
                    className="admin-input resize-none" placeholder="Usage instructions..." />
                </div>
                {/* Flags */}
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                      className="w-4 h-4 accent-purple-500" />
                    <span className="text-sm text-white/60 font-medium">Mark as New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.isBestseller} onChange={e => setForm(f => ({ ...f, isBestseller: e.target.checked }))}
                      className="w-4 h-4 accent-purple-500" />
                    <span className="text-sm text-white/60 font-medium">Bestseller</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 rounded-xl text-sm font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold transition-all hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2">
                  {saved ? <><Check size={14} /> Saved!</> : (editProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Product</th>
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Category</th>
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Price</th>
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Discount</th>
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Stock</th>
                <th className="text-left text-white/30 text-xs font-semibold py-3 px-4">Rating</th>
                <th className="text-right text-white/30 text-xs font-semibold py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => {
                const discount = discounts[product.id] ?? product.discount;
                return (
                  <tr key={product.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30 font-bold text-xs bg-white/5">
                              {product.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white/90 text-xs">{product.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.isNew && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-bold">New</span>}
                            {product.isBestseller && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">Bestseller</span>}
                            {isAdminProduct(product.id) && <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">Custom</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/50 text-xs">{product.category}</td>
                    <td className="py-3 px-4 font-bold text-white/90 text-xs">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      {discount ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">{discount}% OFF</span>
                      ) : (
                        <span className="text-white/20 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white/50 text-xs">
                      {product.stock != null ? (
                        <span className={product.stock < 10 ? 'text-red-400 font-bold' : 'text-white/50'}>{product.stock}</span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-4 text-white/50 text-xs">⭐ {product.rating}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)}
                          className="p-1.5 text-white/30 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        {isAdminProduct(product.id) && (
                          <button onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                        {!isAdminProduct(product.id) && (
                          <span title="Built-in products cannot be deleted">
                            <AlertCircle size={14} className="text-white/10" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .admin-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; color: white; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .admin-input:focus { border-color: rgba(168,85,247,0.5); background: rgba(255,255,255,0.07); }
        .admin-input::placeholder { color: rgba(255,255,255,0.2); }
        select.admin-input option { background: #1a1a2e; color: white; }
      `}</style>
    </div>
  );
};
