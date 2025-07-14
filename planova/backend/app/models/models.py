from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Date, DateTime, Text, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="free")  # free or premium
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    workout_plans = relationship("WorkoutPlan", back_populates="user")
    meal_plans = relationship("MealPlan", back_populates="user")
    subscription = relationship("Subscription", back_populates="user", uselist=False)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gender = Column(String, CheckConstraint("gender IN ('male', 'female', 'other')"))
    date_of_birth = Column(Date)
    age = Column(Integer)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    activity_level = Column(String, CheckConstraint("activity_level IN ('sedentary', 'light', 'moderate', 'intense')"))
    goal = Column(String, CheckConstraint("goal IN ('lose_fat', 'maintain', 'gain_muscle')"))
    body_fat_percent = Column(Float, nullable=True)
    lean_mass_kg = Column(Float, nullable=True)
    bmr = Column(Float, nullable=True)
    tdee = Column(Float, nullable=True)
    protein_gram = Column(Float, nullable=True)
    carb_gram = Column(Float, nullable=True)
    fat_gram = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profile")


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    day = Column(Integer)  # 1-7 representing days of the week
    muscle_group = Column(String)
    level = Column(String, CheckConstraint("level IN ('beginner', 'intermediate', 'advanced')"))
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="workout_plans")
    exercises = relationship("Exercise", back_populates="workout_plan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_plan_id = Column(Integer, ForeignKey("workout_plans.id"))
    name = Column(String)
    sets = Column(Integer)
    reps = Column(String)  # Could be "8-12" or "12" etc.
    rest_seconds = Column(Integer)
    notes = Column(Text, nullable=True)
    
    # Relationships
    workout_plan = relationship("WorkoutPlan", back_populates="exercises")


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    day = Column(Integer)  # 1-7 representing days of the week
    total_calories = Column(Float)
    total_protein = Column(Float)
    total_carbs = Column(Float)
    total_fat = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="meal_plans")
    meals = relationship("Meal", back_populates="meal_plan")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"))
    name = Column(String)  # Breakfast, Lunch, Dinner, Snack, etc.
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    description = Column(Text, nullable=True)
    
    # Relationships
    meal_plan = relationship("MealPlan", back_populates="meals")
    food_items = relationship("FoodItem", back_populates="meal")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"))
    name = Column(String)
    quantity = Column(Float)
    unit = Column(String)  # g, ml, oz, etc.
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    
    # Relationships
    meal = relationship("Meal", back_populates="food_items")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    tier = Column(String, default="free")  # free or premium
    start_date = Column(DateTime, server_default=func.now())
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
