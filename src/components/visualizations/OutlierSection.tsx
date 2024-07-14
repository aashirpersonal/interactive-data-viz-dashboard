import React from 'react';
import OutlierDetection from '../charts/OutlierDetection';

interface OutlierSectionProps {
  data: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
  outliers: Record<string, number[]>;
}

const OutlierSection: React.FC<OutlierSectionProps> = ({ data, outliers }) => {
  const numericalData = Object.entries(data)
    .filter(([_, colData]) => colData.type === 'numerical')
    .reduce((acc, [colName, colData]) => {
      acc[colName] = Object.values(colData).filter(val => typeof val === 'number');
      return acc;
    }, {} as Record<string, number[]>);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Outlier Detection</h3>
      <OutlierDetection data={numericalData} outliers={outliers} />
    </div>
  );
};

export default OutlierSection;