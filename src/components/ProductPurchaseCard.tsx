"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  School,
  UserCheck,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";

interface ProductPurchaseCardProps {
  productId: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  priceCents: number;
  isFree: boolean;
  pageCount: number;
  fileFormats: string;
  isEaselReady: boolean;
  sellerStoreName: string;
  sellerRating: number;
  sellerRatingCount: number;
  sellerAvatarUrl?: string | null;
}

export function ProductPurchaseCard({
  productId,
  title,
  slug,
  coverImageUrl,
  priceCents,
  isFree,
  pageCount,
  fileFormats,
  isEaselReady,
  sellerStoreName,
  sellerRating,
  sellerRatingCount,
  sellerAvatarUrl,
}: ProductPurchaseCardProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const [licenseType, setLicenseType] = useState<"SINGLE_USER" | "SCHOOL_SEAT">("SINGLE_USER");
  const [seatCount, setSeatCount] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);

  const isInCart = items.some((item) => item.productId === productId);

  // Calculate price based on licenses
  // School licenses get 15% off additional seats
  const calculateTotal = () => {
    if (isFree) return 0;
    if (licenseType === "SCHOOL_SEAT" && seatCount > 1) {
      const base = priceCents;
      const additional = (seatCount - 1) * Math.round(priceCents * 0.85);
      return base + additional;
    }
    return priceCents * seatCount;
  };

  const totalPriceCents = calculateTotal();

  const handleAddToCart = () => {
    addToCart({
      productId,
      title,
      slug,
      coverImageUrl,
      priceCents,
      sellerStoreName,
      licenseType,
      seatCount,
    });
  };

  const handleBuyNow = () => {
    addToCart({
      productId,
      title,
      slug,
      coverImageUrl,
      priceCents,
      sellerStoreName,
      licenseType,
      seatCount,
    });
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm space-y-6 sticky top-24">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-black text-gray-900">
            {formatPrice(totalPriceCents)}
          </span>
          {isFree && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Free Download
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {licenseType === "SINGLE_USER"
            ? "Single teacher classroom license"
            : `${seatCount} transferable school teacher license seats`}
        </p>
      </div>

      {/* License Selector (if not free) */}
      {!isFree && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider">
            Choose License Type
          </h4>

          <div className="space-y-2">
            {/* Single User Option */}
            <label
              onClick={() => {
                setLicenseType("SINGLE_USER");
                setSeatCount(1);
              }}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                licenseType === "SINGLE_USER"
                  ? "border-primary-500 bg-primary-50/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="license"
                checked={licenseType === "SINGLE_USER"}
                onChange={() => {}}
                className="mt-1 text-primary-600 focus:ring-primary-500"
              />
              <div className="text-xs">
                <span className="font-bold text-gray-900 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-primary-700" /> Individual Classroom License
                </span>
                <p className="text-gray-500 mt-0.5">
                  For use by one educator in their personal classroom.
                </p>
              </div>
            </label>

            {/* School / Multi-Seat Option */}
            <label
              onClick={() => setLicenseType("SCHOOL_SEAT")}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                licenseType === "SCHOOL_SEAT"
                  ? "border-primary-500 bg-primary-50/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="license"
                checked={licenseType === "SCHOOL_SEAT"}
                onChange={() => {}}
                className="mt-1 text-primary-600 focus:ring-primary-500"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-blue-600" /> Multi-Seat School License
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Save 15%
                  </span>
                </div>
                <p className="text-gray-500 mt-0.5">
                  School-owned, transferable across grade-level teams or departments.
                </p>

                {/* Seat Stepper */}
                {licenseType === "SCHOOL_SEAT" && (
                  <div className="mt-3 flex items-center gap-3 pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-700">Teacher Seats:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeatCount((c) => Math.max(1, c - 1));
                        }}
                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-900">{seatCount}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeatCount((c) => c + 1);
                        }}
                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleAddToCart}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm ${
            isInCart
              ? "bg-primary-50 text-primary-700 border border-primary-300"
              : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200"
          }`}
        >
          {isInCart ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-primary-600" />
              <span>Already in Cart (Add More)</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>{isFree ? "Instant Free Download" : "Buy Now"}</span>
        </button>
      </div>

      {/* Resource Spec List */}
      <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <FileText className="w-3.5 h-3.5" /> Total Pages:
          </span>
          <span className="font-semibold text-gray-900">{pageCount} pages</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">File Formats:</span>
          <span className="font-semibold text-gray-900">{fileFormats}</span>
        </div>
        {isEaselReady && (
          <div className="flex items-center justify-between text-indigo-700 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Digital Activity:
            </span>
            <span className="font-bold">Easel by TeachConnect</span>
          </div>
        )}
      </div>

      {/* Seller Box */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={sellerAvatarUrl || "https://placehold.co/150"}
            alt={sellerStoreName}
            className="w-10 h-10 rounded-full object-cover border border-primary-100"
          />
          <div>
            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{sellerStoreName}</h4>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <span>★ {sellerRating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({sellerRatingCount})</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing((f) => !f)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            isFollowing
              ? "bg-gray-100 text-gray-700"
              : "bg-primary-50 text-primary-700 hover:bg-primary-100"
          }`}
        >
          {isFollowing ? "Following" : "+ Follow"}
        </button>
      </div>

      {/* Trust Notice */}
      <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2 text-[11px] text-gray-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Instant download after checkout. Verified authentic curriculum.</span>
      </div>
    </div>
  );
}
