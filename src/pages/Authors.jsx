import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { getAllAuthors, getTopAuthors } from '../services/postApi';
import { 
  Users, 
  Flame, 
  AlertCircle, 
  RefreshCw, 
  Trophy, 
  Medal, 
  Award,
  Sparkles,
  BookOpen,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { toast } from '../components/Toast';

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

function AuthorCardSkeleton({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col items-center rounded-3xl border border-outline-variant/25 bg-surface-container-low p-8 text-center overflow-hidden"
    >
      <Skeleton className="w-24 h-24 rounded-full mb-6" />
      <Skeleton className="h-6 w-32 rounded-lg mb-3" />
      <Skeleton className="h-4 w-40 rounded-lg mb-6" />
      <div className="flex gap-6 mb-6 w-full justify-center">
        <div className="flex flex-col items-center">
          <Skeleton className="h-6 w-12 rounded-lg mb-2" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-6 w-12 rounded-lg mb-2" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-32 rounded-full" />
    </motion.div>
  );
}

// ============================================================================
// ANIMATED BACKGROUND
// ============================================================================

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 20, 0], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -20, 0], rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
      />
    </div>
  );
};

// ============================================================================
// FILTER & SEARCH COMPONENT
// ============================================================================

const AuthorFilters = ({ onSearchChange, onFilterChange, totalAuthors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    onFilterChange(type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 space-y-6"
    >
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
        <input
          type="text"
          placeholder="Search authors by name or interest..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-12 pr-6 py-4 rounded-full border-2 border-outline-variant/30 bg-surface-container-low/80 backdrop-blur focus:border-primary focus:outline-none transition-all text-on-surface placeholder-on-surface-variant/50"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide">Filter:</span>
        {['all', 'trending', 'new', 'verified'].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filterType === type
                ? 'bg-primary text-on-primary shadow-lg'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTop, setIsLoadingTop] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const navigate = useNavigate();
  const limit = 12;

  /**
   * Load all authors with pagination
   */
  const loadAuthors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllAuthors(currentPage, limit);
      let filteredAuthors = response?.data || [];

      // Client-side filtering for demo purposes
      if (searchTerm) {
        filteredAuthors = filteredAuthors.filter(author =>
          author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.bio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterType === 'trending') {
        filteredAuthors = filteredAuthors.filter(a => a.totalFollowers > 50);
      } else if (filterType === 'verified') {
        filteredAuthors = filteredAuthors.filter(a => a.role === 'admin');
      }

      setAuthors(filteredAuthors);
      setTotalAuthors(response?.total || 0);
      setTotalPages(response?.pages || 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err);
      console.error('Error loading authors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load top authors
   */
  const loadTopAuthors = async () => {
    setIsLoadingTop(true);

    try {
      const response = await getTopAuthors(5);
      setTopAuthors(response?.data || []);
    } catch (err) {
      console.error('Error loading top authors:', err);
    } finally {
      setIsLoadingTop(false);
    }
  };

  /**
   * Load on mount and when filters change
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    loadTopAuthors();
  }, []);

  useEffect(() => {
    loadAuthors();
  }, [currentPage, searchTerm, filterType]);

  const handleRetry = () => {
    loadAuthors();
    loadTopAuthors();
  };

  const handleViewProfile = (authorId) => {
    navigate(`/author-profile/${authorId}`);
  };

  const handleFollowAuthor = (e, authorId) => {
    e.stopPropagation();
    toast('Follow feature coming soon!', 'info');
  };

  const getFallbackAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-24 min-h-screen">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 relative"
        >
          <div className="absolute -left-10 top-0 w-48 h-48 rounded-full bg-primary/20 blur-[80px] mix-blend-screen -z-10" />
          <div className="absolute right-20 top-20 w-32 h-32 rounded-full bg-tertiary/20 blur-[60px] mix-blend-screen -z-10" />

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Meet Our Community</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6 bg-gradient-to-br from-on-surface to-on-surface-variant bg-clip-text text-transparent">
              Our Authors
            </h1>
            <p className="text-lg text-on-surface-variant font-body mb-8 max-w-2xl leading-relaxed">
              Discover brilliant minds and creative storytellers behind our most engaging content. Join thousands of readers exploring diverse perspectives.
            </p>
          </div>

          {/* Header Stats */}
          <div className="flex flex-wrap gap-4 items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-full px-6 py-3 border border-primary/20 bg-primary/5 backdrop-blur-sm flex items-center gap-3 shadow-sm"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium text-on-surface">
                <span className="text-primary font-bold text-lg">{totalAuthors}</span> Authors
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-full px-6 py-3 border border-surface-variant/40 bg-surface-container/50 backdrop-blur-sm flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-tertiary animate-pulse" />
              <span className="text-sm font-medium text-on-surface-variant">Community Driven</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-full px-6 py-3 border border-surface-variant/40 bg-surface-container/50 backdrop-blur-sm flex items-center gap-2 shadow-sm"
            >
              <TrendingUp className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium text-on-surface-variant">Trending Topics</span>
            </motion.div>
          </div>
        </motion.div>

        {/* FILTER & SEARCH */}
        <AuthorFilters 
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
          totalAuthors={totalAuthors}
        />

        {/* TOP AUTHORS SECTION */}
        {isLoadingTop ? (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <Flame className="text-orange-500 w-6 h-6" />
              </div>
              <h2 className="text-3xl font-headline font-bold">Top Authors</h2>
              <Badge className="ml-auto">Rising Stars</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <AuthorCardSkeleton key={i} delay={i * 0.1} />
              ))}
            </div>
          </div>
        ) : topAuthors.length > 0 ? (
          <div className="mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] -z-10 -m-8 mix-blend-multiply opacity-50" />
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-xl shadow-sm border border-orange-500/20">
                  <Flame className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-headline font-bold">Top Writers</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Most engaging authors this month</p>
                </div>
              </div>
              <Badge className="hidden md:flex py-2 px-4 text-xs font-medium bg-orange-500/10 text-orange-600 border border-orange-500/20">
                <Flame className="w-3.5 h-3.5 mr-1.5" /> Trending
              </Badge>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {topAuthors.map((author, i) => {
                const isTop3 = i < 3;
                const rColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
                const rBgs = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-400/10 border-gray-400/30', 'bg-amber-600/10 border-amber-600/30'];
                const RankIcon = i === 0 ? Trophy : (i === 1 || i === 2 ? Medal : Award);
                
                return (
                  <motion.div
                    key={author._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                    className="relative flex flex-col items-center rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 hover:bg-surface-container-low hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-colors duration-500 pointer-events-none" />

                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`flex items-center justify-center w-9 h-9 rounded-full ${isTop3 ? rBgs[i] : 'bg-surface-container border border-outline-variant'} shadow-sm`}>
                        <RankIcon className={`w-4.5 h-4.5 ${isTop3 ? rColors[i] : 'text-on-surface-variant'}`} />
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative mb-5 mt-2">
                      <img
                        src={author.avatar || getFallbackAvatar(author.name)}
                        onError={(e) => { e.target.src = getFallbackAvatar(author.name); }}
                        alt={author.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md group-hover:border-primary/20 transition-all duration-300 ring-1 ring-outline-variant/30"
                      />
                      {i === 0 && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute -bottom-2 -right-2 bg-yellow-500 p-1.5 rounded-full border-2 border-surface"
                        >
                          <Trophy className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 px-2 text-center line-clamp-1">
                      {author.name}
                    </h3>
                    {author.role === 'admin' && (
                      <Badge className="mb-3 text-xs py-1 px-2 bg-primary/10 text-primary border-primary/20">
                        ✓ Verified
                      </Badge>
                    )}

                    {/* Bio */}
                    {author.bio ? (
                      <p className="text-xs text-on-surface-variant text-center mb-6 line-clamp-2 px-1 min-h-[2rem]">
                        {author.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-on-surface-variant/50 text-center mb-6 italic min-h-[2rem]">
                        Curious writer
                      </p>
                    )}

                    {/* Main Stats */}
                    <div className="flex items-center justify-center gap-6 mb-6 w-full">
                      <div className="text-center flex-1">
                        <p className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{author.totalPosts}</p>
                        <p className="text-[10px] font-medium tracking-wider uppercase text-on-surface-variant mt-1">Posts</p>
                      </div>
                      <div className="w-px h-8 bg-outline-variant/30" />
                      <div className="text-center flex-1">
                        <p className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{author.totalFollowers}</p>
                        <p className="text-[10px] font-medium tracking-wider uppercase text-on-surface-variant mt-1">Followers</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto w-full flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewProfile(author._id)}
                        className="flex-1 py-2.5 rounded-xl bg-surface-container text-primary font-semibold text-sm hover:bg-primary hover:text-on-primary transition-colors"
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleFollowAuthor(e, author._id)}
                        className="flex-1 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                      >
                        Follow
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Divider */}
        {topAuthors.length > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="my-16 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"
          />
        )}

        {/* ALL AUTHORS SECTION */}
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
                <Users className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold">Community Authors</h2>
                <p className="text-xs text-on-surface-variant mt-1">Discover amazing writers</p>
              </div>
            </div>
            
            <Badge className="hidden md:flex py-1.5 px-4 text-sm font-medium bg-primary/10 text-primary border-primary/20">
               <BookOpen className="w-3.5 h-3.5 mr-1.5" /> {totalAuthors} creators
            </Badge>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <AuthorCardSkeleton key={i} delay={i * 0.05} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center my-20"
            >
              <div className="bg-surface-container-low rounded-[2rem] p-12 border border-error/20 shadow-sm">
                <motion.div
                  className="flex justify-center mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-error/10 p-5 rounded-full">
                    <AlertCircle className="w-10 h-10 text-error" />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-headline font-bold mb-3 text-on-surface">
                  Unable to Load Authors
                </h2>
                <p className="text-on-surface-variant mb-8 font-body">
                  {error?.message || 'We encountered an error while fetching our community authors.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full font-semibold hover:opacity-90 shadow-md transition-all"
                >
                  <RefreshCw className="w-4.5 h-4.5" />
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          ) : authors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-surface-container-lowest rounded-[3rem] border border-outline-variant/30 border-dashed"
            >
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search className="w-10 h-10 text-on-surface-variant/50" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">No authors found</h3>
              <p className="text-on-surface-variant font-medium">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {authors.map((author, i) => {
                  return (
                    <motion.div
                      key={author._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.4 }}
                      className="group relative flex flex-col items-center rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-8 hover:bg-surface-container-low hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      {/* Avatar Container */}
                      <div className="relative mb-5 transition-transform duration-300 group-hover:scale-105">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img
                          src={author.avatar || getFallbackAvatar(author.name)}
                          onError={(e) => { e.target.src = getFallbackAvatar(author.name); }}
                          alt={author.name}
                          className="relative w-28 h-28 rounded-full object-cover border-[3px] border-surface shadow-sm ring-1 ring-outline-variant/20 group-hover:ring-primary/40 transition-all z-10"
                        />
                        {author.role === 'admin' && (
                          <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                            <Award className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-headline font-bold text-on-surface mb-1 text-center line-clamp-1">
                        {author.name}
                      </h3>

                      {author.role === 'admin' && (
                        <Badge className="mb-3 text-xs py-0.5 px-2.5 bg-primary/10 text-primary border-primary/20">
                          Verified Author
                        </Badge>
                      )}
                      
                      {author.bio ? (
                        <p className="text-sm text-on-surface-variant text-center mb-6 line-clamp-2 px-2 min-h-[2.5rem]">
                          {author.bio}
                        </p>
                      ) : (
                        <p className="text-sm text-on-surface-variant/50 text-center mb-6 italic min-h-[2.5rem]">
                          Exploring ideas...
                        </p>
                      )}

                      {/* Main Stats */}
                      <div className="flex items-center gap-4 mb-8 w-full justify-center">
                        <div className="text-center px-4 py-2 bg-surface-container rounded-2xl flex-1">
                          <p className="text-xl font-bold text-on-surface">{author.totalPosts}</p>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-on-surface-variant mt-0.5">Posts</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-surface-container rounded-2xl flex-1">
                          <p className="text-xl font-bold text-on-surface">
                            {author.totalFollowers}
                          </p>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-on-surface-variant mt-0.5">Follows</p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewProfile(author._id)}
                        className="mt-auto w-full py-3 rounded-xl border-2 border-primary/20 bg-transparent text-primary font-bold text-sm hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300"
                      >
                        View Profile
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination - Enhanced */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center gap-6 pt-12"
                >
                  <div className="text-center text-sm text-on-surface-variant">
                    Page <span className="font-bold text-on-surface">{currentPage}</span> of <span className="font-bold text-on-surface">{totalPages}</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 sm:px-6 py-3 rounded-full border border-outline-variant/30 bg-surface-container-low font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container hover:shadow-sm transition-all text-sm sm:text-base"
                    >
                      ← <span className="hidden sm:inline">Previous</span>
                    </motion.button>

                    <div className="flex items-center gap-1.5 sm:gap-2 bg-surface-container-low p-2 rounded-full border border-outline-variant/30 shadow-sm flex-wrap justify-center">
                      {/* First Page */}
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(1)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                          currentPage === 1
                            ? 'bg-primary text-on-primary shadow-md'
                            : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                      >
                        1
                      </motion.button>

                      {/* Show ellipsis if needed */}
                      {currentPage > 3 && (
                        <span className="text-on-surface-variant">...</span>
                      )}

                      {/* Middle pages */}
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                        let pageNum = currentPage;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else {
                          if (currentPage <= 3) pageNum = i + 1;
                          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                          else pageNum = currentPage - 2 + i;
                        }

                        if (pageNum === 1 || pageNum === totalPages) return null;

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                              currentPage === pageNum
                                ? 'bg-primary text-on-primary shadow-md'
                                : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}

                      {/* Show ellipsis if needed */}
                      {currentPage < totalPages - 2 && (
                        <span className="text-on-surface-variant">...</span>
                      )}

                      {/* Last Page */}
                      {totalPages > 1 && (
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPage(totalPages)}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                            currentPage === totalPages
                              ? 'bg-primary text-on-primary shadow-md'
                              : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                          }`}
                        >
                          {totalPages}
                        </motion.button>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 sm:px-6 py-3 rounded-full border border-outline-variant/30 bg-surface-container-low font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container hover:shadow-sm transition-all text-sm sm:text-base"
                    >
                      <span className="hidden sm:inline">Next</span> →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}