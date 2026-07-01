import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, ArrowLeft, Lock, User, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  saveUserProfile
} from "../lib/firebase";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RegisterMethod = "select" | "email" | "success";

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [method, setMethod] = useState<RegisterMethod>("select");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string; provider: string; isNewUser: boolean } | null>(null);

  const resetForm = () => {
    setMethod("select");
    setIsLoginMode(false);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(result.user, "Google");
      
      // Check authentication status
      const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      setRegisteredUser({
        name: result.user.displayName || "Google User",
        email: result.user.email || "",
        provider: "Google",
        isNewUser: isNew,
      });
      setMethod("success");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("The authentication process was closed by the user.");
      } else {
        setError(err.message || "Error authenticating with Google.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("The password must be at least 6 characters long.");
      return;
    }

    if (!isLoginMode && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (isLoginMode) {
        // Sign in user
        const result = await signInWithEmailAndPassword(auth, email, password);
        await saveUserProfile(result.user, "Password");
        setRegisteredUser({
          name: result.user.displayName || result.user.email?.split("@")[0] || "User",
          email: result.user.email || "",
          provider: "Email",
          isNewUser: false,
        });
      } else {
        // Sign up user
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await saveUserProfile(result.user, "Password");
        setRegisteredUser({
          name,
          email,
          provider: "Email",
          isNewUser: true,
        });
      }
      setMethod("success");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Incorrect credentials. Please verify your email or password.");
      } else {
        setError(err.message || "An error occurred while processing your request.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          id="register-modal-backdrop"
        />

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10"
          id="register-modal-container"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            aria-label="Close modal"
            id="register-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal content */}
          <div className="p-6 sm:p-8" id="register-modal-content">
            <AnimatePresence mode="wait">
              {method === "select" && (
                <motion.div
                  key="select-method"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                      Sign In / Register
                    </h3>
                    <p className="text-sm text-slate-500 mt-1.5">
                      Access or create your account in seconds to start exploring.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 rounded-xl text-xs font-medium text-red-600 border border-red-100 text-left">
                      {error}
                    </div>
                  )}

                  {/* Login providers */}
                  <div className="space-y-3 pt-2">
                    {/* Google authentication */}
                    <button
                      onClick={handleGoogleSignUp}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all font-medium text-sm shadow-xs disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                      id="signup-google-btn"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      )}
                      <span>Continue with Google</span>
                    </button>

                    {/* Email authentication */}
                    <button
                      onClick={() => {
                        setIsLoginMode(false);
                        setMethod("email");
                        setError("");
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all font-medium text-sm shadow-xs cursor-pointer"
                      id="signup-email-btn"
                    >
                      <Mail className="w-5 h-5 text-slate-500" />
                      <span>Continue with Email Address</span>
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      By signing in or registering, you accept our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </motion.div>
              )}

              {method === "email" && (
                <motion.div
                  key="email-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-2 -mt-2">
                    <button
                      onClick={() => {
                        setMethod("select");
                        setError("");
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Back to options
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 font-display">
                      {isLoginMode ? "Sign In" : "Create Account"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isLoginMode ? "Enter your credentials to continue." : "Complete the details to get started."}
                    </p>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                    {error && (
                      <div className="p-3 bg-red-50 rounded-xl text-xs font-medium text-red-600 border border-red-100">
                        {error}
                      </div>
                    )}

                    {/* Full Name field */}
                    {!isLoginMode && (
                      <div className="space-y-1">
                        <label htmlFor="reg-name" className="text-xs font-semibold text-slate-600 block">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            id="reg-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email field */}
                    <div className="space-y-1">
                      <label htmlFor="reg-email" className="text-xs font-semibold text-slate-600 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1">
                      <label htmlFor="reg-pass" className="text-xs font-semibold text-slate-600 block">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          id="reg-pass"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                      id="signup-submit-btn"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        isLoginMode ? "Sign In" : "Create Account"
                      )}
                    </button>

                    {/* Authentication toggle */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoginMode(!isLoginMode);
                          setError("");
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer"
                        id="auth-mode-toggle-btn"
                      >
                        {isLoginMode ? "Don't have an account yet? Register" : "Already have an account? Sign In"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {method === "success" && (
                <motion.div
                  key="signup-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5 text-center py-4"
                >
                  <div className="flex justify-center">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-500 border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      {registeredUser?.isNewUser ? "Registration Successful!" : "Welcome Back!"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      Great to have you at Horizone, <span className="font-semibold text-slate-800">{registeredUser?.name}</span>!
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {registeredUser?.isNewUser ? "Account linked via" : "Session started via"} {registeredUser?.provider} ({registeredUser?.email}).
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                    id="signup-success-close-btn"
                  >
                    Start exploring
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
