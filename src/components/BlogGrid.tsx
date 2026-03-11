'use client';

import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard';
import type { IPost } from '@/models/Post';

interface BlogGridProps {
  posts: IPost[];
  title?: string;
  viewAllLink?: string;
}

export default function BlogGrid({ posts, title, viewAllLink }: BlogGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-text-primary"
          >
            {title}
          </motion.h2>
          {viewAllLink && (
            <motion.a
              href={viewAllLink}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: 5 }}
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          )}
        </div>
      )}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post._id?.toString() || index} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No blog posts available</p>
        </div>
      )}
    </section>
  );
}
