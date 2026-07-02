# Rental Tracker

An interactive tracker for comparing rental listings (house shares, studios, flats) by
price, features, and real-world distance to the places that matter to you — built
while house-hunting around Orpington & Bromley, Kent.

Live at **https://rentals.nataliaserranoortiz.com** (once DNS is configured — see below).

## Features

- **Places you care about** — add any number of anchor locations (work, gym, family)
  by clicking on the map; every listing is scored by distance to each one.
- **Smart Paste** — paste the raw text you copy from an OpenRent/Rightmove listing and
  the app extracts price, bedrooms, bathrooms, bills-included, deposit, availability
  and furnishing status automatically. Runs entirely in your browser against the text
  you provide — nothing is fetched from the network, so it never invents data.
- **Manual entry** as a fallback/complement to Smart Paste.
- **Interactive map** (Leaflet + OpenStreetMap) showing anchors and listings, color-coded
  by status.
- **Filter & sort** by budget, application status, and proximity score.
- **Status tracking** per listing (Not Contacted → Contacted → Viewing Scheduled → Offer
  Made → Rejected), star ratings, viewing dates, and private notes.
- **One-click outreach draft** — copies a ready-to-send inquiry message to your clipboard.
- **Archive or delete with a reason** — every removal records why (already let, too
  expensive, no response, etc.); archived listings are restorable, and a removal log
  keeps a record even after permanent deletion.
- **Clear Session** — wipe all data in one click so anyone else can use this tool for
  their own search from a blank slate. Everything persists only in your browser's
  `localStorage` — no backend, no accounts, no data ever leaves your device.

## Why no auto-import from listing URLs?

A lot of "paste a URL and we'll fetch it" tools quietly fabricate data when they can't
actually reach the page. This one doesn't: it only ever shows facts you provided,
either by pasting the listing's own text (Smart Paste) or typing them in yourself.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Deployment

Pushing to `main` builds the app and deploys it to GitHub Pages via
`.github/workflows/deploy.yml`. One-time setup:

1. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.
2. In your domain's DNS, add a `CNAME` record: `rentals` → `<your-github-username>.github.io`.
3. The `public/CNAME` file (deployed as `dist/CNAME`) already points at
   `rentals.nataliaserranoortiz.com` — GitHub Pages picks it up automatically once the
   DNS record resolves and you can enforce HTTPS in the Pages settings.
