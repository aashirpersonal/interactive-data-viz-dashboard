import pandas as pd
import numpy as np

def get_summary(df):
    summary = {}
    for column in df.columns:
        col_summary = {}
        if pd.api.types.is_numeric_dtype(df[column]):
            col_summary['type'] = 'numerical'
            col_summary.update(df[column].describe().to_dict())
            col_summary['skewness'] = df[column].skew()
            col_summary['kurtosis'] = df[column].kurtosis()
        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            col_summary['type'] = 'datetime'
            col_summary['min'] = df[column].min().isoformat()
            col_summary['max'] = df[column].max().isoformat()
        else:
            col_summary['type'] = 'categorical'
            col_summary['unique_values'] = df[column].nunique()
            col_summary['top_values'] = df[column].value_counts().head(5).to_dict()
        summary[column] = col_summary
    return summary

def get_column_types(df):
    column_types = {}
    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            column_types[column] = 'numerical'
        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            column_types[column] = 'datetime'
        else:
            column_types[column] = 'categorical'
    return column_types

def calculate_general_statistics(df):
    total_rows = len(df)
    total_columns = len(df.columns)
    numeric_columns = len(df.select_dtypes(include=[np.number]).columns)
    categorical_columns = len(df.select_dtypes(include=['object']).columns)
    datetime_columns = len(df.select_dtypes(include=['datetime64']).columns)
    missing_values = df.isnull().sum().sum()
    total_cells = total_rows * total_columns
    
    return {
        "totalRows": total_rows,
        "totalColumns": total_columns,
        "numericColumns": numeric_columns,
        "categoricalColumns": categorical_columns,
        "datetimeColumns": datetime_columns,
        "missingValues": int(missing_values),
        "totalCells": total_cells
    }