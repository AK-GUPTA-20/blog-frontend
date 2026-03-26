import React, { useEffect } from 'react';
import { latestPosts, allCategories } from '../data/mockData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Categories() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="layout-container pb-24">
      <div className="pt-12 md:pt-24 mb-16 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6 relative">
          Explore <span className="text-primary italic font-light">Topics</span>
          <div className="absolute -left-10 top-0 w-32 h-32 rounded-full bg-primary/20 blur-[60px] mix-blend-screen -z-10" />
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          Dive deep into our curated collections covering everything from structural frontend architecture to the abstract art of creative coding.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-16">
        <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-label uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all">
          All Topics
        </button>
        {allCategories.map((cat) => (
          <button key={cat} className="px-6 py-3 rounded-full glass-card hover:bg-surface-container-high transition-colors font-label uppercase tracking-widest text-sm">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {latestPosts.map((post, i) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col group"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-6 shadow-xl w-full">
              <Link to={`/post/${post.slug}`} className="absolute inset-0 z-20" />
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-primary mb-3">
              <span>{post.category}</span>
            </div>
            <Link to={`/post/${post.slug}`}>
               <h3 className="text-2xl font-display font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                 {post.title}
               </h3>
            </Link>
            <div className="flex items-center gap-4 text-sm font-label uppercase tracking-widest text-muted-foreground mt-auto pt-4">
               <span>{post.date}</span>
               <span className="w-1 h-1 rounded-full bg-border" />
               <span>{post.readTime}</span>
            </div>
          </motion.article>
        ))}
        {latestPosts.map((post, i) => (
          <motion.article 
            key={`dup-${post.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (i + 4) * 0.1 }}
            className="flex flex-col group"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-6 shadow-xl w-full">
              <Link to={`/post/${post.slug}`} className="absolute inset-0 z-20" />
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
            </div>
            <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-primary mb-3">
              <span>{post.category}</span>
            </div>
            <Link to={`/post/${post.slug}`}>
               <h3 className="text-2xl font-display font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                 {post.title} (Archived)
               </h3>
            </Link>
            <div className="flex items-center gap-4 text-sm font-label uppercase tracking-widest text-muted-foreground mt-auto pt-4">
               <span>Oct 05, 2026</span>
               <span className="w-1 h-1 rounded-full bg-border" />
               <span>4 min read</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
