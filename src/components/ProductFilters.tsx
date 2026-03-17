'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import type { IProduct } from '@/models/Product';

interface ProductFiltersProps {
  products: IProduct[];
  brands: string[];
}

const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Levis', 'Raymond'];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity },
];
const ratings = [0, 4, 3, 2, 1];
const discountRanges = [
  { label: 'All', min: 0 },
  { label: '50% or more', min: 50 },
  { label: '40% or more', min: 40 },
  { label: '30% or more', min: 30 },
  { label: '20% or more', min: 20 },
  { label: '10% or more', min: 10 },
];

export default function ProductFilters({ products, brands }: ProductFiltersProps) {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const discountedPrice = product.price - (product.price * product.discount) / 100;
      
      if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
      if (discountedPrice < priceRanges[selectedPriceRange].min || discountedPrice > priceRanges[selectedPriceRange].max) return false;
      if (product.rating < selectedRating) return false;
      if (product.discount < selectedDiscount) return false;
      
      return true;
    });
  }, [products, selectedBrand, selectedPriceRange, selectedRating, selectedDiscount]);

  const clearFilters = () => {
    setSelectedBrand('All');
    setSelectedPriceRange(0);
    setSelectedRating(0);
    setSelectedDiscount(0);
  };

  const hasActiveFilters = selectedBrand !== 'All' || selectedPriceRange !== 0 || selectedRating !== 0 || selectedDiscount !== 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-64 flex-shrink-0"
      >
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-4"
        >
          <span className="font-medium">Filters</span>
          <svg className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {(isFilterOpen || isDesktop) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(index)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPriceRange === index
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Brand</h4>
                <div className="flex flex-wrap gap-2">
                  {['All', ...brands].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedBrand === brand
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Rating</h4>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        selectedRating === rating
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {rating === 0 ? 'All Ratings' : (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span>& Up</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Discount</h4>
                <div className="space-y-2">
                  {discountRanges.map((discount) => (
                    <button
                      key={discount.label}
                      onClick={() => setSelectedDiscount(discount.min)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedDiscount === discount.min
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {discount.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id?.toString() || index} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">No products match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
