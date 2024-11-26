import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Stock } from '../types/stock';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.changePercent >= 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stock.companyName}</p>
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          <span className="ml-1 font-medium">{stock.changePercent.toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{stock.currentPrice.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vol: {(stock.volume / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          ₹{Math.abs(stock.change).toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
};