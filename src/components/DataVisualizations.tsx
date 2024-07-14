import React, { useState } from 'react';
import SummaryCharts from './charts/SummaryCharts';
import CorrelationHeatmap from './charts/CorrelationHeatmap';
import ScatterPlots from './charts/ScatterPlots';
import AIInsights from './charts/AIInsights';
import ClusteringChart from './charts/ClusteringChart';
import TimeSeriesChart from './charts/TimeSeriesChart';
import LineChart from './charts/LineChart';
import PairwisePlots from './charts/PairwisePlots';
import OutlierDetection from './charts/OutlierDetection';
import BarChart from './charts/BarChart';
import GeneralStatistics from './GeneralStatistics';
import FeatureImportance from './charts/FeatureImportance';
import RegressionInsights from './charts/RegressionInsights';

interface DataVisualizationsProps {
  data: {
    summary: Record<string, {
      type: 'numerical' | 'categorical' | 'datetime';
      [key: string]: any;
    }>;
    column_types: Record<string, string>;
    correlation: Record<string, Record<string, number>>;
    top_correlations: [string, string, number][];
    pca_data?: Array<{ PC1: number; PC2: number }>;
    clusters?: number[];
    time_series_analysis?: Record<string, {
      trend: number[];
      seasonal: number[];
      residual: number[];
      adf_statistic: number;
      adf_pvalue: number;
      dates: string[];
    }>;
    insights?: string[];
    recommended_visualizations?: [string, string][];
    pca_result?: number[][];
    pca_explained_variance?: number[];
    general_statistics: {
      totalRows: number;
      totalColumns: number;
      numericColumns: number;
      categoricalColumns: number;
      datetimeColumns: number;
      missingValues: number;
      totalCells: number;
    };
    outliers?: Record<string, number[]>;
    feature_importance?: Record<string, Record<string, number>>;
    regression_insights?: Record<string, {
      r2_score: number;
      mse: number;
      coefficients: Record<string, number>;
    }>;
  };
}

const DataVisualizations: React.FC<DataVisualizationsProps> = ({ data }) => {
  const [selectedVisualization, setSelectedVisualization] = useState<string>('summary');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!data || !data.summary) return null;

  const { 
    summary, 
    column_types, 
    correlation, 
    top_correlations, 
    pca_data, 
    clusters, 
    time_series_analysis, 
    insights,
    recommended_visualizations = [],
    pca_result = [],
    pca_explained_variance = [],
    general_statistics,
    outliers = {},
    feature_importance = {},
    regression_insights = {}
  } = data;

  const availableVisualizations = [
    { value: 'summary', label: 'Summary Charts', description: 'Overview of key statistics for each variable' },
    { value: 'correlation', label: 'Correlation Heatmap', description: 'Visualize relationships between variables' },
    { value: 'scatter', label: 'Scatter Plot', description: 'Explore relationships between two variables' },
    { value: 'clustering', label: 'Clustering', description: 'Identify groups within your data' },
    { value: 'timeseries', label: 'Time Series', description: 'Analyze patterns over time' },
    { value: 'line', label: 'Line Chart', description: 'View trends across multiple variables' },
    { value: 'pairwise', label: 'Pairwise Plots', description: 'Compare multiple variables simultaneously' },
    { value: 'outlier', label: 'Outlier Detection', description: 'Identify unusual data points' },
    { value: 'bar', label: 'Bar Chart', description: 'Compare categories or groups' },
    { value: 'feature_importance', label: 'Feature Importance', description: 'See which variables have the most impact' },
    { value: 'regression', label: 'Regression Insights', description: 'Understand predictive relationships' },
    ...recommended_visualizations.map(([_, label]) => ({ 
      value: label.toLowerCase().replace(' ', '_'), 
      label, 
      description: 'AI-recommended visualization'
    }))
  ];

  const renderVisualization = (chartType: string) => {
    switch(chartType) {
      case 'summary':
        return <SummaryCharts summary={summary} />;
      case 'correlation':
        return <CorrelationHeatmap correlation={correlation} />;
      case 'scatter':
        return <ScatterPlots topCorrelations={top_correlations} summary={summary} />;
      case 'clustering':
        return <ClusteringChart pca_data={pca_data} clusters={clusters} summary={summary} />;
      case 'timeseries':
        return <TimeSeriesChart timeSeriesData={time_series_analysis || {}} />;
      case 'line':
        return <LineChart data={getLineChartData()} columnTypes={column_types} xAxisLabel="Data Points" yAxisLabel="Values" />;
      case 'pairwise':
        return <PairwisePlots data={getNumericalData()} />;
      case 'outlier':
        return <OutlierDetection data={getNumericalData()} outliers={outliers} />;
      case 'bar':
        return <BarChart data={getCategoricalData()} />;
      case 'feature_importance':
        return <FeatureImportance data={feature_importance} />;
      case 'regression':
        return <RegressionInsights data={regression_insights} />;
      default:
        return null;
    }
  };

  const getLineChartData = () => {
    const chartData: Record<string, (number | string)[]> = {};
    
    Object.entries(summary).forEach(([colName, colData]) => {
      if (colData.type === 'numerical') {
        chartData[colName] = Object.values(colData).filter(val => typeof val === 'number');
      } else if (colData.type === 'datetime') {
        chartData[colName] = colData.values || [];
      }
    });

    if (time_series_analysis) {
      const timeSeriesColumn = Object.keys(time_series_analysis)[0];
      if (timeSeriesColumn) {
        chartData['Date'] = time_series_analysis[timeSeriesColumn].dates;
        chartData[timeSeriesColumn] = time_series_analysis[timeSeriesColumn].trend;
      }
    }

    return chartData;
  };

  const getNumericalData = () => {
    const numericalData: Record<string, number[]> = {};
    Object.entries(summary).forEach(([colName, colData]) => {
      if (colData.type === 'numerical') {
        numericalData[colName] = Object.values(colData).filter(val => typeof val === 'number');
      }
    });
    return numericalData;
  };

  const getCategoricalData = () => {
    const categoricalData: Record<string, Record<string, number>> = {};
    Object.entries(summary).forEach(([colName, colData]) => {
      if (colData.type === 'categorical') {
        categoricalData[colName] = colData.top_values;
      }
    });
    return categoricalData;
  };

  const handleVisualizationChange = (value: string) => {
    setIsLoading(true);
    setSelectedVisualization(value);
    // Simulate loading time for smoother transitions
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Data Visualizations and AI Insights</h2>
      
      <GeneralStatistics data={general_statistics} />
      
      <div className="mb-6">
        <label htmlFor="visualization-select" className="block text-lg font-semibold text-indigo-800 mb-2">
          Select Visualization
        </label>
        <div className="relative">
          <select
            id="visualization-select"
            value={selectedVisualization}
            onChange={(e) => handleVisualizationChange(e.target.value)}
            className="block appearance-none w-full bg-indigo-100 border border-indigo-300 text-indigo-900 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            {availableVisualizations.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-indigo-600">
          {availableVisualizations.find(v => v.value === selectedVisualization)?.description}
        </p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner min-h-[400px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          renderVisualization(selectedVisualization)
        )}
      </div>

      {insights && insights.length > 0 && (
        <div className="mt-8">
          <AIInsights insights={insights} />
        </div>
      )}

      {pca_explained_variance.length > 0 && (
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-indigo-800">PCA Results</h3>
          <p className="text-indigo-900">Explained Variance Ratio: {pca_explained_variance.map(v => v.toFixed(4)).join(', ')}</p>
          <p className="text-indigo-700 mt-2">This indicates how much of the data's variance is explained by each principal component.</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualizations;