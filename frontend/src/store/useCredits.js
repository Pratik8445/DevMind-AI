import { useState } from "react";

// Simple in-memory credits state
// Each generation costs 5 credits
export const GENERATION_COST = 5;

export function useCredits(initialCredits = 10) {
  const [credits, setCredits] = useState(initialCredits);

  function addCredits(amount) {
    setCredits((prev) => prev + amount);
  }

  function spendCredits() {
    if (credits < GENERATION_COST) return false;
    setCredits((prev) => prev - GENERATION_COST);
    return true;
  }

  return { credits, addCredits, spendCredits };
}
