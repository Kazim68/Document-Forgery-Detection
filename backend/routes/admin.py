from fastapi import APIRouter, Depends
from utils.permissions import require_role
from db.connect import engine
from models.user import User

router = APIRouter()

@router.get("/users", response_model=list[User])
async def get_all_users(current_user: User = Depends(require_role("admin"))):
    users = await engine.find(User)
    return users
