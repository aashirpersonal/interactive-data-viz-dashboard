import React, { useState } from 'react';
import SummarySection from './visualizations/SummarySection';
import CorrelationSection from './visualizations/CorrelationSection';
import ClusteringSection from './visualizations/ClusteringSection';
import TimeSeriesSection from './visualizations/TimeSeriesSection';
import OutlierSection from './visualizations/OutlierSection';
import FeatureImportanceSection from './visualizations/FeatureImportanceSection';
import RegressionSection from './visualizations/RegressionSection';
import BarChartSection from './visualizations/BarChartSection';
import ScatterPlotSection from './visualizations/ScatterPlotSection';
import PairwisePlotsSection from './visualizations/PairwisePlotsSection';
import GeneralStatistics from './GeneralStatistics';
import AIInsights from './charts/AIInsights';

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
    feature_importance?: Record<string, Record<string, number>> | null;
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

  const baseVisualizations = [
    { value: 'summary', label: 'Summary Charts', description: 'Overview of key statistics for each variable' },
    { value: 'correlation', label: 'Correlation Analysis', description: 'Visualize relationships between variables' },
    { value: 'bar_chart', label: 'Bar Chart', description: 'Compare categories or groups' },
    { value: 'scatter_plot', label: 'Scatter Plot', description: 'Explore relationships between two variables' },
    { value: 'pairwise_plots', label: 'Pairwise Plots', description: 'Compare multiple variables simultaneously' },
  ];

  // Conditionally add visualizations based on available data
  if (data.pca_data && data.clusters) {
    baseVisualizations.push({ value: 'clustering', label: 'Clustering', description: 'Identify groups within your data' });
  }

  if (Object.keys(data.time_series_analysis || {}).length > 0) {
    baseVisualizations.push({ value: 'timeseries', label: 'Time Series', description: 'Analyze patterns over time' });
  }

  if (data.outliers && Object.keys(data.outliers).length > 0) {
    baseVisualizations.push({ value: 'outlier', label: 'Outlier Detection', description: 'Identify unusual data points' });
  }

  if (data.feature_importance) {
    baseVisualizations.push({ value: 'feature_importance', label: 'Feature Importance', description: 'See which variables have the most impact' });
  }

  if (data.regression_insights && Object.keys(data.regression_insights).length > 0) {
    baseVisualizations.push({ value: 'regression', label: 'Regression Insights', description: 'Understand predictive relationships' });
  }

  const recommendedVisualizations = (data.recommended_visualizations || []).map(([_, label]) => ({ 
    value: label.toLowerCase().replace(' ', '_'), 
    label, 
    description: 'AI-recommended visualization'
  }));

  const availableVisualizations = [
    ...baseVisualizations,
    ...recommendedVisualizations.filter(rec => !baseVisualizations.some(base => base.value === rec.value))
  ];

  const renderVisualization = (chartType: string) => {
    switch(chartType) {
      case 'summary':
        return <SummarySection summary={data.summary} />;
      case 'correlation':
        return <CorrelationSection 
          correlation={data.correlation} 
          topCorrelations={data.top_correlations} 
          summary={data.summary}
        />;
      case 'clustering':
        return data.pca_data && data.clusters ? (
          <ClusteringSection pca_data={data.pca_data} clusters={data.clusters} summary={data.summary} />
        ) : (
          <div className="text-gray-600">Clustering analysis is not available for the current dataset.</div>
        );
      case 'timeseries':
        return Object.keys(data.time_series_analysis || {}).length > 0 ? (
          <TimeSeriesSection timeSeriesData={data.time_series_analysis || {}} />
        ) : (
          <div className="text-gray-600">Time series analysis is not available for the current dataset.</div>
        );
      case 'outlier':
        return data.outliers && Object.keys(data.outliers).length > 0 ? (
          <OutlierSection data={data.summary} outliers={data.outliers} />
        ) : (
          <div className="text-gray-600">Outlier detection is not available for the current dataset.</div>
        );
      case 'feature_importance':
        return data.feature_importance ? (
          <FeatureImportanceSection data={data.feature_importance} />
        ) : (
          <div className="text-gray-600">Feature importance analysis is not available for the current dataset.</div>
        );
      case 'regression':
        return data.regression_insights && Object.keys(data.regression_insights).length > 0 ? (
          <RegressionSection data={data.regression_insights} />
        ) : (
          <div className="text-gray-600">Regression analysis is not available for the current dataset.</div>
        );
      case 'bar_chart':
        return <BarChartSection data={data.summary} />;
      case 'scatter_plot':
        return <ScatterPlotSection data={data.summary} />;
      case 'pairwise_plots':
        return <PairwisePlotsSection data={data.summary} />;
      default:
        return null;
    }
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
      
      <GeneralStatistics data={data.general_statistics} />
      
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

      {data.insights && data.insights.length > 0 && (
        <div className="mt-8">
          <AIInsights insights={data.insights} />
        </div>
      )}

      {data.pca_explained_variance && data.pca_explained_variance.length > 0 && (
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-indigo-800">PCA Results</h3>
          <p className="text-indigo-900">Explained Variance Ratio: {data.pca_explained_variance.map(v => v.toFixed(4)).join(', ')}</p>
          <p className="text-indigo-700 mt-2">This indicates how much of the data's variance is explained by each principal component.</p>
        </div>
      )}

      {!data.feature_importance && (
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-yellow-800">Feature Importance Not Available</h3>
          <p className="text-yellow-700">Feature importance analysis was not performed. This could be due to the large size of the dataset (over 10,000 rows) or because numerical features were not included in the analysis.</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualizations;