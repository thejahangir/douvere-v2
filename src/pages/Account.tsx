import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, LogOut, Shield, Bell, CreditCard, 
  Camera, Plus, Edit2, Trash2, X, Lock, Smartphone, Mail, Check, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useStore } from '../context/StoreContext';

export const Account = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems: { id: string; label: string; icon: any; color: string; bgColor: string; link?: string }[] = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-brand-purple', bgColor: 'bg-brand-purple/10' },
    { id: 'orders', label: 'Orders', icon: Package, color: 'text-brand-blue', bgColor: 'bg-brand-blue/10' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'text-brand-pink', bgColor: 'bg-brand-pink/10' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, color: 'text-brand-orange', bgColor: 'bg-brand-orange/10' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-brand-yellow', bgColor: 'bg-brand-yellow/10' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 sticky top-24">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-stone-100 text-stone-600 hover:text-brand-purple transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-stone-900">Jane Doe</h2>
                <p className="text-sm text-stone-500">Member since Oct 2023</p>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      {activeSection === item.id && (
                        <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                      )}
                    </div>
                  );

                  if (item.link) {
                    return (
                      <Link 
                        key={item.id}
                        to={item.link}
                        className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                          activeSection === item.id 
                            ? 'bg-stone-100 text-stone-900' 
                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all ${
                        activeSection === item.id 
                          ? 'bg-stone-100 text-stone-900' 
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      {content}
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-stone-100">
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-red-50">
                      <LogOut size={18} />
                    </div>
                    <span>Log out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Logout Confirmation Modal */}
          <AnimatePresence>
            {showLogoutConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-stone-100"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 text-center mb-2">Confirm Logout</h3>
                  <p className="text-stone-500 text-center mb-8">Are you sure you want to log out of your account?</p>
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                    >
                      Yes, Log out
                    </button>
                    <button 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="w-full py-3 bg-stone-100 text-stone-600 rounded-full font-bold hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-stone-900">Account Details</h1>
                      <p className="text-stone-500 mt-1">Manage your personal information and preferences.</p>
                    </div>
                  </div>
                  
                  <form className="space-y-8 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-semibold text-stone-700 ml-1">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          defaultValue="Jane" 
                          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:bg-white transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-semibold text-stone-700 ml-1">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          defaultValue="Doe" 
                          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:bg-white transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-stone-700 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        defaultValue="jane@example.com" 
                        className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:bg-white transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-stone-700 ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        placeholder="+1 (555) 000-0000" 
                        className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:bg-white transition-all" 
                      />
                    </div>

                    <div className="pt-4 flex items-center space-x-4">
                      <button type="button" className="px-10 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 hover:shadow-stone-300 transform hover:-translate-y-0.5 active:translate-y-0">
                        Save Changes
                      </button>
                      <button type="button" className="px-8 py-4 bg-white text-stone-600 rounded-full font-bold border border-stone-200 hover:bg-stone-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeSection === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-900">Order History</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-stone-500">Filter:</span>
                      <select className="bg-stone-50 border-none rounded-lg text-sm font-medium px-3 py-1 focus:ring-0">
                        <option>Last 6 months</option>
                        <option>2023</option>
                        <option>2022</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-3xl bg-stone-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Package size={40} className="text-brand-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No orders yet</h3>
                    <p className="text-stone-500 mb-8 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start exploring our collections!</p>
                    <Link to="/shop" className="inline-flex items-center px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20">
                      Start Shopping
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeSection === 'wishlist' && (
                <motion.div 
                  key="wishlist"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-900">My Wishlist</h2>
                    <Link to="/shop" className="text-brand-purple font-bold hover:underline">Continue Shopping</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {wishlist.length > 0 ? (
                      wishlist.map((item) => (
                        <div key={item.id} className="flex gap-4 group relative">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {item.isNew && (
                              <span className="absolute top-2 left-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full shadow-sm z-10">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col justify-center flex-1">
                            <h3 className="font-bold text-stone-900">{item.name}</h3>
                            <p className="text-stone-500">₹{item.price.toLocaleString('en-IN')}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button 
                                onClick={() => addToCart(item)}
                                className="text-sm font-bold text-brand-purple hover:underline"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-sm text-stone-400 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <Heart size={32} className="mx-auto text-stone-300 mb-3" />
                        <p className="text-stone-500">Your wishlist is empty.</p>
                        <Link to="/shop" className="text-brand-purple font-bold hover:underline mt-2 inline-block">Go to Shop</Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <AnimatePresence mode="wait">
                    {!isAddingAddress ? (
                      <motion.div
                        key="address-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex justify-between items-center mb-8">
                          <div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900">My Addresses</h2>
                            <p className="text-stone-500 mt-1">Manage your shipping and billing addresses.</p>
                          </div>
                          <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                          >
                            <Plus size={18} />
                            <span>Add New Address</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Default Address */}
                          <div className="relative p-6 rounded-2xl border-2 border-brand-purple bg-brand-purple/5 group">
                            <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-purple transition-colors">
                                <Edit2 size={14} />
                              </button>
                              <button className="p-2 bg-white rounded-lg shadow-sm text-stone-600 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-4">
                              <span className="px-2 py-1 bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider rounded">Default</span>
                              <span className="text-sm font-bold text-stone-900">Home</span>
                            </div>
                            
                            <div className="space-y-1 text-stone-600">
                              <p className="font-bold text-stone-900">Jane Doe</p>
                              <p>123 Glow Street, Suite 456</p>
                              <p>Beverly Hills, CA 90210</p>
                              <p>United States</p>
                              <p className="pt-2 text-sm">+1 (555) 123-4567</p>
                            </div>
                          </div>

                          {/* Add New Placeholder */}
                          <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-stone-200 hover:border-brand-purple hover:bg-stone-50 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors">
                              <Plus size={24} />
                            </div>
                            <span className="font-bold text-stone-900">Add New Address</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="address-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-3xl font-serif font-bold text-stone-900">Add New Address</h2>
                          <button 
                            onClick={() => setIsAddingAddress(false)}
                            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                          >
                            <X size={24} />
                          </button>
                        </div>

                        <form className="space-y-6 max-w-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-stone-700">Address Label (e.g. Home, Work)</label>
                              <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="Home" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-stone-700">Full Name</label>
                              <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="Jane Doe" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Street Address</label>
                            <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="123 Glow St" />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-stone-700">City</label>
                              <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="Beverly Hills" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-stone-700">State</label>
                              <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="CA" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-stone-700">Zip Code</label>
                              <input type="text" className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none" placeholder="90210" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="default-address" className="w-4 h-4 rounded border-stone-300 text-brand-purple focus:ring-brand-purple" />
                            <label htmlFor="default-address" className="text-sm text-stone-600">Set as default shipping address</label>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setIsAddingAddress(false)} className="px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all">Save Address</button>
                            <button type="button" onClick={() => setIsAddingAddress(false)} className="px-8 py-3 bg-white text-stone-600 border border-stone-200 rounded-full font-bold hover:bg-stone-50 transition-all">Cancel</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeSection === 'payments' && (
                <motion.div 
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-stone-900">Payment Methods</h2>
                      <p className="text-stone-500 mt-1">Manage your saved cards and payment preferences.</p>
                    </div>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all">
                      <Plus size={18} />
                      <span>Add New Card</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-stone-100 bg-stone-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-stone-900 rounded flex items-center justify-center text-white font-bold text-[10px]">VISA</div>
                        <div>
                          <p className="font-bold text-stone-900">Visa ending in 4242</p>
                          <p className="text-sm text-stone-500">Expires 12/26 • Default</p>
                        </div>
                      </div>
                      <button className="text-stone-400 hover:text-stone-900 transition-colors"><Edit2 size={18} /></button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Security Settings</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between py-6 border-b border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 rounded-2xl text-stone-600"><Lock size={24} /></div>
                        <div>
                          <p className="font-bold text-stone-900">Password</p>
                          <p className="text-sm text-stone-500">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 border border-stone-200 rounded-full font-bold hover:bg-stone-50 transition-all">Change</button>
                    </div>

                    <div className="flex items-center justify-between py-6 border-b border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 rounded-2xl text-stone-600"><Smartphone size={24} /></div>
                        <div>
                          <p className="font-bold text-stone-900">Two-Factor Authentication</p>
                          <p className="text-sm text-stone-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold">Enabled</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-stone-100"
                >
                  <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Order Updates", desc: "Get notified about your order status and shipping", icon: Package },
                      { title: "Promotions & Sales", desc: "Be the first to know about new arrivals and special offers", icon: Heart },
                      { title: "Account Activity", desc: "Security alerts and account-related notifications", icon: Shield }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 rounded-2xl border border-stone-100">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-stone-50 rounded-2xl text-stone-400"><item.icon size={24} /></div>
                          <div>
                            <p className="font-bold text-stone-900">{item.title}</p>
                            <p className="text-sm text-stone-500">{item.desc}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] uppercase font-bold text-stone-400">Email</span>
                            <button className="w-12 h-6 bg-brand-purple rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></button>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] uppercase font-bold text-stone-400">Push</span>
                            <button className="w-12 h-6 bg-stone-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
