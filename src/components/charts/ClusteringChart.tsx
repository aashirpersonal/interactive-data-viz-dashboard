import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface ClusteringChartProps {
  pca_data?: Array<{ PC1: number; PC2: number }>;
  clusters?: number[];
  summary: Record<string, {
    type: 'numerical' | 'categorical';
    [key: string]: any;
  }>;
}

const ClusteringChart: React.FC<ClusteringChartProps> = ({ pca_data, clusters, summary }) => {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  if (!pca_data || !clusters || pca_data.length !== clusters.length) {
    return <div>Insufficient data for clustering visualization</div>;
  }

  const data = pca_data.map((point, index) => ({
    ...point,
    cluster: clusters[index]
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const clusterNames = ['Low', 'Medium', 'High'];

  const getClusterCharacteristics = (clusterNum: number) => {
    const clusterData = data.filter(point => point.cluster === clusterNum);
    const characteristics: Record<string, string> = {};

    Object.entries(summary).forEach(([column, colSummary]) => {
      if (colSummary.type === 'numerical') {
        const values = clusterData.map(point => point[column as keyof typeof point] as number);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        characteristics[column] = avg.toFixed(2);
      }
    });

    return characteristics;
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Clustering Visualization</h3>
      <p className="mb-4">
        This chart shows how the data points are grouped into 3 clusters based on their similarities. 
        Each point represents a data entry, and its position is determined by two principal components (PC1 and PC2) 
        which capture the most important patterns in the data.
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis type="number" dataKey="PC1" name="Principal Component 1" />
          <YAxis type="number" dataKey="PC2" name="Principal Component 2" />
          <ZAxis type="number" dataKey="cluster" name="cluster" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {Array.from(new Set(clusters)).map((cluster, index) => (
            <Scatter
              key={`cluster-${cluster}`}
              name={`${clusterNames[index]} Group`}
              data={data.filter(point => point.cluster === cluster)}
              fill={COLORS[index % COLORS.length]}
              onClick={() => setSelectedCluster(cluster)}
            >
              <LabelList dataKey="cluster" position="top" />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Cluster Characteristics</h4>
        <p className="mb-2">Click on a cluster in the chart to see its characteristics.</p>
        {selectedCluster !== null && (
          <div>
            <h5 className="text-md font-semibold">{clusterNames[selectedCluster]} Group Characteristics:</h5>
            <ul>
              {Object.entries(getClusterCharacteristics(selectedCluster)).map(([key, value]) => (
                <li key={key}>{`${key}: ${value}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">How to Interpret This Chart</h4>
        <ul className="list-disc pl-5">
          <li>Each point represents a data entry in your dataset.</li>
          <li>Points that are close together are similar in terms of their characteristics.</li>
          <li>The three colors represent three different groups (clusters) that the algorithm has identified.</li>
          <li>Click on a cluster to see the average characteristics of data points in that group.</li>
          <li>This can help you identify patterns or segments in your data, such as different customer groups or product categories.</li>
        </ul>
      </div>
    </div>
  );
};

export default ClusteringChart;