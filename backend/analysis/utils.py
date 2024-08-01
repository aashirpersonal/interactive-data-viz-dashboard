import pandas as pd

def generate_insights(df, summary, correlation, clusters, time_series_analysis, outliers, feature_importance, regression_insights):
    insights = []
    
    # Basic statistics insights
    for column, stats in summary.items():
        if stats['type'] == 'numerical':
            if abs(stats['skewness']) > 1:
                insights.append(f"The distribution of {column} is {'positively' if stats['skewness'] > 0 else 'negatively'} skewed, which may indicate the presence of extreme values or a non-normal distribution.")
            if stats['kurtosis'] > 3:
                insights.append(f"{column} has a heavy-tailed distribution, suggesting the presence of outliers or extreme values that may require further investigation.")
        elif stats['type'] == 'categorical':
            top_category = max(stats['top_values'], key=stats['top_values'].get)
            percentage = (stats['top_values'][top_category] / sum(stats['top_values'].values())) * 100
            insights.append(f"In the {column} category, '{top_category}' is dominant, representing {percentage:.2f}% of the data. This imbalance might affect analysis and modeling.")
    
    # Correlation insights
    if correlation:
        strong_correlations = [(col1, col2, corr) for col1, col2, corr in get_top_correlations(correlation) if abs(corr) > 0.7]
        for col1, col2, corr in strong_correlations:
            insights.append(f"There is a strong {'positive' if corr > 0 else 'negative'} correlation ({corr:.2f}) between {col1} and {col2}. This relationship might be key for predictive modeling or understanding data dynamics.")
    
    # Clustering insights
    if clusters is not None:
        n_clusters = len(set(clusters))
        insights.append(f"The data exhibits {n_clusters} distinct clusters, suggesting natural groupings or segments within your dataset. Further analysis of these clusters could reveal important patterns or customer segments.")
    
    # Time series insights
    if time_series_analysis:
        for column, analysis in time_series_analysis.items():
            if analysis['adf_pvalue'] < 0.05:
                insights.append(f"The time series for {column} is stationary, making it suitable for various forecasting models. Consider using ARIMA or exponential smoothing methods for predictions.")
            else:
                insights.append(f"The time series for {column} is non-stationary. Consider differencing or transforming the data before applying time series models.")
    
    # Outlier insights
    for column, outlier_labels in outliers.items():
        outlier_count = sum(1 for label in outlier_labels if label == -1)
        if outlier_count > 0:
            percentage = (outlier_count / len(outlier_labels)) * 100
            insights.append(f"{column} contains {outlier_count} potential outliers ({percentage:.2f}% of the data). These outliers might represent anomalies, errors, or interesting edge cases worth investigating.")
    
    # Feature importance insights
    if feature_importance is not None:
        for target, importances in feature_importance.items():
            top_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:3]
            features_str = ", ".join([f"{feature} ({importance:.3f})" for feature, importance in top_features])
            insights.append(f"For predicting {target}, the most important features are: {features_str}. Focus on these features for feature engineering or when building predictive models.")
    else:
        insights.append("Feature importance analysis was skipped due to the large size of the dataset (over 10,000 rows). This helps to ensure faster processing times for large datasets.")
    
    # Regression insights
    if regression_insights:
        for target, results in regression_insights.items():
            if results['r2_score'] > 0.7:
                insights.append(f"The linear regression model for {target} shows a strong fit (R² = {results['r2_score']:.2f}). This suggests that the selected features are good predictors for {target}.")
            elif results['r2_score'] > 0.5:
                insights.append(f"The linear regression model for {target} shows a moderate fit (R² = {results['r2_score']:.2f}). There might be room for improvement by including non-linear relationships or additional features.")
            else:
                insights.append(f"The linear regression model for {target} shows a weak fit (R² = {results['r2_score']:.2f}). Consider exploring non-linear models or gathering additional relevant features to improve predictive power.")
    
    return insights

def recommend_visualizations(df, column_types):
    recommendations = []
    
    # Check for time series data
    if any(col_type == 'datetime' for col_type in column_types.values()):
        recommendations.append(('Time Series', 'Time Series Chart'))
    
    # Check for categorical data
    if any(col_type == 'categorical' for col_type in column_types.values()):
        recommendations.append(('Categorical', 'Bar Chart'))
    
    # Check for numerical data
    if any(col_type == 'numerical' for col_type in column_types.values()):
        recommendations.append(('Numerical', 'Scatter Plot'))
        recommendations.append(('Numerical', 'Correlation Heatmap'))
    
    return recommendations

def get_top_correlations(correlation_matrix, n=5):
    if not correlation_matrix:
        return []
    correlation_matrix = pd.DataFrame(correlation_matrix)
    
    corr_pairs = []
    for i in range(len(correlation_matrix.columns)):
        for j in range(i+1, len(correlation_matrix.columns)):
            corr_pairs.append((correlation_matrix.index[i], correlation_matrix.columns[j], correlation_matrix.iloc[i, j]))
    
    return sorted(corr_pairs, key=lambda x: abs(x[2]), reverse=True)[:n]