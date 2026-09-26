import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Star, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [sortBy, setSortBy] = useState('featured');

  // Format category name from URL (e.g., 'body-care' to 'Body Care')
  const formattedCategory = categoryName 
    ? categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All';

  const filteredProducts = products
    .filter(p => p.category.toLowerCase() === formattedCategory.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight">{formattedCategory}</h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Explore our curated selection of {formattedCategory.toLowerCase()} essentials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0">
          <p className="text-sm font-medium text-stone-500">{filteredProducts.length} Products</p>

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
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 mb-4">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-5xl opacity-50 transition-transform duration-500 group-hover:scale-105">
                    {product.name.charAt(0)}
                  </div>
                )}
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_10px_rgba(255,0,110,0.3)] z-10">
                    New
                  </span>
                )}
                {product.isBestseller && !product.isNew && (
                  <span className="absolute top-3 left-3 bg-[#ffbe0b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-900 rounded-sm">
                    Bestseller
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <div className="w-full bg-white/95 backdrop-blur-sm text-stone-900 font-bold py-3 rounded-full shadow-md text-center text-xs uppercase tracking-wider group-hover:bg-brand-purple group-hover:text-white transition-all">
                    View Details
                  </div>
                </div>
              </Link>
              <div className="flex flex-col flex-1">
                <div className="flex items-center space-x-1 mb-1.5">
                  <Star size={12} className="fill-stone-900 text-stone-900" />
                  <span className="text-xs font-medium text-stone-900">{product.rating}</span>
                  <span className="text-xs text-stone-400">({product.reviews})</span>
                </div>
                <h3 className="text-base font-medium text-stone-900 mb-1">
                  <Link to={`/product/${product.id}`} className="hover:underline underline-offset-4 decoration-stone-300">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-stone-500 mb-2 line-clamp-1">{product.description}</p>
                <p className="text-base font-medium text-stone-900 mt-auto">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-xl font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-500">We don't have any products in this category yet.</p>
            <Link 
              to="/shop"
              className="mt-6 inline-block px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Shop All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
