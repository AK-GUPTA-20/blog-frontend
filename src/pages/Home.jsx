import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Quote } from 'lucide-react';
import { latestPosts, topBlogs } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
  };

  React.useEffect(() => {
    const handleFocusSearch = () => {
      const searchInput = document.getElementById('home-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('focusSearch', handleFocusSearch);
    return () => window.removeEventListener('focusSearch', handleFocusSearch);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <main className="bg-mesh pt-32 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
                Editorial Excellence
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] text-on-surface mb-8 text-glow">
                Thoughts in Motion,<br />Stories in Style
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
                Dive into a curated archive of contemporary culture, minimalist design, and the minds shaping our digital future.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/categories" className="group flex items-center gap-3 bg-surface-bright p-1 pr-6 rounded-full hover:bg-surface-container-highest transition-all duration-300">
                  <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                    <ArrowRight size={20} />
                  </span>
                  <span className="font-bold">Explore Archive</span>
                </Link>
                <div className="flex -space-x-3">
                  <img loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Reader avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOFWVSOUPok4ev4YADG2iiqxUWWKAa4aKtajmsZKw4YE_SWOUR3nxsnVoaqrHk9bt5ytB5tNwUwFR_ZIbdAUC1iIKnfgecwpNU5oXoQVZ_CxoPamB8CNq-s255oYWdIjf0YsCO0ES1HB0XOvKzQYr7vFwtQXy1vubh7-47cr3eBUDWa0NnwPVGm99KnQrqFV0yZoB9aEY0igUxCE3d0M5moH3gHdjPOOmBOXqMCiZxMDVs2wKBtAuLWI8X9eqKvBMaBLrucoxHrwGA" />
                  <img loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Reader avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdbzLEZDWbnrIAkyNsCid_sgeaEDQaByAkyOJxKptk4Hm6cMJvbdskeIaCUqiW0iD4szvdtN7-jdsw4CZIboS1XIKu0UxEys5IdC9HMpMUtCfCp0A3_SFtPHAgcQ7xjT8DQC8XTukINl_PfDC2NWjE_rUCvq9fIcIbJnbntpeylOriXRnphb1hQdWv4y70Z0MM2JR9kqqAwbVWYdrMdOgfEvgKRDjyIFpeM5T2vxaBzo6AUdXEwWI1cyHMNRev-GwCmg_Xtz_zHXpw" />
                  <img loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Reader avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8tTqYQ9q9yR3050JjmZgTWN0A6Dqs4ko0AsnwUXhazqORo-aW3iL1a2GCGFgXu56Ayvgwl8N8iNkG9D_BBMXZFDM6VAHulftgXSQgQOfur9sDlCVkltgQwWLSQQBWGfT3p13sRiQf0sJqCx--dhdQQk-MzhL-oPwVomL601NKhrUL5Tj2IypjPSKNVDiRSTjBRZp6bNowC8Cfbyu04rCzWP-852Fsy_04ocbF5D6Z4BMyb76LMJc_Gi9MDgHGnBf6AQ_y38kKWQ2O" />
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+2k</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <Link to="/post/architecting-for-scale" className="block relative rounded-xl overflow-hidden shadow-2xl group cursor-pointer aspect-[4/3]">
                <img loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="The Brutalist Revival: Concrete as a Canvas for Light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-I1bHS9oylCTEdTmTI9gJ1WrGLMMLU3gDiHejyaaRx4CjES9ikWqnW2FJ7WdCyxhVcmxoZT9E47eTcxzXoxSkjJ2SDR2P3VMJ66MVJBjlwZiPUMUq8_bdKbJsMOhHr5EIPeIlodRGt5GRKIjrhAiAU_UKC63FU0rdAyEbJUBmT-MejQmkPzvGP5LLQeRMFz82kjgNZzeB0R9zppa7GoIkXNKMQTvi8CZPHTgkK4774ptTNm700C0m9_uEol1MQ9ObOemEKh8KC_uH" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 p-6 md:p-10 w-full">
                  <div className="glass-card p-6 md:p-8 rounded-lg border border-white/5 hover:translate-y-[-8px] transition-transform duration-500 shadow-2xl">
                    <span className="text-primary text-xs font-bold tracking-widest uppercase mb-4 block">Architecture</span>
                    <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 leading-tight">The Brutalist Revival: Concrete as a Canvas for Light</h2>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">8 min read • 12 Oct 2024</span>
                      <ArrowRight size={20} className="text-primary transform -rotate-45" />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input
                id="home-search-input"
                aria-label="Search the archive"
                className="w-full bg-surface-container-highest border-none rounded-md py-4 pl-12 pr-6 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant transition-all outline-none"
                placeholder="Search the archive..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-0 rounded-md ring-2 ring-primary opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity pointer-events-none"></div>
            </form>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/categories" className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm">All</Link>
              <Link to="/categories" className="px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all text-sm font-semibold">Culture</Link>
              <Link to="/categories" className="px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all text-sm font-semibold">Minimalism</Link>
              <Link to="/categories" className="px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all text-sm font-semibold">Technology</Link>
            </div>
          </div>
        </section>

        {/* Latest Insights Bento Grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Latest Insights</h2>
              <p className="text-on-surface-variant">Deep dives into the trends that define tomorrow.</p>
            </div>
            <Link to="/categories" className="text-primary font-bold flex items-center gap-2 group whitespace-nowrap">
              View all stories
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Card */}
            {latestPosts[0] && (
              <Link to={`/post/${latestPosts[0].slug}`} className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low h-[400px] md:h-[500px]">
                <img loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" alt={latestPosts[0].title} src={latestPosts[0].image} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold w-fit mb-6 uppercase">{latestPosts[0].category}</span>
                  <h3 className="font-headline text-3xl md:text-4xl font-bold mb-6 max-w-xl group-hover:text-primary transition-colors line-clamp-3">{latestPosts[0].title}</h3>
                  <div className="flex items-center gap-4">
                    <img loading="lazy" decoding="async" className="w-10 h-10 rounded-full" alt={latestPosts[0].author.name} src={latestPosts[0].author.avatar} />
                    <div>
                      <p className="font-bold text-sm">{latestPosts[0].author.name}</p>
                      <p className="text-xs text-on-surface-variant">{latestPosts[0].date} • {latestPosts[0].readTime}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            
            {/* Small Vertical Card */}
            {latestPosts[1] && (
              <Link to={`/post/${latestPosts[1].slug}`} className="md:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col justify-between hover:bg-surface-bright transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={80} className="rotate-180" />
                </div>
                <div className="relative z-10">
                  <span className="text-primary text-xs font-bold tracking-widest uppercase mb-6 block">{latestPosts[1].category}</span>
                  <h3 className="font-headline text-2xl font-bold leading-tight mb-4">{latestPosts[1].title}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-3 mb-8 leading-relaxed">{latestPosts[1].excerpt}</p>
                </div>
                <div className="pt-8 border-t border-outline-variant/20 flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-on-surface-variant">READ ARTICLE</span>
                  <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            )}

            
          </div>
        </section>

        {/* Featured Minds Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Featured Minds</h2>
              <p className="text-on-surface-variant">Voices shaping our culture and design.</p>
            </div>
            <Link to="/categories" className="text-primary font-bold flex items-center gap-2 group whitespace-nowrap">
              All authors
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topBlogs.map((blog) => (
              <div key={`mind-${blog.id}`} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-surface-container-high group-hover:border-primary transition-colors shadow-xl">
                  <img loading="lazy" decoding="async" src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <h4 className="font-headline font-bold text-xl mb-1">{blog.author.name}</h4>
                  <p className="text-xs text-primary font-bold tracking-widest uppercase">{blog.author.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Blogs Section (Based on Featured Minds) */}
        <section className="bg-surface-container-low py-32 rounded-[4rem] mb-32 mx-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl font-extrabold mb-4">Top Blogs</h2>
              <p className="text-on-surface-variant text-lg">The voices defining our editorial direction.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topBlogs.map((blog, idx) => {
                const colors = [
                  'hover:border-violet-500/20 before:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent_70%)]',
                  'hover:border-amber-500/20 before:bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_70%)]',
                  'hover:border-teal-500/20 before:bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.08),transparent_70%)]',
                  'hover:border-rose-500/20 before:bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.08),transparent_70%)]'
                ];
                return (
                  <div key={blog.id} className={`bg-surface p-8 rounded-xl text-center group hover:translate-y-[-10px] transition-all duration-300 border border-transparent relative overflow-hidden before:absolute before:inset-0 ${colors[idx % colors.length]}`}>
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      {/* Using blog image instead of author for this requirement */}
                      <img loading="lazy" decoding="async" className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={blog.title} src={blog.image} />
                      <div className="absolute inset-0 rounded-full ring-2 ring-primary ring-offset-4 ring-offset-surface opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h4 className="font-headline font-bold text-lg mb-1 line-clamp-1" title={blog.title}>{blog.title}</h4>
                    <p className="text-xs text-primary font-bold tracking-widest uppercase mb-4">{blog.category}</p>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{blog.excerpt}</p>
                    <Link to={`/post/${blog.slug}`} className="block w-full py-2 rounded-full border border-outline-variant text-sm font-bold hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-95 text-center">
                      Read
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-surface-container-high to-surface-container-highest p-1 md:p-12">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 bg-surface/80 backdrop-blur-3xl rounded-[2.5rem] p-12 md:p-20 border border-white/5">
              <div className="max-w-xl">
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Join the Archive.</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Get exclusive insights, editorial picks, and stories from the Velora Journal delivered directly to your inbox every Sunday.
                </p>
              </div>
              <div className="w-full lg:w-auto">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full">
                  <input required aria-label="Email address for newsletter" className="px-8 py-5 rounded-full bg-surface-bright border-none focus:ring-2 focus:ring-primary/50 text-on-surface w-full sm:w-80 outline-none" placeholder="Your best email address" type="email" />
                  <button type="submit" className="px-10 py-5 bg-primary text-on-primary rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,221,121,0.4)] transition-all active:scale-95 whitespace-nowrap">
                    Subscribe Now
                  </button>
                </form>
                <p className="text-[10px] text-on-surface-variant/60 mt-4 text-center sm:text-left">By joining, you agree to our privacy policy and terms.</p>
              </div>
            </div>
            {/* Ambient Glow Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
