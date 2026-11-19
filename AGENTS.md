# AGENTS.md - VirtualAssistantDirectories.com

A US directory of virtual assistant companies. Next.js 16 (App Router), Tailwind v4,
standalone Docker output.

## Data

- `data/cities.json` - US cities >= 25k population (GeoNames)
- `data/firms.json` - deduplicated VA providers
- `data/states.json` - state code to name
- `data/raw/places.jsonl` - raw Google Maps scrape batches (not committed)

Pipeline:

```bash
MIN_POP=25000 node scripts/build-cities.mjs /path/to/US.txt
MIN_POP=25000 TOP_VARIANTS=600 CONCURRENCY=80 node scripts/collect.mjs
node scripts/build-firms.mjs        # -> data/firms-unverified.json
node scripts/verify.mjs             # treg site verification -> data/verify.jsonl
node scripts/apply-verification.mjs # -> data/firms.json (confirmed VA providers only)
node scripts/build-hero-map.mjs
```

## Deployment (standing instruction)

Always deploy after changes. Do not stop at a local build.

1. `npm run lint` and `npm run build`
2. Commit and push `origin main`
3. Trigger Coolify3 deploy with `ego-browser` (API is behind Cloudflare Access):
   `POST https://coolify3.stealthagents.us/api/v1/deploy {"uuid":"7dmdzwimummijcp0k1ca3wau","force":true}`
   Token: `~/.config/stealthagents/ops-watchdog.env` -> `COOLIFY_TOKENS.coolify3`.
4. Poll `GET /api/v1/deployments/<uuid>` to `finished`.
5. Verify `https://virtualassistantdirectories.com` and a city/provider page return 200.

## Infrastructure

- **Repo:** public `github.com/teovanyo/virtualassistantdirectories` (main)
- **Coolify3:** project `Virtual Assistant Directories` `lfgf7ltwobvp2caoktg8b4o5`, app `virtualassistantdirectories` `7dmdzwimummijcp0k1ca3wau`, Dockerfile, port 3000.
- **Domain:** `https://virtualassistantdirectories.com` (+ www). Cloudflare zone `adac646cb7044a9e01bb6d6ee1beb054`, NS `khalid.ns.cloudflare.com` / `sunny.ns.cloudflare.com` (Name.com registrar). Apex + www CNAME -> Coolify-03 tunnel `3cef3dd6-5f46-4a9d-982e-b70ae97b3806.cfargotunnel.com`.
- **Ads:** all Stealth Agents placements link to `https://stealthagents.com/virtual-assistant` with `utm_source=virtualassistantdirectories`.

## Design

Distinct from propertymanagementfirms.com and accountspayabledirectory.com: charcoal + lime,
Space Grotesk/Inter, row-style directory, numbered type tiles, dark hero panel. Do not
reuse the serif/teal design system from the other directories.
