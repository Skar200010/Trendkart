'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface ProductFiltersProps {
  products: ProductData[];
  brands: string[];
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
    rating: true,
    discount: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const discountedPrice = product.price - (product.price * product.discount) / 100;
      
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
      if (discountedPrice < priceRanges[selectedPriceRange].min || discountedPrice > priceRanges[selectedPriceRange].max) return false;
      if (product.rating < selectedRating) return false;
      if (product.discount < selectedDiscount) return false;
      
      return true;
    });
  }, [products, searchQuery, selectedBrand, selectedPriceRange, selectedRating, selectedDiscount]);

  const clearFilters = () => {
    setSelectedBrand('All');
    setSelectedPriceRange(0);
    setSelectedRating(0);
    setSelectedDiscount(0);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedBrand !== 'All' || selectedPriceRange !== 0 || selectedRating !== 0 || selectedDiscount !== 0 || searchQuery !== '';

  return (
    <div className="flex flex-col lg:flex-row gap-6 py-6">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-32 lg:self-start"
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
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3"
                >
                  <span>Price Range</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSections.price && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  onClick={() => toggleSection('brand')}
                  className="w-full flex items-center justify-between font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3"
                >
                  <span>Brand</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSections.brand && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  onClick={() => toggleSection('rating')}
                  className="w-full flex items-center justify-between font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3"
                >
                  <span>Rating</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSections.rating && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  onClick={() => toggleSection('discount')}
                  className="w-full flex items-center justify-between font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3"
                >
                  <span>Discount</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.discount ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSections.discount && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      <div className="flex-1 min-w-0 h-screen">
    <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 pb-3 border-b border-gray-200 dark:border-gray-700">
  <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              data-testid="clear-search"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
          </p>
        </div>
        <div className='flex-1 min-w-0 h-screen overflow-y-auto'>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
      </div>
</div>
  );
}
