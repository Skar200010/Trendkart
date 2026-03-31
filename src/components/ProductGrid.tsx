'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

interface ProductData {
  _id?: string;
  title: string;
  slug: string;
  category: "men" | "women";
  brand: string;
  price: number;
  discount: number;
  rating: number;
  image: string;
  affiliateLink: string;
}

interface ProductGridProps {
  products: ProductData[];
  title?: string;
  viewAllLink?: string;
}

export default function ProductGrid({ products, title, viewAllLink }: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-text-primary"
          >
            {title}
          </motion.h2>
          {viewAllLink && (
            <motion.a
              href={viewAllLink}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: 5 }}
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          )}
        </div>
      )}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product._id?.toString() || index} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No products available</p>
        </div>
      )}
    </section>
  );
}
