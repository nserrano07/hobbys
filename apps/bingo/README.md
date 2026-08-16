# Family Bingo

A digital take on the bingo card I built in Excel to play with family over video calls
during the pandemic — classic 75-ball bingo, played live with whoever you invite.

Live at **https://bingo.nataliaserranoortiz.com** (once deployed — see below).

## How it plays

- **Host a game** to get a short room code (and a shareable invite link); you become the
  **caller**.
- **Join a game** with that code. Before you go in, pick **how many cards** you want
  (1-5) — you get your own 5x5 cards (B-I-N-G-O, 1-75, free center space). Other
  players never see them; the caller does, so they can keep tabs on everyone's
  progress (see Player Progress below).
- The caller picks a **round mode** — Any Line, Any Letter (a full column), or Full
  House (blackout) — shown to everyone (with a small diagram of the shape) so it's
  clear what pattern wins. Real bingo halls call this out too; shorter rounds are
  usually Line or Letter, a proper game is Blackout.
- The caller clicks **Draw Next Number** to call the next number. Marking is
  **manual**, same as a physical card — a cell that's been called but not yet marked
  pulses amber as a nudge; click it to dab it. Nothing marks itself, on purpose.
- Click **Claim BINGO!** once any one of your cards satisfies the current round's mode.
  It's checked against the numbers you've actually clicked, not just what's been
  called, before it's announced to the room.
- The caller can **Start New Round** at any point — pick a mode and it clears the board
  and deals everyone fresh cards.
- The caller also gets a **Player Progress** panel showing everyone else's cards,
  auto-marked from the called numbers (not from their manual clicks) — a way to keep
  an eye on how close everyone is without waiting on their claim.
- Anyone can switch their own screen to **Big Screen** mode: a shared, projector- or
  screen-share-friendly display of the round's goal, the latest call in huge type, and
  a full caller board of every number called so far. Handy for a spare device or
  screen-sharing during a video call, independent of whoever's actually playing.

## No server, no accounts

Players' browsers connect to each other directly over WebRTC using
[Trystero](https://github.com/dmotz/trystero), which uses the public Nostr relay network
purely to help browsers find each other (peer discovery) — no game data is ever stored
on a server, nothing is fetched or persisted anywhere but each player's own device for
the duration of the tab being open. Close every tab and the game is gone, same as
putting away a physical set of cards.

One consequence of this: if the caller's tab closes, nobody else can draw further
numbers until they rejoin. There's no automatic hand-off of the caller role.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

To test multiplayer locally, open the dev server URL in two separate browser tabs (or
one normal + one private/incognito window so `localStorage` doesn't clash) — host in one,
join with the room code in the other.

## Deployment

This app deploys to **Cloudflare** (as a Worker with static assets), not GitHub Pages —
GitHub Pages only supports one custom domain per repository, and `apps/rentals` already
uses this repo's for `rentals.nataliaserranoortiz.com`.

Deploys run via `.github/workflows/deploy-bingo.yml`: on every push to `main` touching
`apps/bingo/`, GitHub Actions builds the app and runs `npx wrangler deploy`, which reads
`apps/bingo/wrangler.toml` for everything else (Worker name, static assets directory).
This replaced an earlier attempt at Cloudflare's own Git integration, which kept
building with a stale command no matter how the dashboard settings were edited —
GitHub Actions makes the build fully deterministic instead.

One-time setup:

1. Create a Cloudflare API token (My Profile → API Tokens → Create Token → template
   **"Edit Cloudflare Workers"**), and grab your Account ID from the dashboard.
2. Add them as this repo's secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. The Worker itself is named `hobbys` (see `wrangler.toml`) — deploys land on the
   existing project of that name.
4. Custom domain: on the `hobbys` Worker, **Settings → Domains & Routes → Add → Custom
   Domain** → `bingo.nataliaserranoortiz.com`. This binds the domain and provisions the
   certificate automatically — no manual DNS record needed (a manually-added proxied
   CNAME record is a separate, broken path that returns a Cloudflare 522 error, since
   it tries to reach an "origin server" a Worker doesn't have).

This app lives at `apps/bingo/` inside the `hobbys` monorepo — see the
[top-level README](../../README.md) for the other projects alongside it.
