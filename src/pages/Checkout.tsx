import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronRight, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Checkout = () => {
  const { cart, cartTotal } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        // In a real app, we would clear the cart here
        // clearCart();
        navigate('/');
      }, 3000);
    }, 1500);
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">Your cart is empty</h1>
        <p className="text-stone-500 mb-8">Add some products before proceeding to checkout.</p>
        <Link 
          to="/shop" 
          className="px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-brand-pink/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-pink" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">Order Confirmed!</h1>
          <p className="text-stone-500 mb-8">
            Thank you for your purchase. We've sent a confirmation email to your inbox.
          </p>
          <p className="text-sm text-stone-400">Redirecting to home page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="flex-1">
            <nav className="flex text-xs text-stone-500 font-medium mb-8">
              <Link to="/cart" className="hover:text-stone-900 transition-colors">Cart</Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-stone-900">Information</span>
              <ChevronRight size={14} className="mx-2" />
              <span>Shipping</span>
              <ChevronRight size={14} className="mx-2" />
              <span>Payment</span>
            </nav>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Info */}
              <section>
                <h2 className="text-xl font-serif font-medium text-stone-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      placeholder="Email address" 
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="newsletter" className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900" />
                    <label htmlFor="newsletter" className="ml-2 text-sm text-stone-600">Email me with news and offers</label>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-serif font-medium text-stone-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="sr-only">First name</label>
                      <input type="text" id="firstName" required placeholder="First name" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="sr-only">Last name</label>
                      <input type="text" id="lastName" required placeholder="Last name" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="sr-only">Address</label>
                    <input type="text" id="address" required placeholder="Address" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                  </div>
                  <div>
                    <label htmlFor="apartment" className="sr-only">Apartment, suite, etc. (optional)</label>
                    <input type="text" id="apartment" placeholder="Apartment, suite, etc. (optional)" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="city" className="sr-only">City</label>
                      <input type="text" id="city" required placeholder="City" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="state" className="sr-only">State</label>
                      <select id="state" required className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow bg-white text-stone-500">
                        <option value="">State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="zip" className="sr-only">ZIP code</label>
                      <input type="text" id="zip" required placeholder="ZIP code" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone</label>
                    <input type="tel" id="phone" required placeholder="Phone" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-xl font-serif font-medium text-stone-900 mb-4">Payment</h2>
                <p className="text-sm text-stone-500 mb-4">All transactions are secure and encrypted.</p>
                <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center">
                      <input type="radio" id="credit-card" name="payment" defaultChecked className="w-4 h-4 text-stone-900 focus:ring-stone-900" />
                      <label htmlFor="credit-card" className="ml-3 font-medium text-stone-900">Credit card</label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-5 bg-stone-200 rounded"></div>
                      <div className="w-8 h-5 bg-stone-200 rounded"></div>
                      <div className="w-8 h-5 bg-stone-200 rounded"></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="sr-only">Card number</label>
                      <div className="relative">
                        <input type="text" id="cardNumber" required placeholder="Card number" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                        <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="nameOnCard" className="sr-only">Name on card</label>
                      <input type="text" id="nameOnCard" required placeholder="Name on card" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="sr-only">Expiration date (MM / YY)</label>
                        <input type="text" id="expiry" required placeholder="Expiration date (MM / YY)" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="sr-only">Security code</label>
                        <input type="text" id="cvc" required placeholder="Security code" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-shadow" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white py-4 rounded-xl font-bold text-lg hover:from-brand-purple hover:to-brand-blue transition-all duration-300 shadow-lg shadow-brand-purple/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  `Pay ₹${total.toLocaleString('en-IN')}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[450px] mt-12 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 sticky top-24">
              <h2 className="text-lg font-medium text-stone-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative w-16 h-16 bg-stone-100 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-stone-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-stone-500">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <p className="text-sm font-medium text-stone-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-stone-600">
                  <p>Subtotal</p>
                  <p className="font-medium text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <p>Shipping</p>
                  <p className="font-medium text-stone-900">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</p>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <p>Estimated taxes</p>
                  <p className="font-medium text-stone-900">₹{tax.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between items-center">
                <p className="text-lg font-medium text-stone-900">Total</p>
                <div className="flex items-end space-x-2">
                  <span className="text-xs text-stone-500 mb-1">INR</span>
                  <p className="text-2xl font-bold text-stone-900">₹{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
