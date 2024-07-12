import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScatterPlotsProps {
  topCorrelations: [string, string, number][];
  summary: Record<string, any>;
}

const ScatterPlots: React.FC<ScatterPlotsProps> = ({ topCorrelations, summary }) => {
  if (topCorrelations.length === 0) {
    return <div>No correlation data available for scatter plots</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {topCorrelations.map(([col1, col2, corr]) => {
        const data = Object.keys(summary[col1]).map((key) => ({
          [col1]: summary[col1][key],
          [col2]: summary[col2][key],
        }));

        return (
          <div key={`${col1}-${col2}`} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{`${col1} vs ${col2} (Correlation: ${corr.toFixed(2)})`}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey={col1} name={col1} />
                <YAxis type="number" dataKey={col2} name={col2} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name={`${col1} vs ${col2}`} data={data} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default ScatterPlots;