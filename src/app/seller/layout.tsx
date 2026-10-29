import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  LayoutDashboard,
  Upload,
  DollarSign,
  Store,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seller = await prisma.sellerProfile.findFirst({
    where: { storeSlug: "mathcraft-studios" },
  });

  return (
    <div className="bg-gray-50/60 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Seller Store Banner Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={seller?.avatarUrl || "https://placehold.co/150"}
              alt="Store Avatar"
              className="w-16 h-16 rounded-2xl object-cover border border-primary-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">{seller?.storeName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  <span>Exclusive Tier (77.5% Royalty)</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{seller?.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/search?seller=${encodeURIComponent(seller?.storeName || "")}`}
              className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              <Store className="w-4 h-4 text-gray-500" />
              <span>View Public Store</span>
            </Link>

            <Link
              href="/seller/products/new"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Product</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
          <Link
            href="/seller/dashboard"
            className="px-4 py-2 text-xs font-bold text-gray-900 border-b-2 border-primary-600 flex items-center gap-2 whitespace-nowrap"
          >
            <LayoutDashboard className="w-4 h-4 text-primary-600" />
            <span>Store Metrics & Sales</span>
          </Link>
          <Link
            href="/seller/products/new"
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-2 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>Product Ingestion Wizard</span>
          </Link>
          <Link
            href="/seller/payouts"
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-2 whitespace-nowrap"
          >
            <DollarSign className="w-4 h-4" />
            <span>Stripe Payouts & Tiers</span>
          </Link>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

