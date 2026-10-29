"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import {
  Search,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Layers,
  Scroll,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { totalCount, setIsDrawerOpen } = useCart();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#F1E8C7] shadow-xs">
      {/* Top Banner - Scholastic Warm Antiquity */}
      <div className="bg-[#4F5B32] text-[#FAF7EE] text-xs py-2 px-4 text-center font-serif tracking-wide flex items-center justify-center gap-2 border-b border-[#3B4425]">
        <Scroll className="w-3.5 h-3.5 text-[#A38345]" />
        <span>Fall Semester Curriculum Archives: Explore over 10,000+ teacher-curated lesson folios & interactive Easel manuscripts.</span>
        <Link href="/search?price=free" className="underline font-bold text-[#F1E8C7] hover:text-white ml-1">
          View Free Folios
        </Link>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo - Classic Academy Crest Style */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-12 h-12 rounded-xl bg-[#4F5B32] border border-[#A38345]/40 flex items-center justify-center text-[#FAF7EE] shadow-sm group-hover:bg-[#3B4425] transition-all">
              <GraduationCap className="w-7 h-7 text-[#F1E8C7]" />
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-[#28291F] flex items-center">
                Teach<span className="text-[#4F5B32] italic font-normal">Connect</span>
              </span>
              <span className="block text-[11px] text-[#A38345] font-serif tracking-widest uppercase font-semibold -mt-1">
                Scholastic Archive & Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar - Antiqued Parchment Input */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fractions, decodable manuscripts, science codices, CCSS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-[#F1E8C7]/50 border-2 border-[#A38345]/40 rounded-xl text-sm font-serif text-[#28291F] placeholder-[#555745]/70 focus:outline-none focus:ring-2 focus:ring-[#4F5B32] focus:bg-[#FAF7EE] transition shadow-inner"
              />
              <Search className="w-4 h-4 text-[#A38345] absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] text-xs font-serif font-bold rounded-lg transition shadow-sm border border-[#A38345]/30"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden lg:flex items-center gap-1.5 text-xs font-serif font-semibold text-[#28291F] hover:text-[#4F5B32] px-3 py-2 rounded-lg hover:bg-[#F1E8C7]/60 transition"
            >
              <Layers className="w-4 h-4 text-[#A38345]" />
              <span>Catalog</span>
            </Link>

            <Link
              href="/library"
              className="flex items-center gap-1.5 text-xs font-serif font-semibold text-[#28291F] hover:text-[#4F5B32] px-3 py-2 rounded-lg hover:bg-[#F1E8C7]/60 transition"
            >
              <BookOpen className="w-4 h-4 text-[#A38345]" />
              <span>Library Vault</span>
            </Link>

            <Link
              href="/seller/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-serif font-semibold text-[#4F5B32] bg-[#E4E8D2] hover:bg-[#c8d0a7] border border-[#9CA763] px-3.5 py-2 rounded-lg transition shadow-2xs"
            >
              <LayoutDashboard className="w-4 h-4 text-[#4F5B32]" />
              <span>Author Desk</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 text-[#28291F] hover:text-[#4F5B32] rounded-xl hover:bg-[#F1E8C7] border border-[#A38345]/30 transition bg-[#FAF7EE] shadow-2xs"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#4F5B32]" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#4F5B32] text-[#FAF7EE] text-[11px] font-serif font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7EE] shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="py-2.5 md:hidden border-t border-[#F1E8C7]">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search curriculum, printables..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2.5 bg-[#F1E8C7]/50 border border-[#A38345]/40 rounded-xl text-xs font-serif text-[#28291F] placeholder-[#555745]/70 focus:outline-none focus:ring-2 focus:ring-[#4F5B32]"
            />
            <Search className="w-3.5 h-3.5 text-[#A38345] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#4F5B32] text-[#FAF7EE] text-[11px] font-serif font-semibold rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
