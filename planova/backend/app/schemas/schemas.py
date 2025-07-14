from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    INTENSE = "intense"


class Goal(str, Enum):
    LOSE_FAT = "lose_fat"
    MAINTAIN = "maintain"
    GAIN_MUSCLE = "gain_muscle"


class Level(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Role(str, Enum):
    FREE = "free"
    PREMIUM = "premium"


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    role: Role

    class Config:
        orm_mode = True


class User(UserInDB):
    pass


# UserProfile schemas
class UserProfileBase(BaseModel):
    gender: Gender
    date_of_birth: date
    height_cm: float = Field(..., gt=0)
    weight_kg: float = Field(..., gt=0)
    activity_level: ActivityLevel
    goal: Goal
    body_fat_percent: Optional[float] = Field(None, ge=0, le=100)


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(BaseModel):
    gender: Optional[Gender] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[float] = Field(None, gt=0)
    weight_kg: Optional[float] = Field(None, gt=0)
    activity_level: Optional[ActivityLevel] = None
    goal: Optional[Goal] = None
    body_fat_percent: Optional[float] = Field(None, ge=0, le=100)


class UserProfileInDB(UserProfileBase):
    id: int
    user_id: int
    age: int
    lean_mass_kg: Optional[float] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    protein_gram: Optional[float] = None
    carb_gram: Optional[float] = None
    fat_gram: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserProfile(UserProfileInDB):
    pass


# Exercise schemas
class ExerciseBase(BaseModel):
    name: str
    sets: int = Field(..., gt=0)
    reps: str
    rest_seconds: int = Field(..., ge=0)
    notes: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    sets: Optional[int] = Field(None, gt=0)
    reps: Optional[str] = None
    rest_seconds: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None


class ExerciseInDB(ExerciseBase):
    id: int
    workout_plan_id: int

    class Config:
        orm_mode = True


class Exercise(ExerciseInDB):
    pass


# WorkoutPlan schemas
class WorkoutPlanBase(BaseModel):
    day: int = Field(..., ge=1, le=7)
    muscle_group: str
    level: Level
    notes: Optional[str] = None


class WorkoutPlanCreate(WorkoutPlanBase):
    pass


class WorkoutPlanUpdate(BaseModel):
    day: Optional[int] = Field(None, ge=1, le=7)
    muscle_group: Optional[str] = None
    level: Optional[Level] = None
    notes: Optional[str] = None


class WorkoutPlanInDB(WorkoutPlanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class WorkoutPlan(WorkoutPlanInDB):
    exercises: List[Exercise] = []


# FoodItem schemas
class FoodItemBase(BaseModel):
    name: str
    quantity: float = Field(..., gt=0)
    unit: str
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = None
    calories: Optional[float] = Field(None, ge=0)
    protein: Optional[float] = Field(None, ge=0)
    carbs: Optional[float] = Field(None, ge=0)
    fat: Optional[float] = Field(None, ge=0)


class FoodItemInDB(FoodItemBase):
    id: int
    meal_id: int

    class Config:
        orm_mode = True


class FoodItem(FoodItemInDB):
    pass


# Meal schemas
class MealBase(BaseModel):
    name: str
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)
    description: Optional[str] = None


class MealCreate(MealBase):
    pass


class MealUpdate(BaseModel):
    name: Optional[str] = None
    calories: Optional[float] = Field(None, ge=0)
    protein: Optional[float] = Field(None, ge=0)
    carbs: Optional[float] = Field(None, ge=0)
    fat: Optional[float] = Field(None, ge=0)
    description: Optional[str] = None


class MealInDB(MealBase):
    id: int
    meal_plan_id: int

    class Config:
        orm_mode = True


class Meal(MealInDB):
    food_items: List[FoodItem] = []


# MealPlan schemas
class MealPlanBase(BaseModel):
    day: int = Field(..., ge=1, le=7)
    total_calories: float = Field(..., ge=0)
    total_protein: float = Field(..., ge=0)
    total_carbs: float = Field(..., ge=0)
    total_fat: float = Field(..., ge=0)


class MealPlanCreate(MealPlanBase):
    pass


class MealPlanUpdate(BaseModel):
    day: Optional[int] = Field(None, ge=1, le=7)
    total_calories: Optional[float] = Field(None, ge=0)
    total_protein: Optional[float] = Field(None, ge=0)
    total_carbs: Optional[float] = Field(None, ge=0)
    total_fat: Optional[float] = Field(None, ge=0)


class MealPlanInDB(MealPlanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class MealPlan(MealPlanInDB):
    meals: List[Meal] = []


# Subscription schemas
class SubscriptionBase(BaseModel):
    tier: Role
    end_date: Optional[datetime] = None
    is_active: bool = True


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    tier: Optional[Role] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class SubscriptionInDB(SubscriptionBase):
    id: int
    user_id: int
    start_date: datetime

    class Config:
        orm_mode = True


class Subscription(SubscriptionInDB):
    pass


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# Nutrition calculation response
class NutritionPlan(BaseModel):
    bmr: float
    tdee: float
    protein_gram: float
    carb_gram: float
    fat_gram: float
    daily_calories: float
