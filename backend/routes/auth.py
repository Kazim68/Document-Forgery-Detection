from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from models.user import User
from db.connect import engine
from utils.auth import hash_password, verify_password, create_access_token, decode_token
from utils.sendEmail import send_email

import random
from datetime import datetime, timedelta


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    role: str

class AuthResponse(BaseModel):
    access_token: str
    user: UserResponse

class NormalResponse(BaseModel):
    success: bool
    message: str
    data: dict = None

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

@router.post("/register", response_model=NormalResponse)
async def register_user(data: RegisterRequest):
    existing = await engine.find_one(User, User.email == data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(data.password)
    otp = f"{random.randint(100000, 999999)}"
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)


    user = User(name=data.name, email=data.email, hashed_password=hashed, otp_code=otp, otp_expires_at=otp_expiry)
    await engine.save(user)

    await send_email(
        to=user.email,
        subject="Verify your email",
        body=f"Your verification code is: {otp}"
    )

    return {"success": True, "message": "Registration successful. Please verify your email."}

@router.post("/login", response_model=AuthResponse)
async def login_user(data: LoginRequest):
    user = await engine.find_one(User, User.email == data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified.")

    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "user": {"name": user.name, "email": user.email, "role": user.role}
    }


@router.post("/verify-email", response_model=NormalResponse)
async def verify_email(data: OTPVerifyRequest):
    user = await engine.find_one(User, User.email == data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "Email already verified."}
    
    print(user.otp_code != int(data.otp_code))
    print(user.otp_code, data.otp_code)

    if user.otp_code != data.otp_code or datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    await engine.save(user)

    return {"success": True, "message": "Email verified successfully.", "data": {"email": user.email}}



@router.post("/resend-otp", response_model=NormalResponse)
async def resend_otp(data: ResendOTPRequest):
    user = await engine.find_one(User, User.email == data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email is already verified")

    # Generate new OTP
    new_otp = f"{random.randint(100000, 999999)}"
    expiry = datetime.utcnow() + timedelta(minutes=10)

    user.otp_code = new_otp
    user.otp_expires_at = expiry
    await engine.save(user)

    try:
    # Send the email
        await send_email(
            to=user.email,
            subject="Your New Verification Code",
            body=f"Your new OTP code is: {new_otp}"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email.")

    return {"success": True, "message": "A new OTP has been sent to your email."}



@router.post('/make-admin', response_model=NormalResponse)
async def make_admin(data: RegisterRequest):
    existing_user = await engine.find_one(User, User.email == data.email)
    if existing_user:
        raise HTTPException(status_code=404, detail="Duplicate Email")

    hashed = hash_password(data.password)
    otp = None
    otp_expiry = None
    role = "admin"
    is_verified = True


    user = User(name=data.name, email=data.email, hashed_password=hashed, otp_code=otp, otp_expires_at=otp_expiry, role=role, is_verified=is_verified)
    await engine.save(user)

    return {"success": True, "message": "User role admin."}
