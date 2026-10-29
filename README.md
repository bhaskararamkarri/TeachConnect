# TeachConnect 🎓
> **The Educator-to-Educator Resource Marketplace**  
> *Inspired by the architecture & business model of Teachers Pay Teachers (TPT).*

TeachConnect is a peer-to-peer educational marketplace where teachers, tutors, and homeschooling educators discover, buy, and sell original curriculum packages, unit plans, printables, and interactive digital assignments.

---

## 🌟 Key Features

### 🛒 1. Marketplace & Discovery
- **Faceted Educational Search:** Instant filtering by **Grade Level** (Pre-K through High School), **Subject Area** (Math, ELA, Science, Social Studies, etc.), **Format** (PDF, Google Apps, Easel Activity), and **Price Range** (Free, Under $5, $5–$10, $10+).
- **Educational Standards Mapping:** Full alignment with Common Core State Standards (CCSS) and Next Generation Science Standards (NGSS).
- **Watermarked Preview Viewer:** Automated Digital Rights Management (DRM) modal with semi-transparent diagonal watermarking across sample pages.

### 🏫 2. Dual Licensing Engine
- **Individual Classroom License:** For a single educator's personal classroom use.
- **Multi-Seat School License:** For grade-level teams or school districts, with automated **15% volume discounts** on additional teacher seats.

### 💳 3. Checkout & Instant Digital Fulfillment
- **Instant Digital Delivery:** Immediate post-checkout download vault and automatic delivery to user's personal curriculum library.
- **Expiring Secure Download Tokens:** Time-expiring download URLs (`/api/download/[token]`) preventing unauthorized file scraping.
- **Promo Code Engine:** Educational discounts (e.g. `BTS2026` for 20% off).
- **Payment Methods:** Support for credit/debit card processing and official School Purchase Orders (POs) for district procurement.

### 👩‍🏫 4. Teacher-Author / Seller Portal
- **Seller Economics:** 
  - **Exclusive Tier:** 77.5% creator payout royalty with $0 transaction fees on standard carts.
  - **Basic Tier:** 55% creator payout royalty ($0.30 transaction fee per item).
- **Analytics & Dashboards:** Real-time metrics for net royalties, curriculum downloads, store ratings, and live order streams.
- **Publishing Ingestion Wizard:** Complete product upload pipeline with grade, subject, and standard tagging, preview generator, and Easel activity toggles.
- **Stripe Connect Integration:** Payout tracking and direct deposit history.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React Server Components)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & ORM:** [Prisma ORM](https://www.prisma.io/) with SQLite (fully swappable with PostgreSQL / Supabase)
- **Testing:** Custom end-to-end integration test suite (`scripts/test-e2e.mjs`)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/bhaskararamkarri/TeachConnect.git
cd TeachConnect
npm install
```

### 2. Database Setup & Seeding
```bash
# Push Prisma schema to local SQLite database
npx prisma db push

# Seed curriculum products, standards, and teacher stores
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated E2E Tests
```bash
node scripts/test-e2e.mjs
```

---

## 📂 Project Structure

```text
TeachConnect/
├── prisma/
│   ├── schema.prisma           # Relational schema (Users, Products, Orders, Licenses, Standards)
│   └── dev.db                  # Local SQLite database
├── scripts/
│   ├── seed.mjs                # Realistic curriculum seeding script
│   └── test-e2e.mjs            # 15-point automated verification suite
├── src/
│   ├── app/
│   │   ├── actions/            # Server actions (checkout, seller, reviews)
│   │   ├── api/download/       # Expiring token download delivery route
│   │   ├── checkout/           # Checkout & order confirmation
│   │   ├── library/            # Buyer curriculum library & downloads
│   │   ├── product/[slug]/     # Product details & licensing
│   │   ├── search/             # Faceted search & discovery catalog
│   │   ├── seller/             # Seller dashboard, upload wizard & payouts
│   │   ├── layout.tsx          # Root layout with CartProvider & Navbar
│   │   └── page.tsx            # Marketplace homepage
│   ├── components/             # Reusable UI components (Navbar, CartDrawer, ProductCard, etc.)
│   └── lib/                    # Prisma client, search engine, formatting utilities
└── README.md
```

---

## 📄 License
MIT © 2026 TeachConnect Technologies.
