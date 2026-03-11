'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 premium-gradient-bg">
        <div className="gradient-blob-1 -top-40 -left-40" />
        <div className="gradient-blob-2 -bottom-40 -right-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-text-primary">
              Trend<span className="text-primary">Kart</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary mt-6">Admin Login</h1>
            <p className="text-text-secondary mt-2">Sign in to manage your store</p>
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full gradient-bg text-white py-3.5 rounded-xl font-semibold transition-all shadow-glow hover:shadow-glow-lg"
            >
              Sign In
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-text-secondary hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
