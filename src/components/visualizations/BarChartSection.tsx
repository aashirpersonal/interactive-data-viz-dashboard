import React from 'react';
import BarChart from '../charts/BarChart';

interface BarChartSectionProps {
  data: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const BarChartSection: React.FC<BarChartSectionProps> = ({ data }) => {
  const categoricalData = Object.entries(data)
    .filter(([_, colData]) => colData.type === 'categorical')
    .reduce((acc, [colName, colData]) => {
      acc[colName] = colData.top_values;
      return acc;
    }, {} as Record<string, Record<string, number>>);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bar Charts</h3>
      <BarChart data={categoricalData} />
    </div>
  );
};

export default BarChartSection;