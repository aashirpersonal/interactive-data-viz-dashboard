'use client';
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataVisualizations from './DataVisualizations';
import DataPreprocessing from './DataPreprocessing';
import { preprocessData, AnalysisResult } from '../utils/api';
import ProgressBar from './ProgressBar';

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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const steps = [
    { name: 'Uploading file', percentage: 20 },
    { name: 'Processing data', percentage: 40 },
    { name: 'Performing analysis', percentage: 60 },
    { name: 'Generating visualizations', percentage: 80 },
    { name: 'Finalizing results', percentage: 100 }
  ];

  const updateProgress = (stepIndex: number) => {
    setCurrentStep(steps[stepIndex].name);
    setProgress(steps[stepIndex].percentage);
  };

  const handleAnalysisResult = async (result: AnalysisResult) => {
    setLoading(true);
    setError(null);
    try {
      updateProgress(0);  // Start with file upload
      if ('error' in result) {
        throw new Error(result.error as string);
      }
      updateProgress(1);  // Processing data
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate processing time
      updateProgress(2);  // Performing analysis
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate analysis time
      updateProgress(3);  // Generating visualizations
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate visualization generation time
      updateProgress(4);  // Finalizing results
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error processing analysis result:', err);
      setError(err instanceof Error ? err.message : 'Failed to process the analysis result. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handlePreprocess = async (options: PreprocessingOptions) => {
    setLoading(true);
    setError(null);
    try {
      updateProgress(1);  // Start with processing data
      const preprocessedData = await preprocessData(analysisResult!.filename, options);
      updateProgress(2);  // Performing analysis
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate analysis time
      updateProgress(3);  // Generating visualizations
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate visualization generation time
      updateProgress(4);  // Finalizing results
      setAnalysisResult(preprocessedData);
    } catch (err) {
      setError('Failed to preprocess data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Interactive Data Visualization Dashboard</h2>
        <div className="mb-6 text-gray-600">
          <p>Upload your dataset to get started with automatic visualizations and AI-powered insights.</p>
        </div>
        <FileUpload onAnalysisComplete={handleAnalysisResult} />
        {loading && (
          <div className="mt-4">
            <ProgressBar progress={progress} />
            <p className="text-sm text-indigo-600 mt-2">{currentStep}</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-600">Error: {error}</p>}
        {analysisResult && (
          <div className="mt-8">
            <p className="text-green-600 mb-4">Analysis complete. Rendering visualizations...</p>
            <DataPreprocessing
              columns={Object.keys(analysisResult.summary || {})}
              missingValues={analysisResult.missing_values || {}}
              onPreprocess={handlePreprocess}
            />
            <DataVisualizations data={analysisResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;