import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface BoxPlotProps {
  variable: string;
  data: number[];
  outliers: number[];
}

const BoxPlot: React.FC<BoxPlotProps> = ({ variable, data, outliers }) => {
  const sortedData = [...data].sort((a, b) => a - b);
  const q1 = sortedData[Math.floor(sortedData.length / 4)];
  const median = sortedData[Math.floor(sortedData.length / 2)];
  const q3 = sortedData[Math.floor(sortedData.length * 3 / 4)];
  const iqr = q3 - q1;
  const min = Math.max(q1 - 1.5 * iqr, sortedData[0]);
  const max = Math.min(q3 + 1.5 * iqr, sortedData[sortedData.length - 1]);

  const boxPlotData = [{
    variable,
    min,
    q1,
    median,
    q3,
    max,
    outliers
  }];

  const CustomBoxPlot = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { min, q1, median, q3, max } = payload;
    const boxWidth = width * 0.8;

    return (
      <g>
        <line x1={x + width / 2} y1={y + height - min} x2={x + width / 2} y2={y + height - max} stroke="black" />
        <rect x={x + (width - boxWidth) / 2} y={y + height - q3} width={boxWidth} height={q3 - q1} fill="#8884d8" stroke="black" />
        <line x1={x} y1={y + height - median} x2={x + width} y2={y + height - median} stroke="black" strokeWidth={2} />
        <line x1={x + (width - boxWidth) / 2} y1={y + height - min} x2={x + (width + boxWidth) / 2} y2={y + height - min} stroke="black" />
        <line x1={x + (width - boxWidth) / 2} y1={y + height - max} x2={x + (width + boxWidth) / 2} y2={y + height - max} stroke="black" />
      </g>
    );
  };

  return (
    <div className="w-full h-64">
      <h4 className="text-lg font-semibold mb-2">Box Plot: {variable}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={boxPlotData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="variable" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Bar dataKey="median" fill="#8884d8" shape={<CustomBoxPlot />} />
          <Scatter name="Outliers" dataKey="outliers" fill="red">
            {outliers.map((value: number, index: number) => (
              <Cell key={`cell-${index}`} fill="red" />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BoxPlot;