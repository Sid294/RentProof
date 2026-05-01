from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="RentProof API",
    description="Property management API for landlords and tenants",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from routers import content, auth, dashboard, tenant

# Include routers
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(tenant.router, prefix="/api/tenant", tags=["tenant"])


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "RentProof API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
