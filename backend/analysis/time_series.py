import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller

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