'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: number;
  gender: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  bmr: number;
  tdee: number;
  protein_gram: number;
  carb_gram: number;
  fat_gram: number;
}

interface NutritionSummary {
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
}

interface WorkoutSummary {
  total_workouts: number;
  next_workout_day: string;
  next_workout_type: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:8000/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            // Profile not found, user needs to create one
            setProfile(null);
            setIsLoading(false);
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Mock nutrition summary data (in a real app, this would come from the API)
        setNutritionSummary({
          calories_consumed: Math.round(profileData.tdee * 0.8),
          protein_consumed: Math.round(profileData.protein_gram * 0.75),
          carbs_consumed: Math.round(profileData.carb_gram * 0.8),
          fat_consumed: Math.round(profileData.fat_gram * 0.7),
        });
        
        // Mock workout summary data (in a real app, this would come from the API)
        setWorkoutSummary({
          total_workouts: 3,
          next_workout_day: 'Today',
          next_workout_type: 'Upper Body',
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
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
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Planova!</h2>
          <p className="mt-2 text-gray-600">
            To get started, please complete your profile so we can create personalized plans for you.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/profile/create">
              <Button>Create Your Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        <p className="mt-1 text-gray-600">
          Here's your fitness summary for today.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Nutrition card */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Nutrition</h3>
            <Link href="/dashboard/nutrition" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View details
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Calories</span>
                <span className="font-medium text-gray-900">
                  {nutritionSummary?.calories_consumed} / {profile.tdee} kcal
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${(nutritionSummary?.calories_consumed || 0) / profile.tdee * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Protein</span>
                <span className="font-medium text-gray-900">
                  {nutritionSummary?.protein_consumed} / {profile.protein_gram} g
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(nutritionSummary?.protein_consumed || 0) / profile.protein_gram * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Carbs</span>
                <span className="font-medium text-gray-900">
                  {nutritionSummary?.carbs_consumed} / {profile.carb_gram} g
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(nutritionSummary?.carbs_consumed || 0) / profile.carb_gram * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Fat</span>
                <span className="font-medium text-gray-900">
                  {nutritionSummary?.fat_consumed} / {profile.fat_gram} g
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{ width: `${(nutritionSummary?.fat_consumed || 0) / profile.fat_gram * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Workout card */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Workouts</h3>
            <Link href="/dashboard/workouts" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View details
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Next workout</p>
              <p className="mt-1 font-medium text-gray-900">
                {workoutSummary?.next_workout_day}: {workoutSummary?.next_workout_type}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Workouts completed</p>
              <p className="mt-1 font-medium text-gray-900">{workoutSummary?.total_workouts} this week</p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/workouts/today">
                <Button className="w-full">Start Today's Workout</Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Profile card */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
            <Link href="/dashboard/profile" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Edit profile
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Height</span>
              <span className="text-sm font-medium text-gray-900">{profile.height_cm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Weight</span>
              <span className="text-sm font-medium text-gray-900">{profile.weight_kg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">BMR</span>
              <span className="text-sm font-medium text-gray-900">{profile.bmr} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">TDEE</span>
              <span className="text-sm font-medium text-gray-900">{profile.tdee} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Goal</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{profile.goal.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/nutrition/meal-plan">
            <Button variant="outline" className="w-full justify-center">
              View Meal Plan
            </Button>
          </Link>
          <Link href="/dashboard/workouts/log">
            <Button variant="outline" className="w-full justify-center">
              Log Workout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
