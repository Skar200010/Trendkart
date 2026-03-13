'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user?.role === 'admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="absolute inset-0 premium-gradient-bg">
        <div className="gradient-blob-1 -top-40 -left-40" />
        <div className="gradient-blob-2 -bottom-40 -right-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-primary via-blue-500 to-purple-600 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-12 left-8"
            >
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                </div>
                <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/30">
                  Verified Customer
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-white/10 pt-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
              <div className="space-y-1">
                <div className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Full Name</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Email Address</span>
                  <span className="text-white font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-blue-400 font-medium">Customer</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white font-medium">New User</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex gap-4"
            >
              <button className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Edit Profile
              </button>
              <button className="py-3 px-6 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Change Password
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
