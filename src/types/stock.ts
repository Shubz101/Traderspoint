export interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number | null;
}

export interface StockDetail extends Stock {
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
  description: string;
}