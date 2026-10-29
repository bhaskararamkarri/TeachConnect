"use server";

import { prisma } from "@/lib/prisma";

export interface CheckoutPayload {
  buyerName: string;
  buyerEmail: string;
  schoolName?: string;
  paymentMethod: "STRIPE_CARD" | "FREE_ORDER" | "SCHOOL_PO";
  poNumber?: string;
  promoCode?: string;
  items: {
    productId: string;
    title: string;
    priceCents: number;
    licenseType: "SINGLE_USER" | "SCHOOL_SEAT";
    seatCount: number;
  }[];
}

export async function processCheckout(payload: CheckoutPayload) {
  try {
    const { buyerName, buyerEmail, schoolName, paymentMethod, poNumber, promoCode, items } = payload;

    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    if (!buyerEmail || !buyerName) {
      return { success: false, error: "Buyer name and email are required." };
    }

    // 1. Get or create buyer user
    let user = await prisma.user.findUnique({
      where: { email: buyerEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: buyerEmail,
          name: buyerName,
          role: schoolName ? "SCHOOL_ADMIN" : "BUYER",
        },
      });
    }

    // 2. Calculate subtotal
    let subtotalCents = 0;
    const itemCalculations = items.map((item) => {
      let itemTotal = item.priceCents * item.seatCount;
      if (item.licenseType === "SCHOOL_SEAT" && item.seatCount > 1) {
        const base = item.priceCents;
        const additional = (item.seatCount - 1) * Math.round(item.priceCents * 0.85);
        itemTotal = base + additional;
      }
      subtotalCents += itemTotal;
      return {
        ...item,
        itemTotalCents: itemTotal,
      };
    });

    // 3. Apply promo code
    let discountCents = 0;
    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase();
      if (cleanCode === "BTS2026") {
        discountCents = Math.round(subtotalCents * 0.2); // 20% off
      } else if (cleanCode === "TEACHER10") {
        discountCents = Math.round(subtotalCents * 0.1); // 10% off
      }
    }

    const totalAmountCents = Math.max(0, subtotalCents - discountCents);

    // 4. Create Order
    const orderNumber = `TC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        totalAmountCents,
        discountCents,
        status: "COMPLETED",
        paymentMethod: paymentMethod === "SCHOOL_PO" && poNumber ? `PO-${poNumber}` : paymentMethod,
      },
    });

    // 5. Create OrderItems & Credit Sellers & Deliver to Library
    for (const item of itemCalculations) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { seller: true },
      });

      if (!product) continue;

      // Payout split: Exclusive = 77.5%, Basic = 55%
      const royaltyRate = product.seller.tier === "EXCLUSIVE" ? 0.775 : 0.55;
      const sellerShareCents = Math.round(item.itemTotalCents * royaltyRate);
      const platformShareCents = item.itemTotalCents - sellerShareCents;

      // Record OrderItem
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          priceCents: item.itemTotalCents,
          licenseType: item.licenseType,
          seatCount: item.seatCount,
          sellerShareCents,
          platformShareCents,
        },
      });

      // Update seller stats
      await prisma.sellerProfile.update({
        where: { id: product.seller.id },
        data: {
          totalSales: { increment: item.seatCount },
          totalEarningsCents: { increment: sellerShareCents },
        },
      });

      // Update product download count
      await prisma.product.update({
        where: { id: product.id },
        data: {
          totalDownloads: { increment: item.seatCount },
        },
      });

      // Generate download token with 7-day initial TTL (refreshed on demand)
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

      const downloadToken = `dl_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

      // Check if user already owns this item
      const existingLibraryItem = await prisma.libraryItem.findFirst({
        where: {
          userId: user.id,
          productId: product.id,
        },
      });

      if (existingLibraryItem) {
        await prisma.libraryItem.update({
          where: { id: existingLibraryItem.id },
          data: {
            downloadToken,
            tokenExpiresAt,
          },
        });
      } else {
        await prisma.libraryItem.create({
          data: {
            userId: user.id,
            productId: product.id,
            productTitle: product.title,
            productSlug: product.slug,
            sellerStoreName: product.seller.storeName,
            coverImageUrl: product.coverImageUrl,
            licenseType: item.licenseType,
            downloadToken,
            tokenExpiresAt,
          },
        });
      }
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      userEmail: user.email,
    };
  } catch (error: any) {
    console.error("Checkout processing error:", error);
    return { success: false, error: error.message || "Failed to process checkout." };
  }
}
