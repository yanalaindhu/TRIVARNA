from fastapi import APIRouter
from fastapi import HTTPException

from schemas.auth import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from database.supabase_client import supabase
from services.email_service import send_email


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
                "full_name": payload.full_name,
                "email": payload.email
            }
        ).execute()

        # Send welcome email notification
        try:
            welcome_html = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #6C4CF1;">Welcome to TRIVARNA! </h2>
                    <p>Hi {payload.full_name or "Explorer"},</p>
                    <p>Thank you for creating an account with TRIVARNA, your ultimate AI Companion for Mind, Body, and Lifestyle balance.</p>
                    <p>We are excited to guide you on your wellness journey! To get started, please complete your onboarding diagnostic questionnaire so we can co-create your personalized daily wellness routine.</p>
                    <br />
                    <p>Warmly,</p>
                    <p><strong>The TRIVARNA Team</strong></p>
                </body>
            </html>
            """
            send_email(payload.email, "Welcome to TRIVARNA! ", welcome_html)
        except Exception as mail_err:
            print(f"Warning: Welcome email could not be sent: {mail_err}")

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

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    try:
        # Supabase reset_password_for_email triggers a reset password email automatically
        supabase.auth.reset_password_for_email(
            payload.email,
            {
                "redirect_to": "http://localhost:5173/reset-password"
            }
        )
        return {
            "success": True,
            "message": "A password reset link has been sent to your email address."
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    try:
        supabase.auth.set_session(payload.token, payload.token)
        supabase.auth.update_user({"password": payload.password})
        return {
            "success": True,
            "message": "Your password has been successfully reset."
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )