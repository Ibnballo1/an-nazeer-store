# An-Nazeer Holistic Home Ltd — E-Commerce Platform

A production-ready, mobile-first e-commerce website for a certified herbal and natural wellness brand.

## Tech Stack

| Layer              | Technology              |
| ------------------ | ----------------------- |
| **Framework**      | Next.js 14 (App Router) |
| **Language**       | TypeScript              |
| **Styling**        | Tailwind CSS            |
| **UI Components**  | shadcn/ui + Radix UI    |
| **Database**       | Supabase (PostgreSQL)   |
| **ORM**            | Drizzle ORM             |
| **Authentication** | BetterAuth              |
| **Payments**       | Paystack (NGN)          |
| **State**          | Zustand (cart)          |
| **Forms**          | React Hook Form + Zod   |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── shop/page.tsx               # Shop with filter & search
│   ├── product/[slug]/page.tsx     # Product detail
│   ├── cart/page.tsx               # Cart page
│   ├── checkout/page.tsx           # Checkout with Paystack
│   ├── order-success/page.tsx      # Post-payment success
│   ├── about/page.tsx              # Brand story
│   ├── contact/page.tsx            # Contact + consultation
│   ├── login/page.tsx              # Auth
│   ├── register/page.tsx           # Auth
│   ├── admin/
│   │   ├── dashboard/page.tsx      # Stats overview
│   │   ├── products/page.tsx       # Product CRUD
│   │   ├── orders/page.tsx         # Order management
│   │   ├── customers/page.tsx      # Customer list
│   │   ├── categories/page.tsx     # Category CRUD
│   │   └── consultations/page.tsx  # Health consultation requests
│   └── api/
│       ├── auth/[...all]/route.ts  # BetterAuth handler
│       └── payment/verify/route.ts # Paystack callback
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── whatsapp-button.tsx
│   ├── shop/
│   │   └── shop-content.tsx
│   └── admin/
│       └── admin-sidebar.tsx
└── lib/
    ├── db/
    │   ├── index.ts                # Drizzle client
    │   └── schema.ts               # All table schemas
    ├── auth/
    │   ├── auth.ts                 # BetterAuth server config
    │   └── auth-client.ts          # BetterAuth client hooks
    ├── payments/
    │   └── paystack.ts             # Paystack API helpers
    ├── store/
    │   └── cart-store.ts           # Zustand cart store
    └── actions/
        ├── products.ts             # Product server actions
        └── orders.ts               # Order + payment server actions
```

---

## Database Schema

### Tables

- **users** — registered customers & admins (BetterAuth compatible)
- **sessions** — user sessions
- **accounts** — OAuth provider accounts
- **verifications** — email verification tokens
- **categories** — product categories (Herbs, Spices, Beauty, etc.)
- **products** — full product catalog with NAFDAC, images, benefits
- **orders** — orders (registered users + guest checkout)
- **order_items** — line items per order
- **payments** — Paystack payment records
- **reviews** — product reviews (verified + guest)
- **consultation_requests** — health consultation form submissions

---

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd an-nazeer-holistic-home
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy the **Transaction Pooler** connection string → `DATABASE_URL`
3. Copy anon key and project URL for `NEXT_PUBLIC_SUPABASE_*`

### 4. Run database migrations

```bash
npm run db:generate   # generate migrations from schema
npm run db:migrate    # apply to database
# OR for rapid dev:
npm run db:push       # push schema directly (no migration files)
```

### 5. Seed categories

```sql
-- Run in Supabase SQL editor:
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Herbs', 'herbs', 1),
  ('Food Spices', 'food-spices', 2),
  ('Beauty Products', 'beauty-products', 3),
  ('Natural Aphrodisiacs', 'natural-aphrodisiacs', 4),
  ('Gorontula Products', 'gorontula-products', 5),
  ('Wellness Remedies', 'wellness-remedies', 6);
```

### 6. Create first admin user

```sql
-- After registering via /register, promote to admin:
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 7. Configure Paystack

1. Create account at [paystack.com](https://paystack.com)
2. Get test keys from Dashboard → Settings → API Keys
3. Add to `.env.local`
4. Set callback URL: `https://yourdomain.com/api/payment/verify`

### 8. Start development

```bash
npm run dev
```

---

## Key Features

### Storefront

- ✅ Mobile-first responsive design
- ✅ Hero section with brand messaging
- ✅ Category browsing (6 product categories)
- ✅ Product grid with search & filtering
- ✅ Product detail with gallery, benefits, ingredients
- ✅ Persistent cart (localStorage via Zustand)
- ✅ Guest checkout (no account required)
- ✅ Paystack payment integration (NGN)
- ✅ Order confirmation + email-ready
- ✅ Sticky WhatsApp button
- ✅ SEO-optimized pages

### Authentication

- ✅ Email/password registration & login
- ✅ Secure sessions (BetterAuth)
- ✅ Guest checkout without account
- ✅ Role-based access (user / admin)

### Admin Dashboard

- ✅ Revenue & order statistics
- ✅ Product CRUD (add/edit/delete/images)
- ✅ Category management
- ✅ Order management & status updates
- ✅ Customer list
- ✅ Health consultation submissions

### Design

- ✅ Brand colors: Primary #0f7a3a, Dark #0a5c2c
- ✅ Fonts: Playfair Display (headings) + DM Sans (body)
- ✅ Natural, wellness-focused aesthetic
- ✅ Soft shadows, rounded cards
- ✅ Loading skeletons
- ✅ Toast notifications (Sonner)

---

## Payment Flow

```
1. Customer fills checkout form
2. Server creates Order + Payment records (status: pending)
3. Server calls Paystack Initialize API
4. Customer redirected to Paystack checkout page
5. After payment, Paystack redirects to /api/payment/verify?reference=xxx
6. Server verifies payment with Paystack Verify API
7. Order + Payment status updated to paid/confirmed
8. Customer redirected to /order-success
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel deploy
# Set all env vars in Vercel dashboard
```

### Environment Variables for Production

- Update `NEXT_PUBLIC_APP_URL` to production domain
- Switch Paystack keys from `sk_test_` to `sk_live_`
- Update `BETTER_AUTH_URL` to production URL

---

## Color Palette

| Name          | Hex                  |
| ------------- | -------------------- |
| Primary Green | `#0f7a3a`            |
| Dark Green    | `#0a5c2c`            |
| Brand Black   | `#111111`            |
| Background    | `#fafaf9` (stone-50) |
| WhatsApp      | `#25D366`            |
