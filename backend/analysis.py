import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from sklearn.impute import SimpleImputer
from scipy import stats
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.feature_selection import mutual_info_regression
from sklearn.tree import DecisionTreeRegressor
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
from sklearn.ensemble import RandomForestRegressor

nltk.download('punkt')
nltk.download('stopwords')

def analyze_data(df):
    summary = get_summary(df)
    column_types = get_column_types(df)
    correlation = get_correlation(df)
    top_correlations = get_top_correlations(correlation)
    pca_data, pca_explained_variance = perform_pca(df)
    clusters = perform_clustering(df)
    time_series_analysis = analyze_time_series(df)
    outliers = detect_outliers(df)
    feature_importance = get_feature_importance(df)
    regression_insights = perform_regression_analysis(df)
    insights = generate_insights(df, summary, correlation, clusters, time_series_analysis, outliers, feature_importance, regression_insights)
    missing_values = df.isnull().sum().to_dict()
    
    recommended_visualizations = recommend_visualizations(df, column_types)
    important_features = get_important_features(df)
    
    general_statistics = calculate_general_statistics(df)
    
    return {
        "summary": summary,
        "column_types": column_types,
        "correlation": correlation,
        "top_correlations": top_correlations,
        "pca_data": pca_data,
        "clusters": clusters,
        "time_series_analysis": time_series_analysis,
        "insights": insights,
        "missing_values": missing_values,
        "recommended_visualizations": recommended_visualizations,
        "important_features": important_features,
        "pca_result": pca_data,
        "pca_explained_variance": pca_explained_variance,
        "general_statistics": general_statistics,
        "outliers": outliers,
        "feature_importance": feature_importance,
        "regression_insights": regression_insights
    }
def get_summary(df):
    summary = {}
    for column in df.columns:
        col_summary = {}
        if pd.api.types.is_numeric_dtype(df[column]):
            col_summary['type'] = 'numerical'
            col_summary.update(df[column].describe().to_dict())
            col_summary['skewness'] = df[column].skew()
            col_summary['kurtosis'] = df[column].kurtosis()
        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            col_summary['type'] = 'datetime'
            col_summary['min'] = df[column].min().isoformat()
            col_summary['max'] = df[column].max().isoformat()
        else:
            col_summary['type'] = 'categorical'
            col_summary['unique_values'] = df[column].nunique()
            col_summary['top_values'] = df[column].value_counts().head(5).to_dict()
        summary[column] = col_summary
    return summary

def get_column_types(df):
    column_types = {}
    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            column_types[column] = 'numerical'
        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            column_types[column] = 'datetime'
        else:
            column_types[column] = 'categorical'
    return column_types

def get_correlation(df):
    numeric_df = df.select_dtypes(include=[np.number])
    if not numeric_df.empty and numeric_df.shape[1] > 1:
        return numeric_df.corr().to_dict()
    return {}

def get_top_correlations(correlation_matrix, n=5):
    if not correlation_matrix:
        return []
    correlation_matrix = pd.DataFrame(correlation_matrix)
    
    corr_pairs = []
    for i in range(len(correlation_matrix.columns)):
        for j in range(i+1, len(correlation_matrix.columns)):
            corr_pairs.append((correlation_matrix.index[i], correlation_matrix.columns[j], correlation_matrix.iloc[i, j]))
    
    return sorted(corr_pairs, key=lambda x: abs(x[2]), reverse=True)[:n]

def perform_pca(df):
    numeric_df = df.select_dtypes(include=[np.number])
    if not numeric_df.empty and numeric_df.shape[1] > 1:
        imputer = SimpleImputer(strategy='mean')
        imputed_data = imputer.fit_transform(numeric_df)
        
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(imputed_data)
        pca = PCA(n_components=2)
        pca_result = pca.fit_transform(scaled_data)
        pca_data = pd.DataFrame(data=pca_result, columns=['PC1', 'PC2']).to_dict(orient='records')
        return pca_data, pca.explained_variance_ratio_.tolist()
    return None, []

def perform_clustering(df):
    numeric_df = df.select_dtypes(include=[np.number])
    if not numeric_df.empty and numeric_df.shape[1] > 1:
        imputer = SimpleImputer(strategy='mean')
        imputed_data = imputer.fit_transform(numeric_df)
        
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(imputed_data)
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(scaled_data)
        return clusters.tolist()
    return None

def analyze_time_series(df):
    date_columns = df.select_dtypes(include=['datetime64']).columns
    if len(date_columns) > 0:
        date_column = date_columns[0]
        df = df.sort_values(by=date_column)
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        results = {}
        for column in numeric_columns:
            try:
                series = df[column].fillna(df[column].mean())
                decomposition = seasonal_decompose(series, model='additive', period=30)
                adf_result = adfuller(series)
                results[column] = {
                    'trend': decomposition.trend.tolist(),
                    'seasonal': decomposition.seasonal.tolist(),
                    'residual': decomposition.resid.tolist(),
                    'adf_statistic': adf_result[0],
                    'adf_pvalue': adf_result[1],
                    'dates': df[date_column].dt.strftime('%Y-%m-%d').tolist()
                }
            except:
                pass
        return results
    return None
def detect_outliers(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    outliers = {}
    for column in numeric_columns:
        clf = IsolationForest(contamination=0.1, random_state=42)
        outliers[column] = clf.fit_predict(df[[column]]).tolist()
    return outliers
def calculate_general_statistics(df):
    total_rows = len(df)
    total_columns = len(df.columns)
    numeric_columns = len(df.select_dtypes(include=[np.number]).columns)
    categorical_columns = len(df.select_dtypes(include=['object']).columns)
    datetime_columns = len(df.select_dtypes(include=['datetime64']).columns)
    missing_values = df.isnull().sum().sum()
    total_cells = total_rows * total_columns
    
    return {
        "totalRows": total_rows,
        "totalColumns": total_columns,
        "numericColumns": numeric_columns,
        "categoricalColumns": categorical_columns,
        "datetimeColumns": datetime_columns,
        "missingValues": int(missing_values),
        "totalCells": total_cells
    }

def get_feature_importance(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    categorical_columns = df.select_dtypes(include=['object']).columns
    importance = {}
    
    for column in numeric_columns:
        X = df.drop(columns=[column])
        y = df[column]
        
        # Handle categorical features
        X_encoded = pd.get_dummies(X, columns=categorical_columns)
        
        # Use Random Forest for feature importance
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X_encoded, y)
        
        feature_importance = dict(zip(X_encoded.columns, rf.feature_importances_))
        importance[column] = feature_importance
    
    return importance

def perform_regression_analysis(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    categorical_columns = df.select_dtypes(include=['object']).columns
    insights = {}
    
    for target in numeric_columns:
        X = df.drop(columns=[target])
        y = df[target]
        
        # Handle categorical features
        X_encoded = pd.get_dummies(X, columns=categorical_columns)
        
        X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        
        insights[target] = {
            "r2_score": r2,
            "mse": mse,
            "coefficients": dict(zip(X_encoded.columns, model.coef_))
        }
    
    return insights
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
    for target, importances in feature_importance.items():
        top_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:3]
        features_str = ", ".join([f"{feature} ({importance:.3f})" for feature, importance in top_features])
        insights.append(f"For predicting {target}, the most important features are: {features_str}. Focus on these features for feature engineering or when building predictive models.")
    
    # Regression insights
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

def get_important_features(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    categorical_columns = df.select_dtypes(include=['object']).columns
    
    important_features = {}
    for target in numeric_columns:
        X = df.drop(columns=[target])
        y = df[target]
        
        # Handle categorical features
        X_encoded = pd.get_dummies(X, columns=categorical_columns)
        
        # Use Random Forest for feature importance
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X_encoded, y)
        
        feature_importance = dict(zip(X_encoded.columns, rf.feature_importances_))
        important_features[target] = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return important_features