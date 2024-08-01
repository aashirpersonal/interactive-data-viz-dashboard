import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

interface DataPreprocessingProps {
  columns: string[];
  missingValues: Record<string, number>;
  columnTypes: Record<string, string>;
  onPreprocess: (options: PreprocessingOptions) => void;
}

interface PreprocessingOptions {
  columnOptions: Record<string, ColumnOption>;
  use_standard_scaler: boolean;
}

interface ColumnOption {
  include: boolean;
  fillMethod: 'none' | 'mean' | 'median' | 'mode' | 'constant' | 'ffill' | 'bfill';
  fillConstant?: string | number;
  scaling: 'none' | 'standardization' | 'normalization' | 'log';
  encoding: 'none' | 'one-hot' | 'keep';
  binning: 'none' | 'equal-width' | 'equal-frequency';
  numBins?: number;
}

const DataPreprocessing: React.FC<DataPreprocessingProps> = ({ columns, missingValues, columnTypes, onPreprocess }) => {
  const [columnOptions, setColumnOptions] = useState<Record<string, ColumnOption>>({});
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [useStandardScaler, setUseStandardScaler] = useState(false);

  useEffect(() => {
    const initialOptions = columns.reduce((acc, column) => {
      acc[column] = {
        include: true,
        fillMethod: 'none',
        scaling: 'none',
        encoding: 'none',
        binning: 'none',
      };
      return acc;
    }, {} as Record<string, ColumnOption>);
    setColumnOptions(initialOptions);
  }, [columns]);

  const handleOptionChange = (column: string, option: keyof ColumnOption, value: any) => {
    setColumnOptions(prev => ({
      ...prev,
      [column]: { ...prev[column], [option]: value }
    }));
  };

  const handlePreprocess = () => {
    onPreprocess({ columnOptions, use_standard_scaler: useStandardScaler });
  };

  const toggleColumnExpand = (column: string) => {
    setExpandedColumns(prev => 
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const filteredColumns = columns.filter(column => 
    column.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderColumnOptions = (column: string) => {
    const options = columnOptions[column];
    const type = columnTypes[column];

    return (
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fill Method</label>
          <select
            value={options.fillMethod}
            onChange={(e) => handleOptionChange(column, 'fillMethod', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="none">None</option>
            <option value="mean">Mean</option>
            <option value="median">Median</option>
            <option value="mode">Mode</option>
            <option value="constant">Constant</option>
            <option value="ffill">Forward Fill</option>
            <option value="bfill">Backward Fill</option>
          </select>
        </div>
        {options.fillMethod === 'constant' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Fill Constant</label>
            <input
              type="text"
              value={options.fillConstant || ''}
              onChange={(e) => handleOptionChange(column, 'fillConstant', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        )}
        {type === 'numerical' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Scaling</label>
              <select
                value={options.scaling}
                onChange={(e) => handleOptionChange(column, 'scaling', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="none">None</option>
                <option value="standardization">Standardization</option>
                <option value="normalization">Normalization</option>
                <option value="log">Log Transform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Binning</label>
              <select
                value={options.binning}
                onChange={(e) => handleOptionChange(column, 'binning', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="none">None</option>
                <option value="equal-width">Equal Width</option>
                <option value="equal-frequency">Equal Frequency</option>
              </select>
            </div>
            {options.binning !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Bins</label>
                <input
                  type="number"
                  value={options.numBins || 5}
                  onChange={(e) => handleOptionChange(column, 'numBins', parseInt(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            )}
          </>
        )}
        {type === 'categorical' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Encoding</label>
            <select
              value={options.encoding}
              onChange={(e) => handleOptionChange(column, 'encoding', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="one-hot">One-Hot Encoding</option>
              <option value="keep">Keep as Categorical</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-800">Data Preprocessing</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search columns..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useStandardScaler}
            onChange={(e) => setUseStandardScaler(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Use Standard Scaler</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing Values</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Include</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColumns.map(column => (
              <React.Fragment key={column}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{columnTypes[column]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{missingValues[column] || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={columnOptions[column]?.include}
                      onChange={(e) => handleOptionChange(column, 'include', e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleColumnExpand(column)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedColumns.includes(column) ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedColumns.includes(column) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      {renderColumnOptions(column)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handlePreprocess}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        Apply Preprocessing
      </button>
    </div>
  );
};

export default DataPreprocessing;