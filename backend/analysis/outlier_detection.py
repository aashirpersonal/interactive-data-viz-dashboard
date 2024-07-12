import numpy as np
from sklearn.ensemble import IsolationForest

def detect_outliers(df):
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    outliers = {}
    for column in numeric_columns:
        clf = IsolationForest(contamination=0.1, random_state=42)
        outliers[column] = clf.fit_predict(df[[column]]).tolist()
    return outliers