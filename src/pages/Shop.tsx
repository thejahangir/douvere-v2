import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Star, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProductSkeleton = () => (
  <div className="group flex flex-col animate-pulse">
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 mb-6"></div>
    <div className="flex flex-col flex-1 px-2">
      <div className="flex items-center space-x-1 mb-2">
        <div className="w-3.5 h-3.5 bg-stone-200 rounded-full"></div>
        <div className="w-6 h-4 bg-stone-200 rounded"></div>
        <div className="w-8 h-4 bg-stone-200 rounded"></div>
      </div>
      <div className="w-3/4 h-6 bg-stone-200 rounded mb-2"></div>
      <div className="w-full h-4 bg-stone-200 rounded mb-3"></div>
      <div className="w-16 h-6 bg-stone-200 rounded mt-auto"></div>
    </div>
  </div>
);

export const Shop = () => {
  const { discounts, adminProducts } = useStore();
  const allProducts = [...products, ...adminProducts];
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate network request
    return () => clearTimeout(timer);
  }, [activeCategory, sortBy]);

  const filteredProducts = allProducts
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-yellow/15 via-brand-pink/10 to-brand-purple/15 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-black text-stone-900 mb-6 tracking-tighter drop-shadow-sm">Shop All</h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-xl font-medium tracking-wide">
            Discover our full collection of clean, high-performance beauty essentials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0">
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 space-x-2 md:space-x-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-sm ${
                  activeCategory === category 
                    ? 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-[0_4px_15px_rgba(255,0,110,0.3)] transform -translate-y-0.5' 
                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200 hover:border-brand-pink/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <span className="text-sm text-stone-500">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent pr-8 pl-2 py-1 text-sm font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {isLoading ? (
            [...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col"
              >
                <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100 mb-6 shadow-sm hover:shadow-xl transition-all duration-500">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-5xl opacity-50 transition-transform duration-700 group-hover:scale-110">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  {/* Badges row */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {(() => { const disc = discounts[product.id] ?? product.discount; return disc ? (
                      <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {disc}% OFF
                      </span>
                    ) : null; })()}
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(255,0,110,0.4)]">
                        New
                      </span>
                    )}
                    {product.isBestseller && !product.isNew && (
                      <span className="bg-[#ffbe0b]/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-900 rounded-full shadow-sm">
                        Bestseller
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="w-full bg-white/95 backdrop-blur-xl text-stone-900 font-bold py-3.5 rounded-full shadow-lg text-center text-xs uppercase tracking-wider group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple group-hover:text-white transition-all duration-300">
                      View Details
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col flex-1 px-2">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star size={14} className="fill-brand-yellow text-brand-yellow" />
                    <span className="text-sm font-bold text-stone-900">{product.rating}</span>
                    <span className="text-sm text-stone-400">({product.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1 tracking-tight">
                    <Link to={`/product/${product.id}`} className="hover:text-brand-pink transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-stone-500 mb-3 line-clamp-1">{product.description}</p>
                  {(() => {
                    const disc = discounts[product.id] ?? product.discount;
                    if (disc) {
                      const discPrice = Math.round(product.price * (1 - disc / 100));
                      return (
                        <div className="flex items-center gap-2 mt-auto">
                          <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">₹{discPrice.toLocaleString('en-IN')}</p>
                          <p className="text-sm text-stone-400 line-through">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                      );
                    }
                    return <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink mt-auto">₹{product.price.toLocaleString('en-IN')}</p>;
                  })()}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-xl font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-500">Try adjusting your filters to see more results.</p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="mt-6 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
