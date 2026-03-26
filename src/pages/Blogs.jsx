import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';
import { getAllPosts } from '../services/postApi';
import { AlertCircle, RefreshCw, BookOpen, Eye, Flame, TrendingUp } from 'lucide-react';

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

/**
 * Blog Card Skeleton Component with Pulse Animation
 */
function BlogCardSkeleton({ delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col rounded-3xl border border-outline-variant/25 bg-surface-container-low p-4 overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="mb-6 aspect-[4/3] w-full rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="px-2 pb-2 flex-1 flex flex-col space-y-3">
        <Skeleton className="h-3 w-20 rounded-full animate-pulse" />

        <div className="space-y-2">
          <Skeleton className="h-6 w-full rounded-lg animate-pulse" />
          <Skeleton className="h-6 w-4/5 rounded-lg animate-pulse" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <Skeleton className="h-4 w-24 rounded-full animate-pulse" />
          <Skeleton className="h-7 w-20 rounded-full animate-pulse" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full animate-pulse" />
            <Skeleton className="h-3 w-24 rounded-full animate-pulse" />
          </div>
          <Skeleton className="h-3 w-12 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================================
// STATE COMPONENTS
// ============================================================================

/**
 * Error State Component
 */
function ErrorState({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-6 py-16 text-center"
    >
      <div className="bg-surface-container-low rounded-3xl p-12 border border-error/20">
        <div className="flex justify-center mb-6">
          <div className="bg-error/10 p-4 rounded-full">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
        </div>

        <h2 className="text-2xl font-headline font-bold mb-3 text-on-surface">
          Unable to Load Blogs
        </h2>

        <p className="text-on-surface-variant mb-2 text-sm md:text-base">
          {error?.message || 'Something went wrong while fetching blogs. Please check your internet connection.'}
        </p>

        <p className="text-xs text-on-surface-variant/70 mb-8">
          Error Code: {error?.status || 'UNKNOWN'}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="bg-surface-container-low rounded-2xl p-12 max-w-md w-full">
        <BookOpen className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-6" />
        <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
          No Blogs Found
        </h2>
        <p className="text-on-surface-variant">
          Check back soon for new content!
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Blog Loading Indicator
 */
function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 text-on-surface-variant">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="text-sm ml-2">Loading blogs...</span>
    </div>
  );
}

// ============================================================================
// HEADER SECTION COMPONENT
// ============================================================================

/**
 * Header Section with Hero and Stats
 */
function HeaderSection({ blogCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16 max-w-2xl relative"
    >
      {/* Background Glow */}
      <div className="absolute -left-10 top-0 w-32 h-32 rounded-full bg-primary/20 blur-[60px] mix-blend-screen -z-10" />

      {/* Main Title */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6 text-glow">
          The Archive
        </h1>
        <p className="text-lg text-on-surface-variant font-body">
          Explore all our featured publications, insights, and stories in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-3 items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-full px-6 py-3 border border-primary/30 backdrop-blur-sm flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-medium text-on-surface">
            <span className="text-primary font-bold">{blogCount}</span> Articles
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-full px-6 py-3 border border-surface-variant/30 backdrop-blur-sm flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-on-surface-variant">Quality Content</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-full px-6 py-3 border border-surface-variant/30 backdrop-blur-sm flex items-center gap-2"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-on-surface-variant">Fresh Updates</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const cardColors = [
    'hover:border-violet-500/40 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]',
    'hover:border-amber-500/40 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
    'hover:border-teal-500/40 hover:bg-teal-500/5 dark:hover:bg-teal-500/10 hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]',
    'hover:border-rose-500/40 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]',
    'hover:border-blue-500/40 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
    'hover:border-emerald-500/40 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
  ];

  /**
   * Load blogs from API
   */
  const loadBlogsFromAPI = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllPosts(1, 100);
      let data = response;
      
      if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response?.posts && Array.isArray(response.posts)) {
        data = response.posts;
      } else if (response?.items && Array.isArray(response.items)) {
        data = response.items;
      } else if (!Array.isArray(response)) {
        data = response.data || response.posts || response.items || [];
      }

      // Validate data
      if (!Array.isArray(data) || data.length === 0) {
        setBlogs([]);
        return;
      }

      setBlogs(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle retry action
   */
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    loadBlogsFromAPI();
  }, [loadBlogsFromAPI]);

  /**
   * Load blogs on component mount
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogsFromAPI();
  }, [loadBlogsFromAPI]);

  /**
   * Render loading skeleton state
   */
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
        {/* Header Skeleton */}
        <div className="mb-16 max-w-2xl relative">
          <div className="h-16 bg-surface-container-low rounded-lg mb-6 animate-pulse" />
          <div className="h-6 bg-surface-container-low rounded-lg w-3/4 animate-pulse mb-4" />
          <div className="h-4 bg-surface-container-low rounded-lg w-2/3 animate-pulse" />
          <div className="absolute -left-10 top-0 w-32 h-32 rounded-full bg-primary/20 blur-[60px] mix-blend-screen -z-10" />
        </div>

        {/* Loading Indicator */}
        <div className="mb-8 flex justify-start">
          <LoadingIndicator />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <BlogCardSkeleton key={`skeleton-${i}`} delay={i * 0.08} />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error && blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
        <HeaderSection blogCount={0} />
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (!blogs || blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
        <HeaderSection blogCount={0} />
        <EmptyState />
      </div>
    );
  }

  /**
   * Render blog cards
   */
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-24 pt-12 md:pt-24 min-h-screen bg-background text-on-surface">
      {/* Header Section */}
      <HeaderSection blogCount={blogs.length} />

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((post, i) => {
          const postId = post.id || post._id;
          const postSlug = post.slug;
          const postImage = post.featuredImage || post.image || post.thumbnail || `https://images.unsplash.com/photo-1516534775068-bb6c2ff74b3f?q=80&w=2670&auto=format&fit=crop`;
          const postTitle = post.title || 'Untitled';
          const postCategory = post.category || 'Uncategorized';
          const readTime = post.stats?.readingTime || post.readTime || '1 min read';
          const views = post.stats?.views || post.views || 0;
          const publishedDate = post.publishedAt || post.createdAt;

          // Author Info
          const authorId = post.author?.id || post.author?._id || postId;
          const authorName = post.author?.name || 'Anonymous';
          const authorAvatar = post.author?.avatar || `https://i.pravatar.cc/150?u=${authorId}`;

          // Format date
          let formattedDate = '';
          if (publishedDate) {
            try {
              const date = new Date(publishedDate);
              formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            } catch (e) {
              formattedDate = publishedDate;
            }
          }

          return (
            <motion.article
              key={`${postSlug}-${postId}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`flex flex-col group cursor-pointer bg-surface-container-low rounded-3xl p-4 hover:bg-surface-container-high transition-all duration-500 border border-transparent hover:-translate-y-2 overflow-hidden ${
                cardColors[i % cardColors.length]
              }`}
            >
              {/* Image Section */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-6 shadow-md w-full bg-surface-container-high">
                <Link
                  to={`/post/${postSlug}`}
                  className="absolute inset-0 z-20"
                  title={`Read: ${postTitle}`}
                  aria-label={`Read ${postTitle}`}
                  state={{ post }}
                />
                <img
                  src={postImage}
                  alt={postTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1516534775068-bb6c2ff74b3f?q=80&w=2670&auto=format&fit=crop`;
                  }}
                />

                {/* Category Tag on Image */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-label uppercase tracking-widest text-white font-bold">
                    {postCategory}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-2 pb-2 flex-1 flex flex-col">
                {/* Title */}
                <Link to={`/post/${postSlug}`} className="flex-1" state={{ post }}>
                  <h3 className="text-2xl font-headline font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {postTitle}
                  </h3>
                </Link>

                {/* Footer: Date and Read Time */}
                <div className="flex items-center justify-between text-sm font-label text-on-surface-variant mt-auto pt-4 border-t border-outline-variant/30">
                  <span className="text-xs">{formattedDate}</span>
                  <span className="font-medium bg-surface-bright px-3 py-1 rounded-full text-xs">
                    {readTime} min read
                  </span>
                </div>

                {/* Author Info with Views - Below Translucent Line */}
                <div className="flex items-center justify-between text-xs font-label text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/20">
                  {/* Author Profile */}
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-7 h-7 rounded-full object-cover border border-outline-variant/30 flex-shrink-0"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://i.pravatar.cc/150?u=${authorId}`;
                      }}
                    />
                    <span className="truncate font-medium text-on-surface-variant">{authorName}</span>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Eye size={14} className="text-primary" />
                    <span className="font-semibold text-on-surface-variant">{views}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-24 text-center text-on-surface-variant text-sm">
        <p>
          Showing <span className="font-semibold text-on-surface">{blogs.length}</span> articles
        </p>
      </div>
    </div>
  );
}