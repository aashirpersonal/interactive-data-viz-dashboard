import React from 'react';
import ClusteringChart from '../charts/ClusteringChart';

interface ClusteringSectionProps {
  pca_data?: Array<{ PC1: number; PC2: number }>;
  clusters?: number[];
  summary: Record<string, {
    type: 'numerical' | 'categorical' | 'datetime';
    [key: string]: any;
  }>;
}

const ClusteringSection: React.FC<ClusteringSectionProps> = ({ pca_data, clusters, summary }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Clustering Analysis</h3>
      <ClusteringChart pca_data={pca_data} clusters={clusters} summary={summary} />
    </div>
  );
};

export default ClusteringSection;