# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to patersonseanmichael@gmail.com. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the issue until it has been addressed by the team.

## Security Measures

This project implements the following security measures:

- **Dependabot:** Automated dependency updates to address security vulnerabilities.
- **CodeQL Analysis:** Automated code scanning for security issues.
- **Regular Updates:** We keep dependencies up to date to minimize security risks.

- Firebase client configuration now requires `NEXT_PUBLIC_FIREBASE_*` environment variables and will fail fast when missing, preventing accidental fallback to stale embedded defaults.

## Firebase Keys and Secret-Scanning Alerts

If GitHub reports a leaked Firebase API key, treat it as an exposure event even though `NEXT_PUBLIC_FIREBASE_*` values are client-visible by design.

1. Rotate the key in Firebase Console immediately.
2. Restrict the replacement key by referrer/domain and app restrictions.
3. Revoke the previous key and remove any hardcoded copies from git history.
4. Store values only in Vercel environment variables (never commit `.env` files).

For this repo, only runtime env lookups are allowed in source code (`process.env.NEXT_PUBLIC_FIREBASE_*`); embedded literal keys should be considered a policy violation.

## Best Practices

When contributing to this project, please follow these security best practices:

- Never commit sensitive information (API keys, passwords, etc.) to the repository.
- Use environment variables for configuration.
- Keep dependencies up to date.
- Follow secure coding practices.


## Security Headers

Runtime security headers are enforced via `vercel.json` for all routes, including a baseline Content Security Policy, clickjacking protection, MIME sniffing protection, and strict referrer policy.
