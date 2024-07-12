import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FeatureImportanceProps {
  data: Record<string, Record<string, number>>;
}

const FeatureImportance: React.FC<FeatureImportanceProps> = ({ data }) => {
  const prepareData = (featureData: Record<string, number>) => {
    return Object.entries(featureData)
      .map(([feature, importance]) => ({ feature, importance }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10); // Show top 10 features
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Feature Importance</h3>
      {Object.entries(data).map(([target, featureData]) => (
        <div key={target} className="mb-8">
          <h4 className="text-lg font-medium mb-2">Target: {target}</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={prepareData(featureData)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="importance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Interpret This Chart</h4>
        <ul className="list-disc pl-5">
          <li>Each bar represents a feature in your dataset.</li>
          <li>The length of the bar indicates the importance of the feature in predicting the target variable.</li>
          <li>Longer bars (higher importance scores) suggest that the feature has a stronger influence on the target variable.</li>
          <li>This chart can help you identify which features are most crucial for your predictive models or data analysis.</li>
          <li>Consider focusing on the top features for feature engineering or when building simplified models.</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureImportance;