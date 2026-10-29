import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WatermarkPreviewModal } from "@/components/WatermarkPreviewModal";
import { ProductPurchaseCard } from "@/components/ProductPurchaseCard";
import {
  Star,
  ShieldCheck,
  Download,
  FileCheck2,
  Bookmark,
  ChevronRight,
  Share2,
  Heart,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      seller: true,
      files: true,
      previews: {
        orderBy: { sortOrder: "asc" },
      },
      reviews: {
        orderBy: { helpfulVotes: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const gradeLevels: string[] = JSON.parse(product.gradeLevels);
  const subjects: string[] = JSON.parse(product.subjects);
  const resourceTypes: string[] = JSON.parse(product.resourceTypes);
  const standards: string[] = product.standardsAlignment ? JSON.parse(product.standardsAlignment) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/search?subject=${encodeURIComponent(subjects[0] || "")}`} className="hover:text-primary-600 transition">
          {subjects[0] || "Resources"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/search?grade=${encodeURIComponent(gradeLevels[0] || "")}`} className="hover:text-primary-600 transition">
          {gradeLevels[0] || "Grades"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Media, Description, Standards, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Main Cover & Preview Action */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <div className="relative aspect-[16/10] max-h-[460px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={product.coverImageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Interactive Preview Trigger */}
            <WatermarkPreviewModal
              previews={product.previews}
              title={product.title}
            />
          </div>

          {/* Product Header Information */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {gradeLevels.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 bg-primary-50 text-primary-800 rounded-lg"
                  >
                    {g}
                  </span>
                ))}
                {subjects.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
                {resourceTypes.map((r, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Author & Review Line */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <Link
                  href={`/search?seller=${encodeURIComponent(product.seller.storeName)}`}
                  className="text-sm font-semibold text-primary-700 hover:text-primary-800"
                >
                  By {product.seller.storeName}
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  </div>
                  <span className="text-gray-900">{product.ratingAverage.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({product.ratingCount} teacher ratings)</span>
                </div>

                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-800">{product.totalDownloads}</span> educators downloaded
                </div>
              </div>
            </div>

            {/* Standards Alignment Tags */}
            {standards.length > 0 && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Educational Standards Alignment
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {standards.map((code, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200 shadow-2xs"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Description */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900">About this Resource</h3>
              <div className="prose prose-sm text-gray-700 leading-relaxed max-w-none">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Included Files Inventory */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Files Included in this Download</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{file.fileName}</p>
                        <p className="text-[10px] text-gray-400">
                          {(file.fileSize / 1024 / 1024).toFixed(1)} MB • {file.mimeType}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {file.fileType.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Educator Feedback</h3>
                <p className="text-xs text-gray-500">Verified teacher purchases & classroom experiences</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-gray-900">{product.ratingAverage.toFixed(1)}</div>
                <div className="text-xs text-amber-500 font-bold">
                  <div>★★★★★</div>
                  <span className="text-gray-400 font-normal">Based on {product.ratingCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                    <span className="text-xs text-amber-500">{"★".repeat(rev.rating)}</span>
                  </div>
                  {rev.gradeTaught && (
                    <span className="inline-block text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      Taught {rev.gradeTaught}
                    </span>
                  )}
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Sticky Purchase Card */}
        <div className="lg:col-span-1">
          <ProductPurchaseCard
            productId={product.id}
            title={product.title}
            slug={product.slug}
            coverImageUrl={product.coverImageUrl}
            priceCents={product.priceCents}
            isFree={product.isFree}
            pageCount={product.pageCount}
            fileFormats={product.fileFormats}
            isEaselReady={product.isEaselReady}
            sellerStoreName={product.seller.storeName}
            sellerRating={product.seller.ratingAverage}
            sellerRatingCount={product.seller.ratingCount}
            sellerAvatarUrl={product.seller.avatarUrl}
          />
        </div>
      </div>
    </div>
  );
}
