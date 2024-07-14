import React from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';

interface TimeSeriesSectionProps {
  timeSeriesData: Record<string, {
    trend: number[];
    seasonal: number[];
    residual: number[];
    adf_statistic: number;
    adf_pvalue: number;
    dates: string[];
  }>;
}

const TimeSeriesSection: React.FC<TimeSeriesSectionProps> = ({ timeSeriesData }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Time Series Analysis</h3>
      <TimeSeriesChart timeSeriesData={timeSeriesData} />
    </div>
  );
};

export default TimeSeriesSection;