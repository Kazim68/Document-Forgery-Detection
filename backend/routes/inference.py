from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from inference_sdk import InferenceHTTPClient
import shutil
import os
import uuid

from utils.auth import get_current_user

router = APIRouter()

# Set up the Roboflow inference client
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="YnRu3Rz8cJPunDVJVMCX"
)

@router.post("/scan")
async def scan_document(image: UploadFile = File(...), current_user=Depends(get_current_user)):
    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    try:
        # Save to a temporary file
        filename = f"{uuid.uuid4().hex}_{image.filename}"
        temp_path = f"temp/{filename}"
        os.makedirs("temp", exist_ok=True)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Run inference
        result = CLIENT.infer(temp_path, model_id="document-forgery-detection/48")

        # Cleanup temp image
        os.remove(temp_path)
        print(result)

        return JSONResponse(content={"success": True, "message": "Scan complete.", "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")
