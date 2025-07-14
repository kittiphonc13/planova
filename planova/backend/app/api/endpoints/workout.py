from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ...db.database import get_db
from ...models.models import User, UserProfile, WorkoutPlan, Exercise
from ...schemas.schemas import (
    WorkoutPlan as WorkoutPlanSchema,
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    Exercise as ExerciseSchema,
    ExerciseCreate,
    ExerciseUpdate,
    Level
)
from ...core.security import get_current_active_user, get_premium_user
from ...services.workout_service import generate_workout_plan

router = APIRouter()


@router.get("/plan", response_model=List[WorkoutPlanSchema])
def get_workout_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all workout plans for the current user
    """
    workout_plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id).all()
    return workout_plans


@router.post("/plan/generate", response_model=Dict[str, Any])
def generate_user_workout_plan(
    level: Level,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a workout plan based on user's level and goal
    """
    # Get user profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found, please create a profile first"
        )
    
    # Check if workout plan already exists
    existing_plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id).all()
    
    if existing_plans:
        # Delete existing plans if user is premium
        if current_user.role == "premium":
            for plan in existing_plans:
                # Delete associated exercises
                for exercise in plan.exercises:
                    db.delete(exercise)
                # Delete workout plan
                db.delete(plan)
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Workout plan already exists. Premium subscription required to regenerate."
            )
    
    # Generate workout plan
    workout_plan_data = generate_workout_plan(level, profile.goal)
    
    # Create workout plans in database
    created_plans = []
    
    for day, plan_data in workout_plan_data.items():
        workout = plan_data["workout"]
        exercises = plan_data["exercises"]
        
        # Create workout plan
        db_workout_plan = WorkoutPlan(
            user_id=current_user.id,
            day=workout["day"],
            muscle_group=workout["muscle_group"],
            level=workout["level"],
            notes=workout["notes"]
        )
        
        db.add(db_workout_plan)
        db.commit()
        db.refresh(db_workout_plan)
        created_plans.append(db_workout_plan.id)
        
        # Create exercises
        for exercise_data in exercises:
            db_exercise = Exercise(
                workout_plan_id=db_workout_plan.id,
                name=exercise_data["name"],
                sets=exercise_data["sets"],
                reps=exercise_data["reps"],
                rest_seconds=exercise_data["rest_seconds"],
                notes=exercise_data.get("notes")
            )
            
            db.add(db_exercise)
        
        db.commit()
    
    # Return success message
    return {
        "message": "Workout plan generated successfully",
        "workout_plan_ids": created_plans,
        "days": list(workout_plan_data.keys())
    }


@router.get("/plan/{day}", response_model=WorkoutPlanSchema)
def get_workout_plan_by_day(
    day: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get workout plan for a specific day
    """
    # Validate day
    if day < 1 or day > 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Day must be between 1 and 7"
        )
    
    # Get workout plan
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.day == day
    ).first()
    
    if not workout_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No workout plan found for day {day}"
        )
    
    return workout_plan


@router.put("/plan/{workout_plan_id}", response_model=WorkoutPlanSchema)
def update_workout_plan(
    workout_plan_id: int,
    workout_plan_in: WorkoutPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can update workout plans
):
    """
    Update a workout plan (Premium feature)
    """
    # Get workout plan
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not workout_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found or you don't have access to it"
        )
    
    # Update workout plan
    update_data = workout_plan_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(workout_plan, key, value)
    
    db.commit()
    db.refresh(workout_plan)
    
    return workout_plan


@router.post("/plan/{workout_plan_id}/exercise", response_model=ExerciseSchema)
def add_exercise_to_plan(
    workout_plan_id: int,
    exercise_in: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can add custom exercises
):
    """
    Add a custom exercise to a workout plan (Premium feature)
    """
    # Get workout plan
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not workout_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found or you don't have access to it"
        )
    
    # Create exercise
    db_exercise = Exercise(
        workout_plan_id=workout_plan.id,
        name=exercise_in.name,
        sets=exercise_in.sets,
        reps=exercise_in.reps,
        rest_seconds=exercise_in.rest_seconds,
        notes=exercise_in.notes
    )
    
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    
    return db_exercise


@router.put("/exercise/{exercise_id}", response_model=ExerciseSchema)
def update_exercise(
    exercise_id: int,
    exercise_in: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can update exercises
):
    """
    Update an exercise (Premium feature)
    """
    # Get exercise
    exercise = db.query(Exercise).join(WorkoutPlan).filter(
        Exercise.id == exercise_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found or you don't have access to it"
        )
    
    # Update exercise
    update_data = exercise_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(exercise, key, value)
    
    db.commit()
    db.refresh(exercise)
    
    return exercise


@router.delete("/exercise/{exercise_id}", response_model=Dict[str, str])
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can delete exercises
):
    """
    Delete an exercise (Premium feature)
    """
    # Get exercise
    exercise = db.query(Exercise).join(WorkoutPlan).filter(
        Exercise.id == exercise_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found or you don't have access to it"
        )
    
    # Delete exercise
    db.delete(exercise)
    db.commit()
    
    return {"message": "Exercise deleted successfully"}
