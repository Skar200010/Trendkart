'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoryBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/men" 
            className="relative h-72 md:h-80 rounded-2xl overflow-hidden group block"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90 group-hover:opacity-100 transition-opacity"
              whileHover={{ opacity: 1 }}
            />
            <img 
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=400&fit=crop" 
              alt="Men's Fashion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center"
                whileHover={{ scale: 1.05 }}
              >
                Men&apos;s Collection
              </motion.h3>
              <p className="mt-2 text-white/80">Explore the latest trends for men</p>
              <motion.span 
                whileHover={{ x: 5 }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium bg-white/20 px-4 py-2 rounded-full"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.span>
            </div>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            href="/women" 
            className="relative h-72 md:h-80 rounded-2xl overflow-hidden group block"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-secondary to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity"
              whileHover={{ opacity: 1 }}
            />
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop" 
              alt="Women's Fashion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-center"
                whileHover={{ scale: 1.05 }}
              >
                Women&apos;s Collection
              </motion.h3>
              <p className="mt-2 text-white/80">Discover elegant styles for women</p>
              <motion.span 
                whileHover={{ x: 5 }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium bg-white/20 px-4 py-2 rounded-full"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
