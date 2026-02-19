# Launch Diagnostic Checklist (Automation, Visual Effects, Theme Balance)

Date: 2026-02-19
Target: https://grand-golden-vault.vercel.app/

## 1) Automation / CI Readiness

- [ ] Lint passes in CI
  - **Result:** FAIL.
  - `npm run lint` fails because ESLint config extends `next/typescript` but that config cannot be resolved in this environment.
- [ ] Production build passes
  - **Result:** FAIL.
  - `npm run build` fails on TypeScript in `components/PremiumPoker.tsx` where `newPlayers[j].cards.push(card)` is typed as invalid (`Card` into `never`).
- [ ] Branch pull readiness
  - **Result:** PARTIAL.
  - `origin` remote is configured, but external fetch/pull is currently blocked by proxy/network restrictions in this environment.

## 2) Visual Effects Diagnostic

### Strengths
- Rich bespoke animation system exists and is centralized in `app/globals.css` with custom keyframes (`floaty`, `spin-slow`, `shimmer`, `glow-pulse`, `jackpot`, `coin-flip`).
- Landing page applies effects consistently (shimmer hero title, glow cards, blur overlays) matching luxury intent.

### Risks / Observations
- **Potential performance risk:** `.animate-spin-slow` is set to `0.5s linear infinite`, which may be visually aggressive and GPU-heavy for persistent elements.
- **Motion accessibility gap:** no reduced-motion variant handling was found for continuous animation classes.
- **Modal visual divergence:** `DepositModal` uses emerald/cyan/purple neon palette, which is stylistically strong but departs from the default gold/velvet system used on landing.

## 3) Themed Balance Checklist

- [x] Core palette defined (velvet dark + gold gradients).
- [x] Reusable shadow/glow tokens exist (`shadow-vv-soft`, `shadow-vv-glow`).
- [~] Feature consistency across game modules.
  - Roulette mixes purple/red/gray betting controls, which is fine functionally but introduces a casino-neon sub-theme.
- [~] Deposit experience harmony.
  - Deposit modal color language (emerald/cyan) is coherent internally but not fully aligned to brand gold/amber baseline.

## 4) Actionable Recommendations (Priority Order)

1. **Fix blocking build/type issue** in `PremiumPoker` so production builds pass.
2. **Fix ESLint config resolution** (`next/typescript`) so lint and build lint-stage are stable in CI.
3. **Add reduced-motion support** for infinite animations (`prefers-reduced-motion`).
4. **Normalize theme tokens** by introducing semantic color variables (brand-gold, accent-cyan, accent-emerald) and deciding which modules intentionally diverge.
5. **Tighten animation cadence** on continuous motion classes (especially `spin-slow`) to reduce visual fatigue.

## 5) Command Log

- `npm run lint` → FAIL (ESLint config resolution)
- `npm run build` → FAIL (TypeScript error in poker + ESLint config resolution)
- `curl -I https://grand-golden-vault.vercel.app/` → blocked by environment proxy (`CONNECT tunnel failed, response 403`)
