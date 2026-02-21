export interface VipTier {
  name: string;
  minDeposit: number;
  maxDeposit: number;
  note: string;
  perks: string[];
}

export interface DepositLedgerEntry {
  amount: number;
  createdAt: string;
  receiptName?: string;
}

export interface DepositLedger {
  totalDeposited: number;
  deposits: DepositLedgerEntry[];
}

export const vipTiers: VipTier[] = [
  {
    name: "Tier 1 • Golden Starter",
    minDeposit: 0,
    maxDeposit: 1500,
    note: "Entry tier for new members",
    perks: ["Daily check-in reward access", "Member room promotions"],
  },
  {
    name: "Tier 2 • Gilded Circle",
    minDeposit: 1501,
    maxDeposit: 5000,
    note: "Priority tier for active depositors",
    perks: ["Faster support queue", "Boosted bonus draw entries"],
  },
  {
    name: "Tier 3 • Vault Prestige",
    minDeposit: 5001,
    maxDeposit: 99991,
    note: "High-value loyalty profile",
    perks: ["Premium bonus offers", "Higher mission reward caps"],
  },
  {
    name: "Tier 4 • Golden Noir High Roller",
    minDeposit: 100000,
    maxDeposit: Number.POSITIVE_INFINITY,
    note: "Extremely exclusive high-roller privileges",
    perks: ["Private concierge lane", "Elite cashback windows", "Invitation-only bonus events"],
  },
];

export const getVipTierForDeposits = (totalDeposited: number): VipTier => {
  const safeTotal = Number.isFinite(totalDeposited) ? Math.floor(totalDeposited) : 0;

  if (safeTotal >= vipTiers[3].minDeposit) return vipTiers[3];
  if (safeTotal >= vipTiers[2].minDeposit) return vipTiers[2];
  if (safeTotal >= vipTiers[1].minDeposit) return vipTiers[1];
  return vipTiers[0];
};

export const defaultDepositLedger: DepositLedger = {
  totalDeposited: 0,
  deposits: [],
};
