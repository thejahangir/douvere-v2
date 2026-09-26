import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, Review } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Star, Heart, Share2, ChevronRight, ChevronLeft, Minus, Plus, Check, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToWishlist, removeFromWishlist, isInWishlist, discounts } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'how-to'>('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const product = products.find(p => p.id === id);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  const [reviews, setReviews] = useState<Review[]>(product?.reviewsList || []);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  React.useEffect(() => {
    if (product?.variants) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setReviews(product?.reviewsList || []);
  }, [product?.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      author: newReviewName,
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: newReviewText
    };
    
    setReviews([newReview, ...reviews]);
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewText('');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <h1 className="text-4xl font-serif font-black text-stone-900 mb-4 tracking-tighter">Product Not Found</h1>
        <Link to="/shop" className="text-stone-500 hover:text-stone-900 underline underline-offset-4">
          Return to Shop
        </Link>
      </div>
    );
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveImage((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = product.images.length - 1;
      if (next >= product.images.length) next = 0;
      return next;
    });
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 1
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 1
      };
    },
    zoomed: {
      scale: 2.5
    },
    unzoomed: {
      scale: 1
    }
  };



  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-stone-50 py-4 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs text-stone-500 font-medium">
            <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-stone-900 transition-colors">{product.category}</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-stone-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeImage ? 1 : -1);
                    setActiveImage(idx);
                  }}
                  className={`relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? 'border-stone-900' : 'border-transparent hover:border-stone-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} - View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div 
              className="flex-1 relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.images.length > 0 ? (
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img 
                    key={activeImage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate={["center", isZoomed ? "zoomed" : "unzoomed"]}
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2, ease: "easeOut" }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);

                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    src={product.images[activeImage]} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{
                      transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center center',
                    }}
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-8xl opacity-50">
                  {product.name.charAt(0)}
                </div>
              )}
              
              {/* Carousel Controls */}
              <div className="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-800 shadow-sm hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-800 shadow-sm hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setDirection(idx > activeImage ? 1 : -1); setActiveImage(idx); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeImage === idx ? 'bg-stone-900 w-4' : 'bg-stone-400/50 hover:bg-stone-600'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {product.isNew && (
                <span className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-900 rounded-full shadow-sm">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tighter mb-2 drop-shadow-sm">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(product.rating) ? "fill-brand-yellow text-brand-yellow" : "fill-stone-200 text-stone-200"} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-stone-900">{product.rating}</span>
                    <span className="text-sm text-brand-purple underline decoration-brand-purple/30 underline-offset-4 cursor-pointer hover:text-brand-pink transition-colors">
                      Read {product.reviews} Reviews
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={toggleWishlist}
                    className={`p-3 rounded-full border transition-all duration-300 ${
                      isInWishlist(product.id) 
                        ? 'border-brand-pink bg-brand-pink/10 text-brand-pink shadow-[0_0_15px_rgba(255,0,110,0.2)]' 
                        : 'border-stone-200 text-stone-400 hover:border-brand-pink hover:text-brand-pink'
                    }`}
                  >
                    <Heart size={20} className={isInWishlist(product.id) ? 'fill-brand-pink' : ''} />
                  </button>
                  <button className="p-3 rounded-full border border-stone-200 text-stone-400 hover:border-brand-blue hover:text-brand-blue transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              {/* Price with discount support */}
              {(() => {
                const disc = discounts[product.id] ?? product.discount;
                if (disc) {
                  const discPrice = Math.round(product.price * (1 - disc / 100));
                  return (
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tighter">₹{discPrice.toLocaleString('en-IN')}</span>
                      <span className="text-xl text-stone-400 line-through font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1.5 rounded-full">{disc}% OFF</span>
                    </div>
                  );
                }
                return <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink mb-6 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>;
              })()}
              <p className="text-lg text-stone-600 leading-relaxed font-medium mb-8">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      {product.variants[0].colorCode ? 'Select Shade' : 'Select Size'}
                    </h3>
                    <span className="text-sm text-stone-500">{selectedVariant?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative rounded-full transition-all duration-300 ${
                          variant.colorCode 
                            ? `w-12 h-12 flex items-center justify-center border-2 ${selectedVariant?.id === variant.id ? 'border-stone-900 scale-110' : 'border-transparent hover:scale-105'}`
                            : `px-6 py-3 text-sm font-medium border ${selectedVariant?.id === variant.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`
                        }`}
                        style={variant.colorCode ? { backgroundColor: variant.colorCode } : {}}
                        aria-label={`Select ${variant.name}`}
                      >
                        {variant.colorCode && selectedVariant?.id === variant.id && (
                          <Check size={20} className="text-white drop-shadow-md mix-blend-difference" />
                        )}
                        {!variant.colorCode && variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Highlights & Guarantees */}
            <div className="mb-10 space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex flex-wrap gap-4 items-center justify-between text-xs font-semibold text-stone-700">
                <span className="flex items-center text-emerald-600 font-bold"><Check size={16} className="mr-1.5" /> In Stock</span>
                <span className="flex items-center"><Check size={16} className="mr-1.5 text-brand-purple" /> 100% Vegan & Cruelty-Free</span>
                <span className="flex items-center"><Check size={16} className="mr-1.5 text-brand-purple" /> Dermatologist Tested</span>
                <span className="flex items-center"><Check size={16} className="mr-1.5 text-brand-purple" /> Clean Ingredients</span>
              </div>
            </div>

            {/* Accordion / Tabs */}
            <div className="border-t border-stone-200 pt-8">
              <div className="flex space-x-8 border-b border-stone-200 mb-6">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'ingredients', label: 'Ingredients' },
                  { id: 'how-to', label: 'How to Use' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-sm font-bold transition-colors relative ${
                      activeTab === tab.id ? 'text-brand-purple' : 'text-stone-500 hover:text-brand-pink'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-pink to-brand-purple" 
                      />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-stone-600 leading-relaxed"
                  >
                    {activeTab === 'details' && (
                      <p>{product.description} Formulated to deliver visible results while maintaining the integrity of your skin barrier. Suitable for all skin types, including sensitive skin.</p>
                    )}
                    {activeTab === 'ingredients' && (
                      <div>
                        <p className="mb-4">Key Ingredients:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          {product.ingredients?.map((ing, i) => (
                            <li key={i} className="text-stone-700 font-medium">{ing}</li>
                          ))}
                        </ul>
                        <p className="mt-4 text-xs text-stone-500">Free of parabens, phthalates, sulfates, and synthetic fragrances.</p>
                      </div>
                    )}
                    {activeTab === 'how-to' && (
                      <p>{product.howToUse}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-stone-200 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Customer Reviews</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-5xl font-black text-stone-900">{product.rating}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < Math.floor(product.rating) ? "fill-brand-yellow text-brand-yellow" : "fill-stone-200 text-stone-200"} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-stone-500">Based on {reviews.length || product.reviews} reviews</p>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mt-8">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            size={24} 
                            className={star <= newReviewRating ? "fill-brand-yellow text-brand-yellow" : "fill-stone-200 text-stone-200 hover:text-brand-yellow transition-colors"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Review</label>
                    <textarea 
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors resize-none"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-100 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{review.author}</p>
                          <p className="text-xs text-stone-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "fill-brand-yellow text-brand-yellow" : "fill-stone-200 text-stone-200"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{review.content}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                  <Star size={48} className="text-stone-300 mb-4" />
                  <h3 className="text-lg font-bold text-stone-900 mb-2">No reviews yet</h3>
                  <p className="text-stone-500 max-w-sm">Be the first to review this product and share your experience with others.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-24 border-t border-stone-200 pt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">You Might Also Like</h2>
              <p className="text-stone-500">Curated recommendations based on your selection.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products
              .filter(p => p.id !== product.id && (p.category === product.category || p.isBestseller))
              .slice(0, 4)
              .map((recommendedProduct) => (
                <div key={recommendedProduct.id} className="group flex flex-col">
                  <Link to={`/product/${recommendedProduct.id}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 mb-4">
                    {recommendedProduct.image ? (
                      <img 
                        src={recommendedProduct.image} 
                        alt={recommendedProduct.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-5xl opacity-50 transition-transform duration-500 group-hover:scale-105">
                        {recommendedProduct.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                      <div className="w-full bg-white/95 backdrop-blur-sm text-stone-900 font-bold py-3 rounded-full shadow-md text-center text-xs uppercase tracking-wider group-hover:bg-brand-purple group-hover:text-white transition-all">
                        View Details
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-base font-medium text-stone-900 mb-1">
                      <Link to={`/product/${recommendedProduct.id}`} className="hover:underline underline-offset-4 decoration-stone-300">
                        {recommendedProduct.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-stone-500 mb-2 line-clamp-1">{recommendedProduct.description}</p>
                    <p className="text-base font-medium text-stone-900 mt-auto">₹{recommendedProduct.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
