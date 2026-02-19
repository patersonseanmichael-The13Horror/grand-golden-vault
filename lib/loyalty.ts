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
    name: "Tier 1 • Velvet Starter",
    minDeposit: 0,
    maxDeposit: 500,
    note: "Entry tier for new members",
    perks: ["Daily check-in reward access", "Member room promotions"],
  },
  {
    name: "Tier 2 • Gilded Circle",
    minDeposit: 500,
    maxDeposit: 3000,
    note: "Priority tier for active depositors",
    perks: ["Faster support queue", "Boosted bonus draw entries"],
  },
  {
    name: "Tier 3 • Vault Prestige",
    minDeposit: 3000,
    maxDeposit: 25000,
    note: "High-value loyalty profile",
    perks: ["Premium bonus offers", "Higher mission reward caps"],
  },
  {
    name: "Tier 4 • Velvet Noir High Roller",
    minDeposit: 25000,
    maxDeposit: Number.POSITIVE_INFINITY,
    note: "Extremely exclusive high-roller privileges",
    perks: ["Private concierge lane", "Elite cashback windows", "Invitation-only bonus events"],
  },
];

export const getVipTierForDeposits = (totalDeposited: number): VipTier => {
  const safeTotal = Number.isFinite(totalDeposited) ? totalDeposited : 0;
  return (
    vipTiers.find((tier) => safeTotal >= tier.minDeposit && safeTotal < tier.maxDeposit) ?? vipTiers[vipTiers.length - 1]
  );
};

export const defaultDepositLedger: DepositLedger = {
  totalDeposited: 0,
  deposits: [],
};
