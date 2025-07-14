'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/api';

interface WorkoutPlan {
  id: number;
  user_id: number;
  name: string;
  description: string;
  days_per_week: number;
  goal: string;
  level: string;
  created_at: string;
  updated_at: string;
}

interface WorkoutDay {
  id: number;
  workout_plan_id: number;
  day_name: string;
  focus: string;
  exercises: Exercise[];
}

interface Exercise {
  id: number;
  workout_day_id: number;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
}

export default function WorkoutsPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkoutData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch workout plan using the centralized API module
        try {
          const workoutData = await api.workout.getWorkoutPlan();
          setWorkoutPlan(workoutData);
          
          // Fetch workout days
          const daysData = await api.workout.getWorkoutDays(workoutData.id);
          setWorkoutDays(daysData);
          
          // Set active day to today's day of the week
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const today = dayNames[new Date().getDay()];
          const todayWorkout = daysData.find((day: WorkoutDay) => day.day_name === today);
          
          if (todayWorkout) {
            setActiveDay(today);
          } else {
            setActiveDay(daysData[0]?.day_name || null);
          }
        } catch (err) {
          // It's okay if there's no workout plan yet
          if (err instanceof Error && err.message.includes('404')) {
            console.log('No workout plan found');
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkoutData();
  }, []);
  
  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate workout plan using the centralized API module
      const workoutData = await api.workout.generateWorkoutPlan();
      setWorkoutPlan(workoutData);
      
      // Fetch workout days for the new plan
      const daysData = await api.workout.getWorkoutDays(workoutData.id);
      setWorkoutDays(daysData);
      
      // Set active day to today's day of the week
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = dayNames[new Date().getDay()];
      const todayWorkout = daysData.find((day: WorkoutDay) => day.day_name === today);
      
      if (todayWorkout) {
        setActiveDay(today);
      } else {
        setActiveDay(daysData[0]?.day_name || null);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating workout plan');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading workout data...</p>
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
            <h3 className="text-sm font-medium text-red-800">Error loading workout data</h3>
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
        <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/workouts/log">
            <Button variant="outline">Workout Log</Button>
          </Link>
          <Link href="/dashboard/workouts/progress">
            <Button variant="outline">Track Progress</Button>
          </Link>
        </div>
      </div>
      
      {/* Workout Plan */}
      {!workoutPlan ? (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="text-center py-8">
            <h2 className="text-lg font-medium text-gray-900">No Workout Plan Found</h2>
            <p className="mt-2 text-gray-500">
              Generate a personalized workout plan based on your fitness goals.
            </p>
            <div className="mt-4">
              <Button onClick={generateWorkoutPlan}>
                Generate Workout Plan
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{workoutPlan.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{workoutPlan.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900 capitalize">{workoutPlan.goal.replace('_', ' ')}</span>
                <span className="text-sm text-gray-500 capitalize">{workoutPlan.level.replace('_', ' ')} level</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {workoutDays.map((day: WorkoutDay) => (
                  <button
                    key={day.id}
                    onClick={() => setActiveDay(day.day_name)}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      activeDay === day.day_name
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.day_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Workout Day Details */}
          {activeDay && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {workoutDays
                .filter((day: WorkoutDay) => day.day_name === activeDay)
                .map((day: WorkoutDay) => (
                  <div key={day.id}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{day.day_name}: {day.focus}</h3>
                      <Link href={`/dashboard/workouts/start/${day.id}`}>
                        <Button>Start Workout</Button>
                      </Link>
                    </div>
                    
                    <div className="mt-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Exercise
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sets
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reps
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rest
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {day.exercises.map((exercise: Exercise) => (
                            <tr key={exercise.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                                {exercise.notes && (
                                  <div className="text-xs text-gray-500">{exercise.notes}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exercise.sets}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exercise.reps}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exercise.rest_seconds}s
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
      
      {/* Workout Tips */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Workout Tips</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Always warm up properly before starting your workout.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Focus on proper form rather than lifting heavier weights.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Stay hydrated throughout your workout session.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Allow at least 48 hours of rest for muscle groups between workouts.
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Track your progress to stay motivated and see improvements.
          </li>
        </ul>
      </div>
    </div>
  );
}
