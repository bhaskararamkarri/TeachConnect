import React from "react";
import Link from "next/link";
import { searchProducts, SearchParams } from "@/lib/search";
import { ProductCard } from "@/components/ProductCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Layers, AlertCircle, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const products = await searchProducts(resolvedParams);

  const queryTitle = resolvedParams.q
    ? `Results for "${resolvedParams.q}"`
    : resolvedParams.subject && resolvedParams.subject !== "all"
    ? `${resolvedParams.subject} Resources`
    : resolvedParams.grade && resolvedParams.grade !== "all"
    ? `${resolvedParams.grade} Curriculum`
    : "All Teaching Resources";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Curriculum Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{queryTitle}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing <span className="font-bold text-gray-900">{products.length}</span> verified educator-created resources
          </p>
        </div>

        {/* Sort Links */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
          <span className="text-xs text-gray-400 pl-2 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          {[
            { label: "Popular", value: "popular" },
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
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  isSelected
                    ? "bg-primary-50 text-primary-800 font-bold"
                    : "text-gray-600 hover:text-gray-900"
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
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No resources found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn't find any resources matching your selected filters. Try broadening your keywords or clearing selected filters.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition"
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
