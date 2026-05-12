# Webhook Setup — Receive leads in real time

DarkTrend forwards every waitlist lead and click event to a webhook URL of your choice.
This is the recommended way to collect leads on Vercel, where the local JSON file storage is ephemeral.

---

## Step 1 — Get a webhook URL

Go to **[webhook.site](https://webhook.site)** and copy the unique URL shown on the page.

It looks like:
```
https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

This URL is ready to receive POST requests immediately, no account needed.
You can also use Zapier, Make (Integromat), or n8n to forward leads to Google Sheets, Notion, email, etc.

---

## Step 2 — Add the env var to Vercel

1. Open your Vercel project dashboard
2. Go to **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `WEBHOOK_URL`
   - **Value:** your URL from Step 1
   - **Environment:** Production (and Preview if you want)
4. Save

---

## Step 3 — Redeploy

Trigger a new deployment so the env var takes effect:

```bash
git commit --allow-empty -m "trigger redeploy: add WEBHOOK_URL"
git push
```

Or click **Redeploy** in the Vercel dashboard.

---

## Step 4 — Test with one lead

Open your live site, fill in the "Get Early Access" modal, and submit.

On webhook.site you should see a new request appear within ~1 second with a body like:

```json
{
  "type": "lead",
  "email": "test@email.com",
  "whatsapp": "+55 11 9 0000-0000",
  "niche": "cars",
  "source": "pricing_pro",
  "createdAt": "2026-05-11T14:23:01.123Z"
}
```

Analytics click events arrive as:

```json
{
  "type": "analytics",
  "event": "pricing_pro_click",
  "source": "pricing_section",
  "timestamp": "2026-05-11T14:22:58.000Z"
}
```

---

## Vercel Function Logs (backup)

Even without a webhook, every lead is printed to your Vercel Function Logs:

```
[DARKTREND:LEAD] {"email":"...","source":"...","createdAt":"..."}
[DARKTREND:WEBHOOK:LEAD_SENT] {...}
[DARKTREND:WEBHOOK:FAILED] HTTP 500 | {...}
```

To view: Vercel dashboard → your project → **Functions** tab → click any `/api/waitlist` invocation.

---

## Connect to Google Sheets (optional, 5 min)

1. In webhook.site: click **Export → Zapier**
2. In Zapier: Trigger = Webhooks → Action = Google Sheets → Append Row
3. Map: `email`, `whatsapp`, `niche`, `source`, `createdAt`
4. Done — every lead auto-appends to a spreadsheet row.
