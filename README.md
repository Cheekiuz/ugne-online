<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/59835500-a57b-466e-9af4-52b2d04db94a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages (ugne.online)

This project is configured for static export and GitHub Pages deployment via GitHub Actions.

### 1. Push to main

The workflow at `.github/workflows/deploy-pages.yml` runs on every push to `main`.

### 2. Enable Pages source (one-time)

In the repo on GitHub: **Settings → Pages → Build and deployment → Source** → **Deploy from a branch**.

- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

The workflow pushes the built `out/` folder to the `gh-pages` branch on every push to `main`.

If you previously used **GitHub Actions** as the Pages source, switch to **Deploy from a branch** as above.

Optional via GitHub CLI (`Cheekiuz/ugne-online`):

```bash
gh api repos/Cheekiuz/ugne-online/pages \
   --method PUT \
   -f build_type=legacy \
   -f 'source[branch]=gh-pages' \
   -f 'source[path]=/'
```

### 3. Set custom domain (one-time)

```bash
gh api repos/Cheekiuz/ugne-online/pages \
   --method PUT \
   -f cname=ugne.online
```

After GitHub provisions the TLS certificate, enforce HTTPS:

```bash
gh api repos/Cheekiuz/ugne-online/pages \
   --method PUT \
   -F https_enforced=true
```

The site also ships a `public/CNAME` file containing `ugne.online`.

### 4. Configure DNS

At your DNS provider, point the apex domain to GitHub Pages with A records:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

Optional: add `www` as a CNAME to `cheekiuz.github.io`.

### 5. Verify

- Wait for the Actions workflow to complete.
- Check deployment status:

```bash
gh run list --workflow deploy-pages.yml --limit 5
```

- Open the site: https://ugne.online
