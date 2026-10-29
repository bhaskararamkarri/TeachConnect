import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              files: true,
              seller: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Get user's library items corresponding to this order
  const libraryItems = await prisma.libraryItem.findMany({
    where: {
      userId: order.userId,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Hero Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-emerald-950">
          Order Confirmed! Your Resources are Ready
        </h1>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto">
          Thank you for your order, <span className="font-bold">{order.user.name}</span>. A receipt and download links have been sent to{" "}
          <span className="font-bold underline">{order.user.email}</span>.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-emerald-800 rounded-full text-xs font-mono font-bold border border-emerald-300">
          <Receipt className="w-3.5 h-3.5" />
          <span>Order #{order.orderNumber}</span>
        </div>
      </div>

      {/* Immediate Download Vault Cards */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Download Vault</h2>
            <p className="text-xs text-gray-500">Click below to download un-watermarked curriculum files</p>
          </div>
          <Link
            href="/library"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All in My Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {order.items.map((item) => {
            const libItem = libraryItems.find((l) => l.productId === item.productId);
            const downloadToken = libItem ? libItem.downloadToken : "demo-token";

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.coverImageUrl}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-200"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{item.product.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      By {item.product.seller.storeName} • {item.licenseType === "SCHOOL_SEAT" ? `${item.seatCount} School Seats` : "Classroom License"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.product.files.map((f) => (
                        <span
                          key={f.id}
                          className="text-[10px] font-medium bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-primary-600" />
                          <span>{f.fileName}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`/api/download/${downloadToken}`}
                    download
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Files</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary & Lifetime Access Notice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
          <h4 className="font-bold text-gray-900 text-sm mb-2">Order Information</h4>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid:</span>
            <span className="font-bold text-gray-900">{formatPrice(order.totalAmountCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Lifetime Curriculum Access</span>
          </div>
          <p className="leading-relaxed">
            All resources are stored permanently in your TeachConnect account. Whenever the Teacher-Author updates this unit, you receive the latest files for free.
          </p>
        </div>
      </div>
    </div>
  );
}
