[README.md](https://github.com/user-attachments/files/25388635/README.md)
[README.md](https://github.com/user-attachments/files/25388635/README.md)
# The Velvet Vault — Full Production Structure (Next.js)

## Install
```bash
npm install
```

## Dev
```bash
npm run dev
```

## Production build
```bash
npm run build
npm run start
```

## Routes
- Landing: `/`
- Auth placeholders: `/login`, `/register`
- Members Hub: `/members` (ticker + QLD clock + VIP tiers + concierge placeholder)
- Slots: `/slots` (25 machines) and `/slots/:id` (demo spins)
- Game placeholders: `/games/*`
- Legal: `/terms`, `/privacy`, `/responsible`

## Assets
Images are expected in:
`/public/assets/images/`

Key files used by pages:
- `index-hero.jpg`
- `vault-entry.jpg`
- `members-page.jpg`
- `executive-chamber.jpg`
- `jackpot-core.jpg`
- `treasure-floor.jpg`
- `horizon-vault.jpg`
- `celestial-vault.jpg`

## Legacy (from provided zip)
Your uploaded zip contents were merged as reference materials:
- CSS copied to `/public/css/`
- Original HTML/firebase artifacts copied to `/legacy_from_zip/`

## IMPORTANT (Production wagering)
This repository is a **visual/UX foundation**.
The slots demo uses **client RNG** for UI demonstration only.
For any real-money or regulated wagering, implement:
- server-side RNG validation + tamper-proof logs
- jurisdiction & age verification
- responsible gambling controls (limits, cooldowns, self-exclusion)
- audited VIP deposit-only progressive logic
