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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900 text-lg">Your Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-base font-medium text-gray-800">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1 mb-6">Explore teacher-created lessons and printables to get started.</p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                >
                  Browse Resources
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
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
                      className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">By {item.sellerStoreName}</p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                        {item.licenseType === "SCHOOL_SEAT" ? (
                          <span className="flex items-center gap-1">
                            <School className="w-3 h-3 text-blue-600" /> School License
                          </span>
                        ) : (
                          "Classroom License"
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
                        <button
                          onClick={() => updateSeats(item.productId, item.seatCount - 1)}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-medium text-gray-800">{item.seatCount}</span>
                        <button
                          onClick={() => updateSeats(item.productId, item.seatCount + 1)}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.priceCents * item.seatCount)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
            <div className="p-4 border-t border-gray-100 bg-gray-50/70 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 text-base">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Instant Digital Download & Lifetime Access</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-sm transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
