import { prisma } from "./prisma";

export interface SearchParams {
  q?: string;
  grade?: string;
  subject?: string;
  price?: string;
  format?: string;
  sort?: string;
  seller?: string;
}

export async function searchProducts(params: SearchParams) {
  const { q, grade, subject, price, format, sort, seller } = params;

  // Build Prisma where clause
  const where: any = {};

  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { title: { contains: term } },
      { description: { contains: term } },
      { subjects: { contains: term } },
      { gradeLevels: { contains: term } },
      { standardsAlignment: { contains: term } },
    ];
  }

  if (grade && grade !== "all") {
    where.gradeLevels = { contains: grade };
  }

  if (subject && subject !== "all") {
    where.subjects = { contains: subject };
  }

  if (format && format !== "all") {
    if (format === "Easel") {
      where.isEaselReady = true;
    } else {
      where.fileFormats = { contains: format };
    }
  }

  if (seller && seller !== "all") {
    where.seller = {
      storeName: { contains: seller },
    };
  }

  if (price && price !== "all") {
    if (price === "free") {
      where.isFree = true;
    } else if (price === "under-5") {
      where.priceCents = { gt: 0, lte: 500 };
    } else if (price === "5-to-10") {
      where.priceCents = { gt: 500, lte: 1000 };
    } else if (price === "10-plus") {
      where.priceCents = { gt: 1000 };
    }
  }

  // Sorting
  let orderBy: any = { totalDownloads: "desc" };
  if (sort === "rating") {
    orderBy = { ratingAverage: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "price-low") {
    orderBy = { priceCents: "asc" };
  } else if (sort === "price-high") {
    orderBy = { priceCents: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      seller: true,
      previews: true,
    },
  });

  return products;
}
