import React from 'react';
import CorrelationHeatmap from '../charts/CorrelationHeatmap';
import ScatterPlots from '../charts/ScatterPlots';

interface CorrelationSectionProps {
  correlation: Record<string, Record<string, number>>;
  topCorrelations: [string, string, number][];
  summary: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const CorrelationSection: React.FC<CorrelationSectionProps> = ({ correlation, topCorrelations, summary }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Correlation Analysis</h3>
      <CorrelationHeatmap correlation={correlation} />
      <h4 className="text-lg font-semibold mt-8 mb-4">Top Correlations</h4>
      <ScatterPlots topCorrelations={topCorrelations} summary={summary} />
    </div>
  );
};

export default CorrelationSection;