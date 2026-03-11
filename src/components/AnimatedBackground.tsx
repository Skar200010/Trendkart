'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'intense';
}

export default function AnimatedBackground({ 
  children, 
  className = '',
  variant = 'default' 
}: AnimatedBackgroundProps) {
  const variants = {
    default: {
      blob1: 'gradient-blob-1',
      blob2: 'gradient-blob-2',
      blob3: 'gradient-blob-3',
    },
    subtle: {
      blob1: 'gradient-blob-1 opacity-50',
      blob2: 'gradient-blob-2 opacity-40',
      blob3: 'gradient-blob-3 opacity-30',
    },
    intense: {
      blob1: 'gradient-blob-1 scale-125',
      blob2: 'gradient-blob-2 scale-125',
      blob3: 'gradient-blob-3 scale-125',
    },
  };

  const { blob1, blob2, blob3 } = variants[variant];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 premium-gradient-bg">
        <motion.div 
          className={`${blob1} -top-40 -left-40`}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className={`${blob2} -bottom-40 -right-40`}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className={`${blob3} top-1/3 right-1/4`}
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      {children}
    </div>
  );
}

interface HeroGradientProps {
  className?: string;
}

export function HeroGradient({ className = '' }: HeroGradientProps) {
  return (
    <div className={`absolute inset-0 premium-gradient-bg ${className}`}>
      <motion.div 
        className="gradient-blob-1 -top-40 -left-40"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div 
        className="gradient-blob-2 -bottom-40 -right-40"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div 
        className="gradient-blob-3 top-1/3 right-1/4"
        animate={{
          x: [0, 30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
          radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 40%)
        `
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
    </div>
  );
}

interface SectionBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionBackground({ children, className = '' }: SectionBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-card">
        <motion.div 
          className="gradient-blob-1 opacity-30 -top-20 -left-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="gradient-blob-2 opacity-25 -bottom-20 -right-20"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
