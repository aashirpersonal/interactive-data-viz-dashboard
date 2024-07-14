import React from 'react';
import SummaryCharts from '../charts/SummaryCharts';

interface SummarySectionProps {
  summary: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Summary Charts</h3>
      <SummaryCharts summary={summary} />
    </div>
  );
};

export default SummarySection;