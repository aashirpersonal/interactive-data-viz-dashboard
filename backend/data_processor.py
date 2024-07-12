import pandas as pd
import io
from fastapi import UploadFile, HTTPException
from analysis import analyze_data

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

        analysis_result = analyze_data(df)
        
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

async def preprocess_data(filename: str, options: dict):
    try:
        df = pd.read_csv(filename)  # Adjust this based on how you're storing uploaded files
        
        for column, column_options in options['columnOptions'].items():
            if not column_options['include']:
                df = df.drop(columns=[column])
            else:
                fill_method = column_options['fillMethod']
                if fill_method == 'mean':
                    df[column] = df[column].fillna(df[column].mean())
                elif fill_method == 'median':
                    df[column] = df[column].fillna(df[column].median())
                elif fill_method == 'mode':
                    df[column] = df[column].fillna(df[column].mode()[0])
                elif fill_method == 'ffill':
                    df[column] = df[column].fillna(method='ffill')
                elif fill_method == 'bfill':
                    df[column] = df[column].fillna(method='bfill')
                elif fill_method == 'remove':
                    df = df.dropna(subset=[column])
        
        analysis_result = analyze_data(df)
        
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error preprocessing data: {str(e)}")