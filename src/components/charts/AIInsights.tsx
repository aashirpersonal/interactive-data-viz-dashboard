import React, { useState } from 'react';

interface AIInsightsProps {
  insights: string[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categorizedInsights = insights.reduce((acc, insight) => {
    let category = 'General';
    if (insight.includes('correlation')) category = 'Correlation';
    else if (insight.includes('distribution') || insight.includes('skewed') || insight.includes('kurtosis')) category = 'Distribution';
    else if (insight.includes('cluster')) category = 'Clustering';
    else if (insight.includes('time series')) category = 'Time Series';
    else if (insight.includes('outlier')) category = 'Outliers';
    else if (insight.includes('feature')) category = 'Feature Importance';
    else if (insight.includes('regression')) category = 'Regression';
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(insight);
    return acc;
  }, {} as Record<string, string[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Generated Insights</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed analysis and insights from your data</p>
      </div>
      <div className="border-t border-gray-200">
        {Object.entries(categorizedInsights).map(([category, categoryInsights]) => (
          <div key={category} className="px-4 py-5 sm:p-6">
            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between w-full text-left text-lg font-medium text-indigo-600 hover:text-indigo-900"
            >
              <span>{category}</span>
              <span>{expandedCategory === category ? '▼' : '▶'}</span>
            </button>
            {expandedCategory === category && (
              <div className="mt-2 space-y-4">
                {categoryInsights.map((insight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {!categorizedInsights['Feature Importance'] && (
        <div className="px-4 py-5 sm:p-6 bg-yellow-50">
          <p className="text-sm text-yellow-700">
            Note: Feature importance analysis was not performed due to the large size of the dataset (over 10,000 rows).
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;