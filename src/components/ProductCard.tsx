"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import { Star, Sparkles, Check, Download, Layers } from "lucide-react";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  isFree: boolean;
  coverImageUrl: string;
  gradeLevels: string[];
  subjects: string[];
  isEaselReady: boolean;
  ratingAverage: number;
  ratingCount: number;
  sellerStoreName: string;
  sellerSlug?: string;
}

export function ProductCard({
  id,
  title,
  slug,
  priceCents,
  isFree,
  coverImageUrl,
  gradeLevels,
  subjects,
  isEaselReady,
  ratingAverage,
  ratingCount,
  sellerStoreName,
}: ProductCardProps) {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item.productId === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: id,
      title,
      slug,
      coverImageUrl,
      priceCents,
      sellerStoreName,
      licenseType: "SINGLE_USER",
    });
  };

  return (
    <div className="group bg-[#FAF7EE] rounded-2xl border border-[#A38345]/30 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#4F5B32] transition-all flex flex-col h-full">
      {/* Cover Image */}
      <Link href={`/product/${slug}`} className="relative aspect-[4/3] overflow-hidden bg-[#F1E8C7] block">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {isEaselReady && (
          <div className="absolute top-2.5 left-2.5 bg-[#4F5B32]/90 backdrop-blur-sm text-[#FAF7EE] text-[11px] font-serif font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-[#A38345]/40">
            <Sparkles className="w-3 h-3 text-[#F1E8C7]" />
            <span>Easel Activity</span>
          </div>
        )}

        {isFree && (
          <div className="absolute top-2.5 right-2.5 bg-[#9CA763] text-[#28291F] text-[11px] font-serif font-bold px-2.5 py-0.5 rounded-md shadow-sm border border-[#4F5B32]/20">
            COMPLIMENTARY
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {gradeLevels.slice(0, 2).map((grade, idx) => (
              <span
                key={idx}
                className="text-[10px] font-serif font-medium bg-[#F1E8C7] text-[#28291F] px-2 py-0.5 rounded border border-[#A38345]/20"
              >
                {grade}
              </span>
            ))}
            {subjects.slice(0, 1).map((sub, idx) => (
              <span
                key={idx}
                className="text-[10px] font-serif font-medium bg-[#E4E8D2] text-[#3B4425] px-2 py-0.5 rounded border border-[#9CA763]"
              >
                {sub}
              </span>
            ))}
          </div>

          {/* Title */}
          <Link
            href={`/product/${slug}`}
            className="text-sm font-serif font-bold text-[#28291F] group-hover:text-[#4F5B32] line-clamp-2 leading-snug transition-colors"
          >
            {title}
          </Link>

          {/* Seller */}
          <p className="text-xs font-serif text-[#555745] mt-1">
            By <span className="font-semibold text-[#28291F]">{sellerStoreName}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-[#A38345]">
              <Star className="w-3.5 h-3.5 fill-[#A38345] stroke-[#A38345]" />
              <span className="text-xs font-serif font-bold text-[#28291F] ml-1">{ratingAverage.toFixed(1)}</span>
            </div>
            <span className="text-xs font-serif text-[#555745]">({ratingCount})</span>
          </div>
        </div>

        {/* Footer: Price and Add Button */}
        <div className="pt-4 mt-3 border-t border-[#F1E8C7] flex items-center justify-between">
          <div>
            <span className="text-base font-serif font-extrabold text-[#28291F]">
              {formatPrice(priceCents)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold flex items-center gap-1.5 transition ${
              isInCart
                ? "bg-[#E4E8D2] text-[#3B4425] border border-[#9CA763]"
                : "bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] shadow-sm border border-[#A38345]/30"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3B4425]" />
                <span>In Vault</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
