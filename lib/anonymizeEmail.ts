export function anonymizeEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "*********@********.***";
  const safeUser =
    user.length <= 3 ? user[0] + "***" : user.slice(0, 3) + "*".repeat(Math.min(9, user.length - 3));
  const parts = domain.split(".");
  const base = parts[0] ?? "domain";
  const tld = parts.slice(1).join(".") || "com";
  const safeDomain =
    base.length <= 2 ? base[0] + "*" : base.slice(0, 1) + "*".repeat(Math.min(6, base.length - 1));
  const safeTld = tld.length <= 2 ? "*" : tld[0] + "*".repeat(Math.min(4, tld.length - 1));
  return `${safeUser}@${safeDomain}.${safeTld}`;
}
