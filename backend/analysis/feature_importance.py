import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

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