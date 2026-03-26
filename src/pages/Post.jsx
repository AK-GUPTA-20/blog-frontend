import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { featuredPosts, latestPosts } from '../data/mockData';
import { Share2, Bookmark, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Post() {
  const { slug } = useParams();
  const allPosts = [...featuredPosts, ...latestPosts];
  const post = allPosts.find(p => p.slug === slug) || allPosts[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <article className="pb-24">
      {/* Hero Image Full Width */}
      <div className="relative w-full h-[60vh] min-h-[400px]">
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
         <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
         
         <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 layout-container">
           <Link to="/" className="inline-flex items-center gap-2 text-primary font-label uppercase text-sm tracking-widest hover:underline mb-8 w-fit mt-10">
             <ArrowLeft size={16} /> Back to stories
           </Link>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 mb-4 text-xs font-label uppercase tracking-widest text-primary w-fit">
              {post.category}
           </div>
           <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tighter max-w-4xl"
            >
             {post.title}
           </motion.h1>
         </div>
      </div>

      <div className="layout-container mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Sidebar Actions */}
         <div className="hidden lg:block lg:col-span-2 relative">
            <div className="sticky top-32 flex flex-col items-center gap-6 glass-card py-6 rounded-full w-16 mx-auto">
               <button className="text-muted-foreground hover:text-primary transition-colors"><Heart size={20} /></button>
               <div className="w-8 h-px bg-border my-2" />
               <button className="text-muted-foreground hover:text-primary transition-colors"><Bookmark size={20} /></button>
               <button className="text-muted-foreground hover:text-primary transition-colors"><Share2 size={20} /></button>
            </div>
         </div>

         {/* Content */}
         <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-border">
               <div className="flex items-center gap-4">
                 <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full border-2 border-primary/20" />
                 <div>
                   <p className="font-display font-bold text-lg">{post.author.name}</p>
                   <p className="text-muted-foreground font-label text-sm uppercase tracking-widest mt-1">Lead Editor</p>
                 </div>
               </div>
               <div className="text-right font-label text-sm uppercase tracking-widest text-muted-foreground">
                 <p>{post.date}</p>
                 <p className="mt-1">{post.readTime}</p>
               </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none font-body text-muted-foreground leading-loose">
               <p className="text-2xl text-foreground font-display leading-snug mb-8">
                 {post.excerpt} The transition from pure utility to structural art is accelerating across the interactive web.
               </p>
               <p>
                 In the fast-evolving landscape of modern web design, building digital experiences has become more than just arranging text and images on a screen. It's about designing environments—spaces where users interact, read, and explore within an atmospheric depth that mimics the real world. As hardware performance grows and browser engines become more capable, developers are shifting towards immersive frontends.
               </p>
               <h2 className="font-display mt-10 mb-6 text-3xl font-bold text-foreground">The Architectural Shift</h2>
               <p>
                 We are noticing a sharp departure from the strict, flat designs of the late 2010s. The "No-Line Rule," as adopted by elite design teams, prohibits the use of simple 1px borders to separate content containers. Instead, elevation is formed through subtle shifts in backgrounds, shadows, and blurred layers. It is a layering principle that treats UI elements like stacked sheets of fine paper or frosted glass.
               </p>
               <blockquote className="border-l-4 border-primary pl-6 my-10 italic text-3xl font-display text-foreground leading-tight">
                 "True design is not just what it looks like and feels like. Design is how it works, and how it bends the light."
               </blockquote>
               <p>
                 To achieve this level of quality in React, CSS architecture must be fundamentally rethought. Utility classes using Tailwind CSS combined with custom design tokens for surface containers allow for rapid scaling while maintaining absolute creative control. This ensures every shadow, glow, and border interacts perfectly across both light and dark modes.
               </p>
               <div className="my-12 p-8 rounded-3xl glass-card bg-surface-container-high/30">
                  <h3 className="text-xl font-display font-bold text-foreground mb-4">Key Takeaways</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Utilize wide spacing and intentional asymmetry to break the grid.</li>
                    <li>Rely on tonal layering rather than standard drop shadows.</li>
                    <li>Reserve high-contrast accents (like gold and cyan) for micro-interactions only.</li>
                  </ul>
               </div>
               <p>
                 The conclusion is clear: frontend engineers and designers must work closer than ever. The tools exist—Framer Motion for fluid states, complex gradients for emotional resonance, and highly flexible component structures—but the execution requires discipline. Building the web of tomorrow means embracing the digital curator mindset today.
               </p>
            </div>
         </div>
      </div>
    </article>
  );
}
