'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  image: string;
  affiliateLink: string;
}

export default function EditProductPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [productForm, setProductForm] = useState({
    title: '',
    slug: '',
    category: 'men',
    brand: '',
    price: '',
    discount: '',
    rating: '',
    image: '',
    affiliateLink: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && productId) {
      fetchProduct();
    }
  }, [isAuthenticated, productId]);

  const fetchProduct = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`/api/products/${productId}`);
      const product = res.data;
      setProductForm({
        title: product.title || '',
        slug: product.slug || '',
        category: product.category || 'men',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        rating: product.rating?.toString() || '',
        image: product.image || '',
        affiliateLink: product.affiliateLink || '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch product' });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.put(`/api/products/${productId}`, {
        ...productForm,
        price: Number(productForm.price),
        discount: Number(productForm.discount),
        rating: Number(productForm.rating),
      });

      if (res.data) {
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-card hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Edit Product</h1>
              <p className="text-text-secondary">Update product details</p>
            </div>
          </div>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Brand</label>
                <input
                  type="text"
                  required
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="Brand name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Discount (%)</label>
                <input
                  type="number"
                  value={productForm.discount}
                  onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="0"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  value={productForm.rating}
                  onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="4.5"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Affiliate Link</label>
                <input
                  type="url"
                  required
                  value={productForm.affiliateLink}
                  onChange={(e) => setProductForm({ ...productForm, affiliateLink: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                  placeholder="https://affiliate-link.com/product"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 gradient-bg text-white py-4 rounded-xl font-semibold transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Product
                  </>
                )}
              </motion.button>
              <Link
                href="/admin"
                className="px-6 py-4 rounded-xl font-semibold bg-card border border-text-secondary/20 text-text-secondary hover:text-text-primary hover:border-text-secondary/40 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
