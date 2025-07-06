
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatOdds } from "@/lib/utils";
import { Market } from "@shared/schema";
import { useBettingStore } from "@/lib/betting-store";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandedMarketsProps {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  allMarkets: Market[];
}

export default function ExpandedMarkets({ matchId, homeTeam, awayTeam, allMarkets }: ExpandedMarketsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addBet, removeBet, hasBet } = useBettingStore();
  const { toast } = useToast();

  const handleToggleBet = (market: Market) => {
    if (market.isLocked) {
      toast({
        title: "Market is locked",
        description: "This market is currently locked and unavailable for betting.",
        variant: "destructive"
      });
      return;
    }
    
    if (hasBet(market.id)) {
      removeBet(market.id);
    } else {
      addBet({
        id: market.id,
        matchId: matchId,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        marketType: market.type,
        odds: market.odds
      });
    }
  };

  // Group markets by category
  const mainMarkets = allMarkets.filter(m => ["1", "X", "2"].includes(m.type));
  const goalMarkets = allMarkets.filter(m => m.type.includes("OVER") || m.type.includes("UNDER"));
  const bttsMarkets = allMarkets.filter(m => m.type.includes("BTTS"));
  const doubleChanceMarkets = allMarkets.filter(m => m.type.includes("DC"));
  const drawNoBetMarkets = allMarkets.filter(m => m.type.includes("DNB"));
  const halfTimeMarkets = allMarkets.filter(m => m.type.includes("HT"));
  const customMarkets = allMarkets.filter(m => !["1", "X", "2", "OVER", "UNDER", "BTTS", "DC", "DNB", "HT"].some(prefix => m.type.includes(prefix)));

  const renderMarketGroup = (title: string, markets: Market[]) => {
    if (markets.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <div className="grid grid-cols-2 gap-2">
          {markets.map(market => (
            <Button
              key={market.id}
              variant="outline"
              size="sm"
              onClick={() => handleToggleBet(market)}
              className={`${market.isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${hasBet(market.id) ? 'bg-yellow-400 text-black' : 'bg-secondary text-secondary-foreground'} hover:bg-secondary/80 py-1 rounded text-xs font-medium relative`}
              disabled={market.isLocked}
            >
              {market.type} <span className="font-semibold">{formatOdds(market.odds)}</span>
              {market.isLocked && (
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {isExpanded ? "Menos mercados" : "Mais mercados"}
      </Button>
      
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          {renderMarketGroup("Total de Golos", goalMarkets)}
          {renderMarketGroup("Ambas as Equipas Marcam", bttsMarkets)}
          {renderMarketGroup("Dupla Hipótese", doubleChanceMarkets)}
          {renderMarketGroup("Empate Anula", drawNoBetMarkets)}
          {renderMarketGroup("Resultado ao Intervalo", halfTimeMarkets)}
          {renderMarketGroup("Mercados Personalizados", customMarkets)}
        </div>
      )}
    </div>
  );
}
