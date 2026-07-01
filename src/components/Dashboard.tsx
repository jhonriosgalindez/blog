import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, 
  FileText, 
  PlusCircle, 
  Image as ImageIcon, 
  BookOpen, 
  Compass, 
  Clock, 
  Check, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  Eye, 
  Edit3,
  UploadCloud,
  Plus,
  Trash2
} from "lucide-react";
import { auth, db, type User, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { BlogPost } from "../types";

// HTML preview and format configuration
interface DashboardProps {
  currentUser: User | null;
  onPostCreated: (post: BlogPost) => void;
  onPostDeleted?: (id: string) => void;
  onClose: () => void;
  onPostSelect?: (post: BlogPost) => void;
}

const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function Dashboard({ currentUser, onPostCreated, onPostDeleted, onClose, onPostSelect }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"create" | "Borrador" | "Publicado" | "Revisión" | "Archivado">("create");
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [customSlug, setCustomSlug] = useState(false);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  
  // Custom & Dynamic Categories State
  const [categories, setCategories] = useState<string[]>([
    "Destination",
    "Culinary",
    "Lifestyle",
    "Tips & Hacks"
  ]);
  const [category, setCategory] = useState<string>("Destination");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  // Cover image settings
  const [imageUrl, setImageUrl] = useState(DEFAULT_COVER_IMAGE);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [imageSourceType, setImageSourceType] = useState<"upload" | "url">("upload");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [readTime, setReadTime] = useState("5 mins read");
  const [authorBio, setAuthorBio] = useState("Passionate writer and explorer of the modern world.");
  const [authorRole, setAuthorRole] = useState<"Administrador" | "Editor" | "Autor" | "Lector">("Autor");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Extra configuration
  const [estado, setEstado] = useState<"Borrador" | "Revisión" | "Publicado" | "Archivado">("Publicado");
  const [tags, setTags] = useState("");
  const [metaTitulo, setMetaTitulo] = useState("");
  const [metaDescripcion, setMetaDescripcion] = useState("");
  const [palabraClavePrincipal, setPalabraClavePrincipal] = useState("");
  const [showSEO, setShowSEO] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserPosts();
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.biografia) {
          setAuthorBio(data.biografia);
        }
        if (data.rol) {
          setAuthorRole(data.rol as any);
        }
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        biografia: authorBio,
        rol: authorRole,
        displayName: currentUser.displayName || "User",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL || "",
        foto_perfil: currentUser.photoURL || "",
        lastLogin: new Date().toISOString()
      }, { merge: true });
      setSuccess("Author profile updated successfully in the database!");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Could not save profile changes: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setCustomSlug(!!post.slug);
    setSummary(post.summary || "");
    setContent(post.content || "");
    setCategory(post.category || "Destination");
    setTags(post.tags ? post.tags.join(", ") : "");
    setEstado(post.estado || "Publicado");
    setReadTime(post.readTime || "5 mins read");
    setImageUrl(post.imageUrl || DEFAULT_COVER_IMAGE);
    setCustomImageUrl("");
    setMetaTitulo(post.meta_titulo || "");
    setMetaDescripcion(post.meta_descripcion || "");
    setPalabraClavePrincipal(post.palabra_clave_principal || "");
    setActiveTab("create");
    setSuccess("");
    setError("");
  };

  const loadUserPosts = async () => {
    if (!currentUser) return;
    setLoadingPosts(true);
    try {
      const q = query(
        collection(db, "user_posts"),
        where("authorUid", "==", currentUser.uid)
      );
      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "user_posts");
        return;
      }
      const posts: BlogPost[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        posts.push({
          id: docSnap.id,
          title: data.title,
          slug: data.slug || "",
          summary: data.summary,
          content: data.content,
          category: data.category,
          tags: data.tags || [],
          author: data.author,
          estado: data.estado || "Publicado",
          date: data.date,
          readTime: data.readTime,
          imageUrl: data.imageUrl,
          isAiGenerated: data.isAiGenerated || false,
          meta_titulo: data.meta_titulo || "",
          meta_descripcion: data.meta_descripcion || "",
          palabra_clave_principal: data.palabra_clave_principal || "",
          createdAt: data.createdAt
        });
      });
      // Sort newest first
      posts.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        if (timeA && timeB) {
          return timeB - timeA;
        }
        return b.id.localeCompare(a.id);
      });
      setUserPosts(posts);
    } catch (err) {
      console.error("Error loading user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setDeletingId(postId);
    setError("");
    setSuccess("");
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "user_posts", postId));

      // Delete from fallback server cache
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "DELETE"
        });
        if (!res.ok) {
          console.warn("Could not delete from in-memory backend, but deleted from Firestore successfully.");
        }
      } catch (fetchErr) {
        console.warn("Skipped deleting from global cache because backend is offline/serverless:", fetchErr);
      }

      setSuccess("Article deleted successfully!");
      
      // Trigger parent callback
      onPostDeleted?.(postId);

      // Refresh post list
      await loadUserPosts();
    } catch (err: any) {
      console.error("Error deleting post:", err);
      setError("Could not delete article: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCustomImageChange = (val: string) => {
    setCustomImageUrl(val);
    setImageUrl(val || DEFAULT_COVER_IMAGE);
  };

  // Dynamic category creation
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    setCategory(trimmed);
    setNewCategory("");
    setShowAddCategoryInput(false);
    setSuccess(`Category "${trimmed}" added and selected successfully.`);
  };

  // File loading handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP, etc).");
      return;
    }
    // Base64 conversion file size check
    if (file.size > 4 * 1024 * 1024) {
      setError("The image is too large. Please select an image smaller than 4MB.");
      return;
    }

    setUploadingImage(true);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setCustomImageUrl("");
      setUploadingImage(false);
      setSuccess("Image successfully uploaded from your computer!");
    };
    reader.onerror = () => {
      setError("Error reading the image file.");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!title.trim()) {
      setError("Please enter a title for the article.");
      return;
    }
    if (!summary.trim()) {
      setError("Please enter a short 1 or 2 line summary.");
      return;
    }
    if (!content.trim() || content.length < 50) {
      setError("Please write the content of your article (minimum 50 characters).");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-GB', dateOptions);

    const postAuthor = {
      name: currentUser.displayName || currentUser.email?.split("@")[0] || "Horizone Author",
      avatar: currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      bio: authorBio
    };

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : imageUrl;
    const postTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const finalSlug = slug.trim() || slugify(title.trim());

    const newPostData = {
      title: title.trim(),
      slug: finalSlug,
      summary: summary.trim(),
      content: content.trim(),
      category: category,
      tags: postTags,
      author: postAuthor,
      estado: estado,
      date: todayStr,
      readTime: readTime,
      imageUrl: finalImage,
      isAiGenerated: false,
      meta_titulo: metaTitulo.trim() || title.trim(),
      meta_descripcion: metaDescripcion.trim() || summary.trim(),
      palabra_clave_principal: palabraClavePrincipal.trim()
    };

    try {
      // Save to Firestore
      let postId = editingPostId;
      if (editingPostId) {
        try {
          const postRef = doc(db, "user_posts", editingPostId);
          await setDoc(postRef, {
            ...newPostData,
            authorUid: currentUser.uid,
            updatedAt: Timestamp.now(),
            publishedAt: estado === "Publicado" ? Timestamp.now() : null
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, "user_posts");
          return;
        }

        // Sync local memory store
        try {
          const response = await fetch(`/api/posts/${editingPostId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newPostData
            })
          });

          if (!response.ok) {
            console.warn("Could not update globally in-memory, but saved to Firestore.");
          }
        } catch (fetchErr) {
          console.warn("Skipped updating global cache because backend is offline/serverless:", fetchErr);
        }
      } else {
        let docRef;
        try {
          docRef = await addDoc(collection(db, "user_posts"), {
            ...newPostData,
            authorUid: currentUser.uid,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            publishedAt: estado === "Publicado" ? Timestamp.now() : null
          });
          postId = docRef.id;
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, "user_posts");
          return;
        }

        // Sync local memory store
        try {
          const response = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newPostData,
              id: postId
            })
          });

          if (!response.ok) {
            console.warn("Could not register globally in-memory, but saved to Firestore.");
          }
        } catch (fetchErr) {
          console.warn("Skipped registering in global cache because backend is offline/serverless:", fetchErr);
        }
      }

      const publishedPost: BlogPost = {
        id: postId!,
        ...newPostData
      };

      // Notify parent component
      onPostCreated(publishedPost);

      // Reset form
      setTitle("");
      setSlug("");
      setCustomSlug(false);
      setSummary("");
      setContent("");
      setTags("");
      setMetaTitulo("");
      setMetaDescripcion("");
      setPalabraClavePrincipal("");
      setEstado("Publicado");
      setEditingPostId(null);
      setSuccess(editingPostId ? "Article updated successfully!" : "Article saved and published successfully! It is now part of your content database.");
      
      // Refresh user posts list
      loadUserPosts();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error publishing your article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8" id="dashboard-main-container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Hello, {currentUser.displayName || currentUser.email?.split("@")[0]}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Write, edit, and publish exquisite articles on Horizone.
          </p>
        </div>
        <button
          onClick={onClose}
          className="self-start md:self-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          id="dashboard-back-btn"
        >
          Back to home
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Author Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs" id="dashboard-profile-card">
            <div className="flex flex-col items-center text-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-16 h-16 rounded-full border border-blue-100 object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  <UserIcon className="w-8 h-8" />
                </div>
              )}
              <h3 className="font-bold text-slate-800 text-lg mt-3">
                {currentUser.displayName || "Horizone Writer"}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              
              <div className="w-full border-t border-slate-100 my-4" />
              
              <div className="w-full text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Your author bio
                </label>
                <textarea
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Write a short bio..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white text-slate-600 resize-none h-20"
                />
              </div>

              <div className="w-full text-left mt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Author role
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white text-slate-600 font-medium"
                >
                  <option value="Administrador">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Autor">Author</option>
                  <option value="Lector">Reader</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSavingProfile ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save profile changes"
                )}
              </button>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveTab("create");
                setSuccess("");
                setError("");
                if (editingPostId) {
                  setEditingPostId(null);
                  setTitle("");
                  setSlug("");
                  setCustomSlug(false);
                  setSummary("");
                  setContent("");
                  setTags("");
                  setMetaTitulo("");
                  setMetaDescripcion("");
                  setPalabraClavePrincipal("");
                  setEstado("Publicado");
                  setImageUrl(DEFAULT_COVER_IMAGE);
                  setCustomImageUrl("");
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "create"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
              id="tab-create-btn"
            >
              {editingPostId ? (
                <>
                  <Edit3 className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Edit Mode (Reset)</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Create new article</span>
                </>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("Borrador"); setSuccess(""); setError(""); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "Borrador"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
              id="tab-borradores-btn"
            >
              <span>Drafts</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === "Borrador" ? "bg-amber-100 text-amber-800" : "bg-slate-200/60 text-slate-600"}`}>
                ({userPosts.filter((p) => p.estado === "Borrador" || !p.estado).length})
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("Publicado"); setSuccess(""); setError(""); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "Publicado"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
              id="tab-myposts-btn"
            >
              <span>My posts</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === "Publicado" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200/60 text-slate-600"}`}>
                ({userPosts.filter((p) => p.estado === "Publicado").length})
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("Revisión"); setSuccess(""); setError(""); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "Revisión"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
              id="tab-revision-btn"
            >
              <span>In review</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === "Revisión" ? "bg-blue-100 text-blue-800" : "bg-slate-200/60 text-slate-600"}`}>
                ({userPosts.filter((p) => p.estado === "Revisión").length})
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("Archivado"); setSuccess(""); setError(""); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "Archivado"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
              id="tab-archivados-btn"
            >
              <span>Archived</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === "Archivado" ? "bg-slate-100 text-slate-800" : "bg-slate-200/60 text-slate-600"}`}>
                ({userPosts.filter((p) => p.estado === "Archivado").length})
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Form / List */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === "create" && (
              <motion.div
                key="create-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                    {editingPostId ? (
                      <>
                        <Edit3 className="w-5 h-5 text-amber-600" /> Edit article
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5 text-blue-600" /> New article
                      </>
                    )}
                  </h2>
                  
                  {/* Preview toggle */}
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPreviewMode ? "Back to editor" : "View preview"}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 rounded-xl text-xs font-medium text-red-600 border border-red-100 flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl text-xs font-medium text-emerald-700 border border-emerald-100 flex items-center gap-2 mb-4">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {!isPreviewMode ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-1">
                      <label htmlFor="post-title" className="text-xs font-semibold text-slate-700 block">
                        Article title
                      </label>
                      <input
                        id="post-title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!customSlug) {
                            setSlug(slugify(e.target.value));
                          }
                        }}
                        placeholder="e.g. Secret corners of the French Riviera"
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800 font-medium"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label htmlFor="post-slug" className="text-xs font-semibold text-slate-700 block">
                          Slug (SEO Friendly URL)
                        </label>
                        <button
                          type="button"
                          onClick={() => setCustomSlug(!customSlug)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-all active:scale-95 cursor-pointer"
                        >
                          {customSlug ? "Generate automatically" : "Customize slug"}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 select-none">
                          /post/
                        </span>
                        <input
                          id="post-slug"
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => {
                            setSlug(slugify(e.target.value));
                            setCustomSlug(true);
                          }}
                          placeholder="e.g. perfect-travel-article"
                          className="w-full pl-14 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-750"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <label htmlFor="post-cat" className="text-xs font-semibold text-slate-700 block">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {showAddCategoryInput ? "Cancel" : "New category"}
                          </button>
                        </div>
                        
                        {!showAddCategoryInput ? (
                          <select
                            id="post-cat"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex gap-2 min-w-0">
                            <input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="e.g. Technology, Photography"
                              className="flex-1 min-w-0 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCategory();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer active:scale-95 shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Read Time */}
                      <div className="space-y-1 min-w-0">
                        <label htmlFor="post-read" className="text-xs font-semibold text-slate-700 block">
                          Estimated read time
                        </label>
                        <input
                          id="post-read"
                          type="text"
                          required
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="e.g. 5 mins read"
                          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Image selector */}
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-slate-500" /> Article cover image
                        </label>
                        
                        {/* Source type selector */}
                        <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => {
                              setImageSourceType("upload");
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              imageSourceType === "upload"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Upload from computer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageSourceType("url");
                              setImageUrl(customImageUrl || DEFAULT_COVER_IMAGE);
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              imageSourceType === "url"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Web link URL
                          </button>
                        </div>
                      </div>

                      {/* Image sources content */}
                      <AnimatePresence mode="wait">
                        {imageSourceType === "upload" && (
                          <motion.div
                            key="upload-source"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-2"
                          >
                            <div
                              onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) processFile(file);
                              }}
                              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                isDragging
                                  ? "border-blue-500 bg-blue-50/50"
                                  : "border-slate-200 bg-white hover:bg-slate-50/50"
                              }`}
                              onClick={() => document.getElementById("file-upload-input")?.click()}
                            >
                              <input
                                id="file-upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              {uploadingImage ? (
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              ) : (
                                <UploadCloud className={`w-8 h-8 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
                              )}
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-700">
                                  {uploadingImage ? "Processing image..." : "Drag your image here or click to browse"}
                                </p>
                                <p className="text-[10px] text-slate-400">Supports: JPG, PNG, WEBP, GIF (Max 4MB)</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {imageSourceType === "url" && (
                          <motion.div
                            key="url-source"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-2"
                          >
                            <p className="text-[11px] text-slate-400">Enter the web address or public URL of your image:</p>
                            <input
                              type="text"
                              value={customImageUrl}
                              onChange={(e) => handleCustomImageChange(e.target.value)}
                              placeholder="https://example.com/your-travel-image.jpg"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Cover preview */}
                      <div className="relative h-32 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 mt-2">
                        <img
                          src={imageUrl}
                          alt="Header preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-between p-3">
                          <span className="text-[10px] text-white font-medium bg-black/50 px-2 py-1 rounded-md backdrop-blur-xs">
                            Preview of the current cover
                          </span>
                          {imageUrl.startsWith("data:image/") && (
                            <span className="text-[9px] text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              Uploaded file
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-1">
                      <label htmlFor="post-summary" className="text-xs font-semibold text-slate-700 block">
                        Short summary (for card previews)
                      </label>
                      <textarea
                        id="post-summary"
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write an engaging paragraph of 1 or 2 sentences..."
                        className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800 resize-none h-16"
                      />
                    </div>

                    {/* Body content */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label htmlFor="post-content" className="text-xs font-semibold text-slate-700 block">
                          Article content (HTML format supported)
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Minimum 50 characters • {content.length} characters
                        </span>
                      </div>
                      <textarea
                        id="post-content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Use standard HTML tags to style elegantly:
<h1>Main Title</h1>
<p>Write your intro paragraph with style.</p>

<h2>Section subtitle</h2>
<p>Another paragraph of interesting text.</p>

<blockquote>"Add highlighted quotes like this"</blockquote>

<ul>
  <li>You can use organizing bullet points</li>
  <li>To add emphasis or rhythm</li>
</ul>`}
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800 font-mono h-64"
                      />
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Estado */}
                      <div className="space-y-1">
                        <label htmlFor="post-estado" className="text-xs font-semibold text-slate-700 block">
                          Article workflow status
                        </label>
                        <select
                          id="post-estado"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800 font-medium"
                        >
                          <option value="Borrador">Draft</option>
                          <option value="Revisión">In Review</option>
                          <option value="Publicado">Published</option>
                          <option value="Archivado">Archived</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div className="space-y-1">
                        <label htmlFor="post-tags" className="text-xs font-semibold text-slate-700 block">
                          Tags (comma-separated)
                        </label>
                        <input
                          id="post-tags"
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="e.g. travel, culinary, adventure"
                          className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    {/* SEO Metadata */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
                      <button
                        type="button"
                        onClick={() => setShowSEO(!showSEO)}
                        className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100/80 transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          🔍 SEO Configuration & metadata (optional)
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showSEO ? "rotate-90" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {showSEO && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 space-y-4 bg-white border-t border-slate-150"
                          >
                            <div className="space-y-1">
                              <label htmlFor="post-meta-titulo" className="text-[11px] font-semibold text-slate-600 block">
                                Meta Title (SEO)
                              </label>
                              <input
                                id="post-meta-titulo"
                                type="text"
                                value={metaTitulo}
                                onChange={(e) => setMetaTitulo(e.target.value)}
                                placeholder="Search engine optimized title..."
                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="post-meta-desc" className="text-[11px] font-semibold text-slate-600 block">
                                Meta Description (SEO)
                              </label>
                              <textarea
                                id="post-meta-desc"
                                value={metaDescripcion}
                                onChange={(e) => setMetaDescripcion(e.target.value)}
                                placeholder="Short summary optimized for SEO..."
                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 h-16 resize-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="post-meta-key" className="text-[11px] font-semibold text-slate-600 block">
                                Focus Keyword
                              </label>
                              <input
                                id="post-meta-key"
                                type="text"
                                value={palabraClavePrincipal}
                                onChange={(e) => setPalabraClavePrincipal(e.target.value)}
                                placeholder="e.g. travel blue coast"
                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                      id="publish-btn"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        editingPostId ? "Save changes" : "Publish article"
                      )}
                    </button>
                  </form>
                ) : (
                  /* Real-time preview */
                  <div className="space-y-6">
                    {/* Preview header */}
                    <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                      <img
                        src={imageUrl}
                        alt="Post header"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                        <span className="self-start px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                          {category}
                        </span>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display drop-shadow-sm">
                          {title || "No title yet"}
                        </h1>
                        <p className="text-xs text-slate-200 mt-2 line-clamp-1 italic">
                          {summary || "Article summary..."}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Author"
                            className="w-5 h-5 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                            <UserIcon className="w-3 h-3 text-slate-500" />
                          </div>
                        )}
                        <span className="font-semibold text-slate-700">
                          {currentUser.displayName || currentUser.email?.split("@")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5" /> Just created
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {readTime}
                        </span>
                      </div>
                    </div>

                    {/* Rendered content */}
                    <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {content.trim() ? (
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <p className="text-slate-400 italic">Write in the editor to preview the article content here in an elegant format.</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(false)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all text-center cursor-pointer"
                    >
                      Back to editor to publish
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {["Borrador", "Publicado", "Revisión", "Archivado"].includes(activeTab) && (
              <motion.div
                key={`${activeTab}-tab`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs"
              >
                <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                  <span>
                    {activeTab === "Borrador" && "Drafts"}
                    {activeTab === "Publicado" && "My publications"}
                    {activeTab === "Revisión" && "In review"}
                    {activeTab === "Archivado" && "Archived"}
                  </span>
                </h2>

                {loadingPosts ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    <p className="text-sm">Loading your literary works...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const filteredPosts = userPosts.filter((p) => {
                        if (activeTab === "Borrador") return p.estado === "Borrador" || !p.estado;
                        return p.estado === activeTab;
                      });

                      if (filteredPosts.length === 0) {
                        return (
                          <div className="py-12 border-2 border-dashed border-slate-200/50 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400 p-6">
                            <FileText className="w-8 h-8 mb-2 text-slate-300" />
                            <p className="text-xs font-semibold text-slate-500">No articles</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">There are no publications in this state.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="divide-y divide-slate-100/80 bg-white border border-slate-100 rounded-2xl shadow-xs">
                          {filteredPosts.map((post) => (
                            <div
                              key={post.id}
                              className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-all group first:rounded-t-2xl last:rounded-b-2xl"
                            >
                              <button
                                onClick={() => onPostSelect?.(post)}
                                className="text-sm font-semibold text-slate-800 hover:text-blue-600 hover:underline transition-colors text-left flex-1 cursor-pointer pr-4"
                              >
                                {post.title}
                              </button>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Edit button */}
                                <div className="relative group/edit-tooltip">
                                  <button
                                    onClick={() => handleStartEdit(post)}
                                    className="p-1.5 hover:bg-amber-50 hover:text-amber-600 text-slate-400 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="absolute right-0 bottom-full mb-1.5 opacity-0 group-hover/edit-tooltip:opacity-100 bg-slate-900 text-white text-[9px] font-semibold py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none z-10 transition-all duration-150 scale-95 group-hover/edit-tooltip:scale-100">
                                    Edit post
                                  </div>
                                </div>

                                {/* Delete button */}
                                <div className="relative group/tooltip">
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={deletingId === post.id}
                                    className="p-1.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-all cursor-pointer disabled:opacity-50 opacity-0 group-hover:opacity-100"
                                  >
                                    {deletingId === post.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <div className="absolute right-0 bottom-full mb-1.5 opacity-0 group-hover/tooltip:opacity-100 bg-slate-900 text-white text-[9px] font-semibold py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none z-10 transition-all duration-150 scale-95 group-hover/tooltip:scale-100">
                                    Delete post
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

