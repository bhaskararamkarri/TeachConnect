"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { processCheckout } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Tag,
  ArrowRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  School,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clearCart } = useCart();

  const [buyerName, setBuyerName] = useState("Sarah Jenkins");
  const [buyerEmail, setBuyerEmail] = useState("teacher@school.edu");
  const [schoolName, setSchoolName] = useState("Oakridge Elementary School");
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE_CARD" | "SCHOOL_PO">("STRIPE_CARD");
  const [poNumber, setPoNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "BTS2026") {
      setAppliedPromo("BTS2026");
      setDiscountPercent(20);
      setErrorMessage("");
    } else if (code === "TEACHER10") {
      setAppliedPromo("TEACHER10");
      setDiscountPercent(10);
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid promo code. Try 'BTS2026' for 20% off.");
    }
  };

  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const finalTotalCents = Math.max(0, subtotalCents - discountCents);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await processCheckout({
        buyerName,
        buyerEmail,
        schoolName: schoolName.trim() || undefined,
        paymentMethod,
        poNumber: poNumber.trim() || undefined,
        promoCode: appliedPromo || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          priceCents: i.priceCents,
          licenseType: i.licenseType,
          seatCount: i.seatCount,
        })),
      });

      if (res.success && res.orderId) {
        clearCart();
        router.push(`/checkout/success?orderId=${res.orderId}`);
      } else {
        setErrorMessage(res.error || "Payment failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Add some teacher-created units, printables, or digital Easel activities to proceed with checkout.
        </p>
        <Link
          href="/search"
          className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Secure Educator Checkout</h1>
        <p className="text-xs text-gray-500 mt-1">
          Instant access to curriculum files immediately upon order confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Information & Payment */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Educator Details */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Educator Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  School / Work Email
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  School or District Name (Optional for receipt)
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Oakridge Public Schools"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Payment Details</span>
            </h3>

            {/* Payment Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("STRIPE_CARD")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  paymentMethod === "STRIPE_CARD"
                    ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Credit or Debit Card</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Secure payment via Stripe</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("SCHOOL_PO")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  paymentMethod === "SCHOOL_PO"
                    ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-900">School Purchase Order</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Net 30 invoice for districts</p>
                </div>
              </button>
            </div>

            {/* Simulated Card Fields */}
            {paymentMethod === "STRIPE_CARD" ? (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit SSL Encrypted Card Processing
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">TEST MODE ENABLED</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Stripe Verified)"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="•••"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <label className="block text-xs font-semibold text-blue-900">
                  District Purchase Order (PO) Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PO-2026-DISTRICT-8491"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-blue-700">
                  Your school administrator will be emailed the official Net-30 invoice upon order completion.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-md"
          >
            {isSubmitting ? (
              <span>Processing Order & Preparing Digital Files...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-primary-200" />
                <span>Complete Order & Access Downloads ({formatPrice(finalTotalCents)})</span>
              </>
            )}
          </button>
        </form>

        {/* Right 1 Column: Order Summary & Promo */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-xs sticky top-24">
            <h3 className="text-base font-bold text-gray-900">Order Summary ({items.length} items)</h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 text-xs">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {item.seatCount}x {item.licenseType === "SCHOOL_SEAT" ? "School License" : "Classroom License"}
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {formatPrice(item.priceCents * item.seatCount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <div className="pt-4 border-t border-gray-100">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (try BTS2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Code {appliedPromo} applied ({discountPercent}% off)!
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotalCents)}</span>
              </div>

              {discountCents > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Educator Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountCents)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Sales Tax</span>
                <span className="text-gray-500">$0.00 (Exempt)</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Due</span>
                <span className="text-base text-primary-700">{formatPrice(finalTotalCents)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Instant digital fulfillment. Download keys immediately activated.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
