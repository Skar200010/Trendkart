'use client';

import Link from 'next/link';
import type { IPost } from '@/models/Post';
import { motion } from 'framer-motion';

interface BlogCardProps {
  post: IPost;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-text-secondary/10"
        >
          <div className="p-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            <motion.h3 
              whileHover={{ color: '#6366F1' }}
              className="font-bold text-lg mt-4 text-text-primary transition-colors duration-300 line-clamp-2"
            >
              {post.title}
            </motion.h3>
            <p className="text-text-secondary mt-3 line-clamp-3 text-sm leading-relaxed">
              {post.content}
            </p>
            <div className="flex items-center mt-5 text-text-secondary text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
