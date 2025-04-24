from fastapi import HTTPException

def validate_name(name: str):
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty.")
    if any(c in name for c in ['$', '{', '}', '[', ']', '<', '>']):
        raise HTTPException(status_code=400, detail="Name contains invalid characters.")
    if len(name) > 100:
        raise HTTPException(status_code=400, detail="Name too long.")
    return name
