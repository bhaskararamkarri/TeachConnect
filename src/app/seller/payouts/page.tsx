import React from "react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerPayoutsPage() {
  const seller = await prisma.sellerProfile.findFirst({
    where: { storeSlug: "mathcraft-studios" },
    include: {
      payouts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Tier Comparison Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
              TeachConnect Royalty Structure
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-1">
              Seller Membership & Commission Splits
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Reverse-engineered TPT commission economics designed to reward dedicated teacher creators
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active: Exclusive Membership (77.5%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Basic Tier */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Basic Seller</h3>
              <span className="text-xs text-gray-500 font-semibold">$29 One-Time Fee</span>
            </div>
            <div className="text-3xl font-black text-gray-900">55%</div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Creator keeps 55% of all gross sales with a $0.30 transaction fee per resource sold. No exclusivity required—you may cross-post on Etsy or personal blogs.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-200">
              <li>• Non-exclusive licensing</li>
              <li>• Standard store analytics</li>
              <li>• Standard payout schedule</li>
            </ul>
          </div>

          {/* Exclusive Tier */}
          <div className="p-6 rounded-2xl border-2 border-primary-500 bg-primary-50/30 space-y-4 relative">
            <div className="absolute top-4 right-4 bg-primary-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Your Current Plan
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Exclusive Seller</h3>
              <span className="text-xs text-primary-700 font-semibold">$59.95 / year</span>
            </div>
            <div className="text-3xl font-black text-primary-700">77.5%</div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Creator keeps 77.5% of all gross sales with $0 transaction fees on orders of $3 or more ($0.15 on orders under $3). Requires exclusive listing on TeachConnect.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-700 font-medium pt-2 border-t border-primary-200">
              <li>• Maximized revenue retention (77.5%)</li>
              <li>• $0 transaction fees on standard carts</li>
              <li>• Advanced search keyword analytics</li>
              <li>• Priority promotional placement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stripe Connect Account Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Stripe Connect Direct Payouts</h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active & Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Connected to Account <span className="font-mono text-gray-700">{seller.stripeAccountId}</span> (Direct Bank Deposit)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400">Next Scheduled Payout:</span>
          <p className="text-sm font-bold text-gray-900">November 1, 2026</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Disbursed Payout History</h3>
            <p className="text-xs text-gray-500">Official monthly revenue transfers to your bank account</p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
            All Transfers Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-6">Payout Period</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Transfer Reference</th>
                <th className="py-3 px-6 text-right">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {seller.payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-bold text-gray-900">{payout.payoutPeriod}</td>
                  <td className="py-4 px-4 font-black text-emerald-700 text-sm">
                    {formatPrice(payout.amountCents)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-500">{payout.transferRef || "tr_stripe_auto"}</td>
                  <td className="py-4 px-6 text-right text-gray-500">
                    {new Date(payout.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

