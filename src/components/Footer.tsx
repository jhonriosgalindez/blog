import { type ReactNode } from "react";

interface FooterProps {
  totalPosts: number;
}

export default function Footer({ totalPosts }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-500 py-12 px-4 md:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand credit */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded bg-blue-50 border border-blue-100 text-blue-600 font-semibold shadow-xs">
            <span className="text-sm font-bold font-display">H</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-800 font-display">Horizone</span>
        </div>

        {/* Copyright notice */}
        <div className="text-xs font-light">
          &copy; {currentYear} Horizone Travel Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
