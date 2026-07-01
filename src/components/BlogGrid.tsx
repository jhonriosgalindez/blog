import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BlogPost } from "../types";
import { Clock, Calendar, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogGridProps {
  posts: BlogPost[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  onPostClick: (post: BlogPost) => void;
}

const CATEGORIES = ["All", "Destination", "Culinary", "Lifestyle", "Tips & Hacks"];

export default function BlogGrid({
  posts,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  onPostClick,
}: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Reset pagination only when the category, sorting, or the actual items/order of posts change.
  // Using a serialized key of post IDs avoids resetting when parent re-renders recreate the array reference.
  const postsKey = posts.map((p) => p.id).join(",");

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, postsKey]);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById("blog-grid")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto" id="blog-grid">
      {/* Header */}
      <div className="mb-8 text-left">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 font-display mb-2">
          Blog
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-sans max-w-xl">
          Here, we share travel tips, destination guides, and stories that inspire your next adventure.
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all cursor-pointer select-none shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <label htmlFor="sort-by" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value)}
            className="text-xs md:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border-none outline-none rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-300 transition-all cursor-pointer"
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="ReadTime">Read Time</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {posts.length === 0 ? (
        <div className="py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 text-sm">
            No articles found in this category or search.
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Try searching for a different keyword or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentPosts.map((post) => (
              <article
                id={`post-${post.id}`}
                key={post.id}
                onClick={() => onPostClick(post)}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
              >
                {/* Card Media */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Category Badge overlay */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-[10px] md:text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Card Contents */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-base md:text-lg font-bold tracking-tight text-slate-800 font-display mb-2 group-hover:text-slate-900 group-hover:underline decoration-slate-400">
                      {post.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 font-sans font-light line-clamp-2 leading-relaxed mb-4">
                      {post.summary}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-slate-100 object-cover"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-slate-800">
                          {post.author.name}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Calendar className="w-2.5 h-2.5" />
                          {post.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 border-t border-slate-100 pt-8" id="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-xs transition-all hover:bg-slate-50 hover:text-slate-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed group/prev relative"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover/prev:-translate-x-0.5" />
                <span>Anterior</span>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 opacity-0 group-hover/prev:opacity-100 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-md whitespace-nowrap shadow-md pointer-events-none z-10 transition-all duration-150 scale-95 group-hover/prev:scale-100">
                  Página anterior
                </div>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isSelected = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] h-9 flex items-center justify-center text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer relative group/page-${page}`}
                      style={{
                        backgroundColor: isSelected ? "#2563EB" : "transparent",
                        color: isSelected ? "#FFFFFF" : "#475569",
                        border: isSelected ? "1px solid #2563EB" : "1px solid transparent"
                      }}
                    >
                      <span>{page}</span>
                      <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 opacity-0 group-hover/page-${page}:opacity-100 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-md whitespace-nowrap shadow-md pointer-events-none z-10 transition-all duration-150 scale-95 group-hover/page-${page}:scale-100`}>
                        Ir a la página {page}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-xs transition-all hover:bg-slate-50 hover:text-slate-950 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed group/next relative"
                title="Siguiente página"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/next:translate-x-0.5" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 opacity-0 group-hover/next:opacity-100 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-md whitespace-nowrap shadow-md pointer-events-none z-10 transition-all duration-150 scale-95 group-hover/next:scale-100">
                  Página siguiente
                </div>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
