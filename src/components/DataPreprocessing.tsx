import React, { useState, useEffect } from 'react';

interface DataPreprocessingProps {
  columns: string[];
  missingValues: Record<string, number>;
  onPreprocess: (options: PreprocessingOptions) => void;
}

interface PreprocessingOptions {
  columnOptions: Record<string, ColumnOption>;
}

interface ColumnOption {
  include: boolean;
  fillMethod: 'none' | 'bfill' | 'ffill' | 'mean' | 'median' | 'mode' | 'remove';
}

const DataPreprocessing: React.FC<DataPreprocessingProps> = ({ columns = [], missingValues = {}, onPreprocess }) => {
  const [columnOptions, setColumnOptions] = useState<Record<string, ColumnOption>>({});
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const initialOptions = columns.reduce((acc, column) => {
      acc[column] = { include: true, fillMethod: 'none' };
      return acc;
    }, {} as Record<string, ColumnOption>);
    setColumnOptions(initialOptions);
  }, [columns]);

  const handleColumnToggle = (column: string) => {
    setColumnOptions(prev => ({
      ...prev,
      [column]: { ...prev[column], include: !prev[column].include }
    }));
  };

  const handleFillMethodChange = (column: string, method: ColumnOption['fillMethod']) => {
    setColumnOptions(prev => ({
      ...prev,
      [column]: { ...prev[column], fillMethod: method }
    }));
  };

  const handlePreprocess = () => {
    onPreprocess({ columnOptions });
  };

  const toggleColumnExpand = (column: string) => {
    setExpandedColumns(prev => 
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const filteredColumns = columns.filter(column => 
    column.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Data Preprocessing</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search columns..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-4 max-h-96 overflow-y-auto">
        {filteredColumns.map(column => (
          <div key={column} className="mb-2 border-b pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={columnOptions[column]?.include}
                  onChange={() => handleColumnToggle(column)}
                  className="mr-2"
                />
                <span className="font-medium">{column}</span>
              </div>
              <button
                onClick={() => toggleColumnExpand(column)}
                className="text-blue-500 hover:text-blue-700"
              >
                {expandedColumns.includes(column) ? 'Collapse' : 'Expand'}
              </button>
            </div>
            {expandedColumns.includes(column) && (
              <div className="mt-2 ml-6">
                <p className="text-sm text-gray-600">Missing Values: {missingValues[column] || 0}</p>
                <select
                  value={columnOptions[column]?.fillMethod}
                  onChange={(e) => handleFillMethodChange(column, e.target.value as ColumnOption['fillMethod'])}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  disabled={!columnOptions[column]?.include}
                >
                  <option value="none">None</option>
                  <option value="bfill">Backward Fill</option>
                  <option value="ffill">Forward Fill</option>
                  <option value="mean">Mean</option>
                  <option value="median">Median</option>
                  <option value="mode">Mode</option>
                  <option value="remove">Remove Rows</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handlePreprocess}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Apply Preprocessing
      </button>
    </div>
  );
};

export default DataPreprocessing;