# DarkTrend — Deploy Checklist

## 1. Push to GitHub

Run these exact commands in order:

```bash
git add .
git commit -m "feat: founder pro test mode"
git push
```

> If you haven't set up a remote yet:
> ```bash
> git remote add origin https://github.com/YOUR_USERNAME/darktrend.git
> git branch -M main
> git push -u origin main
> ```

---

## 2. Connect to Vercel (first deploy only)

1. Go to **[vercel.com](https://vercel.com)** → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Root directory: `.` (default)
5. Click **Deploy**

Vercel will build and deploy automatically on every push to `main`.

---

## 3. Add YOUTUBE_API_KEY in Vercel

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Create a project → Enable **YouTube Data API v3** in APIs & Services → Library
3. Create credentials → **API Key** → optionally restrict to YouTube Data API v3
4. In your Vercel project → **Settings → Environment Variables**
5. Add:
   - **Name:** `YOUTUBE_API_KEY`
   - **Value:** `AIza...` (your key)
   - **Environment:** ✅ Production  ✅ Preview
6. Click **Save** → redeploy

**Without this key:** the feed silently falls back to mock data. Nothing breaks.

**Quota check:** 10,000 units/day free. 10 niches × ~101 units × 8 refresh cycles/day ≈ 8,080 units. You will not exceed the free tier.

**To verify real data is loading:**
Open DevTools → Network → reload page → look for `GET /api/feed` → response should contain `"id":"yt-…"` entries.

---

## 4. Add WEBHOOK_URL in Vercel

Skip this step if you don't have a webhook receiver yet.
If you want real-time lead delivery:

1. Go to **[webhook.site](https://webhook.site)** → copy your unique URL
2. Open your Vercel project → **Settings → Environment Variables**
3. Add:
   - **Name:** `WEBHOOK_URL`
   - **Value:** `https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Environment:** ✅ Production  ✅ Preview
4. Click **Save**
5. Go to **Deployments** → click the three dots on the latest deploy → **Redeploy**

Every lead and analytics event will now POST to that URL in real time.

---

## 5. Redeploy after env var changes

Any time you change environment variables, you must redeploy:

**Option A — via dashboard:**
Vercel → Deployments → latest deploy → `...` → Redeploy

**Option B — via git (triggers a new deploy automatically):**
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

---

## 6. Test waitlist on production

1. Open your live Vercel URL
2. Click **Get Access** (navbar or hero CTA)
3. Fill in email + optional WhatsApp + niche
4. Submit → should see "Você está na lista 🎉"
5. If `WEBHOOK_URL` is set, check webhook.site within 1 second

**Verify the lead was captured:**
- Vercel dashboard → your project → **Functions** tab
- Click any `/api/waitlist` invocation
- Look for log line: `[DARKTREND:LEAD] {"email":"..."}`

**To test duplicate detection:**
Submit the same email twice → should show "Esse email já está na lista!"

---

## 7. Test Founder Pro login on production

1. Open your live Vercel URL
2. Click **Sign in** in the navbar
3. Enter `rafael.athaydee@gmail.com`
4. Button turns green: "Founder Pro ativado!"
5. Modal closes, toast appears: "Founder Pro ativado — bem-vindo de volta 👑"
6. Navbar now shows **👑 Founder Pro** badge
7. Refresh the page → badge persists (localStorage)

**What to verify in Pro mode:**
- [ ] All locked cards in feed rows are now clickable
- [ ] Early Signals section shows scrollable real cards
- [ ] Click any card → drawer opens
- [ ] Download button in drawer is active (accent color, not locked)
- [ ] Click Download → toast "Download iniciado" + file downloads
- [ ] Similar clips in drawer are visible (no blur/lock overlay)
- [ ] View source button is active
- [ ] Debug panel appears at bottom-left corner
- [ ] Debug panel: expand → shows email, clip count, demo clips count
- [ ] Debug panel: "Testar submit de lead" → submits a test lead, shows success toast
- [ ] Debug panel: "Limpar localStorage" → signs out, badge disappears

**To sign out:**
Debug panel → "Limpar localStorage (sign out)"
Or open DevTools → Application → Local Storage → delete `dt_founder`

---

## 8. Verify /admin/leads is hidden in production

Visit `https://your-vercel-url.vercel.app/admin/leads`
→ Should return **404 Not Found**

It only works locally (`npm run dev`).

---

## 9. Environment variables reference

| Variable | Required | Value | Notes |
|----------|----------|-------|-------|
| `YOUTUBE_API_KEY` | Recommended | `AIza...` | Real content feed. Falls back to mock if absent. |
| `WEBHOOK_URL` | Optional | `https://webhook.site/...` | Leads + events POSTed here |
| `VERCEL` | Auto | `1` | Set automatically by Vercel |
| `NODE_ENV` | Auto | `production` | Set automatically |

---

## 10. Post-deploy smoke test (60 seconds)

Run this after every deploy:

- [ ] Homepage loads at Vercel URL
- [ ] No blank white screen / JS error
- [ ] Navbar renders correctly
- [ ] Video cards load — real thumbnails if YOUTUBE_API_KEY is set, otherwise Unsplash mock
- [ ] DevTools → Network → `/api/feed` returns 200 with video array
- [ ] Cards with `"id":"yt-…"` confirm real YouTube data is flowing
- [ ] Niche tabs switch the feed
- [ ] "Get Access" → modal opens
- [ ] Founder login works (step 6 above)
- [ ] Download test (step 6 above)
- [ ] `/admin/leads` returns 404

---

## 11. Share on TikTok

Once deployed and smoke-tested:

1. Screen-record the homepage on mobile
2. Show the cinematic feed, hover effects, locked sections
3. CTA: "Ferramenta que uso para achar clips virais antes de todo mundo"
4. Link in bio → Vercel URL
5. Monitor webhook.site or Vercel Function Logs for incoming leads
