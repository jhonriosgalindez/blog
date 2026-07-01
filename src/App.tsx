import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BlogGrid from "./components/BlogGrid";
import PostDetail from "./components/PostDetail";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { BlogPost } from "./types";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import RegisterModal from "./components/RegisterModal";
import { auth, onAuthStateChanged, signOut, type User, db } from "./lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { DEFAULT_POSTS } from "./defaultPosts";

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"feed" | "dashboard">("feed");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setViewMode("feed");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Initial post fetch
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (response.ok && data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.error || "Failed to load posts.");
      }
    } catch (err: any) {
      console.warn("Could not connect to database server. Falling back to default posts for offline/serverless mode (Vercel):", err);
      // Use premium default posts in client-side fallback
      setPosts(DEFAULT_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Firestore post subscription
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, "user_posts"),
          where("estado", "==", "Publicado")
        );
        const querySnapshot = await getDocs(q);
        const userPostsList: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userPostsList.push({
            id: doc.id,
            title: data.title || "",
            summary: data.summary || "",
            content: data.content || "",
            category: data.category || "Destination",
            imageUrl: data.imageUrl || "",
            readTime: data.readTime || "5 mins read",
            author: data.author || { name: "Explorer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" },
            estado: data.estado || "Publicado",
            featured: data.featured || false,
            tags: data.tags || [],
            slug: data.slug || "",
            isAiGenerated: data.isAiGenerated || false,
            meta_titulo: data.meta_titulo || "",
            meta_descripcion: data.meta_descripcion || "",
            palabra_clave_principal: data.palabra_clave_principal || "",
            date: data.date || new Date(data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now()).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
          });
        });

        setPosts((prev) => {
          const defaultAndOtherPosts = prev.filter(
            (p) => !userPostsList.some((up) => up.id === p.id)
          );
          return [...userPostsList, ...defaultAndOtherPosts];
        });
      } catch (err) {
        console.error("Error fetching user posts from Firestore for feed:", err);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  // Return to home feed
  const handleHomeClick = () => {
    setActivePost(null);
    setViewMode("feed");
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("Newest");
    setHeroIndex(0);
    // Remove location hashes
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  const handlePostCreated = (newPost: BlogPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newPost.id);
      if (exists) {
        return prev.map((p) => (p.id === newPost.id ? newPost : p));
      }
      return [newPost, ...prev];
    });
    setActivePost(newPost);
    setViewMode("feed");
  };

  // Post filtering
  const filteredPosts = posts.filter((post) => {
    // Filter by status
    if (post.estado && post.estado !== "Publicado") {
      return false;
    }

    // Filter by category
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    // Filter by search query
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  // Post sorting
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "Oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "ReadTime") {
      const getMins = (str: string) => parseInt(str) || 0;
      return getMins(b.readTime) - getMins(a.readTime);
    } else {
      // Default newest sorting
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Extract featured posts
  const featuredPosts = posts.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onHomeClick={handleHomeClick}
        onSignUpClick={() => setIsRegisterModalOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onDashboardClick={() => {
          setActivePost(null);
          setViewMode("dashboard");
        }}
      />

      {/* Main content container */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-32 space-y-4"
          >
            <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
            <p className="text-sm font-medium text-slate-500 font-display">
              Initializing Horizone Travel & Lifestyle...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-32 px-4 space-y-6"
          >
            <div className="p-3 bg-red-50 rounded-full text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="text-lg font-bold text-slate-800 font-display">Connection Error</h3>
              <p className="text-sm text-slate-500 mt-2">{error}</p>
            </div>
            <button
              onClick={fetchPosts}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </motion.div>
        ) : viewMode === "dashboard" && currentUser ? (
          /* Writer dashboard view */
          <motion.div
            key="writer-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1"
          >
            <Dashboard
              currentUser={currentUser}
              onPostCreated={handlePostCreated}
              onPostDeleted={(deletedId) => {
                setPosts((prev) => prev.filter((p) => p.id !== deletedId));
              }}
              onClose={() => setViewMode("feed")}
              onPostSelect={(post) => {
                setActivePost(post);
                setViewMode("feed");
              }}
            />
          </motion.div>
        ) : activePost ? (
          /* Post detailed reader */
          <motion.div key="article-reader" className="flex-1">
            <PostDetail
              post={activePost}
              onBack={() => setActivePost(null)}
              allPosts={posts}
              onPostClick={(post) => {
                setActivePost(post);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </motion.div>
        ) : (
          /* Post feed view */
          <motion.div
            key="feed-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            {/* Featured Hero Slider */}
            <Hero
              featuredPosts={featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 3)}
              currentIndex={heroIndex}
              onIndexChange={setHeroIndex}
              onPostClick={setActivePost}
            />



            {/* Blog Grid Content */}
            <BlogGrid
              posts={sortedPosts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onSelectSortBy={setSortBy}
              onPostClick={setActivePost}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Footer */}
      <Footer totalPosts={posts.length} />
    </div>
  );
}
