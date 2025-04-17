from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

from fastapi import Depends, HTTPException, Header
from models.user import User
from db.connect import engine

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = "i don't sat bleh bleh bleh"  # 🔐 Use a strong, random value in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return f"Bearer {jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)}"

def decode_token(token: str):
    try:
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

async def get_current_user(authorization: str = Header(...)):
    print('here')
    token = authorization
    email = decode_token(token)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await engine.find_one(User, User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user