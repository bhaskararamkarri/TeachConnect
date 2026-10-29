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
  Scroll,
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
      setErrorMessage("Invalid promo code. Try 'BTS2026' for 20% educator discount.");
    }
  };

  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const finalTotalCents = Math.max(0, subtotalCents - discountCents);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Your cart vault is empty.");
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
        setErrorMessage(res.error || "Acquisition failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4 bg-[#FAF7EE] min-h-[70vh]">
        <div className="w-16 h-16 bg-[#F1E8C7] rounded-2xl flex items-center justify-center mx-auto text-[#4F5B32] border border-[#A38345]/40 shadow-sm">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-serif font-black text-[#28291F]">Your Cart Vault is Empty</h1>
        <p className="text-xs font-serif text-[#555745] max-w-sm mx-auto leading-relaxed">
          Add peer-reviewed curriculum units, printable folios, or digital Easel activities to proceed with secure checkout.
        </p>
        <Link
          href="/search"
          className="inline-block px-6 py-3 bg-[#4F5B32] hover:bg-[#3B4425] text-[#FAF7EE] rounded-xl text-xs font-serif font-bold transition border border-[#A38345]/30 shadow-md"
        >
          Explore Scholastic Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#FAF7EE] min-h-screen">
      <div className="mb-8 border-b border-[#F1E8C7] pb-6">
        <span className="text-xs font-serif font-bold text-[#4F5B32] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Scroll className="w-4 h-4 text-[#A38345]" /> Secure Scholastic Acquisition
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#28291F]">Complete Your Order</h1>
        <p className="text-xs font-serif text-[#555745] mt-1">
          Instant digital delivery to your library vault immediately upon confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Information & Payment */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-100/80 border border-red-300 text-red-900 text-xs rounded-2xl font-serif font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Educator Details */}
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-8 space-y-5 shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#28291F] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#4F5B32] text-[#FAF7EE] text-xs flex items-center justify-center font-serif font-bold border border-[#A38345]/40">
                1
              </span>
              <span>Educator & Institution Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold text-[#28291F] mb-1.5">Full Educator Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F1E8C7]/50 border-2 border-[#A38345]/40 rounded-xl text-xs font-serif text-[#28291F] focus:outline-none focus:border-[#4F5B32] focus:bg-[#FAF7EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-[#28291F] mb-1.5">
                  School / Work Email
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F1E8C7]/50 border-2 border-[#A38345]/40 rounded-xl text-xs font-serif text-[#28291F] focus:outline-none focus:border-[#4F5B32] focus:bg-[#FAF7EE]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-serif font-bold text-[#28291F] mb-1.5">
                  School or District Academy Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Oakridge Public Schools"
                  className="w-full px-4 py-3 bg-[#F1E8C7]/50 border-2 border-[#A38345]/40 rounded-xl text-xs font-serif text-[#28291F] focus:outline-none focus:border-[#4F5B32] focus:bg-[#FAF7EE]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-8 space-y-5 shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#28291F] flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#4F5B32] text-[#FAF7EE] text-xs flex items-center justify-center font-serif font-bold border border-[#A38345]/40">
                2
              </span>
              <span>Scholastic Payment Method</span>
            </h3>

            {/* Payment Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("STRIPE_CARD")}
                className={`p-4.5 rounded-2xl border text-left flex items-start gap-3.5 transition ${
                  paymentMethod === "STRIPE_CARD"
                    ? "border-[#4F5B32] bg-[#F1E8C7] shadow-2xs"
                    : "border-[#A38345]/30 bg-[#FAF7EE] hover:bg-[#F1E8C7]/40"
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#4F5B32] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-serif font-bold text-[#28291F]">Credit or Debit Card</p>
                  <p className="text-[11px] font-serif text-[#555745] mt-0.5">Secure processing via Stripe</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("SCHOOL_PO")}
                className={`p-4.5 rounded-2xl border text-left flex items-start gap-3.5 transition ${
                  paymentMethod === "SCHOOL_PO"
                    ? "border-[#4F5B32] bg-[#F1E8C7] shadow-2xs"
                    : "border-[#A38345]/30 bg-[#FAF7EE] hover:bg-[#F1E8C7]/40"
                }`}
              >
                <Building2 className="w-5 h-5 text-[#A38345] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-serif font-bold text-[#28291F]">School Purchase Order</p>
                  <p className="text-[11px] font-serif text-[#555745] mt-0.5">District Net-30 invoice</p>
                </div>
              </button>
            </div>

            {/* Simulated Card Fields */}
            {paymentMethod === "STRIPE_CARD" ? (
              <div className="p-5 bg-[#F1E8C7]/50 rounded-2xl border border-[#A38345]/30 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-serif text-[#555745] pb-2.5 border-b border-[#A38345]/20">
                  <span className="flex items-center gap-1.5 font-bold text-[#4F5B32]">
                    <Lock className="w-3.5 h-3.5 text-[#4F5B32]" />
                    256-Bit SSL Encrypted Vault Checkout
                  </span>
                  <span className="font-mono text-[10px] text-[#A38345] font-bold">TEST MODE ACTIVE</span>
                </div>

                <div>
                  <label className="block text-[11px] font-serif font-bold text-[#28291F] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Stripe Verified)"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7EE] border border-[#A38345]/30 rounded-xl text-xs font-mono text-[#28291F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-serif font-bold text-[#28291F] mb-1">
                      Expiration
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7EE] border border-[#A38345]/30 rounded-xl text-xs font-mono text-[#28291F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-serif font-bold text-[#28291F] mb-1">
                      CVC Code
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="•••"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7EE] border border-[#A38345]/30 rounded-xl text-xs font-mono text-[#28291F]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#E4E8D2]/60 rounded-2xl border border-[#9CA763] space-y-3.5">
                <label className="block text-xs font-serif font-bold text-[#28291F]">
                  District Purchase Order (PO) Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PO-2026-DISTRICT-8491"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF7EE] border-2 border-[#9CA763] rounded-xl text-xs font-serif text-[#28291F] focus:outline-none focus:border-[#4F5B32]"
                />
                <p className="text-[11px] font-serif text-[#3B4425]">
                  Your school finance department will be emailed the official Net-30 invoice upon order confirmation.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-[#4F5B32] hover:bg-[#3B4425] disabled:opacity-50 text-[#FAF7EE] font-serif font-bold rounded-2xl text-sm flex items-center justify-center gap-2.5 transition shadow-md border border-[#A38345]/40"
          >
            {isSubmitting ? (
              <span>Processing Acquisition & Archiving Files...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[#F1E8C7]" />
                <span>Complete Acquisition & Open Vault ({formatPrice(finalTotalCents)})</span>
              </>
            )}
          </button>
        </form>

        {/* Right 1 Column: Order Summary & Promo */}
        <div className="space-y-6">
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#A38345]/30 p-6 space-y-6 shadow-sm sticky top-24">
            <h3 className="text-base font-serif font-bold text-[#28291F]">Acquisition Summary ({items.length} folios)</h3>

            {/* Items list */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3.5 text-xs font-serif">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-[#F1E8C7] flex-shrink-0 border border-[#A38345]/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#28291F] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#555745]">
                      {item.seatCount}x {item.licenseType === "SCHOOL_SEAT" ? "School License" : "Classroom License"}
                    </p>
                    <p className="font-extrabold text-[#28291F] mt-0.5">
                      {formatPrice(item.priceCents * item.seatCount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <div className="pt-4 border-t border-[#F1E8C7]">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (try BTS2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#F1E8C7]/50 border border-[#A38345]/40 rounded-xl text-xs font-serif uppercase text-[#28291F] placeholder-[#555745]/70 focus:outline-none focus:border-[#4F5B32]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#28291F] hover:bg-black text-[#FAF7EE] text-xs font-serif font-bold rounded-xl transition border border-[#A38345]/30"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <p className="text-[11px] font-serif text-[#3B4425] bg-[#E4E8D2] p-2 rounded-xl mt-2 flex items-center gap-1.5 border border-[#9CA763]">
                  <CheckCircle2 className="w-4 h-4 text-[#4F5B32]" /> Code {appliedPromo} applied ({discountPercent}% scholarship discount)!
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-[#F1E8C7] space-y-2.5 text-xs font-serif text-[#555745]">
              <div className="flex justify-between">
                <span>Folios Subtotal</span>
                <span className="font-bold text-[#28291F]">{formatPrice(subtotalCents)}</span>
              </div>

              {discountCents > 0 && (
                <div className="flex justify-between text-[#3B4425] font-bold">
                  <span>Educator Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountCents)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Educational Tax Status</span>
                <span className="text-[#4F5B32] font-semibold">Exempt ($0.00)</span>
              </div>

              <div className="flex justify-between text-sm font-serif font-black text-[#28291F] pt-3 border-t border-[#F1E8C7]">
                <span>Total Due</span>
                <span className="text-base text-[#4F5B32]">{formatPrice(finalTotalCents)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#E4E8D2]/50 rounded-2xl flex items-center gap-2.5 text-[11px] font-serif text-[#3B4425] border border-[#9CA763]">
              <ShieldCheck className="w-4 h-4 text-[#4F5B32] flex-shrink-0" />
              <span>Instant digital archive access. Permanent backup in your library vault.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
