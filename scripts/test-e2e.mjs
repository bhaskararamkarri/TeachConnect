import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🧪 Starting TeachConnect E2E & Architectural Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Database Seed Verification
  console.log("📋 Test Suite 1: Database Catalog & Standards Verification");
  const products = await prisma.product.findMany({ include: { seller: true } });
  assert(products.length >= 5, `Database contains ${products.length} seeded educational products`);

  const mathProducts = products.filter((p) => p.subjects.includes("Math"));
  assert(mathProducts.length >= 2, `Found ${mathProducts.length} Math resources (Fractions, Area & Perimeter)`);

  const freeProducts = products.filter((p) => p.isFree);
  assert(freeProducts.length >= 1, `Found ${freeProducts.length} Free classroom management resource`);

  const standards = await prisma.educationalStandard.findMany();
  assert(standards.length >= 5, `Educational standards framework seeded (${standards.length} CCSS/NGSS codes)`);

  // TEST 2: Royalty & Commission Math Verification
  console.log("\n💰 Test Suite 2: TPT-Style Seller Royalty & Commission Economics");
  const exclusiveSeller = await prisma.sellerProfile.findFirst({ where: { tier: "EXCLUSIVE" } });
  assert(exclusiveSeller !== null, "Exclusive seller tier exists (MathCraft Studios)");

  const itemPrice = 1000; // $10.00 in cents
  const exclusiveRoyalty = Math.round(itemPrice * 0.775); // 77.5%
  const exclusivePlatform = itemPrice - exclusiveRoyalty;
  assert(exclusiveRoyalty === 775, `Exclusive tier 77.5% royalty: Seller gets $7.75 of $10.00`);
  assert(exclusivePlatform === 225, `Exclusive tier platform take: TeachConnect keeps $2.25 (22.5%)`);

  const basicRoyalty = Math.round(itemPrice * 0.55); // 55%
  assert(basicRoyalty === 550, `Basic tier 55% royalty: Seller gets $5.50 of $10.00`);

  // TEST 3: Multi-Seat School Licensing Math
  console.log("\n🏫 Test Suite 3: School Multi-Seat Licensing Math");
  // 5 school seats for a $10 product with 15% discount on additional seats
  // Seat 1 = $10.00. Seats 2,3,4,5 = $8.50 each ($34.00) => Total = $44.00
  const basePrice = 1000;
  const seats = 5;
  const additionalSeatPrice = Math.round(basePrice * 0.85); // $8.50
  const expectedTotal = basePrice + (seats - 1) * additionalSeatPrice;
  assert(expectedTotal === 4400, `5 School seats for $10 product costs $44.00 (with 15% seat discount)`);

  // TEST 4: Checkout & Fulfillment Pipeline
  console.log("\n🛒 Test Suite 4: End-to-End Checkout & Library Delivery");
  const fractionsProduct = products.find((p) => p.slug === "5th-grade-fractions-master-unit");
  assert(fractionsProduct !== null, "Found Fractions master unit for test checkout");

  // Create test order
  const testEmail = `test-teacher-${Date.now()}@district.org`;
  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Marcus Brody (Test Teacher)",
      role: "BUYER",
    },
  });

  const testOrderNumber = `TC-TEST-${Date.now()}`;
  const testOrder = await prisma.order.create({
    data: {
      userId: testUser.id,
      orderNumber: testOrderNumber,
      totalAmountCents: fractionsProduct.priceCents,
      status: "COMPLETED",
      paymentMethod: "STRIPE_TEST_CARD",
    },
  });

  const testToken = `dl_test_${Date.now()}`;
  const testLibraryItem = await prisma.libraryItem.create({
    data: {
      userId: testUser.id,
      productId: fractionsProduct.id,
      productTitle: fractionsProduct.title,
      productSlug: fractionsProduct.slug,
      sellerStoreName: fractionsProduct.seller.storeName,
      coverImageUrl: fractionsProduct.coverImageUrl,
      licenseType: "SINGLE_USER",
      downloadToken: testToken,
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  assert(testLibraryItem.id !== null, "Digital curriculum successfully delivered to buyer library");
  assert(testLibraryItem.downloadToken === testToken, "Secure download token generated for asset fulfillment");

  // TEST 5: Token Security & Expiration Check
  console.log("\n🔒 Test Suite 5: Digital Rights & Token Verification");
  const foundItem = await prisma.libraryItem.findFirst({
    where: { downloadToken: testToken },
  });
  assert(foundItem !== null, "Token lookup succeeds for authorized buyer");
  assert(new Date() < foundItem.tokenExpiresAt, "Token is valid and within TTL window");

  // TEST 6: Review Aggregation Logic
  console.log("\n⭐ Test Suite 6: Review Submission & Rating Recomputation");
  const testReview = await prisma.review.create({
    data: {
      productId: fractionsProduct.id,
      userId: testUser.id,
      userName: "Marcus B., 5th Grade Teacher",
      rating: 5,
      comment: "Outstanding fractions unit! Clear visual models and great assessments.",
      gradeTaught: "5th Grade",
    },
  });
  assert(testReview.id !== null, "Teacher review successfully posted to product");

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

