import React from "react";
import Link from "next/link";
import { searchProducts, SearchParams } from "@/lib/search";
import { ProductCard } from "@/components/ProductCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Layers, AlertCircle, ArrowUpDown, Scroll } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const products = await searchProducts(resolvedParams);

  const queryTitle = resolvedParams.q
    ? `Manuscript Search: "${resolvedParams.q}"`
    : resolvedParams.subject && resolvedParams.subject !== "all"
    ? `${resolvedParams.subject} Scholastic Folios`
    : resolvedParams.grade && resolvedParams.grade !== "all"
    ? `${resolvedParams.grade} Curriculum Archive`
    : "Complete Scholastic Catalog";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF7EE] min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#F1E8C7] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#4F5B32] uppercase tracking-wider mb-1.5">
            <Scroll className="w-4 h-4 text-[#A38345]" />
            <span>Scholastic Archive Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#28291F]">{queryTitle}</h1>
          <p className="text-xs sm:text-sm font-serif text-[#555745] mt-1">
            Displaying <span className="font-bold text-[#28291F]">{products.length}</span> peer-reviewed educator manuscripts
          </p>
        </div>

        {/* Sort Links */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#FAF7EE] border border-[#A38345]/30 rounded-2xl p-1.5 shadow-2xs">
          <span className="text-xs font-serif text-[#555745] pl-2.5 font-semibold flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#A38345]" /> Sort:
          </span>
          {[
            { label: "Acclaimed", value: "popular" },
            { label: "Rating", value: "rating" },
            { label: "Price: Low", value: "price-low" },
          ].map((s) => {
            const isSelected = (resolvedParams.sort || "popular") === s.value;
            const params = new URLSearchParams();
            if (resolvedParams.q) params.set("q", resolvedParams.q);
            if (resolvedParams.grade) params.set("grade", resolvedParams.grade);
            if (resolvedParams.subject) params.set("subject", resolvedParams.subject);
            if (resolvedParams.price) params.set("price", resolvedParams.price);
            if (resolvedParams.format) params.set("format", resolvedParams.format);
            params.set("sort", s.value);

            return (
              <Link
                key={s.value}
                href={`/search?${params.toString()}`}
                className={`text-xs px-3 py-1.5 rounded-xl font-serif font-semibold transition ${
                  isSelected
                    ? "bg-[#E4E8D2] text-[#3B4425] border border-[#9CA763] shadow-2xs"
                    : "text-[#555745] hover:text-[#28291F] hover:bg-[#F1E8C7]"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Facet Filters */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* Right Column: Products Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#F1E8C7] text-[#4F5B32] flex items-center justify-center mx-auto mb-4 border border-[#A38345]/40 shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#28291F]">No manuscripts found in archive</h3>
              <p className="text-xs font-serif text-[#555745] mt-1 max-w-sm mx-auto leading-relaxed">
                We couldn't locate any folios matching your selected filters. Try broadening your keywords or resetting filters.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex px-5 py-2.5 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold transition border border-[#A38345]/30 shadow-md"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </div>
    </div>
  );
}
