import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions: string[];
  recentSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  suggestions,
  recentSearches,
  onSuggestionClick,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Search stocks..."
          className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {query && suggestions.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">Suggestions</p>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">Recent Searches</p>
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => onSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};