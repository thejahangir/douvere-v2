import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useStore();

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag size={40} className="text-stone-300" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">Your cart is empty</h1>
        <p className="text-stone-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our collection of clean beauty essentials.
        </p>
        <Link 
          to="/shop" 
          className="px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-full font-bold hover:from-brand-purple hover:to-brand-blue transition-all duration-300 shadow-lg shadow-brand-purple/20 transform hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-12 tracking-tight">Your Cart ({cartCount})</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-stone-100 text-sm font-medium text-stone-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="divide-y divide-stone-100">
                {cart.map((item, index) => (
                  <motion.div 
                    key={item.cartItemId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center"
                  >
                    <div className="col-span-12 sm:col-span-6 flex w-full">
                      <Link to={`/product/${item.id}`} className="w-24 h-32 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="ml-6 flex flex-col justify-center flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-stone-900">
                            <Link to={`/product/${item.id}`} className="hover:underline underline-offset-4 decoration-stone-300">
                              {item.name}
                            </Link>
                          </h3>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="sm:hidden text-stone-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <p className="text-sm text-stone-500 mb-1">{item.category}</p>
                        {item.selectedVariant && (
                          <p className="text-sm text-stone-500 mb-2">Variant: {item.selectedVariant.name}</p>
                        )}
                        <p className="text-base font-medium text-stone-900">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-3 flex justify-between sm:justify-center items-center w-full">
                      <span className="sm:hidden text-sm font-medium text-stone-500">Quantity:</span>
                      <div className="flex items-center border border-stone-200 rounded-full h-10 w-28 bg-white">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="flex-1 flex justify-center items-center text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="flex-1 flex justify-center items-center text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-3 flex justify-between sm:justify-end items-center w-full">
                      <span className="sm:hidden text-sm font-medium text-stone-500">Total:</span>
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-medium text-stone-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="hidden sm:block text-stone-400 hover:text-red-500 transition-colors p-2 -mr-2 rounded-full hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-base text-stone-600">
                  <p>Subtotal</p>
                  <p className="font-medium text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between text-base text-stone-600">
                  <p>Shipping</p>
                  <p className="font-medium text-stone-900">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</p>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-stone-500 text-right -mt-2">
                    Add ₹{(2999 - cartTotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-base text-stone-600">
                  <p>Estimated taxes</p>
                  <p className="font-medium text-stone-900">₹{tax.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-stone-900">Total</p>
                  <div className="flex items-end space-x-2">
                    <span className="text-sm text-stone-500 mb-1">INR</span>
                    <p className="text-3xl font-bold text-stone-900">₹{total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white py-4 rounded-full font-bold text-lg hover:from-brand-purple hover:to-brand-blue transition-all duration-300 flex items-center justify-center shadow-lg shadow-brand-purple/20 group transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-stone-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Free Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
