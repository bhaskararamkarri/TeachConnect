import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReviewModal } from "@/components/ReviewModal";
import {
  BookOpen,
  Download,
  Calendar,
  School,
  UserCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Scroll,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const items = await prisma.libraryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF7EE] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F1E8C7] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#4F5B32] uppercase tracking-wider mb-1.5">
            <Scroll className="w-4 h-4 text-[#A38345]" />
            <span>Personal Scholastic Archive Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#28291F]">My Library Vault</h1>
          <p className="text-xs font-serif text-[#555745] mt-1">
            Lifetime access to your acquired teacher manuscripts, folios, and curriculum updates
          </p>
        </div>

        <Link
          href="/search"
          className="self-start sm:self-auto px-5 py-2.5 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold shadow-sm transition border border-[#A38345]/30"
        >
          + Discover More Manuscripts
        </Link>
      </div>

      {/* Library Grid */}
      {items.length === 0 ? (
        <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-[#F1E8C7] rounded-2xl flex items-center justify-center mx-auto text-[#4F5B32] border border-[#A38345]/40 shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#28291F]">Your library vault is currently empty</h3>
          <p className="text-xs font-serif text-[#555745] max-w-sm mx-auto leading-relaxed">
            Browse teacher-created lesson plans, printables, and assessments to start populating your permanent archive.
          </p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-[#4F5B32] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold hover:bg-[#3B4425] transition border border-[#A38345]/30 shadow-md"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-6 flex flex-col justify-between shadow-xs hover:border-[#4F5B32] hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <img
                  src={item.coverImageUrl}
                  alt={item.productTitle}
                  className="w-24 h-24 rounded-2xl object-cover bg-[#F1E8C7] flex-shrink-0 border-2 border-[#9CA763] shadow-2xs"
                />

                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-serif font-bold text-[#3B4425] bg-[#E4E8D2] px-2.5 py-1 rounded-lg mb-2 border border-[#9CA763]">
                    {item.licenseType === "SCHOOL_SEAT" ? (
                      <>
                        <School className="w-3 h-3 text-[#A38345]" /> School Department License
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3 text-[#4F5B32]" /> Classroom License
                      </>
                    )}
                  </span>

                  <h3 className="text-sm font-serif font-bold text-[#28291F] line-clamp-2 leading-snug">
                    {item.productTitle}
                  </h3>

                  <p className="text-xs font-serif text-[#555745] mt-1">
                    By <span className="font-semibold text-[#28291F]">{item.sellerStoreName}</span>
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-serif text-[#555745] mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#A38345]" />
                      Acquired {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{item.downloadCount} downloads</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-6 border-t border-[#F1E8C7] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="p-2 text-[#555745] hover:text-[#28291F] rounded-xl hover:bg-[#F1E8C7] transition border border-[#A38345]/20"
                    title="View Product Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <ReviewModal
                    productId={item.productId}
                    productTitle={item.productTitle}
                  />
                </div>

                <a
                  href={`/api/download/${item.downloadToken}`}
                  download
                  className="px-4 py-2 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold flex items-center gap-2 shadow-sm transition border border-[#A38345]/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Files</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
