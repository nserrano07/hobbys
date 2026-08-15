# hobbys

Small, self-contained apps I've built for my own use — each one solves a real problem I
had, each one lives entirely in the browser (no backend, no accounts), and each one is
listed as a project on [my portfolio](https://github.com/nserrano07/portfolio).

| App | What it does | Live | Source |
|---|---|---|---|
| 🏠 Rentals Buddy | Compares rental listings by price, features, and distance to the places that matter | [rentals.nataliaserranoortiz.com](https://rentals.nataliaserranoortiz.com) | [`apps/rentals`](apps/rentals) |
| 🎱 Family Bingo | Classic 75-ball bingo, played live over a video call with family | [bingo.nataliaserranoortiz.com](https://bingo.nataliaserranoortiz.com) | [`apps/bingo`](apps/bingo) |

## Layout

This is a small monorepo — each app under `apps/` is a fully independent Vite project
with its own `package.json`, dependencies, and deploy pipeline. There's no shared
workspace tooling; `cd` into an app's folder and run its own `npm install` / `npm run dev`
as normal.

```
apps/
  rentals/   # Rentals Buddy — see apps/rentals/README.md
  bingo/     # Family Bingo — see apps/bingo/README.md
```

## Why two different hosts?

Both apps deploy from this one repo, but to different places:

- **Rentals Buddy** → **GitHub Pages** (`.github/workflows/deploy-rentals.yml`), using
  this repo's one allowed custom domain.
- **Family Bingo** → **Cloudflare Pages** (`.github/workflows/deploy-bingo.yml`), since
  GitHub Pages only supports a single custom domain per repository and Rentals Buddy
  already has it.

Each workflow only runs when its app's folder changes, so the two deploy independently.

See each app's own README for its features and one-time deployment setup.
