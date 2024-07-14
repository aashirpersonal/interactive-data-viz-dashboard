import React from 'react';

interface CorrelationHeatmapProps {
  correlation: Record<string, Record<string, number>>;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlation }) => {
  if (!correlation || Object.keys(correlation).length === 0) {
    console.log('No correlation data available');
    return <div>No correlation data available</div>;
  }

  const variables = Object.keys(correlation);

  const getColor = (value: number) => {
    const r = value < 0 ? 255 : Math.round(255 * (1 - Math.abs(value)));
    const b = value > 0 ? 255 : Math.round(255 * (1 - Math.abs(value)));
    return `rgb(${r}, 0, ${b})`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Correlation Heatmap</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2"></th>
              {variables.map((variable) => (
                <th key={variable} className="border p-2 text-xs">
                  {/* Empty header for spacing */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map((row) => (
              <tr key={row}>
                <th className="border p-2 text-xs text-left whitespace-nowrap">{row}</th>
                {variables.map((col) => {
                  const value = correlation[row][col] || 0;
                  return (
                    <td
                      key={`${row}-${col}`}
                      className="border p-2 text-xs"
                      style={{
                        backgroundColor: getColor(value),
                        color: Math.abs(value) > 0.5 ? 'white' : 'black',
                      }}
                      title={`${row} - ${col}: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="border p-2"></th>
              {variables.map((variable) => (
                <th key={variable} className="border p-2">
                  <div className="transform origin-top-left translate-y-full text-xs whitespace-nowrap">
                    {variable}
                  </div>
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Interpret This Heatmap</h4>
        <ul className="list-disc pl-5">
          <li>Each cell represents the correlation between two variables.</li>
          <li>The color intensity indicates the strength of the correlation.</li>
          <li>Blue colors represent positive correlations, while red colors represent negative correlations.</li>
          <li>Darker colors indicate stronger correlations, while lighter colors indicate weaker correlations.</li>
          <li>The diagonal represents the correlation of a variable with itself, which is always 1.</li>
          <li>Hover over a cell to see the exact correlation value between two variables.</li>
        </ul>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;