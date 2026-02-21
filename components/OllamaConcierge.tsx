"use client";

import { useEffect, useMemo, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";
import { assessThreat, summarizeThreats, type ThreatEvent } from "@/lib/threatHunter";

const ROUTE_HELP: Record<string, string> = {
  members: "Members hub: /members",
  slots: "Slots: /slots",
  blackjack: "Blackjack: /blackjack",
  roulette: "Roulette: /roulette",
  poker: "Poker: /poker",
  bonus: "Bonus vault: /bonus",
  "check-in": "Daily check-in: /check-in",
  login: "Login: /login",
  register: "Register: /register",
  contact: "Contact: /contact",
};

const BLOCKED_TERMS = [
  "deposit",
  "wallet",
  "payment",
  "bank",
  "credit card",
  "password",
  "email",
  "account",
  "strategy",
  "winning",
  "jackpot",
  "prompt",
  "system",
  "bypass",
  "ignore",
];

const ADMIN_TERMS = ["admin", "security", "protocol", "audit", "logs", "status"];
const ABUSE_LOG_KEY = "vv.concierge.abuse";
const THREAT_LOG_KEY = "vv.concierge.threats";
const MAX_ABUSE_LOGS = 100;

export default function OllamaConcierge() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("Navigation-only concierge active. Ask where to find pages like Slots, Bonus, Check-In, or Login.");
  const [lockedUntil, setLockedUntil] = useState(0);
  const [hasAdminClaim, setHasAdminClaim] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);

  const configuredAdminUid = (process.env.NEXT_PUBLIC_CONCIERGE_ADMIN_UID || "").trim();
  const configuredAdminEmail = (process.env.NEXT_PUBLIC_CONCIERGE_ADMIN_EMAIL || "").trim().toLowerCase();

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      if (!user) {
        setHasAdminClaim(false);
        return;
      }
      setAdminCheckLoading(true);
      try {
        const token = await getIdTokenResult(user, true);
        if (!cancelled) {
          setHasAdminClaim(token.claims.conciergeAdmin === true);
        }
      } catch {
        if (!cancelled) {
          setHasAdminClaim(false);
        }
      } finally {
        if (!cancelled) {
          setAdminCheckLoading(false);
        }
      }
    };

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isStrictAdmin = useMemo(() => {
    if (!user) return false;
    if (!configuredAdminUid || !configuredAdminEmail) return false;
    const uidMatch = user.uid === configuredAdminUid;
    const emailMatch = (user.email || "").toLowerCase() === configuredAdminEmail;
    return uidMatch && emailMatch && hasAdminClaim;
  }, [configuredAdminEmail, configuredAdminUid, hasAdminClaim, user]);

  const handleAsk = () => {
    const normalized = input.toLowerCase().trim();
    if (!normalized) return;
    const now = Date.now();

    const logAbuse = (reason: string) => {
      try {
        const existing = window.localStorage.getItem(ABUSE_LOG_KEY);
        const parsed = existing ? (JSON.parse(existing) as Array<{ ts: string; reason: string; text: string }>) : [];
        const next = [{ ts: new Date().toISOString(), reason, text: normalized }, ...parsed].slice(0, MAX_ABUSE_LOGS);
        window.localStorage.setItem(ABUSE_LOG_KEY, JSON.stringify(next));
      } catch {
        // Ignore logging failures in UI guard.
      }
    };
    const logThreat = (event: ThreatEvent) => {
      try {
        const existing = window.localStorage.getItem(THREAT_LOG_KEY);
        const parsed = existing ? (JSON.parse(existing) as ThreatEvent[]) : [];
        const next = [event, ...parsed].slice(0, MAX_ABUSE_LOGS);
        window.localStorage.setItem(THREAT_LOG_KEY, JSON.stringify(next));
      } catch {
        // Ignore logging failures in UI guard.
      }
    };

    const threat = assessThreat(normalized);
    if (threat.level !== "none") {
      logThreat({
        ts: new Date().toISOString(),
        level: threat.level,
        reason: threat.reason,
        score: threat.score,
        text: normalized,
      });
    }
    if (threat.block && !isStrictAdmin) {
      logAbuse(`threat-${threat.level}`);
      setReply("Request blocked by Site Guard. This assistant only supports safe navigation questions.");
      setLockedUntil(now + threat.lockMs);
      return;
    }

    if (now < lockedUntil) {
      logAbuse("rate-limit");
      setReply("Rate limit active. Wait a moment, then ask one short navigation question.");
      return;
    }

    if (normalized.length > 180) {
      logAbuse("length");
      setReply("Request rejected. Keep navigation questions under 180 characters.");
      setLockedUntil(now + 2500);
      return;
    }

    const asksAdmin = ADMIN_TERMS.some((term) => normalized.includes(term));
    if (asksAdmin) {
      if (!isStrictAdmin) {
        logAbuse("admin-probe");
        setReply("Restricted. Admin features are locked to the configured owner account only.");
        setLockedUntil(now + 3000);
        return;
      }

      if (normalized.includes("logs")) {
        try {
          const abuseRaw = window.localStorage.getItem(ABUSE_LOG_KEY);
          const threatRaw = window.localStorage.getItem(THREAT_LOG_KEY);
          const abuseParsed = abuseRaw ? (JSON.parse(abuseRaw) as Array<{ ts: string; reason: string; text: string }>) : [];
          const threatParsed = threatRaw ? (JSON.parse(threatRaw) as ThreatEvent[]) : [];
          const latest = abuseParsed[0];
          setReply(`Admin logs: ${abuseParsed.length} abuse events. Latest: ${latest ? `${latest.reason} at ${latest.ts}` : "none"}. ${summarizeThreats(threatParsed)}`);
        } catch {
          setReply("Admin logs unavailable due to storage parsing issue.");
        }
      } else {
        setReply("Admin panel status: Site Guard active, threat hunter enabled, navigation-only mode enforced, and blocked-topic filters online.");
      }
      setLockedUntil(now + 1500);
      return;
    }

    const blocked = BLOCKED_TERMS.some((term) => normalized.includes(term));
    if (blocked) {
      logAbuse("blocked-term");
      setReply("Restricted. This concierge only provides page navigation help for visitors.");
      setLockedUntil(now + 2500);
      return;
    }

    const matchedRoute = Object.keys(ROUTE_HELP).find((key) => normalized.includes(key));
    if (!matchedRoute) {
      logAbuse("unknown-request");
      setReply("Navigation-only mode: ask where to find pages like Members, Slots, Bonus, Check-In, Login, or Contact.");
      setLockedUntil(now + 2000);
      return;
    }

    setReply(`Navigation help: ${ROUTE_HELP[matchedRoute]}.`);
    setLockedUntil(now + 1200);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-vv-soft">
      <div className="text-xs tracking-[0.30em] uppercase text-white/60">Concierge (Ollama Guard)</div>
      <p className="mt-3 text-white/70 leading-relaxed">Restricted assistant onboard. Scope: visitor navigation only.</p>
      <div className="mt-2 text-[11px] text-white/45">
        Admin Mode: {adminCheckLoading ? "checking..." : isStrictAdmin ? "owner-verified" : "locked"}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAsk();
            }
          }}
          maxLength={180}
          placeholder="Ask where to find a page"
          className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <button onClick={handleAsk} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black">Ask</button>
      </div>
      <p className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">{reply}</p>
    </div>
  );
}
