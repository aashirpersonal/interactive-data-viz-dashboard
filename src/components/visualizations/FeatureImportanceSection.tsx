import React from 'react';
import FeatureImportance from '../charts/FeatureImportance';

interface FeatureImportanceSectionProps {
  data: Record<string, Record<string, number>>;
}

const FeatureImportanceSection: React.FC<FeatureImportanceSectionProps> = ({ data }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Feature Importance</h3>
      <FeatureImportance data={data} />
    </div>
  );
};

export default FeatureImportanceSection;