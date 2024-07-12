import numpy as np
from sklearn.feature_selection import mutual_info_regression
from sklearn.decomposition import PCA
import pandas as pd

def recommend_visualizations(df):
    recommendations = []
    
    # Check for time series data
    if any(df.dtypes == 'datetime64[ns]'):
        recommendations.append(('time_series', 'Line Chart'))
    
    # Check for categorical data
    categorical_columns = df.select_dtypes(include=['object']).columns
    if len(categorical_columns) > 0:
        recommendations.append(('categorical', 'Bar Chart'))
    
    # Check for numerical data
    numerical_columns = df.select_dtypes(include=[np.number]).columns
    if len(numerical_columns) > 1:
        recommendations.append(('numerical', 'Scatter Plot'))
        recommendations.append(('numerical', 'Correlation Heatmap'))
    
    return recommendations

def select_important_features(df, target_column, n_features=5):
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    mi_scores = mutual_info_regression(X, y)
    mi_scores = pd.Series(mi_scores, name="MI Scores", index=X.columns)
    mi_scores = mi_scores.sort_values(ascending=False)
    
    return mi_scores.head(n_features).index.tolist()

def perform_pca(df, n_components=2):
    numerical_df = df.select_dtypes(include=[np.number])
    pca = PCA(n_components=n_components)
    pca_result = pca.fit_transform(numerical_df)
    
    return pca_result, pca.explained_variance_ratio_