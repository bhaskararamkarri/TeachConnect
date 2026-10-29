"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const comment = formData.get("comment") as string;
    const gradeTaught = formData.get("gradeTaught") as string;
    const userEmail = (formData.get("userEmail") as string) || "teacher@school.edu";

    if (!productId || !rating || !comment) {
      return { success: false, error: "Rating and comment are required." };
    }

    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: "Sarah Jenkins",
        },
      });
    }

    // Check existing review
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          comment,
          gradeTaught,
        },
      });
    } else {
      await prisma.review.create({
        data: {
          productId,
          userId: user.id,
          userName: `${user.name}, Teacher`,
          rating,
          comment,
          gradeTaught,
        },
      });
    }

    // Recompute product rating average
    const reviews = await prisma.review.findMany({
      where: { productId },
    });

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: Math.round(avg * 10) / 10,
        ratingCount: reviews.length,
      },
    });

    revalidatePath(`/product/[slug]`, "page");
    revalidatePath("/library");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { success: false, error: error.message };
  }
}

