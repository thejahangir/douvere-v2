import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { Tag, X, Check, Percent } from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const { discounts, setProductDiscount, removeProductDiscount, adminProducts } = useStore();
  const allProducts = [...products, ...adminProducts];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkPercent, setBulkPercent] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  const categories = [...new Set(allProducts.map(p => p.category))];

  const startEdit = (productId: string) => {
    setEditingId(productId);
    setInputValue(String(discounts[productId] ?? ''));
  };

  const applyDiscount = (productId: string) => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val > 0 && val <= 100) {
      setProductDiscount(productId, val);
      setSaved(productId);
      setTimeout(() => setSaved(null), 1200);
    }
    setEditingId(null);
  };

  const handleBulk = () => {
    const pct = parseInt(bulkPercent);
    if (!bulkCategory || isNaN(pct) || pct <= 0 || pct > 100) return;
    allProducts.filter(p => p.category === bulkCategory).forEach(p => setProductDiscount(p.id, pct));
    setBulkCategory('');
    setBulkPercent('');
  };

  const productsWithDiscount = allProducts.filter(p => discounts[p.id] !== undefined);
  const productsWithout = allProducts.filter(p => discounts[p.id] === undefined);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Discounts</h2>
        <p className="text-white/40 text-sm mt-1">
          {productsWithDiscount.length} products on sale, {productsWithout.length} at full price
        </p>
      </div>

      {/* Bulk Discount */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-white/70 text-sm mb-4 flex items-center gap-2">
          <Tag size={15} className="text-purple-400" /> Bulk Discount by Category
        </h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Category</label>
            <select
              value={bulkCategory}
              onChange={e => setBulkCategory(e.target.value)}
              className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 min-w-[140px]"
            >
              <option value="" className="bg-[#1a1a2e]">Select category</option>
              {categories.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Discount %</label>
            <div className="relative">
              <input
                type="number" min="1" max="100" placeholder="e.g. 15"
                value={bulkPercent}
                onChange={e => setBulkPercent(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 w-28 pr-8"
              />
              <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
          </div>
          <button
            onClick={handleBulk}
            disabled={!bulkCategory || !bulkPercent}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            Apply Bulk
          </button>
        </div>
      </div>

      {/* Products with discounts */}
      {productsWithDiscount.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Active Discounts ({productsWithDiscount.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {productsWithDiscount.map(product => {
              const disc = discounts[product.id];
              const discPrice = product.price * (1 - disc / 100);
              const isEditing = editingId === product.id;
              const wasSaved = saved === product.id;
              return (
                <div key={product.id} className="bg-white/4 border border-green-500/20 rounded-2xl p-4 relative">
                  <span className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{disc}% OFF</span>
                  <div className="flex items-center gap-3 mb-3">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white/5 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0 flex items-center justify-center text-white/40 font-bold text-xs">
                        {product.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white/90 font-semibold text-xs truncate">{product.name}</p>
                      <p className="text-xs mt-0.5">
                        <span className="line-through text-white/30">₹{product.price.toLocaleString('en-IN')}</span>
                        {' '}<span className="text-green-400 font-bold">₹{discPrice.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <div className="relative flex-1">
                          <input
                            type="number" min="1" max="100"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            autoFocus
                            className="w-full bg-white/8 border border-purple-500/40 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none pr-7"
                          />
                          <Percent size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                        <button onClick={() => applyDiscount(product.id)}
                          className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-white/40 rounded-lg transition-colors">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(product.id)}
                          className="flex-1 py-1.5 text-xs font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors">
                          {wasSaved ? '✓ Saved' : 'Edit %'}
                        </button>
                        <button onClick={() => removeProductDiscount(product.id)}
                          className="p-1.5 text-white/30 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors">
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products without discount */}
      <div>
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Full Price Products ({productsWithout.length})</h3>
        <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="text-left text-white/30 font-semibold py-3 px-4">Product</th>
                  <th className="text-left text-white/30 font-semibold py-3 px-4">Category</th>
                  <th className="text-left text-white/30 font-semibold py-3 px-4">Price</th>
                  <th className="text-left text-white/30 font-semibold py-3 px-4">Set Discount</th>
                </tr>
              </thead>
              <tbody>
                {productsWithout.map(product => (
                  <tr key={product.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-7 h-7 rounded-md object-cover bg-white/5 shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-md bg-white/5 shrink-0 flex items-center justify-center text-white/40 font-bold text-[10px]">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-white/80 font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/40">{product.category}</td>
                    <td className="py-3 px-4 font-bold text-white/80">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      {editingId === product.id ? (
                        <div className="flex gap-2 items-center">
                          <div className="relative">
                            <input
                              type="number" min="1" max="100"
                              value={inputValue}
                              onChange={e => setInputValue(e.target.value)}
                              autoFocus
                              className="w-20 bg-white/8 border border-purple-500/40 rounded-lg px-2 py-1 text-white text-xs focus:outline-none pr-6"
                            />
                            <Percent size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30" />
                          </div>
                          <button onClick={() => applyDiscount(product.id)}
                            className="p-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors">
                            <Check size={13} />
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="p-1 bg-white/5 hover:bg-white/10 text-white/40 rounded-lg transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(product.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-xs font-semibold transition-colors">
                          <Tag size={12} /> Add Discount
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
