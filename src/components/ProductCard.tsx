'use client';

import Image from 'next/image';
import type { IProduct } from '@/models/Product';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#4B5563" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="aspect-square relative bg-background-light overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </motion.div>
        {product.discount > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            {product.discount}% OFF
          </motion.span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-text-primary line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-sm text-text-secondary mt-1">{product.brand}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-text-secondary">({product.rating})</span>
        </div>

        <div className="mt-4">
          {product.discount > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-text-primary">₹{discountedPrice.toFixed(0)}</span>
              <span className="text-sm text-text-secondary line-through">₹{product.price}</span>
              <span className="text-xs text-green-400 font-medium">Save ₹{(product.price - discountedPrice).toFixed(0)}</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-text-primary">₹{product.price}</span>
          )}
        </div>

        <motion.a
          href={product.affiliateLink}
          target="_blank"
          rel="nofollow sponsored"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 block w-full bg-gradient-to-r from-primary to-secondary text-white text-center py-3 rounded-xl font-semibold hover:from-button-hover hover:to-primary transition-all duration-300 shadow-md hover:shadow-glow"
        >
          Buy Now
        </motion.a>
      </div>
    </motion.div>
  );
}
