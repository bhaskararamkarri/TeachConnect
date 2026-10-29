import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing database...");
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.libraryItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productPreview.deleteMany();
  await prisma.productFile.deleteMany();
  await prisma.product.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.educationalStandard.deleteMany();

  console.log("📚 Seeding Educational Standards...");
  await prisma.educationalStandard.createMany({
    data: [
      {
        code: "CCSS.MATH.CONTENT.5.NF.A.1",
        framework: "CCSS",
        subject: "Math",
        grade: "5th Grade",
        description: "Add and subtract fractions with unlike denominators by replacing them with equivalent fractions.",
      },
      {
        code: "CCSS.MATH.CONTENT.5.NF.B.4",
        framework: "CCSS",
        subject: "Math",
        grade: "5th Grade",
        description: "Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.",
      },
      {
        code: "CCSS.ELA-LITERACY.RF.K.2",
        framework: "CCSS",
        subject: "ELA",
        grade: "Kindergarten",
        description: "Demonstrate understanding of spoken words, syllables, and sounds (phonemes).",
      },
      {
        code: "CCSS.ELA-LITERACY.RF.K.3",
        framework: "CCSS",
        subject: "ELA",
        grade: "Kindergarten",
        description: "Know and apply grade-level phonics and word analysis skills in decoding words.",
      },
      {
        code: "NGSS.MS-ESS2-1",
        framework: "NGSS",
        subject: "Science",
        grade: "Middle School",
        description: "Develop a model to describe the cycling of Earth materials and the flow of energy that drives this process.",
      },
      {
        code: "CCSS.ELA-LITERACY.RH.9-10.1",
        framework: "CCSS",
        subject: "Social Studies",
        grade: "High School",
        description: "Cite specific textual evidence to support analysis of primary and secondary sources.",
      },
      {
        code: "CCSS.MATH.CONTENT.3.MD.C.7",
        framework: "CCSS",
        subject: "Math",
        grade: "3rd Grade",
        description: "Relate area to the operations of multiplication and addition.",
      },
    ],
  });

  console.log("👩‍🏫 Seeding Users & Teacher-Authors...");

  // Default Buyer Demo Account
  const buyerUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins (Demo Teacher)",
      email: "teacher@school.edu",
      role: "BUYER",
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Creator 1: Mrs. Davis (Math Specialist)
  const creatorUser1 = await prisma.user.create({
    data: {
      name: "Amanda Davis, M.Ed.",
      email: "davis@mathcraft.io",
      role: "SELLER",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      sellerProfile: {
        create: {
          storeName: "MathCraft Studios",
          storeSlug: "mathcraft-studios",
          tagline: "Rigorous, visual, and engaging upper-elementary math curricula.",
          bio: "National Board Certified 5th grade teacher with 14 years of experience crafting visual math scaffolds that help students conquer conceptual hurdles.",
          bannerUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          tier: "EXCLUSIVE",
          stripeAccountId: "acct_demo_mathcraft",
          ratingAverage: 4.95,
          ratingCount: 202,
          totalSales: 1470,
          totalEarningsCents: 852000,
        },
      },
    },
    include: { sellerProfile: true },
  });

  // Creator 2: Little Learners Academy (Early Childhood Phonics)
  const creatorUser2 = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena@littlelearners.org",
      role: "SELLER",
      avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
      sellerProfile: {
        create: {
          storeName: "Little Learners Early Phonics",
          storeSlug: "little-learners-phonics",
          tagline: "Science of Reading (SoR) aligned decodables & multisensory phonics.",
          bio: "Kindergarten reading specialist passionate about structured literacy, multisensory orthographic mapping, and joyful early reader confidence.",
          bannerUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80",
          avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
          tier: "EXCLUSIVE",
          stripeAccountId: "acct_demo_phonics",
          ratingAverage: 4.98,
          ratingCount: 165,
          totalSales: 2180,
          totalEarningsCents: 1145000,
        },
      },
    },
    include: { sellerProfile: true },
  });

  // Creator 3: STEM Discovery Lab (Middle School Science)
  const creatorUser3 = await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "marcus@stemdiscovery.com",
      role: "SELLER",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      sellerProfile: {
        create: {
          storeName: "STEM Discovery Lab",
          storeSlug: "stem-discovery-lab",
          tagline: "Hands-on, inquiry-driven Middle School NGSS science units.",
          bio: "Middle school science department chair bringing laboratory excitement and interactive phenomenon-based investigations to students nationwide.",
          bannerUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80",
          avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
          tier: "EXCLUSIVE",
          stripeAccountId: "acct_demo_stem",
          ratingAverage: 4.88,
          ratingCount: 110,
          totalSales: 940,
          totalEarningsCents: 520000,
        },
      },
    },
    include: { sellerProfile: true },
  });

  console.log("📦 Seeding Educational Products & Previews...");

  // Product 1
  const p1 = await prisma.product.create({
    data: {
      sellerId: creatorUser1.sellerProfile.id,
      title: "5th Grade Complete Fractions Master Unit: Operations, Visual Models & Real-World Word Problems",
      slug: "5th-grade-fractions-master-unit",
      description: "Conquer fraction anxiety with this comprehensive 4-week instructional unit. Includes 24 differentiated guided lessons, visual bar model scaffolds, daily warm-ups, error-analysis tasks, and 3 summative unit assessments with complete step-by-step answer keys.",
      priceCents: 850,
      isFree: false,
      gradeLevels: JSON.stringify(["5th Grade", "6th Grade"]),
      subjects: JSON.stringify(["Math", "Fractions", "Word Problems"]),
      resourceTypes: JSON.stringify(["Unit Plans", "Worksheets", "Assessments"]),
      pageCount: 142,
      fileFormats: "PDF, Google Slides, Easel Activity",
      isEaselReady: true,
      standardsAlignment: JSON.stringify(["CCSS.MATH.CONTENT.5.NF.A.1", "CCSS.MATH.CONTENT.5.NF.B.4"]),
      totalDownloads: 850,
      ratingAverage: 4.92,
      ratingCount: 124,
      coverImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
      files: {
        create: [
          {
            fileName: "Fractions_Unit_Teacher_Guide.pdf",
            fileSize: 18450000,
            mimeType: "application/pdf",
            fileKey: "vault/mathcraft/fractions-guide-v1.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
          {
            fileName: "Student_Visual_Worksheets_Printable.pdf",
            fileSize: 12200000,
            mimeType: "application/pdf",
            fileKey: "vault/mathcraft/student-worksheets.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
          {
            fileName: "Summative_Assessments_Answer_Keys.pdf",
            fileSize: 4500000,
            mimeType: "application/pdf",
            fileKey: "vault/mathcraft/answer-keys.pdf",
            fileType: "ANSWER_KEY",
          },
        ],
      },
      previews: {
        create: [
          {
            previewUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80",
            pageNumber: 1,
            sortOrder: 1,
            watermarkText: "TEACHCONNECT PREVIEW - PAGE 1",
          },
          {
            previewUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
            pageNumber: 2,
            sortOrder: 2,
            watermarkText: "TEACHCONNECT PREVIEW - PAGE 2",
          },
          {
            previewUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80",
            pageNumber: 3,
            sortOrder: 3,
            watermarkText: "TEACHCONNECT PREVIEW - PAGE 3",
          },
        ],
      },
    },
  });

  // Product 2
  const p2 = await prisma.product.create({
    data: {
      sellerId: creatorUser2.sellerProfile.id,
      title: "Science of Reading CVC Word Decodable Readers & Orthographic Mapping Mats",
      slug: "science-of-reading-cvc-word-decodables",
      description: "Explicit, systematic phonics practice designed for emerging readers. Includes 30 printable decodable mini-books covering short vowels a, e, i, o, u, paired with multisensory sound-box mapping worksheets and teacher coaching prompts.",
      priceCents: 600,
      isFree: false,
      gradeLevels: JSON.stringify(["Kindergarten", "1st Grade"]),
      subjects: JSON.stringify(["ELA", "Reading", "Phonics"]),
      resourceTypes: JSON.stringify(["Printables", "Guided Reading Books", "Centers"]),
      pageCount: 96,
      fileFormats: "PDF, Printable Booklets",
      isEaselReady: true,
      standardsAlignment: JSON.stringify(["CCSS.ELA-LITERACY.RF.K.2", "CCSS.ELA-LITERACY.RF.K.3"]),
      totalDownloads: 1200,
      ratingAverage: 4.98,
      ratingCount: 89,
      coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
      files: {
        create: [
          {
            fileName: "Decodables_30_MiniBooks_Bundle.pdf",
            fileSize: 24500000,
            mimeType: "application/pdf",
            fileKey: "vault/phonics/cvc-decodables.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
        ],
      },
      previews: {
        create: [
          {
            previewUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
            pageNumber: 1,
            sortOrder: 1,
            watermarkText: "TEACHCONNECT PREVIEW - SAMPLE MINI BOOK",
          },
          {
            previewUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
            pageNumber: 2,
            sortOrder: 2,
            watermarkText: "TEACHCONNECT PREVIEW - SOUND BOX MATS",
          },
        ],
      },
    },
  });

  // Product 3
  const p3 = await prisma.product.create({
    data: {
      sellerId: creatorUser3.sellerProfile.id,
      title: "Plate Tectonics, Earthquakes & Volcanoes: Interactive NGSS Investigation Lab",
      slug: "plate-tectonics-interactive-lab",
      description: "Students explore tectonic boundaries, convection currents in the mantle, and seafloor spreading through structured inquiry data stations. Compatible with 1:1 digital classrooms or printed hands-on lab notebooks.",
      priceCents: 525,
      isFree: false,
      gradeLevels: JSON.stringify(["6th Grade", "7th Grade", "8th Grade"]),
      subjects: JSON.stringify(["Science", "Earth Science", "Geology"]),
      resourceTypes: JSON.stringify(["Laboratory Activities", "Interactive Notebooks", "Google Apps"]),
      pageCount: 58,
      fileFormats: "PDF, Google Slides, Google Forms Quiz",
      isEaselReady: true,
      standardsAlignment: JSON.stringify(["NGSS.MS-ESS2-1"]),
      totalDownloads: 430,
      ratingAverage: 4.86,
      ratingCount: 67,
      coverImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      files: {
        create: [
          {
            fileName: "Plate_Tectonics_Lab_Guide.pdf",
            fileSize: 15400000,
            mimeType: "application/pdf",
            fileKey: "vault/science/plate-tectonics-lab.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
        ],
      },
      previews: {
        create: [
          {
            previewUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
            pageNumber: 1,
            sortOrder: 1,
            watermarkText: "TEACHCONNECT PREVIEW - LAB OVERVIEW",
          },
        ],
      },
    },
  });

  // Product 4: Freebie
  const p4 = await prisma.product.create({
    data: {
      sellerId: creatorUser1.sellerProfile.id,
      title: "Back-to-School Classroom Routines & Positive Behavior Visual Anchor Charts (FREE)",
      slug: "classroom-routines-visual-anchor-charts-free",
      description: "Establish strong classroom expectations from Day One! Includes 12 high-resolution, full-color printable anchor charts for morning arrival, transitions, group work, independent reading, and dismissal routines.",
      priceCents: 0,
      isFree: true,
      gradeLevels: JSON.stringify(["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"]),
      subjects: JSON.stringify(["Classroom Management", "Back to School", "Special Education"]),
      resourceTypes: JSON.stringify(["Printables", "Posters & Anchor Charts"]),
      pageCount: 16,
      fileFormats: "PDF, High-Res PNGs",
      isEaselReady: false,
      standardsAlignment: JSON.stringify([]),
      totalDownloads: 4500,
      ratingAverage: 4.95,
      ratingCount: 380,
      coverImageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      files: {
        create: [
          {
            fileName: "Classroom_Routines_Anchor_Charts.pdf",
            fileSize: 9800000,
            mimeType: "application/pdf",
            fileKey: "vault/mathcraft/routines-charts.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
        ],
      },
      previews: {
        create: [
          {
            previewUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
            pageNumber: 1,
            sortOrder: 1,
            watermarkText: "TEACHCONNECT FREE SAMPLE",
          },
        ],
      },
    },
  });

  // Product 5
  const p5 = await prisma.product.create({
    data: {
      sellerId: creatorUser1.sellerProfile.id,
      title: "Area & Perimeter Hands-On Task Cards, Real-World Blueprints & Error Analysis",
      slug: "area-and-perimeter-hands-on-task-cards",
      description: "Engage students with 36 differentiated task cards exploring composite rectilinear shapes, missing side lengths, and architect blueprint challenges. Complete with student recording sheets and teacher answer keys.",
      priceCents: 450,
      isFree: false,
      gradeLevels: JSON.stringify(["3rd Grade", "4th Grade"]),
      subjects: JSON.stringify(["Math", "Geometry", "Measurement"]),
      resourceTypes: JSON.stringify(["Task Cards", "Math Centers", "Games"]),
      pageCount: 44,
      fileFormats: "PDF, Easel Activity",
      isEaselReady: true,
      standardsAlignment: JSON.stringify(["CCSS.MATH.CONTENT.3.MD.C.7"]),
      totalDownloads: 620,
      ratingAverage: 4.89,
      ratingCount: 78,
      coverImageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
      files: {
        create: [
          {
            fileName: "Area_Perimeter_Task_Cards_36.pdf",
            fileSize: 8400000,
            mimeType: "application/pdf",
            fileKey: "vault/mathcraft/area-perimeter-cards.pdf",
            fileType: "MAIN_DOWNLOAD",
          },
        ],
      },
      previews: {
        create: [
          {
            previewUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80",
            pageNumber: 1,
            sortOrder: 1,
            watermarkText: "TEACHCONNECT PREVIEW",
          },
        ],
      },
    },
  });

  console.log("⭐ Seeding Reviews...");
  await prisma.review.createMany({
    data: [
      {
        productId: p1.id,
        userId: buyerUser.id,
        userName: "Sarah J., 5th Grade Teacher",
        rating: 5,
        comment: "This fractions unit completely changed my math block! The visual bar models helped my struggling students understand unlike denominators so much faster.",
        gradeTaught: "5th Grade",
        helpfulVotes: 24,
      },
      {
        productId: p1.id,
        userId: creatorUser2.id,
        userName: "Mark R., Elementary Math Specialist",
        rating: 5,
        comment: "Top notch curriculum. The error analysis warmups gave my students authentic math talk opportunities every single day.",
        gradeTaught: "5th Grade",
        helpfulVotes: 18,
      },
      {
        productId: p2.id,
        userId: buyerUser.id,
        userName: "Jessica L., Title I Reading Interventionist",
        rating: 5,
        comment: "My kindergarteners love these decodables! The orthographic mapping mats ensure they are actually blending and segmenting instead of guessing pictures.",
        gradeTaught: "Kindergarten",
        helpfulVotes: 32,
      },
    ],
  });

  console.log("🎒 Seeding Buyer Library Item (Sarah has already purchased Fractions)...");
  await prisma.libraryItem.create({
    data: {
      userId: buyerUser.id,
      productId: p1.id,
      productTitle: p1.title,
      productSlug: p1.slug,
      sellerStoreName: creatorUser1.sellerProfile.storeName,
      coverImageUrl: p1.coverImageUrl,
      licenseType: "SINGLE_USER",
      downloadCount: 2,
      lastDownloadedAt: new Date(),
      downloadToken: "demo-token-sarah-fractions-2026",
    },
  });

  console.log("💰 Seeding Payouts for Sellers...");
  await prisma.payout.create({
    data: {
      sellerId: creatorUser1.sellerProfile.id,
      amountCents: 124500, // $1,245.00
      status: "PAID",
      payoutPeriod: "September 2026",
      transferRef: "tr_stripe_982348234",
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

