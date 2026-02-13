import { getBalance, setBalance } from "./stateManager.js";

export function debit(amount) {
    const balance = getBalance();
    if (amount > balance) throw new Error("Insufficient balance");
    const newBalance = balance - amount;
    setBalance(newBalance);
    return newBalance;
}

export function credit(amount) {
    const balance = getBalance();
    const newBalance = balance + amount;
    setBalance(newBalance);
    return newBalance;
}
