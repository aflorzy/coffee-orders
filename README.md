# Coffee Orders ☕

Mobile-first web app for capturing and displaying coffee orders from friends during home coffee sessions.

## Features

- **Order form** — pick a drink, customize temp/syrup/sweetness/milk/caffeine, submit with your name
- **Orders board** — live view of all orders, auto-refreshes every 15 seconds
- **Admin config** — edit drink defaults, manage syrup options, add/edit beans with photos and tasting notes
- **Aerocano support** — steamed americano available as a style toggle on the Americano order

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com) with a custom coffee color palette
- [SQLite](https://www.sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Description |
|-------|-------------|
| `/` | Place an order |
| `/orders` | View all orders |
| `/admin` | Configure drink defaults and syrups |
| `/admin/beans` | Manage bean inventory |

## Notes

- No authentication — `/admin` is open by default. Add network-level access control if needed.
- The SQLite database (`coffee-orders.db`) is created automatically on first run and excluded from git.
- Drink defaults (temp, syrup, sweetness, milk, caffeine) are configurable per drink from the admin page.
