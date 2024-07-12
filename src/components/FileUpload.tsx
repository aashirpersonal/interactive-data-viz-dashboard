import React, { useState, useRef } from 'react';
import { uploadFile } from '../utils/api';

interface FileUploadProps {
  onAnalysisComplete: (result: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      console.log('Uploading file:', file.name);
      const data = await uploadFile(file);
      console.log('Upload response:', data);
      onAnalysisComplete(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploading(false);
    }

    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.json"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Select Dataset
          </button>
          <button
            type="submit"
            disabled={!file || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;