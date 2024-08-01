import React from 'react';
import FeatureImportance from '../charts/FeatureImportance';

interface FeatureImportanceSectionProps {
  data: Record<string, Record<string, number>> | null;
}

const FeatureImportanceSection: React.FC<FeatureImportanceSectionProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-yellow-800">Feature Importance Not Available</h3>
        <p className="text-yellow-700">
          Feature importance analysis was skipped due to the large size of the dataset (over 10,000 rows). 
          This helps to ensure faster processing times for large datasets.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Feature Importance</h3>
      <FeatureImportance data={data} />
    </div>
  );
};

export default FeatureImportanceSection;