'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { PremiumGate } from '@/components/premium-gate';
import { api } from '@/lib/api/api';

interface NutritionPlan {
  id: number;
  user_id: number;
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  meals_per_day: number;
  created_at: string;
  updated_at: string;
}

interface MealPlan {
  id: number;
  nutrition_plan_id: number;
  date: string;
  meals: Meal[];
}

interface Meal {
  id: number;
  meal_plan_id: number;
  name: string;
  time: string;
  foods: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

interface FoodItem {
  id: number;
  meal_id: number;
  name: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionPage() {
  const { user } = useAuth();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [todaysMealPlan, setTodaysMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isPremium = user?.role === 'premium';
  
  useEffect(() => {
    const fetchNutritionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch nutrition plan
        const nutritionData = await api.nutrition.getNutritionPlan();
        setNutritionPlan(nutritionData);
        
        // Fetch today's meal plan
        const today = new Date().toISOString().split('T')[0];
        try {
          const mealPlanData = await api.nutrition.getMealPlan(today);
          setTodaysMealPlan(mealPlanData);
        } catch (mealPlanError) {
          // It's okay if there's no meal plan yet
          console.log('No meal plan found for today');
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNutritionData();
  }, []);
  
  const generateMealPlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const mealPlanData = await api.nutrition.generateMealPlan(today);
      setTodaysMealPlan(mealPlanData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating meal plan');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading nutrition data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading nutrition data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/nutrition/meal-plan">
            <Button variant="outline">View Weekly Plan</Button>
          </Link>
          <Link href="/dashboard/nutrition/food-log">
            <Button variant="outline">Food Log</Button>
          </Link>
        </div>
      </div>
      
      {/* Nutrition Summary */}
      {nutritionPlan && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Your Nutrition Plan</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-500">Daily Calories</p>
              <p className="text-2xl font-bold text-gray-900">{nutritionPlan.daily_calories}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-2xl font-bold text-green-600">{nutritionPlan.protein_grams}</p>
              <p className="text-xs text-gray-500">grams ({Math.round(nutritionPlan.protein_grams * 4 / nutritionPlan.daily_calories * 100)}%)</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="text-2xl font-bold text-blue-600">{nutritionPlan.carbs_grams}</p>
              <p className="text-xs text-gray-500">grams ({Math.round(nutritionPlan.carbs_grams * 4 / nutritionPlan.daily_calories * 100)}%)</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fat</p>
              <p className="text-2xl font-bold text-yellow-600">{nutritionPlan.fat_grams}</p>
              <p className="text-xs text-gray-500">grams ({Math.round(nutritionPlan.fat_grams * 9 / nutritionPlan.daily_calories * 100)}%)</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Today's Meal Plan */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Today's Meal Plan</h2>
          {!todaysMealPlan && (
            <Button onClick={generateMealPlan} disabled={!isPremium}>
              Generate Meal Plan
            </Button>
          )}
        </div>
        
        {!isPremium && !todaysMealPlan && (
          <div className="mt-4 rounded-md bg-yellow-50 p-4">
                  </Link>
                }
              >
                <Button
                  onClick={generateMealPlan}
                  disabled={isLoading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {isLoading ? 'Generating...' : 'Generate Meal Plan'}
                </Button>
              </PremiumGate>
            </div>
          )}
        </div>
        
        {todaysMealPlan ? (
          <div className="mt-4 space-y-6">
            {todaysMealPlan.meals.map((meal) => (
              <div key={meal.id} className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{meal.name}</h3>
                  <span className="text-sm text-gray-500">{meal.time}</span>
                </div>
                <div className="mt-2">
                  <div className="flex space-x-4 text-sm">
                    <span>{meal.total_calories} kcal</span>
                    <span className="text-green-600">{meal.total_protein}g protein</span>
                    <span className="text-blue-600">{meal.total_carbs}g carbs</span>
                    <span className="text-yellow-600">{meal.total_fat}g fat</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {meal.foods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{food.name}</span>
                        <span className="ml-2 text-gray-500">{food.serving_size}</span>
                      </div>
                      <div className="text-gray-500">{food.calories} kcal</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <p className="text-gray-500">No meal plan generated for today.</p>
            {isPremium && (
              <p className="mt-2 text-sm text-gray-500">
                Click "Generate Meal Plan" to create a personalized plan based on your nutrition goals.
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Nutrition Tips */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Nutrition Tips</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Aim to drink at least 8 glasses of water daily.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Include a variety of colorful vegetables in your meals.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Consume protein with each meal to support muscle recovery and growth.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Choose whole grains over refined carbohydrates for sustained energy.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Include healthy fats from sources like avocados, nuts, and olive oil.
          </li>
        </ul>
      </div>
    </div>
  );
}
