import React, { useEffect } from 'react';
import { topBlogs } from '../data/mockData';
import { motion } from 'framer-motion';

export default function Authors() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
      <div className="mb-24 text-center max-w-3xl mx-auto relative">
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6">
          Meet the <span className="text-primary italic font-light">Minds</span>
        </h1>
        <p className="text-xl text-on-surface-variant font-body">
          The innovative thinkers, designers, and engineers behind Velora Journal's editorial direction.
        </p>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[100px] -z-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {topBlogs.map((blog, i) => (
          <motion.div 
            key={`author-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center gap-6 group cursor-pointer bg-surface-container-low p-8 rounded-[2rem] hover:bg-surface-container-high transition-colors text-center"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-[8px] border-surface-container shadow-2xl group-hover:border-primary transition-all duration-300">
              <img 
                src={blog.author.avatar} 
                alt={blog.author.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
              />
            </div>
            <div>
              <h4 className="font-headline font-extrabold text-2xl mb-2">{blog.author.name}</h4>
              <p className="text-sm text-primary font-bold tracking-widest uppercase mb-4">{blog.author.role || 'Contributor'}</p>
              <p className="text-sm text-on-surface-variant px-2">{blog.excerpt}</p>
            </div>
            <button className="mt-auto pt-6 text-sm font-bold border-b-2 border-transparent group-hover:border-primary transition-all">
              View Articles
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
