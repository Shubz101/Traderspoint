import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Sun, Moon, TrendingUp, TrendingDown, BarChart3, LineChart } from 'lucide-react';
import { StockCard } from './components/StockCard';
import { SearchBar } from './components/SearchBar';
import { StockChart } from './components/StockChart';
import { useStockSearch, useStockQuote } from './hooks/useStocks';
import WebApp from '@telegram-mini-apps/sdk';

const queryClient = new QueryClient();
const DEFAULT_SYMBOLS = ['RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'ICICIBANK.BSE'];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (WebApp.isInitialized) {
      return WebApp.colorScheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { data: searchResults } = useStockSearch(searchQuery);
  const defaultStocksQueries = DEFAULT_SYMBOLS.map(symbol => useStockQuote(symbol));

  useEffect(() => {
    if (WebApp.isInitialized) {
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setRecentSearches(prev => [suggestion, ...prev.filter(s => s !== suggestion)].slice(0, 5));
    setSearchQuery('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LineChart },
    { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
    { id: 'losers', label: 'Top Losers', icon: TrendingDown },
    { id: 'active', label: 'Most Active', icon: BarChart3 },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <h1 className="text-xl font-bold">Indian Stocks</h1>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              
              <div className="py-4">
                <SearchBar
                  onSearch={handleSearch}
                  suggestions={searchResults?.map(r => `${r.symbol} - ${r.name}`) || []}
                  recentSearches={recentSearches}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>

              <div className="flex space-x-4 overflow-x-auto pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon size={18} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultStocksQueries.map((query, index) => 
                query.data ? (
                  <StockCard
                    key={query.data.symbol}
                    stock={query.data}
                    onClick={() => {}}
                  />
                ) : null
              )}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;