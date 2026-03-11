'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

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
            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className="text-text-secondary hover:text-primary font-medium text-sm px-3 py-2 transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-red-400 font-medium text-sm px-3 py-2 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-text-secondary hover:text-primary font-medium text-sm px-3 py-2 transition-colors"
              >
                Login
              </Link>
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
              {isAuthenticated ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
