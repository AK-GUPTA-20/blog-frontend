import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, Eye, ChevronRight } from 'lucide-react';
import { getMySavedPosts } from '../services/postApi';
import { toast } from './Toast';

// Placeholder image
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234f46e5;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%237c3aed;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dy=".3em" opacity="0.7"%3ESaved Post%3C/text%3E%3C/svg%3E';

export default function SavedPostsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSaved, setTotalSaved] = useState(0);
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('velora_token') : null;

  /**
   * Load saved posts when modal opens
   */
  const loadSavedPosts = async () => {
    if (!token) {
      toast('Please login to view saved posts', 'info');
      return;
    }

    setIsLoading(true);
    try {
      const response = await getMySavedPosts(token, 1, 5); // Get first 5
      setSavedPosts(response?.data || []);
      setTotalSaved(response?.total || 0);
    } catch (err) {
      toast('Failed to load saved posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle modal open
   */
  const handleOpen = () => {
    if (!token) {
      toast('Please login to view saved posts', 'info');
      navigate('/login');
      return;
    }
    setIsOpen(true);
    loadSavedPosts();
  };

  /**
   * View all saved posts
   */
  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/saved-posts');
  };

  return (
    <>
      {/*   BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 font-semibold text-sm"
        title="View saved posts"
      >
        <Bookmark size={18} fill="currentColor" />
        <span className="hidden sm:inline">Saved</span>
        
        {/* Badge count */}
        {totalSaved > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold"
          >
            {totalSaved > 99 ? '99+' : totalSaved}
          </motion.span>
        )}
      </motion.button>

      {/*   MODAL/DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-20 right-4 sm:right-8 z-50 w-full max-w-md max-h-[600px] bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 bg-surface-container-high border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Bookmark className="text-primary" size={20} fill="currentColor" />
                  <h2 className="text-lg font-headline font-bold text-on-surface">
                    Saved Posts
                  </h2>
                  {totalSaved > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                      {totalSaved}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-bright rounded-lg transition-colors"
                >
                  <X size={20} className="text-on-surface-variant" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(600px-120px)]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-sm text-on-surface-variant">Loading...</p>
                    </div>
                  </div>
                ) : savedPosts.length === 0 ? (
                  <div className="flex items-center justify-center py-12 px-6 text-center">
                    <div>
                      <Bookmark className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3 opacity-50" />
                      <p className="text-on-surface-variant text-sm mb-3">
                        No saved posts yet
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/blogs');
                        }}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        Browse & Save Posts →
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {savedPosts.map((post, idx) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          to={`/post/${post.slug}`}
                          state={{ post }}
                          onClick={() => setIsOpen(false)}
                          className="group block"
                        >
                          <div className="flex gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-bright transition-all duration-300 border border-outline-variant/20 hover:border-primary/30">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high">
                              <img
                                src={post.featuredImage || PLACEHOLDER_IMAGE}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = PLACEHOLDER_IMAGE;
                                }}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-headline font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-variant">
                                <span className="truncate">
                                  {post.author?.name || 'Anonymous'}
                                </span>
                                <span>•</span>
                                <div className="flex items-center gap-0.5">
                                  <Eye size={12} />
                                  {post.stats?.views || 0}
                                </div>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 flex items-center justify-center">
                              <ChevronRight
                                size={18}
                                className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all"
                              />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {savedPosts.length > 0 && (
                <motion.div
                  className="p-4 bg-surface-container-high border-t border-outline-variant/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewAll}
                    className="w-full px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    View All Saved Posts ({totalSaved})
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}