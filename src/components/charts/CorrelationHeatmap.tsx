import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, ScatterChart, Scatter, Cell } from 'recharts';

interface CorrelationHeatmapProps {
  correlation: Record<string, Record<string, number>>;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlation }) => {
  const heatmapData = Object.entries(correlation).flatMap(([col1, correlations]) =>
    Object.entries(correlations).map(([col2, value]) => ({
      x: col1,
      y: col2,
      value: value
    }))
  );

  if (heatmapData.length === 0) {
    return <div>No correlation data available</div>;
  }

  const getColor = (value: number) => {
    const r = value < 0 ? 255 : Math.round(255 * (1 - value));
    const b = value > 0 ? 255 : Math.round(255 * (1 + value));
    return `rgb(${r}, 0, ${b})`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Correlation Heatmap</h3>
      <div style={{ height: '500px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis type="category" dataKey="x" name="Variable 1" />
            <YAxis type="category" dataKey="y" name="Variable 2" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { x, y, value } = payload[0].payload;
                  return (
                    <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
                      <p>{`${x} - ${y}`}</p>
                      <p>{`Correlation: ${value.toFixed(2)}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={heatmapData}>
              {heatmapData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.value)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;