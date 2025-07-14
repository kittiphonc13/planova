from fastapi import APIRouter

from .endpoints import auth, users, nutrition, workout, subscription

api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/user", tags=["users"])
api_router.include_router(nutrition.router, prefix="/nutrition", tags=["nutrition"])
api_router.include_router(workout.router, prefix="/workout", tags=["workout"])
api_router.include_router(subscription.router, prefix="/subscription", tags=["subscription"])
