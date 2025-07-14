from datetime import date
from typing import Dict, Any
from ..schemas.schemas import Gender, Goal, ActivityLevel


def calculate_age(birth_date: date) -> int:
    """Calculate age from birth date"""
    today = date.today()
    age = today.year - birth_date.year
    
    # Check if birthday has occurred this year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
        
    return age


def calculate_bmr(gender: Gender, weight_kg: float, height_cm: float, age: int) -> float:
    """
    Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
    
    For male: BMR = 10 * weight + 6.25 * height - 5 * age + 5
    For female: BMR = 10 * weight + 6.25 * height - 5 * age - 161
    """
    if gender == Gender.MALE:
        return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:  # Female or Other (using female formula as default for other)
        return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161


def calculate_tdee(bmr: float, activity_level: ActivityLevel) -> float:
    """
    Calculate Total Daily Energy Expenditure (TDEE)
    TDEE = BMR * activity_multiplier
    """
    activity_multipliers = {
        ActivityLevel.SEDENTARY: 1.2,      # Little or no exercise
        ActivityLevel.LIGHT: 1.375,        # Light exercise 1-3 days/week
        ActivityLevel.MODERATE: 1.55,      # Moderate exercise 3-5 days/week
        ActivityLevel.INTENSE: 1.725       # Hard exercise 6-7 days/week
    }
    
    return bmr * activity_multipliers[activity_level]


def calculate_macros(weight_kg: float, tdee: float, goal: Goal) -> Dict[str, float]:
    """
    Calculate macronutrient requirements based on weight, TDEE and goal
    
    Returns:
        Dict with protein_gram, carb_gram, fat_gram, and daily_calories
    """
    # Adjust calories based on goal
    daily_calories = tdee
    
    if goal == Goal.LOSE_FAT:
        # 20% caloric deficit for fat loss
        daily_calories = tdee * 0.8
    elif goal == Goal.GAIN_MUSCLE:
        # 10% caloric surplus for muscle gain
        daily_calories = tdee * 1.1
    
    # Calculate protein requirements (in grams)
    # For muscle gain: 2g per kg of body weight
    # For maintenance: 1.6g per kg
    # For fat loss: 1.8g per kg to preserve muscle
    protein_multipliers = {
        Goal.GAIN_MUSCLE: 2.0,
        Goal.MAINTAIN: 1.6,
        Goal.LOSE_FAT: 1.8
    }
    
    protein_gram = weight_kg * protein_multipliers[goal]
    
    # Calculate fat requirements (25-30% of total calories)
    # 1g of fat = 9 calories
    fat_percentage = 0.25  # 25% of calories from fat
    fat_gram = (daily_calories * fat_percentage) / 9
    
    # Calculate carb requirements (remaining calories)
    # 1g of protein = 4 calories, 1g of carbs = 4 calories
    protein_calories = protein_gram * 4
    fat_calories = fat_gram * 9
    carb_calories = daily_calories - protein_calories - fat_calories
    carb_gram = carb_calories / 4
    
    return {
        "protein_gram": round(protein_gram, 1),
        "carb_gram": round(carb_gram, 1),
        "fat_gram": round(fat_gram, 1),
        "daily_calories": round(daily_calories, 0),
        "bmr": round(tdee / activity_multipliers[activity_level], 0),
        "tdee": round(tdee, 0)
    }


def calculate_nutrition_plan(
    gender: Gender,
    date_of_birth: date,
    weight_kg: float,
    height_cm: float,
    activity_level: ActivityLevel,
    goal: Goal,
    body_fat_percent: float = None
) -> Dict[str, Any]:
    """
    Calculate complete nutrition plan based on user profile
    
    Returns:
        Dict with BMR, TDEE, macros and daily calories
    """
    age = calculate_age(date_of_birth)
    bmr = calculate_bmr(gender, weight_kg, height_cm, age)
    tdee = calculate_tdee(bmr, activity_level)
    
    # Calculate lean mass if body fat percentage is provided
    lean_mass_kg = None
    if body_fat_percent is not None:
        lean_mass_kg = weight_kg * (1 - (body_fat_percent / 100))
    
    # Calculate macros
    macros = calculate_macros(weight_kg, tdee, goal)
    
    # Add lean mass to the result if available
    if lean_mass_kg:
        macros["lean_mass_kg"] = round(lean_mass_kg, 1)
    
    return macros
