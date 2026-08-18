# Hammam Site

**Authentic hammams of Istanbul — booked in four languages.**

Multilingual booking site for hammam experiences in Istanbul. Guests browse a curated catalog with photos, prices, and TripAdvisor ratings, then send a request for a chosen date and time. Owners manage everything from a separate admin panel.

[English](/en) · [Русский](/ru) · [中文](/zh) · [Português](/pt)

---

## Features

- Catalog of hammams: photos, address, price, TripAdvisor rating and link
- Booking request from each card (name, contacts, place, date, slot)
- Quick callback from the navbar (name + phone)
- Inquiries saved in the database and emailed to the owner
- Admin panel at `/admin`: CRUD hammams, 30-minute slots, incoming requests
- Locales: English, Russian, Chinese, Portuguese
- Marble-and-gold visual identity with a compass-and-waves logo

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router), TypeScript, Tailwind CSS |
| i18n | next-intl (`en` / `ru` / `zh` / `pt`) |
| Database | Prisma + SQLite locally (PostgreSQL-ready) |
| Mail | Nodemailer (SMTP) |
| Motion | Framer Motion |

## Quick start

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Then open:

| Page | URL |
| --- | --- |
| Public site | http://localhost:3000/en |
| Admin | http://localhost:3000/admin |

Default admin password: `admin123` (change it in `.env`).

## Environment

Copy `.env.example` to `.env` and fill in secrets:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="change-me"
ADMIN_SESSION_SECRET="change-me-to-a-long-random-string"
MAIL_TO="blackleon1699@gmail.com"
NEXT_PUBLIC_SITE_NAME="Hammam Site"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""
```

Without SMTP credentials, inquiry emails are logged to the server console and still stored in the database.

## Admin workflow

1. Sign in at `/admin`
2. Create a hammam (localized name, address, description, photos, TripAdvisor, price)
3. Publish it
4. Open **Slots** and generate 30-minute windows for a date
5. Guest requests appear under **Inquiries** and are emailed to `MAIL_TO`

Slots are availability options only: sending a request does **not** lock the slot.

## Optional PostgreSQL

`docker-compose.yml` is included. When Docker is available:

1. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`
2. Set `DATABASE_URL` to the Postgres connection string
3. Run `npx prisma db push`

## Scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve production build
npm run db:push      # sync Prisma schema
npm run db:seed      # sample hammam + slots
npm run db:studio    # Prisma Studio
```

## License

Private project. All rights reserved.
