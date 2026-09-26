import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ArrowRight, ArrowUp } from 'lucide-react';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../assets/img/logo-douvere.png';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = React.useState(true);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showGoTop, setShowGoTop] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu and search on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  // Derived filtered products for search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to top 5 results
  }, [searchQuery]);

  // Stop body scroll when search is open
  React.useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Announcement Bar */}
      <AnimatePresence>
        {isAnnouncementVisible && (
          <motion.div 
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple text-white text-xs font-bold py-2.5 text-center tracking-widest uppercase shadow-sm relative overflow-hidden"
          >
            FREE SHIPPING ON ALL ORDERS OVER ₹2,999
            <button 
              onClick={() => setIsAnnouncementVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              aria-label="Close announcement"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="sticky top-0 z-40 w-full h-0">
        <header className="absolute top-4 left-0 right-0 px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-7xl mx-auto relative">
            <div className="glass-panel rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300 pointer-events-auto shadow-lg">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-stone-600 hover:text-brand-pink focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link to="/" className="flex items-center">
                <img src={logoImg} alt="Douvere" className="h-8 sm:h-9 w-auto object-contain logo-deuvere" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-11 items-center">
              <Link to="/shop" className="text-lg font-extrabold text-stone-800 hover:text-brand-pink transition-colors">Shop All</Link>
              <Link to="/category/skincare" className="text-lg font-extrabold text-stone-800 hover:text-brand-pink transition-colors">Skincare</Link>
              <Link to="/category/makeup" className="text-lg font-extrabold text-stone-800 hover:text-brand-pink transition-colors">Makeup</Link>
              <Link to="/about" className="text-lg font-extrabold text-stone-800 hover:text-brand-pink transition-colors">About</Link>
            </nav>

            {/* Icons / Actions - Right side: Search Only */}
            <div className="flex items-center">
              <button 
                className="text-stone-600 hover:text-brand-pink transition-colors focus:outline-none p-1.5 hover:bg-stone-100/60 rounded-full"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                <Link to="/shop" className="block px-4 py-3 text-base font-bold text-stone-900 hover:text-brand-pink hover:bg-stone-50 rounded-xl transition-colors">Shop All</Link>
                <Link to="/category/skincare" className="block px-4 py-3 text-base font-bold text-stone-900 hover:text-brand-pink hover:bg-stone-50 rounded-xl transition-colors">Skincare</Link>
                <Link to="/category/makeup" className="block px-4 py-3 text-base font-bold text-stone-900 hover:text-brand-pink hover:bg-stone-50 rounded-xl transition-colors">Makeup</Link>
                <Link to="/about" className="block px-4 py-3 text-base font-bold text-stone-900 hover:text-brand-pink hover:bg-stone-50 rounded-xl transition-colors">About</Link>
                <div className="px-4 pt-4 mt-2 border-t border-stone-100">
                  <button 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchOpen(true);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-stone-600 hover:text-brand-pink hover:bg-stone-50 rounded-xl transition-colors text-sm font-bold"
                  >
                    <Search size={18} />
                    <span>Search Products</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </header>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] border border-stone-100"
            >
              <div className="flex items-center p-3 border-b border-stone-100/80 bg-stone-50/50">
                <Search size={20} className="text-stone-400 ml-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-stone-900 px-4 py-3 text-base md:text-lg focus:outline-none placeholder:text-stone-400 font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 mr-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition-colors focus:outline-none"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="h-6 w-px bg-stone-200 mx-2" />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 mr-2 text-stone-400 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-full transition-colors focus:outline-none shadow-sm border border-stone-100"
                  aria-label="Close search modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto p-4 md:p-6 pb-8">
                {searchQuery.trim() === '' ? (
                  <div>
                    <p className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 px-2">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Lipstick', 'Serum', 'Cleanser', 'SPF', 'Mask', 'Rose'].map((term, i) => (
                        <button 
                          key={i}
                          onClick={() => setSearchQuery(term)}
                          className="px-5 py-2 bg-stone-50 rounded-full text-sm font-medium text-stone-600 hover:text-brand-pink hover:bg-brand-pink/5 border border-stone-100 hover:border-brand-pink/20 transition-all duration-300 shadow-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 px-2">Products ({searchResults.length})</p>
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center p-3 bg-white hover:bg-stone-50 rounded-2xl border border-transparent hover:border-stone-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                      >
                        <div className="w-14 h-16 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="ml-4 flex-1">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-brand-pink mb-0.5">{product.category}</p>
                           <h4 className="text-sm font-bold text-stone-900 group-hover:text-brand-purple transition-colors">{product.name}</h4>
                        </div>
                        <div className="text-sm font-bold text-stone-700 mr-4 tabular-nums">₹{product.price.toLocaleString('en-IN')}</div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-stone-100 group-hover:bg-brand-pink/10 group-hover:border-brand-pink/20 transition-colors">
                          <ArrowRight size={14} className="text-stone-300 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                      <Search size={24} className="text-stone-300" />
                    </div>
                    <p className="text-stone-500 text-base font-medium">No results found for <span className="text-stone-900 font-bold">"{searchQuery}"</span></p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-grow ${location.pathname === '/' ? '' : 'pt-24'}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0510] text-stone-300 py-12 lg:py-16 border-t-4 border-brand-purple relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <img src={logoImg} alt="Douvere" className="h-8 sm:h-9 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-sm text-stone-400 mb-6">
                Clean, modern beauty essentials designed to enhance your natural radiance.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Shop</h3>
              <ul className="space-y-3">
                <li><Link to="/shop" className="text-sm hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/category/skincare" className="text-sm hover:text-white transition-colors">Skincare</Link></li>
                <li><Link to="/category/makeup" className="text-sm hover:text-white transition-colors">Makeup</Link></li>
                <li><Link to="/category/bestsellers" className="text-sm hover:text-white transition-colors">Bestsellers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">About</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Beauty Blog</Link></li>
                <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Newsletter</h3>
              <p className="text-sm text-stone-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-stone-800 border border-stone-700 text-white px-4 py-2 w-full focus:outline-none focus:border-stone-500 text-sm"
                />
                <button type="submit" className="bg-white text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-200 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-stone-500">© 2026 Douvère. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0 items-center">
              <a href="#" className="text-stone-500 hover:text-white transition-colors text-xs">Privacy Policy</a>
              <a href="#" className="text-stone-500 hover:text-white transition-colors text-xs">Terms of Service</a>
              <Link to="/admin" className="text-stone-600 hover:text-stone-400 transition-colors text-xs opacity-40 hover:opacity-70 ml-4">Admin</Link>
            </div>
          </div>
        </div>
      </footer>



      {/* Go Top Button */}
      <AnimatePresence>
        {showGoTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 p-3 bg-stone-900 text-white rounded-full shadow-xl border border-stone-800 hover:bg-brand-pink hover:border-brand-pink transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink group"
            aria-label="Go to top"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
