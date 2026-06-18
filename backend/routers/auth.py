from fastapi import APIRouter
from fastapi import HTTPException

from schemas.auth import SignupRequest
from schemas.auth import LoginRequest

from database.supabase_client import supabase


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/signup")
async def signup(payload: SignupRequest):

    try:

        response = supabase.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password
            }
        )

        # create profile automatically

        supabase.table("profiles").insert(
            {
                "id": response.user.id,
                "full_name": payload.full_name
            }
        ).execute()

        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": response.user.id
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.post("/login")
async def login(payload: LoginRequest):

    try:

        response = supabase.auth.sign_in_with_password(
            {
                "email": payload.email,
                "password": payload.password
            }
        )

        return {
            "success": True,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )