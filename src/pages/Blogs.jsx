import React, { useEffect, useState } from 'react';
import { featuredPosts, latestPosts, topBlogs } from '../data/mockData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';

function BlogCardSkeleton({ delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col rounded-3xl border border-outline-variant/25 bg-surface-container-low p-4"
    >
      <Skeleton className="mb-6 aspect-[4/3] w-full rounded-2xl" />
      <div className="px-2 pb-2 flex-1 flex flex-col">
        <Skeleton className="mb-3 h-3 w-20 rounded-full" />
        <Skeleton className="mb-2 h-7 w-full rounded-xl" />
        <Skeleton className="mb-2 h-7 w-[88%] rounded-xl" />
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </motion.article>
  );
}

export default function Blogs() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const allBlogs = [...featuredPosts, ...latestPosts, ...topBlogs];
  const cardColors = [
    'hover:border-violet-500/40 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]',
    'hover:border-amber-500/40 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
    'hover:border-teal-500/40 hover:bg-teal-500/5 dark:hover:bg-teal-500/10 hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]',
    'hover:border-rose-500/40 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]',
    'hover:border-blue-500/40 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
    'hover:border-emerald-500/40 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
      <div className="mb-16 max-w-2xl relative">
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6 text-glow">
          The Archive
        </h1>
        <p className="text-lg text-on-surface-variant font-body">
          Explore all our featured publications, insights, and stories in one place.
        </p>
        <div className="absolute -left-10 top-0 w-32 h-32 rounded-full bg-primary/20 blur-[60px] mix-blend-screen -z-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={`blog-skeleton-${i}`} delay={i * 0.05} />
            ))
          : allBlogs.map((post, i) => (
              <motion.article
                key={`${post.slug}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`flex flex-col group cursor-pointer bg-surface-container-low rounded-3xl p-4 hover:bg-surface-container-high transition-all duration-500 border border-transparent hover:-translate-y-2 ${cardColors[i % cardColors.length]}`}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-6 shadow-md w-full">
                  <Link to={`/post/${post.slug}`} className="absolute inset-0 z-20" />
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="px-2 pb-2 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-primary mb-3 font-bold">
                    <span>{post.category}</span>
                  </div>
                  <Link to={`/post/${post.slug}`} className="flex-1">
                    <h3 className="text-2xl font-headline font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between text-sm font-label text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/30">
                    <span>{post.date}</span>
                    <span className="font-medium bg-surface-bright px-3 py-1 rounded-full">{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
      </div>
    </div>
  );
}
