"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, School } from "lucide-react";

export function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, removeFromCart, updateSeats, subtotalCents } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#28291F]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7EE] shadow-2xl flex flex-col border-l border-[#A38345]/30">
          {/* Header */}
          <div className="p-5 border-b border-[#F1E8C7] flex items-center justify-between bg-[#F1E8C7]/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#4F5B32]" />
              <h2 className="font-serif font-bold text-[#28291F] text-lg">Curriculum Vault Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full text-[#555745] hover:text-[#28291F] hover:bg-[#F1E8C7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#555745]">
                <ShoppingBag className="w-12 h-12 text-[#A38345]/50 mb-3" />
                <p className="text-base font-serif font-bold text-[#28291F]">Your cart vault is empty</p>
                <p className="text-xs font-serif text-[#555745] mt-1 mb-6">Explore peer-reviewed manuscripts and teacher folios to begin.</p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2.5 bg-[#4F5B32] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold hover:bg-[#3B4425] transition border border-[#A38345]/30 shadow-xs"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-4 bg-[#FAF7EE] border border-[#A38345]/30 rounded-2xl shadow-2xs hover:border-[#4F5B32] transition"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F1E8C7] flex-shrink-0 border border-[#A38345]/20">
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setIsDrawerOpen(false)}
                      className="text-xs font-serif font-bold text-[#28291F] line-clamp-2 hover:text-[#4F5B32] transition-colors leading-snug"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[11px] font-serif text-[#555745] mt-0.5">By <span className="font-semibold text-[#28291F]">{item.sellerStoreName}</span></p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-serif font-medium px-2 py-0.5 bg-[#F1E8C7] text-[#28291F] rounded-md border border-[#A38345]/20">
                        {item.licenseType === "SCHOOL_SEAT" ? (
                          <span className="flex items-center gap-1">
                            <School className="w-3 h-3 text-[#A38345]" /> School Department License
                          </span>
                        ) : (
                          "Classroom License"
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F1E8C7]">
                      <div className="flex items-center border border-[#A38345]/40 rounded-xl overflow-hidden text-xs bg-[#F1E8C7]/50">
                        <button
                          onClick={() => updateSeats(item.productId, item.seatCount - 1)}
                          className="px-2 py-1 bg-[#F1E8C7] hover:bg-[#e4d9b0] font-bold text-[#28291F]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-serif font-bold text-[#28291F]">{item.seatCount}</span>
                        <button
                          onClick={() => updateSeats(item.productId, item.seatCount + 1)}
                          className="px-2 py-1 bg-[#F1E8C7] hover:bg-[#e4d9b0] font-bold text-[#28291F]"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-serif font-extrabold text-[#28291F]">
                          {formatPrice(item.priceCents * item.seatCount)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-[#555745] hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#F1E8C7] bg-[#F1E8C7]/60 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-serif text-[#555745]">
                <span>Vault Subtotal</span>
                <span className="font-serif font-black text-[#28291F] text-lg">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-serif text-[#3B4425] bg-[#E4E8D2] p-2.5 rounded-xl border border-[#9CA763]">
                <ShieldCheck className="w-4 h-4 text-[#4F5B32] flex-shrink-0" />
                <span>Instant library vault delivery & permanent backup</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] rounded-2xl font-serif font-bold text-sm shadow-md transition border border-[#A38345]/40"
              >
                <span>Proceed to Scholastic Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
