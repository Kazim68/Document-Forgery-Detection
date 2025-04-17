from odmantic import Model
from datetime import datetime
from typing import Optional

class User(Model):
    name: str
    email: str
    hashed_password: str
    role: str = "user"  
    is_verified: bool = False
    otp_code: Optional[str] = None
    otp_expires_at: Optional[datetime] = None