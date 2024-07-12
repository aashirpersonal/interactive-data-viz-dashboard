from .data_summary import get_summary, get_column_types, calculate_general_statistics
from .correlation import get_correlation, get_top_correlations
from .clustering import perform_pca, perform_clustering
from .time_series import analyze_time_series
from .outlier_detection import detect_outliers
from .feature_importance import get_feature_importance
from .regression import perform_regression_analysis
from .utils import generate_insights, recommend_visualizations

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
    important_features = get_feature_importance(df)
    
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