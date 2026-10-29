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
    <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-6 shadow-md space-y-6 sticky top-24">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-serif font-black text-[#28291F]">
            {formatPrice(totalPriceCents)}
          </span>
          {isFree && (
            <span className="px-3 py-1 bg-[#9CA763] text-[#28291F] text-xs font-serif font-bold rounded-lg border border-[#4F5B32]/20">
              Complimentary
            </span>
          )}
        </div>
        <p className="text-xs font-serif text-[#555745] mt-1">
          {licenseType === "SINGLE_USER"
            ? "Single educator classroom license"
            : `${seatCount} transferable school department license seats`}
        </p>
      </div>

      {/* License Selector (if not free) */}
      {!isFree && (
        <div className="space-y-3 pt-3 border-t border-[#F1E8C7]">
          <h4 className="text-xs font-serif font-bold uppercase text-[#4F5B32] tracking-wider">
            Select Scholastic License
          </h4>

          <div className="space-y-2">
            {/* Single User Option */}
            <label
              onClick={() => {
                setLicenseType("SINGLE_USER");
                setSeatCount(1);
              }}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                licenseType === "SINGLE_USER"
                  ? "border-[#4F5B32] bg-[#F1E8C7]/70 shadow-2xs"
                  : "border-[#A38345]/30 bg-[#FAF7EE] hover:bg-[#F1E8C7]/40"
              }`}
            >
              <input
                type="radio"
                name="license"
                checked={licenseType === "SINGLE_USER"}
                onChange={() => {}}
                className="mt-1 text-[#4F5B32] focus:ring-[#4F5B32]"
              />
              <div className="text-xs font-serif">
                <span className="font-bold text-[#28291F] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#4F5B32]" /> Individual Classroom Folio
                </span>
                <p className="text-[#555745] mt-0.5">
                  For use by one master educator in their personal classroom archive.
                </p>
              </div>
            </label>

            {/* School / Multi-Seat Option */}
            <label
              onClick={() => setLicenseType("SCHOOL_SEAT")}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                licenseType === "SCHOOL_SEAT"
                  ? "border-[#4F5B32] bg-[#F1E8C7]/70 shadow-2xs"
                  : "border-[#A38345]/30 bg-[#FAF7EE] hover:bg-[#F1E8C7]/40"
              }`}
            >
              <input
                type="radio"
                name="license"
                checked={licenseType === "SCHOOL_SEAT"}
                onChange={() => {}}
                className="mt-1 text-[#4F5B32] focus:ring-[#4F5B32]"
              />
              <div className="text-xs font-serif flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#28291F] flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-[#A38345]" /> Multi-Seat Department License
                  </span>
                  <span className="text-[10px] font-bold text-[#3B4425] bg-[#E4E8D2] px-2 py-0.5 rounded border border-[#9CA763]">
                    Save 15%
                  </span>
                </div>
                <p className="text-[#555745] mt-0.5">
                  Institutionally owned, transferable across grade-level colleagues.
                </p>

                {/* Seat Stepper */}
                {licenseType === "SCHOOL_SEAT" && (
                  <div className="mt-3 flex items-center gap-3 pt-2.5 border-t border-[#A38345]/20">
                    <span className="font-semibold text-[#28291F]">Teacher Seats:</span>
                    <div className="flex items-center border border-[#A38345]/40 rounded-xl overflow-hidden bg-[#FAF7EE]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeatCount((c) => Math.max(1, c - 1));
                        }}
                        className="px-3 py-1 bg-[#F1E8C7] hover:bg-[#e4d9b0] font-bold text-[#28291F]"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 font-bold text-[#28291F]">{seatCount}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeatCount((c) => c + 1);
                        }}
                        className="px-3 py-1 bg-[#F1E8C7] hover:bg-[#e4d9b0] font-bold text-[#28291F]"
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
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          className={`w-full py-3.5 px-4 rounded-2xl font-serif font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm border ${
            isInCart
              ? "bg-[#E4E8D2] text-[#3B4425] border-[#9CA763]"
              : "bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] border-[#A38345]/40 shadow-md"
          }`}
        >
          {isInCart ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#3B4425]" />
              <span>In Vault (Add Another)</span>
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
          className="w-full py-3.5 px-4 bg-[#28291F] hover:bg-black text-[#FAF7EE] rounded-2xl font-serif font-bold text-sm flex items-center justify-center gap-2 transition shadow-md border border-[#A38345]/30"
        >
          <Zap className="w-4 h-4 text-[#A38345]" />
          <span>{isFree ? "Acquire Complimentary Folio" : "Acquire Now"}</span>
        </button>
      </div>

      {/* Resource Spec List */}
      <div className="pt-4 border-t border-[#F1E8C7] space-y-2.5 text-xs font-serif text-[#555745]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#555745]">
            <FileText className="w-3.5 h-3.5 text-[#A38345]" /> Manuscript Length:
          </span>
          <span className="font-bold text-[#28291F]">{pageCount} folios / pages</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#555745]">Included Formats:</span>
          <span className="font-bold text-[#28291F]">{fileFormats}</span>
        </div>
        {isEaselReady && (
          <div className="flex items-center justify-between text-[#4F5B32] font-semibold bg-[#E4E8D2]/50 p-2 rounded-xl border border-[#9CA763]/50">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#A38345]" /> Digital Assignment:
            </span>
            <span className="font-bold">Easel Ready</span>
          </div>
        )}
      </div>

      {/* Seller Box */}
      <div className="pt-4 border-t border-[#F1E8C7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={sellerAvatarUrl || "https://placehold.co/150"}
            alt={sellerStoreName}
            className="w-11 h-11 rounded-2xl object-cover border-2 border-[#9CA763]"
          />
          <div>
            <h4 className="text-xs font-serif font-bold text-[#28291F] line-clamp-1">{sellerStoreName}</h4>
            <div className="flex items-center gap-1 text-[11px] font-serif text-[#A38345] font-bold">
              <span>★ {sellerRating.toFixed(1)}</span>
              <span className="text-[#555745] font-normal">({sellerRatingCount})</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing((f) => !f)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-semibold transition border ${
            isFollowing
              ? "bg-[#E4E8D2] text-[#3B4425] border-[#9CA763]"
              : "bg-[#F1E8C7] hover:bg-[#e4d9b0] text-[#28291F] border-[#A38345]/30"
          }`}
        >
          {isFollowing ? "Following Scholar" : "+ Follow"}
        </button>
      </div>

      {/* Trust Notice */}
      <div className="p-3.5 bg-[#F1E8C7]/50 rounded-2xl flex items-center gap-2.5 text-[11px] font-serif text-[#555745] border border-[#A38345]/20">
        <ShieldCheck className="w-4 h-4 text-[#4F5B32] flex-shrink-0" />
        <span>Instant download delivered to your library vault. Peer-reviewed scholarship.</span>
      </div>
    </div>
  );
}
