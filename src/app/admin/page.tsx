'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  createdAt?: string;
}

const tabs = [
  { id: 'products', label: 'Products', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )},
  { id: 'posts', label: 'Blog Posts', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  )},
];

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user && activeTab === 'products') {
      fetchProducts();
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const availableBrands = Array.from(new Set((products || []).map(p => p.brand).filter(Boolean))).sort();

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...(products || [])];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    if (brandFilter !== 'all') {
      result = result.filter(p => p.brand === brandFilter);
    }
    
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    }
    
    return result;
  }, [products, searchQuery, categoryFilter, brandFilter, sortBy]);

  if (!user) {
    return null;
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/products', {
        ...productForm,
        price: Number(productForm.price),
        discount: Number(productForm.discount),
        rating: Number(productForm.rating),
      });

      if (res.status === 201) {
        setMessage({ type: 'success', text: 'Product added successfully!' });
        setProductForm({
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
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: 'Failed to add product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding product' });
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/posts', postForm);

      if (res.status === 201) {
        setMessage({ type: 'success', text: 'Post added successfully!' });
        setPostForm({ title: '', slug: '', content: '', category: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding post' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeleteLoading(id);
    try {
      await axios.delete(`/api/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchProducts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                Admin Panel
              </h1>
              <p className="text-text-secondary mt-1">Manage your products and blog posts</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl font-medium transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </div>

          <div className="flex gap-2 p-1 bg-card rounded-2xl mb-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'products' | 'posts')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
          </AnimatePresence>

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Add New Product</h2>
                <form onSubmit={handleProductSubmit} className="card p-6 md:p-8 space-y-6">
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
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full gradient-bg text-white py-4 rounded-xl font-semibold transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Product
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">Product Inventory</h2>
                  <p className="text-text-secondary text-sm">{products.length} total products</p>
                </div>

                <div className="card p-4 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                      >
                        <option value="all">All Categories</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                      </select>
                      <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="px-4 py-2.5 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                      >
                        <option value="all">All Brands</option>
                        {availableBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                  {(searchQuery || categoryFilter !== 'all' || brandFilter !== 'all') && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-text-secondary">
                        Showing {filteredAndSortedProducts.length} of {products.length} products
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('all');
                          setBrandFilter('all');
                        }}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>

                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="card p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-text-secondary/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-text-secondary mb-4">
                      {products.length === 0 ? 'No products found. Add your first product above.' : 'No products match your filters.'}
                    </p>
                    {products.length > 0 && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('all');
                          setBrandFilter('all');
                        }}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filteredAndSortedProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="card p-4 hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-background flex-shrink-0">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{product.title}</h3>
                                <p className="text-sm text-text-secondary">{product.brand}</p>
                              </div>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                product.category === 'men' 
                                  ? 'bg-blue-500/10 text-blue-400' 
                                  : 'bg-pink-500/10 text-pink-400'
                              }`}>
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-primary">₹{product.price}</span>
                              {product.discount > 0 && (
                                <span className="text-sm text-text-secondary line-through">₹{Math.round(product.price / (1 - product.discount/100))}</span>
                              )}
                              {product.discount > 0 && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{product.discount}% OFF</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm text-text-secondary">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-text-secondary/10">
                          <Link
                            href={`/admin/product-edit/${product._id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={deleteLoading === product._id}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === product._id ? (
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-text-primary mb-4">Add New Blog Post</h2>
              <form onSubmit={handlePostSubmit} className="card p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Post Title</label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Category</label>
                  <input
                    type="text"
                    required
                    value={postForm.category}
                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                    placeholder="e.g., Trends, Guide, Tips"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Content</label>
                  <textarea
                    required
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all resize-none"
                    placeholder="Write your blog post content here..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full gradient-bg text-white py-4 rounded-xl font-semibold transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding Post...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Post
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
