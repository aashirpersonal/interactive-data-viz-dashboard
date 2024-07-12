import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface SummaryChartsProps {
  summary: Record<string, {
    type: 'numerical' | 'categorical';
    [key: string]: any;
  }>;
}

const SummaryCharts: React.FC<SummaryChartsProps> = ({ summary }) => {
  const numericColumns = Object.entries(summary).filter(([_, colData]) => colData.type === 'numerical');
  const categoricalColumns = Object.entries(summary).filter(([_, colData]) => colData.type === 'categorical');

  return (
    <div className="grid grid-cols-2 gap-4">
      {numericColumns.map(([column, columnData]) => (
        <div key={column} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{column}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Min', value: columnData.min },
              { name: 'Mean', value: columnData.mean },
              { name: 'Max', value: columnData.max },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
      {categoricalColumns.map(([column, columnData]) => (
        <div key={column} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{column}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(columnData.top_values).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {Object.entries(columnData.top_values).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default SummaryCharts;