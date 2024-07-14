import React from 'react';
import ScatterPlots from '../charts/ScatterPlots';

interface ScatterPlotSectionProps {
  data: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const ScatterPlotSection: React.FC<ScatterPlotSectionProps> = ({ data }) => {
  const numericalColumns = Object.keys(data).filter(key => data[key].type === 'numerical');
  const topCorrelations = numericalColumns.flatMap((col1, i) => 
    numericalColumns.slice(i + 1).map(col2 => [col1, col2, Math.random()] as [string, string, number])
  ).sort((a, b) => Math.abs(b[2]) - Math.abs(a[2])).slice(0, 5);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Scatter Plots</h3>
      <ScatterPlots topCorrelations={topCorrelations} summary={data} />
    </div>
  );
};

export default ScatterPlotSection;