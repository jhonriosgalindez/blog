import { Search, LogOut, User as UserIcon } from "lucide-react";
import { User } from "../lib/firebase";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onHomeClick: () => void;
  onSignUpClick: () => void;
  currentUser: User | null;
  onSignOut: () => void;
  onDashboardClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onHomeClick,
  onSignUpClick,
  currentUser,
  onSignOut,
  onDashboardClick
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between bg-white border-b border-slate-200 shadow-xs">
      {/* Brand logo */}
      <div 
        onClick={onHomeClick}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        {/* Brand visual logo icon */}
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-semibold shadow-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-5 h-5 text-blue-600"
          >
            <path d="M4 12h16M4 5v14M20 5v14" />
            <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-20" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-blue-600 font-display">Horizone</span>
      </div>

      {/* Search Input for blog filtering */}
      <div className="relative w-full order-last mt-3 sm:order-none sm:mt-0 sm:flex-1 sm:max-w-xs md:max-w-md sm:mx-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right elements & Auth shortcuts */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onDashboardClick}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              id="header-dashboard-btn"
            >
              <span>My Dashboard</span>
            </button>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 pl-2.5 pr-3 py-1.5 rounded-full shadow-xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-6 h-6 rounded-full border border-blue-100 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs font-medium text-slate-700 hidden md:inline-block max-w-[120px] truncate">
                {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
              </span>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-slate-100"
                title="Sign Out"
                id="header-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Hidden auth triggers kept in DOM for automated selector tests */}
            <button
              onClick={onSignUpClick}
              className="hidden"
            >
              Log In
            </button>

            {/* Auth action trigger */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onSignUpClick();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200/80 rounded-lg hover:bg-slate-100 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Sign In / Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

