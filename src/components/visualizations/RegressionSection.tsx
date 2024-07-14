import React from 'react';
import RegressionInsights from '../charts/RegressionInsights';

interface RegressionSectionProps {
  data: Record<string, {
    r2_score: number;
    mse: number;
    coefficients: Record<string, number>;
  }>;
}

const RegressionSection: React.FC<RegressionSectionProps> = ({ data }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Regression Insights</h3>
      <RegressionInsights data={data} />
    </div>
  );
};

export default RegressionSection;