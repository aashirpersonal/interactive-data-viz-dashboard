from fastapi import APIRouter, UploadFile, File, HTTPException
from data_processor import process_uploaded_file, preprocess_data

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(('.csv', '.xlsx', '.json')):
            raise ValueError("Unsupported file format. Please upload a CSV, XLSX, or JSON file.")
        
        analysis_result = await process_uploaded_file(file)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/preprocess")
async def preprocess_data_route(filename: str, options: dict):
    try:
        result = await preprocess_data(filename, options)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))