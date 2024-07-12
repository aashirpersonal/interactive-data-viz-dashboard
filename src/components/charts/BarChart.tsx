import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Record<string, Record<string, number>>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const prepareData = (categoryData: Record<string, number>) => {
    return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(data).map(([category, categoryData], index) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={prepareData(categoryData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[index % COLORS.length]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default BarChart;