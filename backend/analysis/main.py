import importlib
import time
from multiprocessing import Pool
import logging

logger = logging.getLogger(__name__)

def lazy_import(module_name, function_name):
    module = importlib.import_module(module_name)
    return getattr(module, function_name)

def analyze_data(df):
    start_time = time.time()
    
    # Lazy imports with absolute path
    get_summary = lazy_import('analysis.data_summary', 'get_summary')
    get_column_types = lazy_import('analysis.data_summary', 'get_column_types')
    calculate_general_statistics = lazy_import('analysis.data_summary', 'calculate_general_statistics')
    get_correlation = lazy_import('analysis.correlation', 'get_correlation')
    get_top_correlations = lazy_import('analysis.correlation', 'get_top_correlations')
    perform_pca = lazy_import('analysis.clustering', 'perform_pca')
    perform_clustering = lazy_import('analysis.clustering', 'perform_clustering')
    analyze_time_series = lazy_import('analysis.time_series', 'analyze_time_series')
    detect_outliers = lazy_import('analysis.outlier_detection', 'detect_outliers')
    summarize_outliers = lazy_import('analysis.outlier_detection', 'summarize_outliers')
    get_feature_importance = lazy_import('analysis.feature_importance', 'get_feature_importance')
    perform_regression_analysis = lazy_import('analysis.regression', 'perform_regression_analysis')
    generate_insights = lazy_import('analysis.utils', 'generate_insights')
    recommend_visualizations = lazy_import('analysis.utils', 'recommend_visualizations')

    logger.info(f"Imports took {time.time() - start_time:.2f} seconds")
    logger.info(f"Analyzing data with columns: {df.columns.tolist()}")

    def timed_execution(func, *args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        logger.info(f"{func.__name__} took {time.time() - start:.2f} seconds")
        return result

    # Run some analyses in parallel
    with Pool(processes=4) as pool:
        summary_future = pool.apply_async(get_summary, (df,))
        column_types_future = pool.apply_async(get_column_types, (df,))
        correlation_future = pool.apply_async(get_correlation, (df,))
        general_statistics_future = pool.apply_async(calculate_general_statistics, (df,))

        summary = summary_future.get()
        column_types = column_types_future.get()
        correlation = correlation_future.get()
        general_statistics = general_statistics_future.get()

    top_correlations = timed_execution(get_top_correlations, correlation)
    
    # Only perform PCA and clustering if the dataset is not too large
    if len(df) <= 10000:
        pca_data, pca_explained_variance = timed_execution(perform_pca, df)
        clusters = timed_execution(perform_clustering, df)
    else:
        pca_data, pca_explained_variance, clusters = None, None, None
    
    time_series_analysis = timed_execution(analyze_time_series, df)
    outliers = timed_execution(detect_outliers, df)
    outlier_summary = timed_execution(summarize_outliers, outliers)
    
    # Skip feature importance analysis for datasets with more than 10,000 rows
    feature_importance = None
    if len(df) <= 10000:
        feature_importance = timed_execution(get_feature_importance, df)
    
    regression_insights = timed_execution(perform_regression_analysis, df)
    insights = timed_execution(generate_insights, df, summary, correlation, clusters, time_series_analysis, outlier_summary, feature_importance, regression_insights)
    missing_values = df.isnull().sum().to_dict()
    
    recommended_visualizations = timed_execution(recommend_visualizations, df, column_types)

    logger.info(f"Total analysis took {time.time() - start_time:.2f} seconds")
    
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
        "pca_result": pca_data,
        "pca_explained_variance": pca_explained_variance,
        "general_statistics": general_statistics,
        "outliers": outliers,
        "outlier_summary": outlier_summary,
        "feature_importance": feature_importance,
        "regression_insights": regression_insights
    }