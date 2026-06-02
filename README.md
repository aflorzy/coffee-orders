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

## Deployment

The app is deployed via Docker on a homelab server behind a reverse proxy. CI/CD runs through Gitea Actions.

### How it works

A push to `main` triggers the CI pipeline:
1. Builds a Docker image and pushes it to the Gitea container registry
2. Sends a signed webhook to the server, which pulls the new image and restarts the container

The SQLite database persists via a named Docker volume (`coffee_orders_data`) mounted at `/app/data`.

Deployment config lives in the [app-deployments](http://192.168.1.205:3000/florzytech/app-deployments) repo under `apps/coffee-orders/`.

### Gitea secrets & variables

Set these on the `florzytech/coffee-orders` repo (org-level ones from `cabin` carry over automatically):

| Type | Name | Notes |
|------|------|-------|
| Variable | `REGISTRY_URL` | Gitea registry host, e.g. `192.168.1.205:3000` |
| Secret | `REGISTRY_USERNAME` | Gitea username |
| Secret | `REGISTRY_PASSWORD` | Gitea token or password |
| Secret | `RELEASE_TOKEN` | Gitea API token (used by release workflow) |
| Secret | `WEBHOOK_SECRET` | Generate: `openssl rand -hex 32` — must match server `.env` |
| Secret | `DEPLOY_SERVER_URL` | `http://192.168.1.205:5004` (port 5004, CI appends `/webhook/prd`) |

`WEBHOOK_SECRET` and `DEPLOY_SERVER_URL` must be set at the repo level since they differ from `cabin`.

Enable Actions for this repo: **Settings → Actions → Enable Actions**.

### First-time server setup

```bash
cd /home/aflorzy/app-deployments/apps/coffee-orders

# Python venv for the webhook receiver
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt && deactivate

# Populate env files
cp .env.template .env          # WEBHOOK_SECRET, DISCORD_WEBHOOK_URL
cp prd/.env.template prd/.env  # REGISTRY_URL, GITHUB_REPOSITORY, etc.

# Deploy script permissions
chmod +x prd/update_docker_stack.sh

# Install and start the webhook receiver
sudo cp coffee-orders-webhook.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now coffee-orders-webhook.service
```
