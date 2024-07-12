import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

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