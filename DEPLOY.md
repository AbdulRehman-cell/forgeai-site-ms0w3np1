# Deploy Guide — Care Services Static Site (Render)

This is a **static HTML/CSS/JS site** — no build step, no backend, no database.
You can deploy it to Render in under 5 minutes using either **Option A (recommended,
no Docker)** or **Option B (Docker, using the included Dockerfile)**.

---

## Option A: Render Static Site (fastest, recommended)

### 1. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial deploy-ready commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Create the Render service from the blueprint
- Go to https://dashboard.render.com/blueprints
- Click **New Blueprint Instance**
- Select your repo — Render auto-detects `render.yaml` and configures everything (static site, headers, routing).

### 3. Deploy
- Click **Apply** — Render builds and deploys automatically.
- Your site will be live at: `https://care-services-site.onrender.com`

That's it — **3 commands, 1 click.**

---

## Option B: Docker-based deploy on Render

If you want the exact nginx image (custom headers, healthcheck, non-root user):

### 1. Push to GitHub (same as above)
```bash
git init
git add .
git commit -m "Initial deploy-ready commit"
git push -u origin main
```

### 2. In `render.yaml`, uncomment the Docker service block and comment out the `static` one.

### 3. Create a new **Web Service** on Render
- Go to https://dashboard.render.com/
- **New > Web Service** → connect your repo
- Render detects the `Dockerfile` automatically
- Health Check Path: `/healthz`
- Click **Create Web Service**

---

## Local testing before you deploy

```bash
docker build -t care-services-site:1.0.0 .
docker run -p 8080:8080 care-services-site:1.0.0
```
Visit http://localhost:8080 — you should see `index.html`.

Or with Compose:
```bash
docker compose up --build
```

---

## CI/CD (already configured)

`.github/workflows/deploy.yml` runs on every push to `main`:
1. Validates all required HTML/JS files exist
2. Builds the Docker image and runs a health-check smoke test
3. Triggers a Render deploy via deploy hook

**Setup required (one-time):**
1. In Render dashboard → your service → **Settings** → copy the **Deploy Hook URL**
2. In GitHub repo → **Settings → Secrets and variables → Actions** → add secret:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: (paste the URL from Render)

After that, every `git push` to `main` auto-deploys.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| 404 on routes like `/services` | Site expects `.html` extensions (`/services.html`); routes are configured with `try_files` fallback to `index.html` |
| Health check failing | Confirm container listens on port `8080`, not `80` |
| Static assets not updating | HTML is `no-cache`; CSS/JS cached 30 days — bump filenames or query strings if you need instant CSS/JS refresh |