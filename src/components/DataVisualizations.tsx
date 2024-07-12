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
    { value: 'summary', label: 'Summary Charts' },
    { value: 'correlation', label: 'Correlation Heatmap' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'clustering', label: 'Clustering' },
    { value: 'timeseries', label: 'Time Series' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pairwise', label: 'Pairwise Plots' },
    { value: 'outlier', label: 'Outlier Detection' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'feature_importance', label: 'Feature Importance' },
    { value: 'regression', label: 'Regression Insights' },
    ...recommended_visualizations.map(([_, label]) => ({ value: label.toLowerCase().replace(' ', '_'), label }))
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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Data Visualizations and AI Insights</h2>
      
      <GeneralStatistics data={general_statistics} />
      
      <div className="mb-4">
        <select
          value={selectedVisualization}
          onChange={(e) => setSelectedVisualization(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {availableVisualizations.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      
      {renderVisualization(selectedVisualization)}

      {insights && insights.length > 0 && <AIInsights insights={insights} />}

      {pca_explained_variance.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">PCA Results</h3>
          <p>Explained Variance Ratio: {pca_explained_variance.map(v => v.toFixed(4)).join(', ')}</p>
          <p>This indicates how much of the data's variance is explained by each principal component.</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualizations;