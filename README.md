# FrameMarket ⚡

> **Great websites start with great templates.**

FrameMarket is a modern, full-stack digital marketplace connecting independent Framer website template creators with founders, agencies, and businesses worldwide.

> **Disclaimer**: FrameMarket is an independent marketplace for digital website templates built for Framer. It is not affiliated with, endorsed by, or sponsored by Framer B.V.

---

## 🌟 Key Features

### 🛍️ Buyer Experience
- **Interactive Template Catalog**: Filter by category, price (Free vs Paid), keyword, and sorting (Popular, Rating, Newest, Price).
- **Responsive Live Preview**: Test designs in real-time with responsive Desktop (100%), Tablet (768px), and Mobile (390px) device frame switches.
- **Instant Digital Delivery**: One-click Framer Remix links duplicate templates directly into your Framer workspace upon payment.
- **Cryptographic Licenses**: Unique license keys (e.g. `FM-NOVA-XXXX-STD`) issued with each verified purchase.
- **Protected Downloads**: Server-verified asset downloads with signed delivery records.

### 🎨 Creator Experience
- **90% Creator Revenue Share**: Industry-leading 10% transparent platform fee model with automated ledger math.
- **Multi-Step Template Publishing Wizard**: 5-step wizard covering metadata, media assets, Framer remix links, specifications, and pricing.
- **Creator Dashboard**: Real-time sales charts powered by Recharts, gross GMV, net earnings, and sales audit logs.
- **Automated Payouts**: UPI and Indian Bank Wire support with withdrawal request tracking.
- **Custom Creator Storefront**: Verified creator badges, bio, social links, and public product catalog.

### 🛡️ Administration & Operations
- **Role-Based Server Authorization**: Dedicated `BUYER`, `CREATOR`, and `ADMIN` role access control.
- **Product Moderation Queue**: Review, approve, reject, hide, and restore marketplace listings.
- **User Management**: Monitor registrations and suspend/restore accounts.
- **Financial Controls**: Configurable platform commission take rates.
- **Audit Logging**: Automated tracking of administrative actions and high-value orders.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & ORM**: PostgreSQL-compatible Prisma ORM (configured with SQLite for zero-setup instant local running)
- **Analytics**: Recharts
- **Authentication**: JWT Sessions (`jose`) with bcrypt password hashing & secure cookies
- **Validation**: Zod & React Hook Form standards

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/punithkumarnallabothula-143/market.git
cd market

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Default `.env` settings:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="framemarket-super-secret-jwt-key-change-in-production-32bytes"
DEFAULT_CURRENCY="INR"
PLATFORM_COMMISSION_PERCENTAGE="10"
```

### 4. Database Setup & Seeding
Initialize the database and populate 12 distinct Framer templates, categories, and demo accounts:
```bash
npm run db:push
npm run db:seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Credentials

The seed script creates pre-configured accounts for testing:

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@framemarket.dev` | `AdminPassword123!` |
| **Creator** | `elena@framemarket.dev` | `CreatorPassword123!` |
| **Creator** | `marco@framemarket.dev` | `CreatorPassword123!` |
| **Buyer** | `buyer@framemarket.dev` | `BuyerPassword123!` |

*(One-click demo login buttons are also provided directly on `/login`)*

---

## 🧪 Testing

Run the automated test suite covering financial commission calculations, license generators, and authentication:
```bash
npm test
```

---

## 📦 Production Deployment

FrameMarket is designed for 1-click deployment to **Vercel**, **Railway**, or any Node.js hosting platform:

1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, set:
   - `DATABASE_URL`: Your production PostgreSQL connection string (Supabase, Neon, or Railway)
   - `JWT_SECRET`: A secure 32+ character random string
   - `PLATFORM_COMMISSION_PERCENTAGE`: `10`
3. If switching to PostgreSQL, change `provider = "postgresql"` in `prisma/schema.prisma` and run `npx prisma db push`.
4. Deploy!
