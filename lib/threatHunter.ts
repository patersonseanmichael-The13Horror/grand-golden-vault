export type ThreatLevel = "none" | "low" | "medium" | "high" | "critical";

export interface ThreatEvent {
  ts: string;
  level: ThreatLevel;
  reason: string;
  score: number;
  text: string;
}

export interface ThreatAssessment {
  level: ThreatLevel;
  score: number;
  reason: string;
  lockMs: number;
  block: boolean;
}

const RULES: Array<{ reason: string; score: number; patterns: RegExp[] }> = [
  {
    reason: "prompt-injection",
    score: 6,
    patterns: [/ignore\s+(all|previous|rules?)/i, /bypass/i, /override/i, /system\s+prompt/i],
  },
  {
    reason: "credential-access",
    score: 8,
    patterns: [/api\s*key/i, /password/i, /secret/i, /token/i, /private\s*key/i],
  },
  {
    reason: "admin-escalation",
    score: 7,
    patterns: [/make\s+me\s+admin/i, /admin\s+access/i, /elevate\s+privileges/i, /owner\s+mode/i],
  },
  {
    reason: "fraud-abuse",
    score: 6,
    patterns: [/wallet\s+hack/i, /free\s+money/i, /rig\s+the\s+game/i, /exploit/i],
  },
  {
    reason: "automation-abuse",
    score: 5,
    patterns: [/script\s+this/i, /bot\s+farm/i, /mass\s+accounts/i, /autoclick/i],
  },
];

function scoreToLevel(score: number): ThreatLevel {
  if (score >= 12) return "critical";
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  if (score >= 2) return "low";
  return "none";
}

export function assessThreat(input: string): ThreatAssessment {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return { level: "none", score: 0, reason: "empty", lockMs: 0, block: false };
  }

  let score = 0;
  const reasons: string[] = [];

  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      score += rule.score;
      reasons.push(rule.reason);
    }
  }

  if (normalized.length > 180) {
    score += 3;
    reasons.push("oversized-input");
  }

  const level = scoreToLevel(score);
  const block = level === "high" || level === "critical";
  const lockMs = level === "critical" ? 7000 : level === "high" ? 5000 : level === "medium" ? 2500 : 0;

  return {
    level,
    score,
    reason: reasons.length ? reasons.join(",") : "clean",
    lockMs,
    block,
  };
}

export function summarizeThreats(events: ThreatEvent[]): string {
  if (events.length === 0) return "No threat events logged.";

  const counts = events.reduce<Record<ThreatLevel, number>>(
    (acc, next) => {
      acc[next.level] += 1;
      return acc;
    },
    { none: 0, low: 0, medium: 0, high: 0, critical: 0 }
  );

  const latest = events[0];
  return `Threat summary: critical=${counts.critical}, high=${counts.high}, medium=${counts.medium}, low=${counts.low}. Latest=${latest.reason} (${latest.level}) at ${latest.ts}.`;
}
