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
  Scroll,
  Feather,
  BookMarked,
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
    <div className="space-y-20 pb-24 bg-[#FAF7EE]">
      {/* Hero Section - Classic Scholastic Antiquity */}
      <section className="relative bg-gradient-to-b from-[#F1E8C7]/60 via-[#FAF7EE] to-[#FAF7EE] pt-20 pb-24 border-b border-[#F1E8C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4E8D2] text-[#3B4425] text-xs font-serif font-bold mb-6 border border-[#9CA763]/60 shadow-2xs">
            <Scroll className="w-4 h-4 text-[#A38345]" />
            <span>Curated by Master Educators & Scholastic Fellows</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-[#28291F] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Timeless teaching manuscripts for every{" "}
            <span className="text-[#4F5B32] italic font-normal underline decoration-[#A38345] decoration-wavy">
              grade, subject & standard
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg font-serif text-[#555745] max-w-2xl mx-auto leading-relaxed">
            Spend less time planning on Sunday nights. Access peer-reviewed unit folios, decodable manuscripts, science codices, and interactive Easel scholarship.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form action="/search" method="GET" className="relative flex items-center shadow-lg rounded-2xl">
              <input
                type="text"
                name="q"
                placeholder="Search by topic, manuscript keyword, or standard (e.g. 5.NF.A.1)..."
                className="w-full pl-12 pr-36 py-4.5 rounded-2xl border-2 border-[#A38345]/50 text-sm sm:text-base font-serif text-[#28291F] placeholder-[#555745]/70 focus:outline-none focus:border-[#4F5B32] focus:ring-4 focus:ring-[#E4E8D2] transition bg-[#FAF7EE]"
              />
              <Search className="w-5 h-5 text-[#A38345] absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 px-7 py-3 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] font-serif font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-md border border-[#A38345]/40"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-serif text-[#555745]">
              <span className="font-bold text-[#28291F]">Scholarship trends:</span>
              <Link href="/search?q=Fractions" className="px-3 py-1 bg-[#F1E8C7]/70 border border-[#A38345]/30 rounded-lg hover:border-[#4F5B32] hover:text-[#4F5B32] transition">
                Fractions Folio
              </Link>
              <Link href="/search?q=Phonics" className="px-3 py-1 bg-[#F1E8C7]/70 border border-[#A38345]/30 rounded-lg hover:border-[#4F5B32] hover:text-[#4F5B32] transition">
                CVC Phonics
              </Link>
              <Link href="/search?q=Plate+Tectonics" className="px-3 py-1 bg-[#F1E8C7]/70 border border-[#A38345]/30 rounded-lg hover:border-[#4F5B32] hover:text-[#4F5B32] transition">
                Plate Tectonics
              </Link>
              <Link href="/search?price=free" className="px-3 py-1 bg-[#E4E8D2] text-[#3B4425] border border-[#9CA763] rounded-lg font-bold hover:bg-[#c8d0a7] transition">
                Complimentary
              </Link>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="mt-16 pt-10 border-t border-[#F1E8C7] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F1E8C7]/40 border border-[#A38345]/20">
              <div className="w-10 h-10 rounded-xl bg-[#9CA763]/30 text-[#3B4425] flex items-center justify-center flex-shrink-0 border border-[#9CA763]">
                <CheckCircle2 className="w-5 h-5 text-[#4F5B32]" />
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#28291F]">100% Educator Peer-Reviewed</p>
                <p className="text-[11px] font-serif text-[#555745]">Crafted by classroom masters</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F1E8C7]/40 border border-[#A38345]/20">
              <div className="w-10 h-10 rounded-xl bg-[#A38345]/20 text-[#6e552d] flex items-center justify-center flex-shrink-0 border border-[#A38345]/40">
                <Layers className="w-5 h-5 text-[#A38345]" />
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#28291F]">CCSS & State Mapped</p>
                <p className="text-[11px] font-serif text-[#555745]">Aligned with learning standards</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F1E8C7]/40 border border-[#A38345]/20">
              <div className="w-10 h-10 rounded-xl bg-[#9CA763]/30 text-[#3B4425] flex items-center justify-center flex-shrink-0 border border-[#9CA763]">
                <Sparkles className="w-5 h-5 text-[#4F5B32]" />
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#28291F]">Easel Digital Manuscript</p>
                <p className="text-[11px] font-serif text-[#555745]">Ready for 1:1 student devices</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F1E8C7]/40 border border-[#A38345]/20">
              <div className="w-10 h-10 rounded-xl bg-[#A38345]/20 text-[#6e552d] flex items-center justify-center flex-shrink-0 border border-[#A38345]/40">
                <Award className="w-5 h-5 text-[#A38345]" />
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#28291F]">Instant Vault Access</p>
                <p className="text-[11px] font-serif text-[#555745]">Lifetime library archiving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Level Categories - Scholastic Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#F1E8C7] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-black text-[#28291F]">Browse by Scholastic Grade Band</h2>
            <p className="text-xs font-serif text-[#555745]">Targeted curriculum designed for developmental milestones</p>
          </div>
          <Link href="/search" className="text-xs font-serif font-bold text-[#4F5B32] hover:text-[#3B4425] flex items-center gap-1">
            <span>View Complete Index</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {[
            { name: "Pre-K & Kindergarten", grade: "Kindergarten", count: "1,240 manuscripts" },
            { name: "1st - 2nd Grade", grade: "1st Grade", count: "2,150 manuscripts" },
            { name: "3rd - 5th Grade", grade: "5th Grade", count: "3,890 manuscripts" },
            { name: "Middle School (6-8)", grade: "6th Grade", count: "1,980 manuscripts" },
            { name: "High School (9-12)", grade: "High School", count: "1,450 manuscripts" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/search?grade=${encodeURIComponent(item.grade)}`}
              className="group p-6 bg-[#F1E8C7]/50 border border-[#A38345]/30 rounded-2xl hover:border-[#4F5B32] hover:bg-[#F1E8C7] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#4F5B32] text-[#FAF7EE] flex items-center justify-center font-serif font-bold text-base shadow-xs mb-4 group-hover:scale-105 transition-transform border border-[#A38345]/40">
                  {idx + 1}
                </div>
                <h3 className="font-serif font-bold text-[#28291F] text-sm group-hover:text-[#4F5B32] transition-colors">
                  {item.name}
                </h3>
              </div>
              <p className="text-[11px] font-serif text-[#555745] mt-5">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#F1E8C7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4F5B32]" />
              <h2 className="text-2xl font-serif font-black text-[#28291F]">Acclaimed Teacher Masterpieces</h2>
            </div>
            <p className="text-xs font-serif text-[#555745]">Most acquired peer-reviewed folios and printables this term</p>
          </div>
          <Link
            href="/search"
            className="text-xs font-serif font-bold text-[#4F5B32] hover:text-[#3B4425] flex items-center gap-1"
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

      {/* Featured Teacher-Authors - Academic Scholars */}
      <section className="bg-[#F1E8C7]/50 border-y border-[#F1E8C7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-serif font-black text-[#28291F]">Distinguished Educator-Scholars</h2>
            <p className="text-xs font-serif text-[#555745] mt-2">
              Follow peer-recognized author-teachers crafting exceptional curriculum for classrooms nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={seller.avatarUrl || "https://placehold.co/150"}
                      alt={seller.storeName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#9CA763]"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-[#28291F] text-base">{seller.storeName}</h3>
                      <p className="text-xs font-serif text-[#4F5B32] font-bold">{seller.tier} Scholar</p>
                      <div className="flex items-center gap-1 text-xs text-[#A38345] font-bold mt-0.5">
                        <span>★ {seller.ratingAverage.toFixed(1)}</span>
                        <span className="text-[#555745] font-normal">({seller.ratingCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-serif text-[#555745] line-clamp-2 leading-relaxed">
                    {seller.tagline || seller.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F1E8C7] flex items-center justify-between">
                  <span className="text-xs font-serif text-[#555745]">{seller.totalSales} scholarship sales</span>
                  <Link
                    href={`/search?seller=${encodeURIComponent(seller.storeName)}`}
                    className="text-xs font-serif font-bold text-[#4F5B32] hover:text-[#3B4425]"
                  >
                    View Folios →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Easel Banner - Classic Editorial Scholarly Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4F5B32] rounded-3xl p-8 sm:p-12 text-[#FAF7EE] relative overflow-hidden shadow-xl border border-[#A38345]/40">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3.5 py-1 bg-[#3B4425] text-[#F1E8C7] border border-[#9CA763]/40 rounded-lg text-xs font-serif font-semibold uppercase tracking-wider">
              Easel Interactive Manuscript Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black mt-4 leading-tight">
              Transform any printable worksheet into an interactive digital assignment
            </h2>
            <p className="text-[#E4E8D2] text-sm sm:text-base font-serif mt-3 leading-relaxed">
              Assign interactive lessons directly to Google Classroom. Students type responses into pre-configured manuscript boxes, manipulate archival pieces, and receive real-time scholastic feedback.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/search?format=Easel"
                className="px-6 py-3 bg-[#FAF7EE] text-[#28291F] font-serif font-bold rounded-xl text-sm hover:bg-[#F1E8C7] transition shadow-sm border border-[#A38345]/30"
              >
                Browse Easel Ready Manuscripts
              </Link>
              <Link
                href="/seller/dashboard"
                className="px-6 py-3 bg-[#3B4425] hover:bg-[#2d351c] text-[#FAF7EE] font-serif font-bold rounded-xl text-sm border border-[#9CA763]/50 transition"
              >
                Learn Scholar Publishing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
