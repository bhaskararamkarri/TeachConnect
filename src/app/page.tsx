import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: {
      seller: true,
    },
    take: 8,
    orderBy: {
      totalDownloads: "desc",
    },
  });

  const sellers = await prisma.sellerProfile.findMany({
    take: 3,
    orderBy: {
      totalSales: "desc",
    },
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50/80 via-white to-background pt-16 pb-20 border-b border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold mb-6 border border-primary-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-primary-700" />
            <span>Built by Educators, for Educators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Original teaching resources for every{" "}
            <span className="text-primary-600 underline decoration-primary-300 decoration-wavy">
              grade, subject & standard
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Spend less time planning on Sunday nights. Download peer-reviewed unit plans, decodable readers, science labs, and interactive digital assignments.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form action="/search" method="GET" className="relative flex items-center shadow-lg rounded-full">
              <input
                type="text"
                name="q"
                placeholder="Search by topic, keyword, or standard (e.g. 5.NF.A.1)..."
                className="w-full pl-6 pr-32 py-4 rounded-full border-2 border-primary-200 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full text-sm flex items-center gap-2 transition shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Trending searches:</span>
              <Link href="/search?q=Fractions" className="px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-700 transition">
                Fractions
              </Link>
              <Link href="/search?q=Phonics" className="px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-700 transition">
                CVC Phonics
              </Link>
              <Link href="/search?q=Plate+Tectonics" className="px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-700 transition">
                Plate Tectonics
              </Link>
              <Link href="/search?price=free" className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold hover:bg-emerald-100 transition">
                Freebies
              </Link>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="mt-14 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">100% Educator Verified</p>
                <p className="text-xs text-gray-500">Crafted by classroom teachers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">CCSS & State Aligned</p>
                <p className="text-xs text-gray-500">Mapped to learning standards</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Easel Digital Ready</p>
                <p className="text-xs text-gray-500">1:1 Device & Google Classroom</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Instant Download</p>
                <p className="text-xs text-gray-500">Lifetime access & updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Level Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Browse by Grade Band</h2>
            <p className="text-sm text-gray-500">Targeted curriculum designed for specific developmental milestones</p>
          </div>
          <Link href="/search" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "Pre-K & Kindergarten", grade: "Kindergarten", color: "from-pink-500 to-rose-400", count: "1,240 items" },
            { name: "1st - 2nd Grade", grade: "1st Grade", color: "from-amber-500 to-orange-400", count: "2,150 items" },
            { name: "3rd - 5th Grade", grade: "5th Grade", color: "from-emerald-500 to-teal-400", count: "3,890 items" },
            { name: "Middle School (6-8)", grade: "6th Grade", color: "from-blue-500 to-indigo-400", count: "1,980 items" },
            { name: "High School (9-12)", grade: "High School", color: "from-purple-500 to-violet-400", count: "1,450 items" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/search?grade=${encodeURIComponent(item.grade)}`}
              className="group p-5 bg-white border border-gray-200/90 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-bold text-sm shadow-sm mb-3 group-hover:scale-110 transition-transform`}>
                  {idx + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                  {item.name}
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-4">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-2xl font-black text-gray-900">Trending Teacher Favorites</h2>
            </div>
            <p className="text-sm text-gray-500">Most downloaded units, worksheets, and printables this month</p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              priceCents={product.priceCents}
              isFree={product.isFree}
              coverImageUrl={product.coverImageUrl}
              gradeLevels={JSON.parse(product.gradeLevels)}
              subjects={JSON.parse(product.subjects)}
              isEaselReady={product.isEaselReady}
              ratingAverage={product.ratingAverage}
              ratingCount={product.ratingCount}
              sellerStoreName={product.seller.storeName}
              sellerSlug={product.seller.storeSlug}
            />
          ))}
        </div>
      </section>

      {/* Featured Teacher-Authors */}
      <section className="bg-gray-50/70 border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-black text-gray-900">Top Educator Stores</h2>
            <p className="text-sm text-gray-500 mt-1">
              Follow peer-recognized Teacher-Authors creating innovative curricula for their own classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={seller.avatarUrl || "https://placehold.co/150"}
                      alt={seller.storeName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{seller.storeName}</h3>
                      <p className="text-xs text-primary-700 font-semibold">{seller.tier} Creator</p>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                        <span>★ {seller.ratingAverage.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({seller.ratingCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {seller.tagline || seller.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{seller.totalSales} curriculum sales</span>
                  <Link
                    href={`/search?seller=${encodeURIComponent(seller.storeName)}`}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    View Store →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Easel Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              Easel Interactive Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">
              Turn any printable worksheet into an interactive digital assignment
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base mt-3 leading-relaxed">
              Assign interactive lessons directly to Google Classroom. Students type answers into pre-configured boxes, manipulate moveable objects, and receive real-time feedback on their devices.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/search?format=Easel"
                className="px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl text-sm hover:bg-indigo-50 transition shadow-sm"
              >
                Browse Easel Ready Activities
              </Link>
              <Link
                href="/seller/dashboard"
                className="px-6 py-3 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm border border-indigo-500/40 transition"
              >
                Learn How to Sell
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
