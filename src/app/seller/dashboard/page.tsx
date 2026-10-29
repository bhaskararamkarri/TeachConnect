import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Star,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const seller = await prisma.sellerProfile.findFirst({
    where: { storeSlug: "mathcraft-studios" },
    include: {
      products: {
        include: {
          reviews: true,
          files: true,
        },
        orderBy: { totalDownloads: "desc" },
      },
      payouts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) return null;

  // Recent order items for this seller's products
  const productIds = seller.products.map((p) => p.id);
  const recentOrders = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    include: {
      order: { include: { user: true } },
      product: true,
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Net Royalties</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{formatPrice(seller.totalEarningsCents)}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 77.5% Take Rate (Exclusive Creator)
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Curricula Sold</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{seller.totalSales.toLocaleString()} downloads</p>
          <p className="text-[11px] text-blue-700 font-semibold mt-1">Classroom & School licenses</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Store Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-black text-gray-900">{seller.ratingAverage.toFixed(2)}</p>
            <span className="text-xs text-amber-500 font-bold">★★★★★</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Based on {seller.ratingCount} teacher reviews</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{seller.products.length} units published</p>
          <Link
            href="/seller/products/new"
            className="text-[11px] text-primary-700 font-semibold mt-1 inline-flex items-center gap-0.5 hover:underline"
          >
            <span>+ Add new curriculum</span>
          </Link>
        </div>
      </div>

      {/* Published Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Published Curriculum Units</h2>
            <p className="text-xs text-gray-500">Live resources actively listed in the TeachConnect catalog</p>
          </div>

          <Link
            href="/seller/products/new"
            className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition"
          >
            + Upload Product
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Product Title</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Formats</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {seller.products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.coverImageUrl}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-sm">
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-bold text-gray-900 hover:text-primary-600 line-clamp-1 transition"
                        >
                          {product.title}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {product.pageCount} pages • {product.files.length} download files
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {formatPrice(product.priceCents)}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">
                    {product.totalDownloads}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-gray-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{product.ratingAverage.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">({product.ratingCount})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {product.fileFormats}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View Live →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sales Activity */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Customer Purchases</h3>
            <span className="text-xs text-gray-500">Live order stream</span>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ro) => (
              <div
                key={ro.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/40 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-gray-900">{ro.product.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Purchased by {ro.order.user.name} ({ro.order.user.email}) • {new Date(ro.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm">
                    +{formatPrice(ro.sellerShareCents)}
                  </span>
                  <p className="text-[10px] text-gray-400">Your 77.5% royalty</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
