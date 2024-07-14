import React from 'react';
import PairwisePlots from '../charts/PairwisePlots';

interface PairwisePlotsSectionProps {
  data: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const PairwisePlotsSection: React.FC<PairwisePlotsSectionProps> = ({ data }) => {
  const numericalData = Object.entries(data)
    .filter(([_, colData]) => colData.type === 'numerical')
    .reduce((acc, [colName, colData]) => {
      acc[colName] = Object.values(colData).filter(val => typeof val === 'number');
      return acc;
    }, {} as Record<string, number[]>);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pairwise Plots</h3>
      <PairwisePlots data={numericalData} />
    </div>
  );
};

export default PairwisePlotsSection;