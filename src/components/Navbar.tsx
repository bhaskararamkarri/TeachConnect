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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-primary-800 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        <span>Fall Semester Curriculum Refresh: Explore over 10,000+ teacher-created lesson plans & interactive Easel activities.</span>
        <Link href="/search?price=free" className="underline font-semibold hover:text-yellow-200 ml-1">
          Explore Freebies
        </Link>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 flex items-center">
                Teach<span className="text-primary-600">Connect</span>
              </span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-wide -mt-1 uppercase">
                Educator Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fractions, decodable readers, science labs, CCSS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-full transition shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Layers className="w-4 h-4 text-gray-500" />
              <span>Browse Catalog</span>
            </Link>

            <Link
              href="/library"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span>My Purchases</span>
            </Link>

            <Link
              href="/seller/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Seller Portal</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600 rounded-full hover:bg-gray-100 transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="py-2.5 md:hidden border-t border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search curriculum, printables, standards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-gray-50 border border-gray-300 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white text-[11px] font-semibold rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
