import numpy as np
from sklearn.ensemble import IsolationForest
from scipy import stats

def detect_outliers(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    outliers = {}
    for column in numeric_columns:
        column_data = df[column].dropna()
        
        if column_data.isnull().any():
            # Skip outlier detection for columns with missing values
            outliers[column] = []
            continue
        
        if len(column_data) > 1:  # Ensure we have at least 2 non-null values
            # Use Z-score method for outlier detection
            z_scores = np.abs(stats.zscore(column_data))
            outliers[column] = (z_scores > 3).tolist()  # Mark as outlier if |z-score| > 3
        else:
            outliers[column] = []
    
    return outliers

def summarize_outliers(outliers):
    summary = {}
    for column, outlier_mask in outliers.items():
        if outlier_mask:
            num_outliers = sum(outlier_mask)
            total_points = len(outlier_mask)
            summary[column] = {
                "num_outliers": num_outliers,
                "percentage": (num_outliers / total_points) * 100
            }
        else:
            summary[column] = {"num_outliers": 0, "percentage": 0}
    return summary