# Final Stage Deployment Checklist

## 1. Pre-merge verification
- Run `pwd` and confirm you are in the project root (`.../grand-golden-vault`).
- Run `npm ci`
- Run `npm run audit:predeploy`
- Run `npm run verify`
- Confirm no uncommitted changes with `git status --short`

### If `npm ci` fails with `EUSAGE`
- This usually means the command was run outside the repo root.
- Fix sequence:
  - `cd /home/patersonseanmichael/grand-golden-vault`
  - `ls package-lock.json package.json`
  - `npm ci`

## 2. Environment setup
- Copy `.env.example` to deployment environment variables.
- Set all `NEXT_PUBLIC_FIREBASE_*` values.
- Set `NEXT_PUBLIC_CONCIERGE_ADMIN_UID` and `NEXT_PUBLIC_CONCIERGE_ADMIN_EMAIL`.
- Ensure Firebase custom claim `conciergeAdmin=true` is set only for owner account.
- Optional helper: use `npm run firebase:set-concierge-admin` with:
  - `FIREBASE_SERVICE_ACCOUNT_KEY_PATH`
  - `FIREBASE_CONCIERGE_ADMIN_UID`
  - Keep service-account JSON out of git.
- Re-run `npm run audit:predeploy` and confirm no env warnings remain.

## 3. Firebase hardening
- Enforce Firebase Auth email verification and strong password policy in Firebase console.
- Lock Firestore security rules to authenticated access and least privilege.
- Confirm no sensitive secrets are exposed as `NEXT_PUBLIC_*` unless intentionally public.

## 4. Concierge abuse controls
- Verify concierge remains navigation-only for non-admin users.
- Verify admin commands are blocked for non-owner accounts.
- Review abuse events in browser logs and telemetry sink (if connected).

## 5. Gameplay checks
- Validate all slot routes `/slots/01` to `/slots/25` load without runtime errors.
- Validate roulette page spin cycle and wallet deduction/credit behavior.
- Validate min/max constraints for each game input and deposit flow.

## 6. Production rollout
- Merge to `main` only after CI passes.
- Deploy to preview first, run smoke test on:
  - `/`
  - `/login`
  - `/register`
  - `/members`
  - `/slots`
  - `/slots/01`
  - `/roulette`
  - `/bonus`
  - `/check-in`
- Promote preview to production after smoke test sign-off.

## 7. Post-deploy monitoring
- Monitor auth errors, route errors, and client exceptions for 24h.
- Track unusual concierge request patterns for abuse attempts.
- Re-run `npm run verify` before any hotfix release.
