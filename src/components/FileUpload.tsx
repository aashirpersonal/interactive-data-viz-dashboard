import React, { useState, useRef } from 'react';
import { uploadFile, FileInfo } from '../utils/api';

interface FileUploadProps {
  onUploadComplete: (result: FileInfo) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
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
      const fileInfo = await uploadFile(file);
      console.log('Upload response:', fileInfo);
      onUploadComplete(fileInfo);
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
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Select Dataset
          </button>
          <button
            type="submit"
            disabled={!file || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {file && (
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-md">
            Selected file: {file.name}
          </div>
        )}
      </form>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default FileUpload;