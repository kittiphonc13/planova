from typing import Dict, List, Any
from ..schemas.schemas import Level, Goal


def get_workout_split(level: Level, goal: Goal) -> Dict[int, Dict[str, Any]]:
    """
    Generate a workout split based on user's level and goal
    
    Returns:
        Dict with days as keys and workout details as values
    """
    # Default workout plans by level
    workout_plans = {
        Level.BEGINNER: {
            # 3-day full body split for beginners
            1: {"day": 1, "muscle_group": "Full Body A", "level": Level.BEGINNER, "notes": "Focus on form and technique"},
            3: {"day": 3, "muscle_group": "Full Body B", "level": Level.BEGINNER, "notes": "Slightly higher intensity than day 1"},
            5: {"day": 5, "muscle_group": "Full Body C", "level": Level.BEGINNER, "notes": "Focus on progressive overload"}
        },
        Level.INTERMEDIATE: {
            # 4-day upper/lower split for intermediate
            1: {"day": 1, "muscle_group": "Upper Body A", "level": Level.INTERMEDIATE, "notes": "Focus on pushing movements"},
            2: {"day": 2, "muscle_group": "Lower Body A", "level": Level.INTERMEDIATE, "notes": "Focus on quad-dominant exercises"},
            4: {"day": 4, "muscle_group": "Upper Body B", "level": Level.INTERMEDIATE, "notes": "Focus on pulling movements"},
            5: {"day": 5, "muscle_group": "Lower Body B", "level": Level.INTERMEDIATE, "notes": "Focus on hip-dominant exercises"}
        },
        Level.ADVANCED: {
            # 5-day body part split for advanced
            1: {"day": 1, "muscle_group": "Chest & Triceps", "level": Level.ADVANCED, "notes": "High volume, moderate intensity"},
            2: {"day": 2, "muscle_group": "Back & Biceps", "level": Level.ADVANCED, "notes": "Focus on width and thickness"},
            3: {"day": 3, "muscle_group": "Legs", "level": Level.ADVANCED, "notes": "High intensity, compound movements"},
            5: {"day": 5, "muscle_group": "Shoulders & Arms", "level": Level.ADVANCED, "notes": "Focus on all three deltoid heads"},
            6: {"day": 6, "muscle_group": "Full Body (Light)", "level": Level.ADVANCED, "notes": "Active recovery, light weights"}
        }
    }
    
    # Adjust workout plan based on goal
    if goal == Goal.LOSE_FAT:
        # Add more conditioning work for fat loss
        for level_key, days in workout_plans.items():
            for day_key, workout in days.items():
                workout["notes"] += ". Add 15-20 min HIIT at the end"
    
    elif goal == Goal.GAIN_MUSCLE:
        # Focus on progressive overload for muscle gain
        for level_key, days in workout_plans.items():
            for day_key, workout in days.items():
                workout["notes"] += ". Focus on progressive overload and time under tension"
    
    return workout_plans[level]


def get_exercises_by_muscle_group(muscle_group: str, level: Level) -> List[Dict[str, Any]]:
    """
    Get a list of exercises for a specific muscle group and level
    
    Returns:
        List of exercise dictionaries
    """
    # Exercise database by muscle group and level
    exercise_db = {
        "Full Body A": {
            Level.BEGINNER: [
                {"name": "Goblet Squat", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Dumbbell Bench Press", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Lat Pulldown", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Dumbbell Shoulder Press", "sets": 2, "reps": "10-15", "rest_seconds": 60},
                {"name": "Plank", "sets": 3, "reps": "30 sec", "rest_seconds": 60}
            ]
        },
        "Full Body B": {
            Level.BEGINNER: [
                {"name": "Romanian Deadlift", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Push-ups", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Seated Cable Row", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Dumbbell Lateral Raise", "sets": 2, "reps": "12-15", "rest_seconds": 60},
                {"name": "Bicycle Crunches", "sets": 3, "reps": "15-20", "rest_seconds": 60}
            ]
        },
        "Full Body C": {
            Level.BEGINNER: [
                {"name": "Leg Press", "sets": 3, "reps": "10-12", "rest_seconds": 90},
                {"name": "Incline Dumbbell Press", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Dumbbell Row", "sets": 3, "reps": "8-12", "rest_seconds": 90},
                {"name": "Face Pull", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Russian Twist", "sets": 3, "reps": "15 each side", "rest_seconds": 60}
            ]
        },
        "Upper Body A": {
            Level.INTERMEDIATE: [
                {"name": "Barbell Bench Press", "sets": 4, "reps": "6-8", "rest_seconds": 120},
                {"name": "Weighted Pull-ups", "sets": 4, "reps": "6-8", "rest_seconds": 120},
                {"name": "Overhead Press", "sets": 3, "reps": "8-10", "rest_seconds": 90},
                {"name": "Cable Fly", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Face Pull", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Tricep Pushdown", "sets": 3, "reps": "10-12", "rest_seconds": 60}
            ]
        },
        "Lower Body A": {
            Level.INTERMEDIATE: [
                {"name": "Back Squat", "sets": 4, "reps": "6-8", "rest_seconds": 180},
                {"name": "Walking Lunges", "sets": 3, "reps": "10 each leg", "rest_seconds": 90},
                {"name": "Leg Extension", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Seated Leg Curl", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Standing Calf Raise", "sets": 4, "reps": "12-15", "rest_seconds": 60},
                {"name": "Hanging Leg Raise", "sets": 3, "reps": "10-15", "rest_seconds": 60}
            ]
        },
        "Upper Body B": {
            Level.INTERMEDIATE: [
                {"name": "Barbell Row", "sets": 4, "reps": "6-8", "rest_seconds": 120},
                {"name": "Incline Dumbbell Press", "sets": 4, "reps": "8-10", "rest_seconds": 90},
                {"name": "Lat Pulldown", "sets": 3, "reps": "10-12", "rest_seconds": 90},
                {"name": "Lateral Raise", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Dumbbell Curl", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Skull Crusher", "sets": 3, "reps": "10-12", "rest_seconds": 60}
            ]
        },
        "Lower Body B": {
            Level.INTERMEDIATE: [
                {"name": "Deadlift", "sets": 4, "reps": "5-6", "rest_seconds": 180},
                {"name": "Bulgarian Split Squat", "sets": 3, "reps": "8-10 each leg", "rest_seconds": 90},
                {"name": "Romanian Deadlift", "sets": 3, "reps": "8-10", "rest_seconds": 90},
                {"name": "Leg Press (Narrow Stance)", "sets": 3, "reps": "10-12", "rest_seconds": 90},
                {"name": "Seated Calf Raise", "sets": 4, "reps": "15-20", "rest_seconds": 60},
                {"name": "Cable Crunch", "sets": 3, "reps": "15-20", "rest_seconds": 60}
            ]
        },
        "Chest & Triceps": {
            Level.ADVANCED: [
                {"name": "Barbell Bench Press", "sets": 5, "reps": "5-8", "rest_seconds": 180},
                {"name": "Incline Dumbbell Press", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Weighted Dips", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Cable Fly", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Close-Grip Bench Press", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Overhead Tricep Extension", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Tricep Pushdown", "sets": 3, "reps": "12-15", "rest_seconds": 60}
            ]
        },
        "Back & Biceps": {
            Level.ADVANCED: [
                {"name": "Weighted Pull-ups", "sets": 5, "reps": "5-8", "rest_seconds": 180},
                {"name": "Barbell Row", "sets": 4, "reps": "6-8", "rest_seconds": 120},
                {"name": "T-Bar Row", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Lat Pulldown", "sets": 3, "reps": "10-12", "rest_seconds": 90},
                {"name": "Barbell Curl", "sets": 4, "reps": "8-10", "rest_seconds": 90},
                {"name": "Hammer Curl", "sets": 3, "reps": "10-12", "rest_seconds": 60},
                {"name": "Cable Curl", "sets": 3, "reps": "12-15", "rest_seconds": 60}
            ]
        },
        "Legs": {
            Level.ADVANCED: [
                {"name": "Back Squat", "sets": 5, "reps": "5-8", "rest_seconds": 180},
                {"name": "Romanian Deadlift", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Hack Squat", "sets": 4, "reps": "8-10", "rest_seconds": 120},
                {"name": "Walking Lunges", "sets": 3, "reps": "10 each leg", "rest_seconds": 90},
                {"name": "Leg Extension", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Leg Curl", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Standing Calf Raise", "sets": 5, "reps": "15-20", "rest_seconds": 60}
            ]
        },
        "Shoulders & Arms": {
            Level.ADVANCED: [
                {"name": "Overhead Press", "sets": 5, "reps": "5-8", "rest_seconds": 180},
                {"name": "Lateral Raise", "sets": 4, "reps": "10-12", "rest_seconds": 60},
                {"name": "Face Pull", "sets": 4, "reps": "12-15", "rest_seconds": 60},
                {"name": "Rear Delt Fly", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "EZ Bar Curl", "sets": 4, "reps": "8-10", "rest_seconds": 90},
                {"name": "Skull Crusher", "sets": 4, "reps": "8-10", "rest_seconds": 90},
                {"name": "Cable Curl/Pushdown Superset", "sets": 3, "reps": "12-15", "rest_seconds": 45}
            ]
        },
        "Full Body (Light)": {
            Level.ADVANCED: [
                {"name": "Goblet Squat", "sets": 3, "reps": "12-15", "rest_seconds": 60},
                {"name": "Push-ups", "sets": 3, "reps": "15-20", "rest_seconds": 60},
                {"name": "TRX Row", "sets": 3, "reps": "15-20", "rest_seconds": 60},
                {"name": "Dumbbell Lateral Raise", "sets": 3, "reps": "15-20", "rest_seconds": 45},
                {"name": "Dumbbell Curl", "sets": 3, "reps": "15-20", "rest_seconds": 45},
                {"name": "Tricep Dips", "sets": 3, "reps": "15-20", "rest_seconds": 45}
            ]
        }
    }
    
    # Return exercises for the specified muscle group and level
    if muscle_group in exercise_db and level in exercise_db[muscle_group]:
        return exercise_db[muscle_group][level]
    
    # Fallback to beginner exercises if specific level not found
    if muscle_group in exercise_db and Level.BEGINNER in exercise_db[muscle_group]:
        return exercise_db[muscle_group][Level.BEGINNER]
    
    # Return empty list if no exercises found
    return []


def generate_workout_plan(level: Level, goal: Goal) -> Dict[str, Any]:
    """
    Generate a complete workout plan based on user's level and goal
    
    Returns:
        Dict with workout split and exercises
    """
    # Get workout split
    workout_split = get_workout_split(level, goal)
    
    # Add exercises to each day
    workout_plan = {}
    for day, workout in workout_split.items():
        muscle_group = workout["muscle_group"]
        exercises = get_exercises_by_muscle_group(muscle_group, level)
        
        workout_plan[day] = {
            "workout": workout,
            "exercises": exercises
        }
    
    return workout_plan
