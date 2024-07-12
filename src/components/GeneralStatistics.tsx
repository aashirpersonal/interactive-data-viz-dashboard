import React from 'react';

interface GeneralStatisticsProps {
  data: {
    totalRows: number;
    totalColumns: number;
    numericColumns: number;
    categoricalColumns: number;
    datetimeColumns: number;
    missingValues: number;
    totalCells: number;
  };
}

const GeneralStatistics: React.FC<GeneralStatisticsProps> = ({ data }) => {
  const {
    totalRows,
    totalColumns,
    numericColumns,
    categoricalColumns,
    datetimeColumns,
    missingValues,
    totalCells
  } = data;

  const missingPercentage = ((missingValues / totalCells) * 100).toFixed(2);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">General Dataset Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Rows</p>
          <p className="text-2xl font-bold">{totalRows.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Columns</p>
          <p className="text-2xl font-bold">{totalColumns}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Numeric Columns</p>
          <p className="text-2xl font-bold">{numericColumns}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Categorical Columns</p>
          <p className="text-2xl font-bold">{categoricalColumns}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Datetime Columns</p>
          <p className="text-2xl font-bold">{datetimeColumns}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Missing Values</p>
          <p className="text-2xl font-bold">{missingValues.toLocaleString()} ({missingPercentage}%)</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralStatistics;