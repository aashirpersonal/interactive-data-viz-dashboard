import pandas as pd
import numpy as np
import io
import logging
from fastapi import UploadFile, HTTPException
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from analysis import analyze_data
import os
import sklearn
import scipy.sparse
# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

UPLOAD_DIRECTORY = "uploaded_files"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

async def process_uploaded_file(file: UploadFile):
    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(contents))
        elif file.filename.endswith('.json'):
            df = pd.read_json(io.StringIO(contents.decode('utf-8')))
        else:
            raise ValueError("Unsupported file format")
        
        if df.empty:
            raise ValueError("The uploaded file is empty")

        # Save the file
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Return basic file info and data summary
        return {
            "filename": file.filename,
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict()
        }
    except Exception as e:
        logger.error(f"Error processing uploaded file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

def preprocess_data(df: pd.DataFrame, preprocessing_options: dict) -> pd.DataFrame:
    logger.info("Starting preprocessing")
    
    # Filter out columns that are not included
    included_columns = [col for col, options in preprocessing_options['columnOptions'].items() if options['include']]
    df = df[included_columns]
    
    logger.info(f"Columns after filtering: {df.columns.tolist()}")
    
    # If no further preprocessing is needed, return the filtered DataFrame
    if not preprocessing_options.get('use_standard_scaler', False) and not any(options.get('fillMethod') != 'none' for options in preprocessing_options['columnOptions'].values()):
        logger.info("No further preprocessing needed. Returning filtered DataFrame.")
        return df

    numeric_features = df.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = df.select_dtypes(include=['object']).columns

    logger.debug(f"Numeric features: {numeric_features}")
    logger.debug(f"Categorical features: {categorical_features}")

    # Separate categorical columns for one-hot encoding and those to keep as is
    encode_columns = [col for col in categorical_features if preprocessing_options['columnOptions'].get(col, {}).get('encoding') == 'one-hot']
    keep_categorical = [col for col in categorical_features if col not in encode_columns]

    transformers = []

    # Numeric transformer
    numeric_steps = []
    if any(preprocessing_options['columnOptions'].get(col, {}).get('fillMethod') != 'none' for col in numeric_features):
        numeric_steps.append(('imputer', SimpleImputer(strategy='mean')))
    if preprocessing_options.get('use_standard_scaler', False):
        numeric_steps.append(('scaler', StandardScaler()))
    if numeric_steps:
        numeric_transformer = Pipeline(steps=numeric_steps)
        transformers.append(('num', numeric_transformer, numeric_features))

    # One-hot encoding transformer
    if encode_columns:
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        transformers.append(('cat', categorical_transformer, encode_columns))

    # If no transformers, return the filtered DataFrame
    if not transformers:
        logger.info("No transformations needed. Returning filtered DataFrame.")
        return df

    # Create the ColumnTransformer
    preprocessor = ColumnTransformer(transformers=transformers)

    try:
        # Fit and transform the data
        preprocessed_data = preprocessor.fit_transform(df)
        logger.info("Preprocessing transformation complete")

        # Get feature names
        feature_names = list(numeric_features)
        if encode_columns:
            if hasattr(preprocessor.named_transformers_['cat'].named_steps['onehot'], 'get_feature_names_out'):
                cat_feature_names = preprocessor.named_transformers_['cat'].named_steps['onehot'].get_feature_names_out(encode_columns)
            else:
                cat_feature_names = preprocessor.named_transformers_['cat'].named_steps['onehot'].get_feature_names(encode_columns)
            feature_names.extend(cat_feature_names)

        # Convert to dense array if it's sparse
        if scipy.sparse.issparse(preprocessed_data):
            preprocessed_data = preprocessed_data.toarray()

        # Create DataFrame with preprocessed data
        result_df = pd.DataFrame(preprocessed_data, columns=feature_names, index=df.index)

        # Add back categorical columns that were not one-hot encoded
        for col in keep_categorical:
            result_df[col] = df[col]

        logger.info(f"Preprocessing complete. Final columns: {result_df.columns.tolist()}")
        return result_df

    except Exception as e:
        logger.error(f"Error during preprocessing: {str(e)}", exc_info=True)
        raise

async def process_preprocessing_request(filename: str, options: dict):
    try:
        logger.info(f"Processing preprocessing request for file: {filename}")
        logger.debug(f"Preprocessing options: {options}")

        # Load the data
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        logger.info(f"Loading data from: {file_path}")
        df = pd.read_csv(file_path)
        logger.info(f"Data loaded. Shape: {df.shape}")

        # Apply preprocessing (including column filtering)
        logger.info("Applying preprocessing")
        preprocessed_df = preprocess_data(df, options)
        logger.info(f"Preprocessing complete. New shape: {preprocessed_df.shape}")

        # Perform analysis on preprocessed data
        logger.info("Performing analysis on preprocessed data")
        analysis_result = analyze_data(preprocessed_df)
        logger.info("Analysis complete")
        
        return analysis_result
    except Exception as e:
        logger.error(f"Error during preprocessing: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error preprocessing data: {str(e)}")