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
  RefreshCw,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  // Fetch library items for the primary teacher account
  const items = await prisma.libraryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Digital Assets Vault</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">My Purchased Library</h1>
          <p className="text-xs text-gray-500 mt-1">
            Lifetime access to your acquired teaching files, lesson plans, and updates
          </p>
        </div>

        <Link
          href="/search"
          className="self-start sm:self-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          + Find More Resources
        </Link>
      </div>

      {/* Library Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No curriculum in your library yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Browse teacher-created lesson plans, printables, and assessments to start filling your classroom library.
          </p>
          <Link
            href="/search"
            className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:border-primary-300 transition"
            >
              <div className="flex gap-4">
                <img
                  src={item.coverImageUrl}
                  alt={item.productTitle}
                  className="w-24 h-24 rounded-2xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100 shadow-2xs"
                />

                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-1.5">
                    {item.licenseType === "SCHOOL_SEAT" ? (
                      <>
                        <School className="w-3 h-3 text-blue-600" /> School Multi-Seat
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3 text-emerald-600" /> Classroom License
                      </>
                    )}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                    {item.productTitle}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    By <span className="font-medium text-gray-700">{item.sellerStoreName}</span>
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{item.downloadCount} downloads</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
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
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
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
