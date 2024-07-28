from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from data_processor import process_uploaded_file, process_preprocessing_request
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ColumnOption(BaseModel):
    include: bool
    fillMethod: str
    scaling: str
    encoding: str
    binning: str
    fillConstant: Optional[str] = None
    numBins: Optional[int] = None

class PreprocessingOptions(BaseModel):
    columnOptions: Dict[str, ColumnOption]

class PreprocessingRequest(BaseModel):
    filename: str
    options: PreprocessingOptions

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(('.csv', '.xlsx', '.json')):
            raise ValueError("Unsupported file format. Please upload a CSV, XLSX, or JSON file.")
        
        file_info = await process_uploaded_file(file)
        return file_info
    except Exception as e:
        logger.error(f"Error during file upload: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/preprocess")
async def preprocess_data_route(request: PreprocessingRequest):
    try:
        logger.info(f"Received preprocessing request for file: {request.filename}")
        logger.debug(f"Preprocessing options: {request.options}")
        result = await process_preprocessing_request(request.filename, request.options.dict())
        return result
    except Exception as e:
        logger.error(f"Error during preprocessing: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))