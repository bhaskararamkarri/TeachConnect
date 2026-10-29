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
  Scroll,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF7EE] min-h-screen">
      {/* Breadcrumb Navigation - Classic Scholastic Journal Style */}
      <nav className="flex items-center gap-2 text-xs font-serif text-[#555745] mb-8 flex-wrap border-b border-[#F1E8C7] pb-3">
        <Link href="/" className="hover:text-[#4F5B32] transition font-semibold">
          Scholastic Archive
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A38345]" />
        <Link href={`/search?subject=${encodeURIComponent(subjects[0] || "")}`} className="hover:text-[#4F5B32] transition">
          {subjects[0] || "Curriculum"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A38345]" />
        <Link href={`/search?grade=${encodeURIComponent(gradeLevels[0] || "")}`} className="hover:text-[#4F5B32] transition">
          {gradeLevels[0] || "Grade Band"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A38345]" />
        <span className="text-[#28291F] font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Media, Description, Standards, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Main Cover & Preview Action */}
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-6 shadow-sm">
            <div className="relative aspect-[16/10] max-h-[460px] rounded-2xl overflow-hidden bg-[#F1E8C7] flex items-center justify-center border border-[#A38345]/20">
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
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-8 shadow-sm space-y-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {gradeLevels.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs font-serif font-bold px-3 py-1 bg-[#F1E8C7] text-[#28291F] rounded-xl border border-[#A38345]/30"
                  >
                    {g}
                  </span>
                ))}
                {subjects.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs font-serif font-bold px-3 py-1 bg-[#E4E8D2] text-[#3B4425] rounded-xl border border-[#9CA763]"
                  >
                    {s}
                  </span>
                ))}
                {resourceTypes.map((r, i) => (
                  <span
                    key={i}
                    className="text-xs font-serif font-medium px-3 py-1 bg-[#F1E8C7]/60 text-[#555745] rounded-xl border border-[#A38345]/20"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#28291F] leading-snug">
                {product.title}
              </h1>

              {/* Author & Review Line */}
              <div className="flex items-center gap-4 mt-4 flex-wrap pt-4 border-t border-[#F1E8C7]">
                <Link
                  href={`/search?seller=${encodeURIComponent(product.seller.storeName)}`}
                  className="text-sm font-serif font-bold text-[#4F5B32] hover:text-[#3B4425] underline decoration-[#A38345]/50"
                >
                  By {product.seller.storeName}
                </Link>

                <div className="flex items-center gap-1.5 text-xs font-serif text-[#A38345] font-bold">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-[#A38345] stroke-[#A38345]" />
                  </div>
                  <span className="text-[#28291F]">{product.ratingAverage.toFixed(1)}</span>
                  <span className="text-[#555745] font-normal">({product.ratingCount} educator reviews)</span>
                </div>

                <div className="text-xs font-serif text-[#555745]">
                  <span className="font-bold text-[#28291F]">{product.totalDownloads}</span> scholars acquired
                </div>
              </div>
            </div>

            {/* Standards Alignment Tags */}
            {standards.length > 0 && (
              <div className="p-5 bg-[#E4E8D2]/40 rounded-2xl border border-[#9CA763]/60 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-[#4F5B32]" />
                  <h3 className="text-xs font-serif font-bold text-[#28291F] uppercase tracking-wider">
                    Educational Standards Alignment & Provenance
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {standards.map((code, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FAF7EE] text-[#3B4425] font-mono text-xs font-bold rounded-xl border border-[#9CA763] shadow-2xs"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Description */}
            <div className="space-y-4 pt-4 border-t border-[#F1E8C7]">
              <h3 className="text-lg font-serif font-bold text-[#28291F]">Curriculum Synopsis & Overview</h3>
              <div className="prose prose-sm font-serif text-[#555745] leading-relaxed max-w-none space-y-3">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Included Files Inventory */}
            <div className="space-y-4 pt-6 border-t border-[#F1E8C7]">
              <h3 className="text-lg font-serif font-bold text-[#28291F]">Manuscripts & Files Included in Folio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {product.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-[#F1E8C7]/50 rounded-2xl border border-[#A38345]/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="w-4 h-4 text-[#4F5B32] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-serif font-bold text-[#28291F] truncate">{file.fileName}</p>
                        <p className="text-[10px] font-serif text-[#555745]">
                          {(file.fileSize / 1024 / 1024).toFixed(1)} MB • {file.mimeType}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-serif font-bold text-[#3B4425] bg-[#E4E8D2] px-2.5 py-1 rounded-lg border border-[#9CA763]">
                      {file.fileType.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#28291F]">Educator Classroom Feedback</h3>
                <p className="text-xs font-serif text-[#555745]">Verified teacher purchases and classroom trials</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-2xl font-serif font-black text-[#28291F]">{product.ratingAverage.toFixed(1)}</div>
                <div className="text-xs font-serif text-[#A38345] font-bold">
                  <div>★★★★★</div>
                  <span className="text-[#555745] font-normal">Based on {product.ratingCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-4 border-t border-[#F1E8C7]">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-[#F1E8C7]/40 rounded-2xl border border-[#A38345]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#28291F]">{rev.userName}</span>
                    <span className="text-xs text-[#A38345]">{"★".repeat(rev.rating)}</span>
                  </div>
                  {rev.gradeTaught && (
                    <span className="inline-block text-[10px] font-serif font-semibold text-[#3B4425] bg-[#E4E8D2] px-2.5 py-0.5 rounded-md border border-[#9CA763]">
                      Taught {rev.gradeTaught}
                    </span>
                  )}
                  <p className="text-xs font-serif text-[#555745] leading-relaxed">{rev.comment}</p>
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
