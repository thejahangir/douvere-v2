import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'The Ultimate Guide to Double Cleansing',
    excerpt: 'Why this two-step process is the secret to clearer, more radiant skin and how to do it right.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    category: 'Skincare Routine',
    date: 'March 15, 2026',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Demystifying Hyaluronic Acid',
    excerpt: 'Everything you need to know about this hydration powerhouse and how to incorporate it into your routine.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    category: 'Ingredient Spotlight',
    date: 'March 10, 2026',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: '5 Ways to Achieve the "No-Makeup" Makeup Look',
    excerpt: 'Master the art of looking effortlessly put together with these simple, skin-first techniques.',
    image: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&q=80&w=800',
    category: 'Makeup Tips',
    date: 'March 5, 2026',
    readTime: '6 min read'
  },
  {
    id: 4,
    title: 'Transitioning Your Skincare for Spring',
    excerpt: 'As the weather warms up, your skin\'s needs change. Here\'s how to adapt your routine for the new season.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    category: 'Seasonal Care',
    date: 'February 28, 2026',
    readTime: '5 min read'
  }
];

export const Blog = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight">The Glow Down</h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Expert advice, skincare routines, and beauty tips from the Douvère team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <Link to={`/blog/${posts[0].id}`} className="block relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden group">
              <img 
                src={posts[0].image} 
                alt={posts[0].title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-4 text-sm font-medium text-stone-500 mb-4">
                <span className="text-[#ff006e] uppercase tracking-wider">{posts[0].category}</span>
                <span>•</span>
                <span>{posts[0].readTime}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6 leading-tight hover:underline underline-offset-4 decoration-stone-300">
                <Link to={`/blog/${posts[0].id}`}>{posts[0].title}</Link>
              </h2>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                {posts[0].excerpt}
              </p>
              <Link 
                to={`/blog/${posts[0].id}`} 
                className="inline-flex items-center text-stone-900 font-medium hover:text-stone-600 transition-colors"
              >
                Read Article <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.slice(1).map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col"
            >
              <Link to={`/blog/${post.id}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 mb-6">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col flex-1">
                <div className="flex items-center space-x-3 text-xs font-medium text-stone-500 mb-3">
                  <span className="text-[#ff006e] uppercase tracking-wider">{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 leading-snug">
                  <Link to={`/blog/${post.id}`} className="hover:underline underline-offset-4 decoration-stone-300">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-stone-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <Link 
                  to={`/blog/${post.id}`} 
                  className="mt-auto inline-flex items-center text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors"
                >
                  Read More <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 border border-stone-200 text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
};
