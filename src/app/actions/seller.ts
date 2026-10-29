"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateProductInput {
  title: string;
  slug?: string;
  description: string;
  priceCents: number;
  isFree: boolean;
  gradeLevels: string[];
  subjects: string[];
  resourceTypes: string[];
  pageCount: number;
  fileFormats: string;
  isEaselReady: boolean;
  standardsAlignment?: string[];
  coverImageUrl: string;
  files: {
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[];
}

export async function createProduct(input: CreateProductInput) {
  try {
    // Default to the first seller (MathCraft Studios)
    const seller = await prisma.sellerProfile.findFirst({
      where: { storeSlug: "mathcraft-studios" },
    });

    if (!seller) {
      return { success: false, error: "Seller profile not found." };
    }

    const slug =
      input.slug ||
      input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
        "-" +
        Math.floor(100 + Math.random() * 900);

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title: input.title,
        slug,
        description: input.description,
        priceCents: input.isFree ? 0 : input.priceCents,
        isFree: input.isFree,
        gradeLevels: JSON.stringify(input.gradeLevels),
        subjects: JSON.stringify(input.subjects),
        resourceTypes: JSON.stringify(input.resourceTypes),
        pageCount: input.pageCount || 1,
        fileFormats: input.fileFormats || "PDF Printable",
        isEaselReady: input.isEaselReady || false,
        standardsAlignment: input.standardsAlignment ? JSON.stringify(input.standardsAlignment) : null,
        coverImageUrl:
          input.coverImageUrl ||
          "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
        files: {
          create: input.files.map((f) => ({
            fileName: f.fileName,
            fileSize: f.fileSize || 5240000,
            mimeType: f.mimeType || "application/pdf",
            fileKey: `vault/seller/${f.fileName}`,
            fileType: "MAIN_DOWNLOAD",
          })),
        },
        previews: {
          create: [
            {
              previewUrl:
                input.coverImageUrl ||
                "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
              pageNumber: 1,
              sortOrder: 1,
              watermarkText: "TEACHCONNECT PREVIEW - FOR EVALUATION ONLY",
            },
          ],
        },
      },
    });

    revalidatePath("/search");
    revalidatePath("/");
    revalidatePath("/seller/dashboard");

    return { success: true, slug: product.slug };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

