import numpy as np
import pandas as pd

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