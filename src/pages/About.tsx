import React from 'react';
import { motion } from 'motion/react';

export const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6 tracking-tight leading-tight"
            >
              Beauty that honors your natural radiance.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-stone-600 leading-relaxed"
            >
              Douvère was born from a simple belief: skincare should be effective, clean, and a joy to use. We create high-performance essentials that celebrate your skin, not hide it.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#ffbe0b]/10 via-[#ff006e]/5 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000" 
                alt="Founder" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                <p>
                  Founded in 2024, Douvère started with a frustration over the beauty industry's impossible standards and complicated routines. Our founder, Maya, wanted products that felt like a breath of fresh air—simple, effective, and transparent.
                </p>
                <p>
                  "Douvère" represents pure elegance and natural radiance. It's a reflection of our core philosophy: true beauty comes from within, and our products are simply tools to help your natural light shine through.
                </p>
                <p>
                  We spent two years working with top chemists to develop formulas that combine the best of nature with safe, clinically-proven synthetics. The result is a curated line of essentials that you'll reach for every single day.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Promise</h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg">The principles that guide everything we create.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Clean & Conscious',
                desc: 'Formulated without parabens, sulfates, phthalates, or synthetic fragrances. We only use ingredients that benefit your skin.'
              },
              {
                title: 'Cruelty-Free Always',
                desc: 'We never test on animals, and we only work with suppliers who share our commitment to ethical practices.'
              },
              {
                title: 'Sustainable Focus',
                desc: 'From glass bottles to post-consumer recycled plastics, we are constantly working to minimize our environmental footprint.'
              }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ffbe0b] to-[#ff006e]" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">{value.title}</h3>
                <p className="text-stone-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
