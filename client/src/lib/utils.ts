import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | string): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, h:mm a");
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function calculateTotalOdds(odds: number[]): number {
  if (!odds.length) return 0;
  return odds.reduce((total, odd) => total * odd, 1);
}

export function calculatePotentialWin(stake: number, totalOdds: number): number {
  return stake * totalOdds;
}

type BetMarketTypes = "1" | "X" | "2" | "OVER_1_5" | "UNDER_1_5" | "OVER_2_5" | "UNDER_2_5" | "OVER_3_5" | "UNDER_3_5" | "BTTS_YES" | "BTTS_NO" | "DNB_1" | "DNB_2" | "DC_1X" | "DC_12" | "DC_X2" | "HT_1" | "HT_X" | "HT_2" | "CORRECT_SCORE" | "CUSTOM";

export function getMarketLabel(type: string): string {
  switch (type) {
    case "1": return "Home";
    case "X": return "Draw";
    case "2": return "Away";
    case "OVER_1_5": return "Over 1.5 Goals";
    case "UNDER_1_5": return "Under 1.5 Goals";
    case "OVER_2_5": return "Over 2.5 Goals";
    case "UNDER_2_5": return "Under 2.5 Goals";
    case "OVER_3_5": return "Over 3.5 Goals";
    case "UNDER_3_5": return "Under 3.5 Goals";
    case "BTTS_YES": return "Both Teams Score - Yes";
    case "BTTS_NO": return "Both Teams Score - No";
    case "DNB_1": return "Home (DNB)";
    case "DNB_2": return "Away (DNB)";
    case "DC_1X": return "Home or Draw";
    case "DC_12": return "Home or Away";
    case "DC_X2": return "Draw or Away";
    case "HT_1": return "Half Time - Home";
    case "HT_X": return "Half Time - Draw";
    case "HT_2": return "Half Time - Away";
    case "CORRECT_SCORE": return "Correct Score";
    case "CUSTOM": return "Custom Market";
    default: return type;
  }
}

// Function to calculate related odds based on main market odds
export function calculateRelatedOdds(homeOdds: number, drawOdds: number, awayOdds: number) {
  const totalImpliedProb = (1/homeOdds + 1/drawOdds + 1/awayOdds);
  const margin = totalImpliedProb - 1;
  
  // Estimate team strengths
  const homeProb = (1/homeOdds) / totalImpliedProb;
  const drawProb = (1/drawOdds) / totalImpliedProb;
  const awayProb = (1/awayOdds) / totalImpliedProb;
  
  return {
    // Total Goals markets
    OVER_1_5: Number((1 / (0.85 - margin * 0.5)).toFixed(2)),
    UNDER_1_5: Number((1 / (0.15 + margin * 0.5)).toFixed(2)),
    OVER_2_5: Number((1 / (0.60 - margin * 0.5)).toFixed(2)),
    UNDER_2_5: Number((1 / (0.40 + margin * 0.5)).toFixed(2)),
    OVER_3_5: Number((1 / (0.35 - margin * 0.5)).toFixed(2)),
    UNDER_3_5: Number((1 / (0.65 + margin * 0.5)).toFixed(2)),
    
    // Both Teams To Score
    BTTS_YES: Number((1 / (0.55 - margin * 0.5)).toFixed(2)),
    BTTS_NO: Number((1 / (0.45 + margin * 0.5)).toFixed(2)),
    
    // Draw No Bet
    DNB_1: Number((homeOdds * (homeProb + drawProb) / homeProb).toFixed(2)),
    DNB_2: Number((awayOdds * (awayProb + drawProb) / awayProb).toFixed(2)),
    
    // Double Chance
    DC_1X: Number((1 / (homeProb + drawProb + margin * 0.5)).toFixed(2)),
    DC_12: Number((1 / (homeProb + awayProb + margin * 0.5)).toFixed(2)),
    DC_X2: Number((1 / (drawProb + awayProb + margin * 0.5)).toFixed(2)),
    
    // Half Time (estimated)
    HT_1: Number((homeOdds * 1.4).toFixed(2)),
    HT_X: Number((drawOdds * 0.8).toFixed(2)),
    HT_2: Number((awayOdds * 1.4).toFixed(2))
  };
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "LIVE": return "LIVE";
    case "UPCOMING": return "Upcoming";
    case "FINISHED": return "Finished";
    default: return status;
  }
}

export function getStatusClass(status: string): string {
  switch (status) {
    case "LIVE": return "bg-green-600 text-white";
    case "UPCOMING": return "bg-blue-500 text-white";
    case "FINISHED": return "bg-gray-500 text-white";
    default: return "bg-gray-200 text-gray-800";
  }
}

export function generateInitials(name: string): string {
  if (!name) return "";
  
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
