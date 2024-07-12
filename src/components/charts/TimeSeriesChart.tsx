import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesChartProps {
  timeSeriesData: Record<string, {
    trend: number[];
    seasonal: number[];
    residual: number[];
    adf_statistic: number;
    adf_pvalue: number;
  }>;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ timeSeriesData }) => {
  const [selectedSeries, setSelectedSeries] = useState(Object.keys(timeSeriesData)[0]);

  const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeries(event.target.value);
  };

  const currentSeries = timeSeriesData[selectedSeries];

  const data = currentSeries.trend.map((value, index) => ({
    index,
    trend: value,
    seasonal: currentSeries.seasonal[index],
    residual: currentSeries.residual[index],
  }));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Time Series Analysis</h3>
      <div className="mb-4">
        <select
          value={selectedSeries}
          onChange={handleSeriesChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(timeSeriesData).map((series) => (
            <option key={series} value={series}>
              {series}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="trend" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="seasonal" stroke="#82ca9d" />
          <Line type="monotone" dataKey="residual" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <p>ADF Statistic: {currentSeries.adf_statistic.toFixed(4)}</p>
        <p>ADF p-value: {currentSeries.adf_pvalue.toFixed(4)}</p>
        <p>
          {currentSeries.adf_pvalue < 0.05
            ? "The time series is stationary (suitable for forecasting models)."
            : "The time series is non-stationary (consider differencing before modeling)."}
        </p>
      </div>
    </div>
  );
};

export default TimeSeriesChart;