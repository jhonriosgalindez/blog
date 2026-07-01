import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  featuredPosts: BlogPost[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onPostClick: (post: BlogPost) => void;
}

export default function Hero({ featuredPosts, currentIndex, onIndexChange, onPostClick }: HeroProps) {
  if (!featuredPosts || featuredPosts.length === 0) return null;
  const currentPost = featuredPosts[currentIndex % featuredPosts.length];
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      onIndexChange((currentIndex + 1) % featuredPosts.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, featuredPosts.length, onIndexChange, isHovered]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex + 1) % featuredPosts.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex - 1 + featuredPosts.length) % featuredPosts.length);
  };

  return (
    <section 
      onClick={() => onPostClick(currentPost)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[55vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] w-full bg-slate-950 overflow-hidden cursor-pointer group"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0.6, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Main Background Image */}
          <img
            src={currentPost.imageUrl}
            alt={currentPost.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/20" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="absolute inset-x-0 bottom-0 px-4 md:px-8 pb-8 md:pb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl text-left">
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full mb-3 uppercase tracking-wider"
          >
            {currentPost.category}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-tight mb-2 group-hover:underline decoration-white/40"
          >
            {currentPost.title}
          </motion.h1>

          {/* Subtitle / Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 font-sans font-light max-w-xl mb-4 sm:mb-6 leading-relaxed line-clamp-3 md:line-clamp-none"
          >
            {currentPost.summary}
          </motion.p>

          {/* Interactive Navigation Dots */}
          <div className="flex items-center gap-2">
            {featuredPosts.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-white scale-125 shadow-md" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>


      </div>

      {/* Desktop Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
