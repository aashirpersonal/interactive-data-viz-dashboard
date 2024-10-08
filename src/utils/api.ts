const API_URL = 'http://localhost:8000';

export interface FileInfo {
  filename: string;
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
}

export async function uploadFile(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.detail || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function preprocessData(filename: string, options: any): Promise<AnalysisResult> {
  try {
    const requestBody = JSON.stringify({ filename, options });
    console.log('Preprocessing request:', requestBody);

    const response = await fetch(`${API_URL}/preprocess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Preprocessing error response:', errorData);
      throw new Error(`Data preprocessing failed: ${JSON.stringify(errorData)}`);
    }

    return response.json();
  } catch (error) {
    console.error('Preprocessing error:', error);
    throw error;
  }
}
export interface AnalysisResult {
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
  missing_values: Record<string, number>;
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
  filename: string;
}