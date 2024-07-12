import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface PairwisePlotsProps {
  data: Record<string, number[]>;
  maxPlots?: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

const PairwisePlots: React.FC<PairwisePlotsProps> = ({ data, maxPlots = 6 }) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(
    Object.keys(data).slice(0, maxPlots)
  );

  const toggleVariable = (variable: string) => {
    setSelectedVariables(prev =>
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable].slice(0, maxPlots)
    );
  };

  const prepareData = (xKey: string, yKey: string) => {
    return data[xKey].map((x, i) => ({ x, y: data[yKey][i] }));
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Pairwise Plots</h3>
      <div className="mb-4">
        {Object.keys(data).map(variable => (
          <button
            key={variable}
            onClick={() => toggleVariable(variable)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              selectedVariables.includes(variable)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {variable}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {selectedVariables.map((xVar, i) =>
          selectedVariables.slice(i + 1).map((yVar, j) => (
            <div key={`${xVar}-${yVar}`} className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={xVar} 
                    label={{ value: xVar, position: 'bottom', offset: 20 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={yVar} 
                    label={{ value: yVar, angle: -90, position: 'left', offset: 0 }}
                  />
                  <ZAxis range={[64, 144]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: number, name: string) => [value.toFixed(2), name === 'x' ? xVar : yVar]}
                  />
                  <Scatter name={`${xVar} vs ${yVar}`} data={prepareData(xVar, yVar)}>
                    {prepareData(xVar, yVar).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Use These Plots</h4>
        <ul className="list-disc pl-5">
          <li>Each plot shows the relationship between two variables.</li>
          <li>The variable name on the bottom is plotted on the x-axis.</li>
          <li>The variable name on the left is plotted on the y-axis.</li>
          <li>Use the buttons above to select which variables to include (up to {maxPlots}).</li>
          <li>Look for patterns such as linear relationships, clusters, or outliers.</li>
          <li>These plots can help identify correlations and potential interesting relationships in your data.</li>
        </ul>
      </div>
    </div>
  );
};

export default PairwisePlots;