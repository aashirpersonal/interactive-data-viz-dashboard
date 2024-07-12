import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer

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