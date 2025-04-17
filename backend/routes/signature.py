from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from odmantic import AIOEngine
from db.connect import engine
from models.document import Document
from utils.crypto import hash_data, verify_signature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
import base64
import os
from datetime import datetime

router = APIRouter()

@router.post("/verify-doc")
async def verify_signed_doc(
    image: UploadFile = File(...),
    signature: str = Form(...),
    publicKey: str = Form(...)
):
    try:
        # Save the uploaded file temporarily
        temp_path = f"temp/{image.filename}"
        os.makedirs("temp", exist_ok=True)
        with open(temp_path, "wb") as f:
            content = await image.read()
            f.write(content)

        # Hash the file
        file_hash = hash_data(content)

        # Verify the signature using provided public key in PEM
        public_key_bytes = publicKey.encode()
        is_valid = verify_signature(file_hash, signature, public_key_bytes)

        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid signature. Verification failed.")
        
        # Save to MongoDB
        document = Document(
            filename=image.filename,
            file_hash=file_hash.hex(),
            signature=signature,
            public_key=publicKey,
            created_at=datetime.utcnow()
        )
        await engine.save(document)

        os.remove(temp_path)
        return {"success": True, "message": "Signature verified. Document is authentic.", "doc_id": str(document.id)}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")
