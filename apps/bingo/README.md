# Family Bingo

A digital take on the bingo card I built in Excel to play with family over video calls
during the pandemic — classic 75-ball bingo, played live with whoever you invite.

Live at **https://bingo.nataliaserranoortiz.com** (once deployed — see below).

## How it plays

- **Host a game** to get a short room code (and a shareable invite link); you become the
  **caller**.
- **Join a game** with that code and you get your own private 5x5 card (B-I-N-G-O,
  1-75, free center space) — nobody else ever sees your card.
- The caller clicks **Draw Next Number** to call the next number; everyone's card
  highlights it live if they have it. There's no timer — call at whatever pace suits a
  video call.
- Click **Claim BINGO!** once you have a complete line (row, column, or diagonal) or a
  full blackout. It's checked against the numbers actually called before it's announced
  to the room.
- The caller can **Start New Round** at any point to clear the board and deal everyone a
  fresh card.

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

This app deploys to **Cloudflare Pages**, not GitHub Pages — GitHub Pages only supports
one custom domain per repository, and `apps/rentals` already uses this repo's for
`rentals.nataliaserranoortiz.com`.

It uses Cloudflare's **native Git integration** (Pages project connected directly to
this GitHub repo) rather than a GitHub Actions workflow — Cloudflare builds and deploys
on its own whenever `main` changes, with no API tokens or repo secrets to manage.

One-time setup, in the Cloudflare dashboard (Workers & Pages → your project →
**Settings → Builds & deployments**):

- **Root directory**: `apps/bingo`
- **Build command**: `npm run build`
- **Build output directory**: not set in the dashboard — Cloudflare reads it from
  `apps/bingo/wrangler.toml` (`pages_build_output_dir = "dist"`) instead, since a
  wrangler config file is present.

Then, in the project's **Custom domains** tab, add `bingo.nataliaserranoortiz.com` and
follow its DNS instructions (a `CNAME` record pointing at the `*.pages.dev` address
Cloudflare gives you).

Once the build settings above are saved, every push to `main` triggers a fresh deploy
automatically (Cloudflare rebuilds on any change to the repo, not just `apps/bingo/` —
harmless, just an extra build once in a while when only `apps/rentals` changes).

This app lives at `apps/bingo/` inside the `hobbys` monorepo — see the
[top-level README](../../README.md) for the other projects alongside it.
