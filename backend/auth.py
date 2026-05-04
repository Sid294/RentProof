from fastapi import APIRouter, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import Response
from backend.models import LoginRequest, SignupRequest, User, AuthResponse
import logging

logger = logging.getLogger(__name__)
from backend.send_email import send_welcome_email
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

# Mock user database (replace with real database)
USERS_DB = {}
SESSIONS = {}


@router.get("/check", response_model=dict)
async def check_auth():
    """Verify if user is authenticated"""
    # TODO: Implement token verification from cookies
    # This is a placeholder implementation
    return {
        "authenticated": False,
        "message": "No auth token found"
    }


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    try:
        # TODO: Validate credentials with database/Firebase
        # This is a placeholder implementation
        
        if not request.email or not request.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required"
            )
        
        # Mock user validation
        user = User(
            id="user123",
            email=request.email,
            role="landlord"
        )
        
        # Generate mock token
        token = f"token_{request.email}_{datetime.now().timestamp()}"
        
        return AuthResponse(
            success=True,
            user=user,
            redirectUrl="/dashboard",
            token=token
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, background_tasks: BackgroundTasks):
    """User registration endpoint"""
    print("\n" + "="*60)
    print("SIGNUP ENDPOINT CALLED!")
    print("="*60)
    logger.info("SIGNUP ENDPOINT CALLED")
    try:
        logger.info(f"\n{'='*60}")
        logger.info(f"SIGNUP: Starting signup for {request.email}")
        logger.info(f"{'='*60}")
        print(f"Email: {request.email}, Name: {request.name}")
        if not request.email or not request.password or not request.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email, password, and name are required"
            )
        
        # Check if user already exists
        is_new_user = request.email not in USERS_DB
        
        if request.email in USERS_DB:
            logger.info(f"User {request.email} already exists in USERS_DB, skipping creation")
            # User already exists, just return success (don't send email again)
            new_user = USERS_DB[request.email]["user"]
        else:
            logger.info(f"Creating new user {request.email}")
            # Create new user (TODO: Hash password and store in database)
            new_user = User(
                id=f"user_{request.email}",
                email=request.email,
                name=request.name,
                role="landlord",
                plan=request.plan
            )
            
            # Store user (TODO: Use real database)
            USERS_DB[request.email] = {
                "user": new_user,
                "password_hash": request.password,  # TODO: Hash this!
                "created_at": datetime.now(),
            }
        
        # Generate mock token
        token = f"token_{request.email}_{datetime.now().timestamp()}"
        
        # Send welcome email in background (only for new users)
        if is_new_user:
            logger.info(f"About to schedule background task for {new_user.email} (new user)")
            try:
                background_tasks.add_task(send_welcome_email, new_user.email, new_user.name)
                logger.info(f"✓ Background task scheduled for welcome email to {new_user.email}")
            except Exception as e:
                logger.error(f"✗ Failed to schedule background task: {str(e)}", exc_info=True)
                # scheduling the background task should not block signup
                pass
        else:
            logger.info(f"Skipping email for existing user {new_user.email}")

        return AuthResponse(
            success=True,
            message="Account created successfully",
            user=new_user,
            redirectUrl="/dashboard",
            token=token
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Signup failed"
        )


@router.post("/delete")
async def delete_account(request: Request):
    """Delete user account and remove from database"""
    logger.info(f"DELETE POST handler called")
    
    try:
        body = await request.json()
        email = body.get("email", "")
        logger.info(f"Delete request for email: {email}")
        
        if email and email in USERS_DB:
            del USERS_DB[email]
            logger.info(f"User {email} deleted from USERS_DB")
        
        logger.info(f"Delete successful, returning success")
        return {"success": True}
    except Exception as e:
        logger.error(f"Delete error: {str(e)}", exc_info=True)
        return {"success": False, "error": str(e)}
