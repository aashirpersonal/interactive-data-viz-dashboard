import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RegressionInsightsProps {
  data: Record<string, {
    r2_score: number;
    mse: number;
    coefficients: Record<string, number>;
  }>;
}

const RegressionInsights: React.FC<RegressionInsightsProps> = ({ data }) => {
  const prepareCoefficientsData = (coefficients: Record<string, number>) => {
    return Object.entries(coefficients)
      .map(([feature, coefficient]) => ({ feature, coefficient }))
      .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
      .slice(0, 10); // Show top 10 features
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Regression Insights</h3>
      {Object.entries(data).map(([target, regressionData]) => (
        <div key={target} className="mb-8">
          <h4 className="text-lg font-medium mb-2">Target: {target}</h4>
          <p>R² Score: {regressionData.r2_score.toFixed(4)}</p>
          <p>Mean Squared Error: {regressionData.mse.toFixed(4)}</p>
          <h5 className="text-md font-medium mt-4 mb-2">Feature Coefficients</h5>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={prepareCoefficientsData(regressionData.coefficients)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="coefficient" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Interpret These Insights</h4>
        <ul className="list-disc pl-5">
          <li>R² Score: Ranges from 0 to 1. Higher values indicate a better fit of the model to the data.</li>
          <li>Mean Squared Error (MSE): Lower values indicate better model performance.</li>
          <li>Feature Coefficients: The bars show the impact of each feature on the target variable.</li>
          <li>Longer bars (positive or negative) indicate a stronger influence on the target.</li>
          <li>Positive coefficients suggest a positive relationship with the target, while negative coefficients suggest an inverse relationship.</li>
        </ul>
      </div>
    </div>
  );
};

export default RegressionInsights;