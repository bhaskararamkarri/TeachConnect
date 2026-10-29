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
    <div className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex flex-col h-full">
      {/* Cover Image */}
      <Link href={`/product/${slug}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 block">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {isEaselReady && (
          <div className="absolute top-2.5 left-2.5 bg-indigo-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Easel Activity</span>
          </div>
        )}

        {isFree && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            FREE
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
                className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
              >
                {grade}
              </span>
            ))}
            {subjects.slice(0, 1).map((sub, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md"
              >
                {sub}
              </span>
            ))}
          </div>

          {/* Title */}
          <Link
            href={`/product/${slug}`}
            className="text-sm font-bold text-gray-900 group-hover:text-primary-700 line-clamp-2 leading-snug transition-colors"
          >
            {title}
          </Link>

          {/* Seller */}
          <p className="text-xs text-gray-500 mt-1">
            By <span className="font-medium text-gray-700">{sellerStoreName}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span className="text-xs font-bold text-gray-900 ml-1">{ratingAverage.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-400">({ratingCount})</span>
          </div>
        </div>

        {/* Footer: Price and Add Button */}
        <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-gray-900">
              {formatPrice(priceCents)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isInCart
                ? "bg-primary-50 text-primary-700 border border-primary-200"
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart</span>
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
