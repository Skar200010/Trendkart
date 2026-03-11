'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 premium-gradient-bg">
        <div className="gradient-blob-1 -top-40 -left-40" />
        <div className="gradient-blob-2 -bottom-40 -right-40" />
        <div className="gradient-blob-3 top-1/3 right-1/4" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 40%)
          `
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-28">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-5 py-2.5 bg-primary/15 border border-primary/25 rounded-full text-sm font-medium text-primary"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2.5 animate-pulse" />
              New Season Collection 2026
            </motion.span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mt-8"
          >
            Discover Your{' '}
            <span className="gradient-text">Perfect Style</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary mt-6 leading-relaxed max-w-xl mx-auto"
          >
            Your ultimate destination for the latest fashion trends. 
            Shop curated collections from top brands at the best prices.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link 
                href="/men" 
                className="inline-flex items-center justify-center gradient-bg text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-glow hover:shadow-glow-lg"
              >
                <span>Shop Men</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/women" 
                className="inline-flex items-center justify-center bg-card border-2 border-text-secondary/30 text-text-primary px-8 py-4 rounded-xl font-semibold hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <span>Shop Women</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-12"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-white text-sm font-medium">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-text-secondary">
              <span className="text-text-primary font-semibold">10K+</span> Happy Customers
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-text-secondary"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
