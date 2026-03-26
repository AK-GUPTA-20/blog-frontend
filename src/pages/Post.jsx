import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Share2, Bookmark, Heart, ArrowLeft, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';
import { getPostBySlug } from '../services/postApi';

function PostSkeleton() {
  return (
    <div className="pb-24">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-surface-container-low animate-pulse" />

      <div className="layout-container mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="hidden lg:block lg:col-span-2" />

        <div className="lg:col-span-8">
          {/* Meta Skeleton */}
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-outline-variant/30">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Post() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [isLoading, setIsLoading] = useState(!post);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    // If post is already in state, don't fetch again
    if (post) return;

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPostBySlug(slug);
        console.log('📄 Post data:', data);
        setPost(data);
      } catch (err) {
        console.error('✗ Error fetching post:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, post]);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error || !post) {
    return (
      <article className="pb-24">
        <div className="layout-container mt-12 text-center">
          <div className="bg-surface-container-low rounded-3xl p-12 max-w-md mx-auto">
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
              Post Not Found
            </h2>
            <p className="text-on-surface-variant mb-6">
              {error?.message || 'The blog post you are looking for does not exist.'}
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft size={16} /> Back to Blogs
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Extract data from API response
  const authorId = post.author?.id || post.author?._id || 'unknown';
  const authorName = post.author?.name || 'Anonymous Author';
  const authorAvatar = post.author?.avatar || `https://i.pravatar.cc/150?u=${authorId}`;
  const authorRole = post.author?.role || 'Author';

  const featuredImage = post.featuredImage || post.image || post.thumbnail || `https://images.unsplash.com/photo-1516534775068-bb6c2ff74b3f?q=80&w=2670&auto=format&fit=crop`;
  const title = post.title || 'Untitled Post';
  const category = post.category || 'Uncategorized';
  const description = post.description || post.excerpt || '';
  const content = post.content || post.body || '';
  const publishedDate = post.publishedAt || post.createdAt;
  const readingTime = post.stats?.readingTime || post.readTime || 1;
  const views = post.stats?.views || post.views || 0;
  const likes = post.stats?.likes || post.likes || 0;
  const tags = post.tags || [];

  return (
    <article className="pb-24">
      {/* Hero Image Full Width */}
      <div className="relative w-full h-[60vh] min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <img
          src={featuredImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1516534775068-bb6c2ff74b3f?q=80&w=2670&auto=format&fit=crop`;
          }}
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 layout-container">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-primary font-label uppercase text-sm tracking-widest hover:underline mb-8 w-fit mt-10"
          >
            <ArrowLeft size={16} /> Back to stories
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 mb-4 text-xs font-label uppercase tracking-widest text-primary w-fit">
            {category}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tighter max-w-4xl"
          >
            {title}
          </motion.h1>
        </div>
      </div>

      <div className="layout-container mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Actions */}
        <div className="hidden lg:block lg:col-span-2 relative">
          <div className="sticky top-32 flex flex-col items-center gap-6 glass-card py-6 rounded-full w-16 mx-auto">
            <button
              className="text-on-surface-variant hover:text-primary transition-colors"
              title={`${likes} likes`}
            >
              <Heart size={20} />
              {likes > 0 && <span className="text-xs mt-1">{likes}</span>}
            </button>
            <div className="w-8 h-px bg-outline-variant my-2" />
            <button className="text-on-surface-variant hover:text-primary transition-colors" title="Save post">
              <Bookmark size={20} />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors" title="Share post">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          {/* Author Section */}
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-outline-variant/30">
            <div className="flex items-center gap-4">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover"
                onError={(e) => {
                  e.target.src = `https://i.pravatar.cc/150?u=${authorId}`;
                }}
              />
              <div>
                <p className="font-display font-bold text-lg">{authorName}</p>
                <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mt-1">{authorRole}</p>
              </div>
            </div>
            <div className="text-right font-label text-sm uppercase tracking-widest text-on-surface-variant">
              <p>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              <p className="mt-1 flex items-center gap-1 justify-end">
                <Clock size={14} /> {readingTime} min read
              </p>
              <p className="mt-1 flex items-center gap-1 justify-end">
                <Eye size={14} /> {views} views
              </p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-2xl text-on-surface font-display leading-snug mb-8">
              {description}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none font-body text-on-surface-variant leading-loose">
            {content ? (
              content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                )
              ))
            ) : (
              <p>No content available for this post.</p>
            )}
          </div>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-outline-variant/30">
              <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-medium hover:bg-surface-bright transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-12 pt-8 border-t border-outline-variant/30 grid grid-cols-3 gap-4">
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-bold text-on-surface">{views}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Views</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-bold text-on-surface">{likes}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Likes</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-bold text-on-surface">{readingTime}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Min Read</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}