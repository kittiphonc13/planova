from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...db.database import get_db
from ...models.models import User, UserProfile, MealPlan, Meal, FoodItem
from ...schemas.schemas import (
    NutritionPlan, 
    MealPlanCreate, 
    MealPlan as MealPlanSchema,
    MealCreate,
    Meal as MealSchema,
    FoodItemCreate
)
from ...core.security import get_current_active_user, get_premium_user
from ...services.nutrition_service import calculate_nutrition_plan
from ...services.meal_service import generate_meal_plan

router = APIRouter()


@router.get("/plan", response_model=NutritionPlan)
def get_nutrition_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get nutrition plan based on user profile
    """
    # Get user profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found, please create a profile first"
        )
    
    # Return nutrition plan
    return {
        "bmr": profile.bmr,
        "tdee": profile.tdee,
        "protein_gram": profile.protein_gram,
        "carb_gram": profile.carb_gram,
        "fat_gram": profile.fat_gram,
        "daily_calories": profile.tdee
    }


@router.get("/meal-plan", response_model=List[MealPlanSchema])
def get_meal_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all meal plans for the current user
    """
    meal_plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()
    return meal_plans


@router.post("/meal-plan/generate", response_model=dict)
def generate_user_meal_plan(
    day: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a meal plan for a specific day based on user's nutrition requirements
    """
    # Validate day
    if day < 1 or day > 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Day must be between 1 and 7"
        )
    
    # Get user profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found, please create a profile first"
        )
    
    # Check if meal plan already exists for this day
    existing_plan = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.day == day
    ).first()
    
    if existing_plan:
        # Delete existing plan if user is premium
        if current_user.role == "premium":
            # Delete associated meals and food items
            for meal in existing_plan.meals:
                # Delete food items
                for food_item in meal.food_items:
                    db.delete(food_item)
                # Delete meal
                db.delete(meal)
            # Delete meal plan
            db.delete(existing_plan)
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meal plan already exists for this day. Premium subscription required to regenerate."
            )
    
    # Generate meal plan
    meal_plan_data = generate_meal_plan(
        daily_calories=profile.tdee,
        daily_protein=profile.protein_gram,
        daily_carbs=profile.carb_gram,
        daily_fat=profile.fat_gram,
        goal=profile.goal
    )
    
    # Create meal plan in database
    db_meal_plan = MealPlan(
        user_id=current_user.id,
        day=day,
        total_calories=meal_plan_data["total_calories"],
        total_protein=meal_plan_data["total_protein"],
        total_carbs=meal_plan_data["total_carbs"],
        total_fat=meal_plan_data["total_fat"]
    )
    
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    
    # Create meals
    for meal_data in meal_plan_data["meals"]:
        db_meal = Meal(
            meal_plan_id=db_meal_plan.id,
            name=meal_data["name"],
            calories=meal_data["calories"],
            protein=meal_data["protein"],
            carbs=meal_data["carbs"],
            fat=meal_data["fat"],
            description=meal_data["description"]
        )
        
        db.add(db_meal)
        db.commit()
        db.refresh(db_meal)
        
        # Create food items
        for food_item_data in meal_data["food_items"]:
            db_food_item = FoodItem(
                meal_id=db_meal.id,
                name=food_item_data["name"],
                quantity=food_item_data["quantity"],
                unit=food_item_data["unit"],
                calories=food_item_data["calories"],
                protein=food_item_data["protein"],
                carbs=food_item_data["carbs"],
                fat=food_item_data["fat"]
            )
            
            db.add(db_food_item)
        
        db.commit()
    
    # Return success message
    return {"message": "Meal plan generated successfully", "meal_plan_id": db_meal_plan.id}


@router.get("/meal-plan/{day}", response_model=MealPlanSchema)
def get_meal_plan_by_day(
    day: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get meal plan for a specific day
    """
    # Validate day
    if day < 1 or day > 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Day must be between 1 and 7"
        )
    
    # Get meal plan
    meal_plan = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.day == day
    ).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No meal plan found for day {day}"
        )
    
    return meal_plan


@router.post("/meal-plan/{day}/meal", response_model=MealSchema)
def add_meal_to_plan(
    day: int,
    meal_in: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can add custom meals
):
    """
    Add a custom meal to a meal plan (Premium feature)
    """
    # Validate day
    if day < 1 or day > 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Day must be between 1 and 7"
        )
    
    # Get meal plan
    meal_plan = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.day == day
    ).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No meal plan found for day {day}"
        )
    
    # Create meal
    db_meal = Meal(
        meal_plan_id=meal_plan.id,
        name=meal_in.name,
        calories=meal_in.calories,
        protein=meal_in.protein,
        carbs=meal_in.carbs,
        fat=meal_in.fat,
        description=meal_in.description
    )
    
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    
    # Update meal plan totals
    meal_plan.total_calories += meal_in.calories
    meal_plan.total_protein += meal_in.protein
    meal_plan.total_carbs += meal_in.carbs
    meal_plan.total_fat += meal_in.fat
    
    db.commit()
    db.refresh(meal_plan)
    
    return db_meal


@router.post("/meal/{meal_id}/food", response_model=dict)
def add_food_to_meal(
    meal_id: int,
    food_in: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_premium_user)  # Only premium users can add custom foods
):
    """
    Add a food item to a meal (Premium feature)
    """
    # Get meal
    meal = db.query(Meal).join(MealPlan).filter(
        Meal.id == meal_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found or you don't have access to it"
        )
    
    # Create food item
    db_food_item = FoodItem(
        meal_id=meal.id,
        name=food_in.name,
        quantity=food_in.quantity,
        unit=food_in.unit,
        calories=food_in.calories,
        protein=food_in.protein,
        carbs=food_in.carbs,
        fat=food_in.fat
    )
    
    db.add(db_food_item)
    db.commit()
    
    # Update meal totals
    meal.calories += food_in.calories
    meal.protein += food_in.protein
    meal.carbs += food_in.carbs
    meal.fat += food_in.fat
    
    db.commit()
    db.refresh(meal)
    
    # Update meal plan totals
    meal_plan = db.query(MealPlan).filter(MealPlan.id == meal.meal_plan_id).first()
    meal_plan.total_calories += food_in.calories
    meal_plan.total_protein += food_in.protein
    meal_plan.total_carbs += food_in.carbs
    meal_plan.total_fat += food_in.fat
    
    db.commit()
    
    return {"message": "Food item added successfully", "food_item_id": db_food_item.id}
