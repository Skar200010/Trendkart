'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/men', label: 'Men' },
  { href: '/women', label: 'Women' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className="relative group py-2 px-1"
    >
      <span className={`text-sm font-medium transition-colors duration-300 ${
        isActive 
          ? 'text-primary' 
          : 'text-text-secondary hover:text-text-primary'
      }`}>
        {children}
      </span>
      <span className={`absolute left-0 bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isAuthenticated = !!user;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/trencarticon.png"
                  alt="TrendKart"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-text-primary ml-2">
                Trend<span className="text-primary">Kart</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                isActive={pathname === link.href}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="w-px h-6 bg-text-secondary/20 mx-4" />
            {loading ? (
              <span className="text-text-secondary text-sm px-3 py-2">Loading...</span>
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  <motion.div
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden"
                    >
                      <div className="relative px-5 py-5 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 border-b border-gray-100/50">
                        <div className="flex items-center gap-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg"
                          >
                            <span className="text-white text-xl font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 }}
                          className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Member'}
                        </motion.span>
                      </div>
                      <div className="py-2">
                        {user.role === 'admin' ? (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 mx-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </span>
                            Dashboard
                            <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ) : (
                          <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 mx-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </span>
                            My Profile
                            <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 mx-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </span>
                          My Orders
                          <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 mx-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </span>
                          Wishlist
                          <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <div className="my-2 mx-4 border-t border-gray-100" />
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 mx-2 px-4 py-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </span>
                          Sign Out
                        </button>
                      </div>
                      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                          TrendKart Account
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-primary font-medium text-sm px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-text-secondary hover:text-primary font-medium text-sm px-3 py-2 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-2" />
              {loading ? (
                <span className="block px-4 py-3 text-text-secondary">Loading...</span>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'admin' ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
                    >
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
