from typing import Dict, List, Any
from ..schemas.schemas import Goal


def get_food_database() -> Dict[str, Dict[str, Any]]:
    """
    Get a database of common foods with their nutritional information
    
    Returns:
        Dict with food items and their nutritional values
    """
    return {
        # Proteins
        "chicken_breast": {
            "name": "Chicken Breast",
            "calories": 165,
            "protein": 31,
            "carbs": 0,
            "fat": 3.6,
            "serving_size": 100,
            "unit": "g",
            "category": "protein"
        },
        "salmon": {
            "name": "Salmon",
            "calories": 208,
            "protein": 20,
            "carbs": 0,
            "fat": 13,
            "serving_size": 100,
            "unit": "g",
            "category": "protein"
        },
        "eggs": {
            "name": "Whole Eggs",
            "calories": 143,
            "protein": 13,
            "carbs": 0.7,
            "fat": 9.5,
            "serving_size": 100,
            "unit": "g",
            "category": "protein"
        },
        "greek_yogurt": {
            "name": "Greek Yogurt",
            "calories": 59,
            "protein": 10,
            "carbs": 3.6,
            "fat": 0.4,
            "serving_size": 100,
            "unit": "g",
            "category": "protein"
        },
        "tofu": {
            "name": "Tofu",
            "calories": 76,
            "protein": 8,
            "carbs": 1.9,
            "fat": 4.8,
            "serving_size": 100,
            "unit": "g",
            "category": "protein"
        },
        
        # Carbohydrates
        "brown_rice": {
            "name": "Brown Rice (cooked)",
            "calories": 112,
            "protein": 2.6,
            "carbs": 23,
            "fat": 0.9,
            "serving_size": 100,
            "unit": "g",
            "category": "carb"
        },
        "sweet_potato": {
            "name": "Sweet Potato",
            "calories": 86,
            "protein": 1.6,
            "carbs": 20,
            "fat": 0.1,
            "serving_size": 100,
            "unit": "g",
            "category": "carb"
        },
        "oats": {
            "name": "Oats",
            "calories": 389,
            "protein": 16.9,
            "carbs": 66.3,
            "fat": 6.9,
            "serving_size": 100,
            "unit": "g",
            "category": "carb"
        },
        "quinoa": {
            "name": "Quinoa (cooked)",
            "calories": 120,
            "protein": 4.4,
            "carbs": 21.3,
            "fat": 1.9,
            "serving_size": 100,
            "unit": "g",
            "category": "carb"
        },
        "whole_wheat_bread": {
            "name": "Whole Wheat Bread",
            "calories": 247,
            "protein": 13,
            "carbs": 41,
            "fat": 3.4,
            "serving_size": 100,
            "unit": "g",
            "category": "carb"
        },
        
        # Fats
        "avocado": {
            "name": "Avocado",
            "calories": 160,
            "protein": 2,
            "carbs": 8.5,
            "fat": 14.7,
            "serving_size": 100,
            "unit": "g",
            "category": "fat"
        },
        "olive_oil": {
            "name": "Olive Oil",
            "calories": 884,
            "protein": 0,
            "carbs": 0,
            "fat": 100,
            "serving_size": 100,
            "unit": "ml",
            "category": "fat"
        },
        "almonds": {
            "name": "Almonds",
            "calories": 579,
            "protein": 21.2,
            "carbs": 21.7,
            "fat": 49.9,
            "serving_size": 100,
            "unit": "g",
            "category": "fat"
        },
        "peanut_butter": {
            "name": "Peanut Butter",
            "calories": 588,
            "protein": 25,
            "carbs": 20,
            "fat": 50,
            "serving_size": 100,
            "unit": "g",
            "category": "fat"
        },
        
        # Vegetables
        "broccoli": {
            "name": "Broccoli",
            "calories": 34,
            "protein": 2.8,
            "carbs": 6.6,
            "fat": 0.4,
            "serving_size": 100,
            "unit": "g",
            "category": "vegetable"
        },
        "spinach": {
            "name": "Spinach",
            "calories": 23,
            "protein": 2.9,
            "carbs": 3.6,
            "fat": 0.4,
            "serving_size": 100,
            "unit": "g",
            "category": "vegetable"
        },
        
        # Fruits
        "banana": {
            "name": "Banana",
            "calories": 89,
            "protein": 1.1,
            "carbs": 22.8,
            "fat": 0.3,
            "serving_size": 100,
            "unit": "g",
            "category": "fruit"
        },
        "apple": {
            "name": "Apple",
            "calories": 52,
            "protein": 0.3,
            "carbs": 13.8,
            "fat": 0.2,
            "serving_size": 100,
            "unit": "g",
            "category": "fruit"
        },
        "berries": {
            "name": "Mixed Berries",
            "calories": 57,
            "protein": 0.7,
            "carbs": 13.8,
            "fat": 0.3,
            "serving_size": 100,
            "unit": "g",
            "category": "fruit"
        }
    }


def create_meal_template(meal_type: str, goal: Goal) -> Dict[str, Any]:
    """
    Create a meal template based on meal type and goal
    
    Returns:
        Dict with meal template information
    """
    templates = {
        "breakfast": {
            Goal.LOSE_FAT: {
                "name": "Breakfast",
                "protein_percent": 0.35,
                "carb_percent": 0.40,
                "fat_percent": 0.25,
                "calorie_percent": 0.25,
                "description": "High protein breakfast to keep you full"
            },
            Goal.MAINTAIN: {
                "name": "Breakfast",
                "protein_percent": 0.30,
                "carb_percent": 0.45,
                "fat_percent": 0.25,
                "calorie_percent": 0.25,
                "description": "Balanced breakfast with moderate carbs"
            },
            Goal.GAIN_MUSCLE: {
                "name": "Breakfast",
                "protein_percent": 0.30,
                "carb_percent": 0.50,
                "fat_percent": 0.20,
                "calorie_percent": 0.25,
                "description": "Carb-rich breakfast to fuel morning workouts"
            }
        },
        "lunch": {
            Goal.LOSE_FAT: {
                "name": "Lunch",
                "protein_percent": 0.40,
                "carb_percent": 0.30,
                "fat_percent": 0.30,
                "calorie_percent": 0.35,
                "description": "Protein-focused lunch with moderate fats"
            },
            Goal.MAINTAIN: {
                "name": "Lunch",
                "protein_percent": 0.35,
                "carb_percent": 0.40,
                "fat_percent": 0.25,
                "calorie_percent": 0.30,
                "description": "Balanced lunch with lean protein and complex carbs"
            },
            Goal.GAIN_MUSCLE: {
                "name": "Lunch",
                "protein_percent": 0.35,
                "carb_percent": 0.45,
                "fat_percent": 0.20,
                "calorie_percent": 0.30,
                "description": "High-calorie lunch with focus on protein and carbs"
            }
        },
        "dinner": {
            Goal.LOSE_FAT: {
                "name": "Dinner",
                "protein_percent": 0.45,
                "carb_percent": 0.25,
                "fat_percent": 0.30,
                "calorie_percent": 0.30,
                "description": "Protein-rich dinner with lower carbs"
            },
            Goal.MAINTAIN: {
                "name": "Dinner",
                "protein_percent": 0.40,
                "carb_percent": 0.35,
                "fat_percent": 0.25,
                "calorie_percent": 0.30,
                "description": "Balanced dinner with moderate carbs"
            },
            Goal.GAIN_MUSCLE: {
                "name": "Dinner",
                "protein_percent": 0.40,
                "carb_percent": 0.40,
                "fat_percent": 0.20,
                "calorie_percent": 0.30,
                "description": "Protein and carb-rich dinner to support muscle growth"
            }
        },
        "snack": {
            Goal.LOSE_FAT: {
                "name": "Snack",
                "protein_percent": 0.40,
                "carb_percent": 0.20,
                "fat_percent": 0.40,
                "calorie_percent": 0.10,
                "description": "Protein-rich snack to maintain satiety"
            },
            Goal.MAINTAIN: {
                "name": "Snack",
                "protein_percent": 0.30,
                "carb_percent": 0.40,
                "fat_percent": 0.30,
                "calorie_percent": 0.15,
                "description": "Balanced snack with moderate carbs"
            },
            Goal.GAIN_MUSCLE: {
                "name": "Snack",
                "protein_percent": 0.25,
                "carb_percent": 0.50,
                "fat_percent": 0.25,
                "calorie_percent": 0.15,
                "description": "Carb-rich snack to fuel workouts and recovery"
            }
        }
    }
    
    return templates.get(meal_type, {}).get(goal, templates["snack"][Goal.MAINTAIN])


def select_foods_for_meal(
    meal_template: Dict[str, Any],
    daily_calories: float,
    daily_protein: float,
    daily_carbs: float,
    daily_fat: float
) -> Dict[str, Any]:
    """
    Select foods for a meal based on the meal template and daily targets
    
    Returns:
        Dict with meal information and food items
    """
    food_db = get_food_database()
    
    # Calculate meal targets
    meal_calories = daily_calories * meal_template["calorie_percent"]
    meal_protein = daily_protein * meal_template["protein_percent"]
    meal_carbs = daily_carbs * meal_template["carb_percent"]
    meal_fat = daily_fat * meal_template["fat_percent"]
    
    # Initialize meal
    meal = {
        "name": meal_template["name"],
        "calories": meal_calories,
        "protein": meal_protein,
        "carbs": meal_carbs,
        "fat": meal_fat,
        "description": meal_template["description"],
        "food_items": []
    }
    
    # Select protein source
    protein_foods = [food for food in food_db.values() if food["category"] == "protein"]
    protein_food = protein_foods[hash(meal_template["name"]) % len(protein_foods)]
    protein_amount = (meal_protein / protein_food["protein"]) * 100  # Amount in grams to meet protein target
    
    # Select carb source
    carb_foods = [food for food in food_db.values() if food["category"] == "carb"]
    carb_food = carb_foods[hash(meal_template["name"] + "carb") % len(carb_foods)]
    carb_amount = (meal_carbs / carb_food["carbs"]) * 100  # Amount in grams to meet carb target
    
    # Select fat source
    fat_foods = [food for food in food_db.values() if food["category"] == "fat"]
    fat_food = fat_foods[hash(meal_template["name"] + "fat") % len(fat_foods)]
    fat_amount = (meal_fat / fat_food["fat"]) * 100  # Amount in grams to meet fat target
    
    # Add vegetable (for lunch and dinner)
    vegetable = None
    vegetable_amount = 0
    if meal_template["name"] in ["Lunch", "Dinner"]:
        vegetables = [food for food in food_db.values() if food["category"] == "vegetable"]
        vegetable = vegetables[hash(meal_template["name"] + "veg") % len(vegetables)]
        vegetable_amount = 100  # Standard serving
    
    # Add fruit (for breakfast and snack)
    fruit = None
    fruit_amount = 0
    if meal_template["name"] in ["Breakfast", "Snack"]:
        fruits = [food for food in food_db.values() if food["category"] == "fruit"]
        fruit = fruits[hash(meal_template["name"] + "fruit") % len(fruits)]
        fruit_amount = 100  # Standard serving
    
    # Add food items to meal
    meal["food_items"].append({
        "name": protein_food["name"],
        "quantity": round(protein_amount, 0),
        "unit": protein_food["unit"],
        "calories": round((protein_amount / 100) * protein_food["calories"], 0),
        "protein": round((protein_amount / 100) * protein_food["protein"], 1),
        "carbs": round((protein_amount / 100) * protein_food["carbs"], 1),
        "fat": round((protein_amount / 100) * protein_food["fat"], 1)
    })
    
    meal["food_items"].append({
        "name": carb_food["name"],
        "quantity": round(carb_amount, 0),
        "unit": carb_food["unit"],
        "calories": round((carb_amount / 100) * carb_food["calories"], 0),
        "protein": round((carb_amount / 100) * carb_food["protein"], 1),
        "carbs": round((carb_amount / 100) * carb_food["carbs"], 1),
        "fat": round((carb_amount / 100) * carb_food["fat"], 1)
    })
    
    meal["food_items"].append({
        "name": fat_food["name"],
        "quantity": round(fat_amount, 0),
        "unit": fat_food["unit"],
        "calories": round((fat_amount / 100) * fat_food["calories"], 0),
        "protein": round((fat_amount / 100) * fat_food["protein"], 1),
        "carbs": round((fat_amount / 100) * fat_food["carbs"], 1),
        "fat": round((fat_amount / 100) * fat_food["fat"], 1)
    })
    
    if vegetable:
        meal["food_items"].append({
            "name": vegetable["name"],
            "quantity": vegetable_amount,
            "unit": vegetable["unit"],
            "calories": vegetable["calories"],
            "protein": vegetable["protein"],
            "carbs": vegetable["carbs"],
            "fat": vegetable["fat"]
        })
    
    if fruit:
        meal["food_items"].append({
            "name": fruit["name"],
            "quantity": fruit_amount,
            "unit": fruit["unit"],
            "calories": fruit["calories"],
            "protein": fruit["protein"],
            "carbs": fruit["carbs"],
            "fat": fruit["fat"]
        })
    
    return meal


def generate_meal_plan(
    daily_calories: float,
    daily_protein: float,
    daily_carbs: float,
    daily_fat: float,
    goal: Goal
) -> Dict[str, Any]:
    """
    Generate a complete meal plan based on daily targets and goal
    
    Returns:
        Dict with meal plan information
    """
    # Create meal templates
    breakfast_template = create_meal_template("breakfast", goal)
    lunch_template = create_meal_template("lunch", goal)
    dinner_template = create_meal_template("dinner", goal)
    snack_template = create_meal_template("snack", goal)
    
    # Generate meals
    breakfast = select_foods_for_meal(breakfast_template, daily_calories, daily_protein, daily_carbs, daily_fat)
    lunch = select_foods_for_meal(lunch_template, daily_calories, daily_protein, daily_carbs, daily_fat)
    dinner = select_foods_for_meal(dinner_template, daily_calories, daily_protein, daily_carbs, daily_fat)
    snack = select_foods_for_meal(snack_template, daily_calories, daily_protein, daily_carbs, daily_fat)
    
    # Create meal plan
    meal_plan = {
        "total_calories": daily_calories,
        "total_protein": daily_protein,
        "total_carbs": daily_carbs,
        "total_fat": daily_fat,
        "meals": [breakfast, lunch, dinner, snack]
    }
    
    return meal_plan
