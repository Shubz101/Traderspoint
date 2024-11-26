import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface ChartProps {
  data: { time: string; value: number }[];
  isDarkMode: boolean;
}

export const StockChart: React.FC<ChartProps> = ({ data, isDarkMode }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartOptions = {
        layout: {
          background: { color: isDarkMode ? '#1F2937' : '#ffffff' },
          textColor: isDarkMode ? '#D1D5DB' : '#1F2937',
        },
        grid: {
          vertLines: { color: isDarkMode ? '#374151' : '#E5E7EB' },
          horzLines: { color: isDarkMode ? '#374151' : '#E5E7EB' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      };

      chartRef.current = createChart(chartContainerRef.current, chartOptions);
      const lineSeries = chartRef.current.addLineSeries({
        color: '#2563EB',
        lineWidth: 2,
      });
      lineSeries.setData(data);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current.remove();
      };
    }
  }, [data, isDarkMode]);

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
};