import { useQuery } from 'react-query';
import { getStockQuote, getStockDetail, getStockIntraday, searchStocks } from '../services/api';

export function useStockSearch(query: string) {
  return useQuery(['stockSearch', query], () => searchStocks(query), {
    enabled: query.length > 1,
    staleTime: 30000,
  });
}

export function useStockQuote(symbol: string) {
  return useQuery(['stockQuote', symbol], () => getStockQuote(symbol), {
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useStockDetail(symbol: string) {
  return useQuery(['stockDetail', symbol], () => getStockDetail(symbol), {
    staleTime: 300000, // Cache for 5 minutes
  });
}

export function useStockIntraday(symbol: string) {
  return useQuery(['stockIntraday', symbol], () => getStockIntraday(symbol), {
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}