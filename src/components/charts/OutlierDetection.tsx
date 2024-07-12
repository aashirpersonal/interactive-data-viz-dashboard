import React, { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import BoxPlot from './BoxPlot';

interface OutlierDetectionProps {
  data: Record<string, number[]>;
  outliers: Record<string, number[]>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

const OutlierDetection: React.FC<OutlierDetectionProps> = ({ data, outliers }) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(
    Object.keys(data).slice(0, 2)
  );

  const toggleVariable = (variable: string) => {
    setSelectedVariables(prev =>
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable].slice(0, 2)
    );
  };

  const prepareScatterData = (xVar: string, yVar: string) => {
    return data[xVar].map((x, i) => ({ x, y: data[yVar][i] }));
  };

  const isOutlier = (value: number, variable: string) => {
    return outliers[variable].includes(value);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Outlier Detection</h3>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedVariables.map(variable => (
          <BoxPlot key={variable} variable={variable} data={data[variable]} outliers={outliers[variable]} />
        ))}
        {selectedVariables.length === 2 && (
          <div className="w-full h-64 col-span-1 md:col-span-2">
            <h4 className="text-lg font-semibold mb-2">Scatter Plot: {selectedVariables[0]} vs {selectedVariables[1]}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" name={selectedVariables[0]} />
                <YAxis type="number" dataKey="y" name={selectedVariables[1]} />
                <ZAxis range={[64, 144]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name={`${selectedVariables[0]} vs ${selectedVariables[1]}`} data={prepareScatterData(selectedVariables[0], selectedVariables[1])}>
                  {prepareScatterData(selectedVariables[0], selectedVariables[1]).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={isOutlier(entry.x, selectedVariables[0]) || isOutlier(entry.y, selectedVariables[1]) ? '#ff0000' : '#8884d8'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <InterpretationGuide />
    </div>
  );
};

const InterpretationGuide: React.FC = () => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold mb-2">How to Interpret These Plots</h4>
    <ul className="list-disc pl-5">
      <li>Box Plots: The box represents the interquartile range (IQR). The line inside the box is the median. Whiskers extend to the lowest and highest data points within 1.5 * IQR. Red points beyond the whiskers are potential outliers.</li>
      <li>Scatter Plot: Points in red are potential outliers in either the x or y dimension.</li>
      <li>Use the buttons above to select which variables to analyze (up to 2).</li>
      <li>Outliers may indicate interesting data points, errors, or unusual events in your dataset.</li>
    </ul>
  </div>
);

export default OutlierDetection;