from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from ...db.database import get_db
from ...models.models import User, UserProfile
from ...schemas.schemas import (
    UserProfileCreate, 
    UserProfileUpdate, 
    UserProfile as UserProfileSchema
)
from ...core.security import get_current_active_user
from ...services.nutrition_service import calculate_age, calculate_bmr, calculate_tdee, calculate_macros

router = APIRouter()


@router.post("/profile", response_model=UserProfileSchema)
def create_user_profile(
    profile_in: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new user profile
    """
    # Check if profile already exists
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if db_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    # Calculate age from date of birth
    age = calculate_age(profile_in.date_of_birth)
    
    # Calculate BMR
    bmr = calculate_bmr(
        profile_in.gender,
        profile_in.weight_kg,
        profile_in.height_cm,
        age
    )
    
    # Calculate TDEE
    tdee = calculate_tdee(bmr, profile_in.activity_level)
    
    # Calculate macros
    macros = calculate_macros(profile_in.weight_kg, tdee, profile_in.goal)
    
    # Calculate lean mass if body fat percentage is provided
    lean_mass_kg = None
    if profile_in.body_fat_percent is not None:
        lean_mass_kg = profile_in.weight_kg * (1 - (profile_in.body_fat_percent / 100))
    
    # Create profile
    db_profile = UserProfile(
        user_id=current_user.id,
        gender=profile_in.gender,
        date_of_birth=profile_in.date_of_birth,
        age=age,
        height_cm=profile_in.height_cm,
        weight_kg=profile_in.weight_kg,
        activity_level=profile_in.activity_level,
        goal=profile_in.goal,
        body_fat_percent=profile_in.body_fat_percent,
        lean_mass_kg=lean_mass_kg,
        bmr=macros["bmr"],
        tdee=macros["tdee"],
        protein_gram=macros["protein_gram"],
        carb_gram=macros["carb_gram"],
        fat_gram=macros["fat_gram"]
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    return db_profile


@router.get("/profile", response_model=UserProfileSchema)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile
    """
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return db_profile


@router.put("/profile", response_model=UserProfileSchema)
def update_user_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update current user profile
    """
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update profile fields
    update_data = profile_in.dict(exclude_unset=True)
    
    # If date_of_birth is updated, recalculate age
    if "date_of_birth" in update_data:
        update_data["age"] = calculate_age(update_data["date_of_birth"])
    
    # If any of these fields are updated, recalculate BMR, TDEE, and macros
    recalculate_required = any(field in update_data for field in [
        "gender", "weight_kg", "height_cm", "date_of_birth", "activity_level", "goal"
    ])
    
    if recalculate_required:
        # Get current values or updated values
        gender = update_data.get("gender", db_profile.gender)
        weight_kg = update_data.get("weight_kg", db_profile.weight_kg)
        height_cm = update_data.get("height_cm", db_profile.height_cm)
        age = update_data.get("age", db_profile.age)
        activity_level = update_data.get("activity_level", db_profile.activity_level)
        goal = update_data.get("goal", db_profile.goal)
        
        # Recalculate BMR
        bmr = calculate_bmr(gender, weight_kg, height_cm, age)
        
        # Recalculate TDEE
        tdee = calculate_tdee(bmr, activity_level)
        
        # Recalculate macros
        macros = calculate_macros(weight_kg, tdee, goal)
        
        # Update calculated fields
        update_data["bmr"] = macros["bmr"]
        update_data["tdee"] = macros["tdee"]
        update_data["protein_gram"] = macros["protein_gram"]
        update_data["carb_gram"] = macros["carb_gram"]
        update_data["fat_gram"] = macros["fat_gram"]
    
    # If body_fat_percent is updated, recalculate lean_mass_kg
    if "body_fat_percent" in update_data or "weight_kg" in update_data:
        body_fat_percent = update_data.get("body_fat_percent", db_profile.body_fat_percent)
        weight_kg = update_data.get("weight_kg", db_profile.weight_kg)
        
        if body_fat_percent is not None:
            update_data["lean_mass_kg"] = weight_kg * (1 - (body_fat_percent / 100))
    
    # Update profile
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    
    return db_profile
