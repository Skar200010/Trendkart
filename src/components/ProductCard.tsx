'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCardProps {
  product: ProductData;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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
        <svg key={i} className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
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
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="aspect-square relative bg-background-light overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
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
            className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
          >
            {product.discount}% OFF
          </motion.span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-text-primary text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-200 leading-tight">
          {product.title}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{product.brand}</p>
        
        <div className="flex items-center gap-1 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-text-secondary">({product.rating})</span>
        </div>

        <div className="mt-2">
          {product.discount > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-text-primary">₹{discountedPrice.toFixed(0)}</span>
              <span className="text-xs text-text-secondary line-through">₹{product.price}</span>
              <span className="text-[10px] text-green-600 font-medium">Save ₹{(product.price - discountedPrice).toFixed(0)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-text-primary">₹{product.price}</span>
          )}
        </div>

        <motion.a
          href={product.affiliateLink}
          target="_blank"
          rel="nofollow sponsored"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 block w-full bg-gradient-to-r from-primary to-secondary text-white text-center py-2 rounded-lg font-medium text-sm hover:from-button-hover hover:to-primary transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Buy Now
        </motion.a>
      </div>
    </motion.div>
  );
}
