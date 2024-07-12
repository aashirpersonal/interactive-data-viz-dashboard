import React, { useState } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Record<string, (number | string)[]>;
  columnTypes: Record<string, string>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

const LineChart: React.FC<LineChartProps> = ({ data, columnTypes, xAxisLabel = 'X Axis', yAxisLabel = 'Y Axis' }) => {
  const [selectedLines, setSelectedLines] = useState<string[]>(Object.keys(data).filter(key => columnTypes[key] === 'numerical'));

  const toggleLine = (line: string) => {
    setSelectedLines(prev => 
      prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
    );
  };

  const dateColumn = Object.keys(columnTypes).find(col => columnTypes[col] === 'datetime');
  const xAxisColumn = dateColumn || Object.keys(data)[0];

  const chartData = data[xAxisColumn].map((xValue, index) => ({
    [xAxisColumn]: xValue,
    ...Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key !== xAxisColumn)
        .map(([key, values]) => [key, values[index]])
    ),
  }));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Line Chart</h3>
      <div className="mb-4">
        {Object.keys(data).filter(key => columnTypes[key] === 'numerical').map((line, index) => (
          <button
            key={line}
            onClick={() => toggleLine(line)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              selectedLines.includes(line)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {line}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisColumn} 
            label={{ value: xAxisLabel || xAxisColumn, position: 'insideBottomRight', offset: -10 }}
            tick={{ angle: -45, textAnchor: 'end' }}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {selectedLines.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Use This Chart</h4>
        <ul className="list-disc pl-5">
          <li>The x-axis shows {dateColumn ? 'dates' : 'data points'} from your dataset.</li>
          <li>Each line represents a different numerical variable.</li>
          <li>You can toggle lines on and off by clicking the buttons above the chart.</li>
          <li>Hover over points on the lines to see exact values.</li>
          <li>Use this chart to compare trends or patterns across different variables over time.</li>
        </ul>
      </div>
    </div>
  );
};

export default LineChart;