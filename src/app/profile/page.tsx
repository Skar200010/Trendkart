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
    <div className="min-h-screen bg-background py-8 sm:py-12 px-3 sm:px-4 overflow-x-hidden">
      <div className="absolute inset-0 premium-gradient-bg overflow-hidden">
        <div className="gradient-blob-1 -top-20 sm:-top-40 -left-20 sm:-left-40 w-64 h-64 sm:w-[600px] sm:h-[600px]" />
        <div className="gradient-blob-2 -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 w-48 h-48 sm:w-[500px] sm:h-[500px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>

      <div className="relative max-w-2xl mx-auto w-full px-0 sm:px-2">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full"
        >
          <div className="h-24 sm:h-32 bg-gradient-to-r from-primary via-blue-500 to-purple-600 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">{user.email}</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 sm:px-4 sm:py-1.5 bg-green-500/20 text-green-400 text-xs sm:text-sm font-medium rounded-full border border-green-500/30">
                  Verified Customer
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-white/10 pt-4 sm:pt-6"
            >
              <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Account Information</h2>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 sm:px-4 bg-white/5 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="text-white font-medium text-sm sm:text-base">{user.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 sm:px-4 bg-white/5 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-400 text-sm">Email Address</span>
                  <span className="text-white font-medium text-sm sm:text-base">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 sm:px-4 bg-white/5 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-400 text-sm">Account Type</span>
                  <span className="text-blue-400 font-medium text-sm sm:text-base">Customer</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 sm:px-4 bg-white/5 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <span className="text-white font-medium text-sm sm:text-base">New User</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <button className="w-full sm:flex-1 py-3 px-4 sm:px-6 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm sm:text-base">
                Edit Profile
              </button>
              <button className="w-full py-3 px-4 sm:px-6 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
                Change Password
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
