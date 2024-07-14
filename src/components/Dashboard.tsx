'use client';
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataVisualizations from './DataVisualizations';
import DataPreprocessing from './DataPreprocessing';
import { preprocessData, AnalysisResult } from '../utils/api';

interface PreprocessingOptions {
  columnOptions: Record<string, {
    include: boolean;
    fillMethod: 'none' | 'bfill' | 'ffill' | 'mean' | 'median' | 'mode' | 'remove';
  }>;
}

const Dashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisResult = (result: AnalysisResult) => {
    setLoading(true);
    setError(null);
    try {
      if ('error' in result) {
        throw new Error(result.error as string);
      }
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error processing analysis result:', err);
      setError(err instanceof Error ? err.message : 'Failed to process the analysis result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreprocess = async (options: PreprocessingOptions) => {
    setLoading(true);
    setError(null);
    try {
      const preprocessedData = await preprocessData(analysisResult!.filename, options);
      setAnalysisResult(preprocessedData);
    } catch (err) {
      setError('Failed to preprocess data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Welcome to the Interactive Data Visualization Dashboard</h2>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Upload your dataset to get started with automatic visualizations and AI-powered insights.</p>
        </div>
        <FileUpload onAnalysisComplete={handleAnalysisResult} />
        {loading && <p className="mt-4 text-blue-500">Processing your data... This may take a moment.</p>}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}
        {analysisResult && (
          <>
            <p className="mt-4 text-green-500">Analysis complete. Rendering visualizations...</p>
            <DataPreprocessing
              columns={Object.keys(analysisResult.summary || {})}
              missingValues={analysisResult.missing_values || {}}
              onPreprocess={handlePreprocess}
            />
            <DataVisualizations data={analysisResult} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;