import { Stock, StockDetail } from '../types/stock';

const API_KEY = 'P1T1GUY3XTY7G1TF';
const BASE_URL = 'https://www.alphavantage.co/query';

export async function searchStocks(query: string): Promise<string[]> {
  const response = await fetch(
    `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
  );
  const data = await response.json();
  return data.bestMatches?.map((match: any) => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
  })) || [];
}

export async function getStockQuote(symbol: string): Promise<Stock> {
  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );
  const data = await response.json();
  const quote = data['Global Quote'];
  
  return {
    symbol: quote['01. symbol'],
    companyName: '', // Will be filled from company overview
    currentPrice: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    volume: parseInt(quote['06. volume']),
    marketCap: 0, // Will be filled from company overview
    peRatio: null, // Will be filled from company overview
  };
}

export async function getStockDetail(symbol: string): Promise<StockDetail> {
  const [quoteResponse, overviewResponse] = await Promise.all([
    fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`),
    fetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`)
  ]);

  const quoteData = await quoteResponse.json();
  const overviewData = await overviewResponse.json();
  const quote = quoteData['Global Quote'];

  return {
    symbol: quote['01. symbol'],
    companyName: overviewData.Name,
    currentPrice: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    volume: parseInt(quote['06. volume']),
    marketCap: parseFloat(overviewData.MarketCapitalization),
    peRatio: parseFloat(overviewData.PERatio),
    dayHigh: parseFloat(quote['03. high']),
    dayLow: parseFloat(quote['04. low']),
    yearHigh: parseFloat(overviewData['52WeekHigh']),
    yearLow: parseFloat(overviewData['52WeekLow']),
    avgVolume: parseFloat(overviewData['VolumeAvg']),
    description: overviewData.Description
  };
}

export async function getStockIntraday(symbol: string): Promise<{ time: string; value: number }[]> {
  const response = await fetch(
    `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
  );
  const data = await response.json();
  const timeSeries = data['Time Series (5min)'];
  
  return Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
    time,
    value: parseFloat(values['4. close'])
  })).reverse();
}