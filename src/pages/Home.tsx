import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: "REDEFINE\nYOUR GLOW.",
    description: "Discover our new collection of clean, high-performance skincare designed to reveal your best skin.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=2000",
    link: "/shop",
    buttonText: "Shop the Collection"
  },
  {
    id: 2,
    title: "VELVET MATTE\nPERFECTION.",
    description: "A highly pigmented, long-lasting matte lipstick that feels comfortable and non-drying on the lips.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=2000",
    link: "/product/2",
    buttonText: "Shop Lipstick"
  },
  {
    id: 3,
    title: "NOURISH\nYOUR BODY.",
    description: "Experience our luxurious body care line for soft, supple, and radiant skin from head to toe.",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=2000",
    link: "/category/body-care",
    buttonText: "Explore Body Care"
  }
];

export const Home = () => {
  const { discounts } = useStore();
  
  // Best sellers based on isBestseller flag
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);
  
  // New arrivals based on isNew flag
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  
  // Cult favorites (mix of highly rated + bestsellers)
  const cultFavorites = products
    .filter(p => p.rating >= 4.8)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Split Screen Creative Design */}
      <section className="relative h-screen min-h-[700px] flex overflow-hidden bg-[#faf8f7]">
        {/* Left Side: Dynamic Content */}
        <div className="relative w-full lg:w-[45%] h-full z-20 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white/60 backdrop-blur-xl shrink-0">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-brand-pink/20 to-transparent blur-[100px] rounded-full" />
             <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-gradient-to-l from-brand-orange/10 to-transparent blur-[80px] rounded-full" />
             <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] bg-gradient-to-t from-brand-purple/15 to-transparent blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 space-y-8">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="inline-flex items-center space-x-3 bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span>
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-stone-700 uppercase">Featured Collection</span>
              </motion.div>

              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 40, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -40, rotateX: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl lg:text-8xl font-serif font-black text-stone-900 tracking-tighter leading-[0.9] whitespace-pre-line"
                style={{ perspective: 1000 }}
              >
                {heroSlides[currentSlide].title.split('\n').map((line, i) => (
                  <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-orange drop-shadow-sm' : ''}`}>
                    {line}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-stone-500 font-medium max-w-sm leading-relaxed"
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              <motion.div
                key={`btn-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-4"
              >
                <Link 
                  to={heroSlides[currentSlide].link} 
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-sm font-bold tracking-widest uppercase overflow-hidden rounded-full shadow-[0_8px_30px_rgba(255,0,110,0.2)] hover:shadow-[0_16px_40px_rgba(255,0,110,0.4)] transition-all duration-300"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-pink via-brand-purple to-brand-orange group-hover:bg-gradient-to-l transition-all duration-700 ease-out" />
                  <span className="relative text-white flex items-center">
                    {heroSlides[currentSlide].buttonText}
                    <ArrowRight size={18} className="ml-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Custom Navigation (Desktop Left Side) */}
          <div className="absolute bottom-12 left-8 sm:left-12 lg:left-20 z-30 flex items-center space-x-6">
            <div className="flex space-x-3">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-brand-pink hover:bg-white transition-all group shadow-sm bg-white/50 backdrop-blur-md"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-brand-pink hover:bg-white transition-all group shadow-sm bg-white/50 backdrop-blur-md"
              >
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="h-4 w-px bg-stone-300 hidden sm:block" />
            
            <div className="hidden sm:flex text-sm font-bold font-serif text-stone-900 tracking-widest w-16">
              0{currentSlide + 1} <span className="text-stone-300 mx-2">/</span> 0{heroSlides.length}
            </div>
          </div>
        </div>

        {/* Right Side: Image Expansion */}
        <div className="absolute inset-0 lg:static w-full lg:w-[55%] h-full z-0 lg:z-10 group bg-[#faf8f7]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10% round 3rem)' }}
              animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 w-full h-full lg:rounded-l-[3rem] overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.1)]"
            >
              <img 
                src={heroSlides[currentSlide].image} 
                alt="Product Showcase" 
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
              />
              {/* Overlay gradients for the image side */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/40 via-transparent to-brand-orange/20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-black/10 lg:hidden" /> {/* Darken slightly on mobile for text readability */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#faf8f7] to-transparent hidden lg:block" /> {/* Blends margin with left side */}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile Navigation overlay (Visible only on small screens) */}
        <div className="lg:hidden absolute bottom-12 right-6 z-30 flex flex-col space-y-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'h-8 bg-brand-pink' : 'h-2 bg-white/50 backdrop-blur-md'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tighter">Shop by Category</h2>
            <Link to="/shop" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-widest text-brand-pink hover:text-brand-purple transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]">
            {[
              { name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800', link: '/category/skincare', span: 'md:col-span-2 md:row-span-2' },
              { name: 'Makeup', image: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&q=80&w=800', link: '/category/makeup', span: 'md:col-span-2 md:row-span-1' },
              { name: 'Body Care', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800', link: '/category/body-care', span: 'md:col-span-2 md:row-span-1' }
            ].map((category, index) => (
              <Link key={index} to={category.link} className={`group block relative overflow-hidden rounded-3xl ${category.span}`}>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/80 via-brand-pink/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                  <h3 className="text-3xl font-serif font-bold text-white drop-shadow-lg tracking-tight">{category.name}</h3>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white/30">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-pink hover:text-brand-purple transition-colors">
              View All Categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cult Favorites Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tighter mb-4">Cult Favorites</h2>
              <p className="text-stone-500 max-w-2xl text-lg">Discover the products our community can't live without.</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-pink hover:text-brand-purple transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {/* Cult Favorites Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {cultFavorites.map((product) => (
              <div key={product.id} className="group flex flex-col">
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
                  {/* Discount + Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {(() => { const disc = discounts[product.id] ?? product.discount; return disc ? <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">{disc}% OFF</span> : null; })()}
                    {product.isNew && <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(255,0,110,0.4)]">New</span>}
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
                  {(() => { const disc = discounts[product.id] ?? product.discount; if (disc) { const dp = Math.round(product.price*(1-disc/100)); return <div className="flex items-center gap-2 mt-auto"><p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">₹{dp.toLocaleString('en-IN')}</p><p className="text-sm text-stone-400 line-through">₹{product.price.toLocaleString('en-IN')}</p></div>; } return <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink mt-auto">₹{product.price.toLocaleString('en-IN')}</p>; })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tighter mb-4">New Arrivals</h2>
              <p className="text-stone-500 max-w-2xl text-lg">The latest innovations in clean beauty, just for you.</p>
            </div>
            <Link to="/shop?category=new" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-pink hover:text-brand-purple transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {/* New Arrivals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {newArrivals.map((product) => (
              <div key={product.id} className="group flex flex-col">
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
                  {/* Discount + Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {(() => { const disc = discounts[product.id] ?? product.discount; return disc ? <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">{disc}% OFF</span> : null; })()}
                    {product.isNew && <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(255,0,110,0.4)]">New</span>}
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
                  {(() => { const disc = discounts[product.id] ?? product.discount; if (disc) { const dp = Math.round(product.price*(1-disc/100)); return <div className="flex items-center gap-2 mt-auto"><p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">₹{dp.toLocaleString('en-IN')}</p><p className="text-sm text-stone-400 line-through">₹{product.price.toLocaleString('en-IN')}</p></div>; } return <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink mt-auto">₹{product.price.toLocaleString('en-IN')}</p>; })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tighter mb-4">Best Sellers</h2>
              <p className="text-stone-500 max-w-2xl text-lg">Our highest-rated essentials for your daily routine.</p>
            </div>
            <Link to="/shop?category=bestsellers" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-pink hover:text-brand-purple transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {bestsellers.map((product) => (
              <div key={product.id} className="group flex flex-col">
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
                  {/* Discount + Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {(() => { const disc = discounts[product.id] ?? product.discount; return disc ? <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">{disc}% OFF</span> : null; })()}
                    {product.isNew && <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(255,0,110,0.4)]">New</span>}
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
                  {(() => { const disc = discounts[product.id] ?? product.discount; if (disc) { const dp = Math.round(product.price*(1-disc/100)); return <div className="flex items-center gap-2 mt-auto"><p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">₹{dp.toLocaleString('en-IN')}</p><p className="text-sm text-stone-400 line-through">₹{product.price.toLocaleString('en-IN')}</p></div>; } return <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink mt-auto">₹{product.price.toLocaleString('en-IN')}</p>; })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gradient-to-br from-brand-yellow/10 via-brand-pink/5 to-brand-blue/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-pink/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-brand-blue/20 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 tracking-tighter mb-6 leading-[1.1]">
                Clean ingredients, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">clinically proven.</span>
              </h2>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed font-medium">
                We believe that what you put on your skin matters. That's why every Douvère product is formulated with potent, plant-derived ingredients and safe synthetics that deliver visible results without compromising your skin's health.
              </p>
              <ul className="space-y-4 mb-10">
                {['Cruelty-free & Vegan', 'Dermatologist Tested', 'No Parabens or Sulfates', 'Sustainable Packaging'].map((item, i) => (
                  <li key={i} className="flex items-center text-stone-800 font-bold tracking-wide">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple mr-4 shadow-[0_0_12px_rgba(255,0,110,0.6)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold tracking-widest uppercase text-white bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-blue hover:to-brand-purple transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Learn About Our Ingredients
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-brand-yellow via-brand-pink to-brand-purple absolute -inset-8 blur-3xl opacity-50 animate-pulse" />
              <div className="glass-panel p-4 rounded-[2.5rem] relative">
                <img 
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000" 
                  alt="Clean Ingredients" 
                  className="rounded-[2rem] shadow-2xl object-cover aspect-[4/5] w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
