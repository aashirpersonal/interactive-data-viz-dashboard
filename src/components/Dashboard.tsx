'use client';
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataVisualizations from './DataVisualizations';
import DataPreprocessing from './DataPreprocessing';
import { preprocessData, AnalysisResult, FileInfo } from '../utils/api';
import ProgressBar from './ProgressBar';

interface PreprocessingOptions {
  columnOptions: Record<string, {
    include: boolean;
    fillMethod: 'none' | 'bfill' | 'ffill' | 'mean' | 'median' | 'mode' | 'remove';
  }>;
}

const Dashboard: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
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

  const handleFileUpload = async (result: FileInfo) => {
    setFileInfo(result);
    setAnalysisResult(null);
    setError(null);
  };

  const handlePreprocess = async (options: PreprocessingOptions) => {
    if (!fileInfo) {
      setError('No file uploaded. Please upload a file first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      updateProgress(1);  // Start with processing data
      const preprocessedData = await preprocessData(fileInfo.filename, options);
      updateProgress(2);  // Performing analysis
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate analysis time
      updateProgress(3);  // Generating visualizations
      await new Promise(resolve => setTimeout(resolve, 1000));  // Simulate visualization generation time
      updateProgress(4);  // Finalizing results
      setAnalysisResult(preprocessedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preprocess data. Please try again.');
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
        <FileUpload onUploadComplete={handleFileUpload} />
        {loading && (
          <div className="mt-4">
            <ProgressBar progress={progress} />
            <p className="text-sm text-indigo-600 mt-2">{currentStep}</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-600">Error: {error}</p>}
        {fileInfo && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">File Information</h3>
            <p>Filename: {fileInfo.filename}</p>
            <p>Shape: {fileInfo.shape[0]} rows, {fileInfo.shape[1]} columns</p>
            <p>Columns: {fileInfo.columns.join(', ')}</p>
            <DataPreprocessing
              columns={fileInfo.columns}
              missingValues={fileInfo.missing_values}
              columnTypes={fileInfo.dtypes}
              onPreprocess={handlePreprocess}
            />
          </div>
        )}
        {analysisResult && (
          <div className="mt-8">
            <p className="text-green-600 mb-4">Analysis complete. Rendering visualizations...</p>
            <DataVisualizations data={analysisResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;