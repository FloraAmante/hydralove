# 🚀 Deploying HydraLove 💧❤️

HydraLove is built 100% client-side with Next.js static export (`output: "export"`). This makes it fast, 100% free to host, and easy to deploy on either **Cloudflare Pages / Workers** or **GitHub Pages**.

---

## ⚡ Option 1: Deploy on Cloudflare Pages (Recommended - Easiest & Fastest)

Cloudflare Pages offers unlimited free hosting, custom domain support, and SSL out of the box.

### Method A: Via Cloudflare Dashboard & GitHub (Automatic Deploys)
1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "HydraLove initial release 💧❤️"
   git remote add origin https://github.com/YOUR_USERNAME/hydralove.git
   git push -u origin main
   ```
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your `hydralove` repository.
4. Set build settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Click **Save and Deploy**. Your app will be live in 1 minute!

### Method B: Via Wrangler CLI (Direct Command Line Deploy)
```bash
# 1. Build static output
npm run build

# 2. Deploy directly using wrangler
npx wrangler pages deploy out --project-name=hydralove
```

---

## 🐙 Option 2: Deploy on GitHub Pages

### Method A: Using GitHub Actions (Automated CI/CD)
Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy HydraLove to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build static export
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Push your changes to `main`. GitHub will automatically build and publish your app!

---

## 📱 Mobile PWA Installation Guide for Her

Once deployed to Cloudflare Pages or GitHub Pages:

### On iPhone (Safari):
1. Open the deployed website link (e.g. `https://hydralove.pages.dev`).
2. Tap the **Share button** (rectangle with up arrow at the bottom).
3. Scroll down and tap **Add to Home Screen**.
4. It will now function like a native iOS App on her phone!

### On Android (Chrome):
1. Open the website link in Chrome.
2. Tap the **3 dots menu** in the top right.
3. Tap **Add to Home screen** / **Install app**.
