from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy.orm import Session

from .api.api import api_router
from .db.database import engine, Base, get_db
from .models.models import User
from .core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Planova API",
    description="Nutrition and Weight Training Web Application API",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


# Create admin user if it doesn't exist
@app.on_event("startup")
async def create_admin_user():
    db = next(get_db())
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@planova.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "adminpassword")
    
    # Check if admin user exists
    admin_user = db.query(User).filter(User.email == admin_email).first()
    
    if not admin_user:
        # Create admin user
        hashed_password = get_password_hash(admin_password)
        admin_user = User(
            email=admin_email,
            hashed_password=hashed_password,
            is_active=True,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        print(f"Admin user created: {admin_email}")
    else:
        print("Admin user already exists")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Planova API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
