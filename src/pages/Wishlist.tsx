import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Heart, X, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Your Wishlist</h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-stone-100 max-w-2xl mx-auto">
            <Heart size={48} className="mx-auto text-stone-300 mb-4" />
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-500 mb-8">Save items you love to revisit them later.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {wishlist.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-stone-100 relative"
              >
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <X size={16} />
                </button>
                
                <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden rounded-xl bg-stone-100 mb-4">
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
                </Link>
                
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-medium text-stone-900 mb-1">
                    <Link to={`/product/${product.id}`} className="hover:underline underline-offset-4 decoration-stone-300">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-stone-500 mb-4">{product.category}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-lg font-medium text-stone-900">₹{product.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex items-center justify-center p-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
