import { motion } from "motion/react";
import { BlogPost } from "../types";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
  allPosts?: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

export default function PostDetail({ post, onBack, allPosts = [], onPostClick }: PostDetailProps) {
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id && p.estado !== "Borrador")
    .slice(0, 3);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className="min-h-screen bg-white pb-20"
    >
      {/* Header media cover */}
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-slate-950 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

        {/* Navigation action bar */}
        <div className="absolute top-6 left-4 md:left-8 right-4 md:right-8 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>
        </div>

        {/* Article title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-4 md:px-8 pb-8 text-left max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-white/20 backdrop-blur-md rounded-full mb-3 uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Layout wrapper */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content */}
        <main className="lg:col-span-8 text-left">
          {/* Article Body */}
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8 text-left">
          
          {/* Reading statistics */}
          <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Reading Information
            </h4>
            <div className="space-y-3.5 text-sm text-slate-600 font-sans">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published: <strong className="font-medium text-slate-800">{post.date}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Reading time: <strong className="font-medium text-slate-800">{post.readTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Author Profile */}
          <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              About the Author
            </h4>
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-sm"
              />
              <div>
                <h5 className="text-sm font-bold text-slate-800 font-display">
                  {post.author.name}
                </h5>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                  <User className="w-3 h-3" />
                  Horizone Contributor
                </span>
              </div>
            </div>
            {post.author.bio && (
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                {post.author.bio}
              </p>
            )}
          </div>
        </aside>

      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-16 pt-10 border-t border-slate-100 text-left">
          <h3 className="text-xl font-bold text-slate-900 font-display mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                onClick={() => onPostClick?.(related)}
                className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-103"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1.5 block">
                      {related.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{related.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
