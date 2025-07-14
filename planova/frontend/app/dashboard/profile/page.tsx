'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProfileFormData {
  gender: 'male' | 'female';
  date_of_birth: string;
  height_cm: number;
  weight_kg: number;
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  body_fat_percent?: number;
}

interface UserProfile extends ProfileFormData {
  id: number;
  user_id: number;
  age: number;
  bmr: number;
  tdee: number;
  protein_gram: number;
  carb_gram: number;
  fat_gram: number;
  lean_mass_kg?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();
  
  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        const response = await fetch('http://localhost:8000/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            // Profile not found, redirect to create profile page
            router.push('/dashboard/profile/create');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        
        const profileData = await response.json();
        setProfile(profileData);
        
        // Format date for the form
        const formattedDate = new Date(profileData.date_of_birth)
          .toISOString()
          .split('T')[0];
        
        // Reset form with profile data
        reset({
          ...profileData,
          date_of_birth: formattedDate,
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router, reset]);
  
  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch('http://localhost:8000/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccessMessage('Profile updated successfully');
      
      // Format date for the form
      const formattedDate = new Date(updatedProfile.date_of_birth)
        .toISOString()
        .split('T')[0];
      
      // Reset form with updated profile data
      reset({
        ...updatedProfile,
        date_of_birth: formattedDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating your profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-1 text-gray-600">
          Update your information to get more accurate nutrition and workout plans.
        </p>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  {...register('gender', { required: 'Gender is required' })}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  {...register('gender', { required: 'Gender is required' })}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
            )}
          </div>
          
          {/* Date of Birth */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1">
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth', {
                  required: 'Date of birth is required',
                  validate: (value) => {
                    const date = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - date.getFullYear();
                    return (age >= 18 && age <= 100) || 'You must be between 18 and 100 years old';
                  },
                })}
                error={errors.date_of_birth?.message}
              />
            </div>
          </div>
          
          {/* Height */}
          <div>
            <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <div className="mt-1">
              <Input
                id="height_cm"
                type="number"
                step="0.1"
                {...register('height_cm', {
                  required: 'Height is required',
                  valueAsNumber: true,
                  min: {
                    value: 100,
                    message: 'Height must be at least 100 cm',
                  },
                  max: {
                    value: 250,
                    message: 'Height must be less than 250 cm',
                  },
                })}
                error={errors.height_cm?.message}
              />
            </div>
          </div>
          
          {/* Weight */}
          <div>
            <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <div className="mt-1">
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                {...register('weight_kg', {
                  required: 'Weight is required',
                  valueAsNumber: true,
                  min: {
                    value: 30,
                    message: 'Weight must be at least 30 kg',
                  },
                  max: {
                    value: 300,
                    message: 'Weight must be less than 300 kg',
                  },
                })}
                error={errors.weight_kg?.message}
              />
            </div>
          </div>
          
          {/* Body Fat Percentage (optional) */}
          <div>
            <label htmlFor="body_fat_percent" className="block text-sm font-medium text-gray-700">
              Body Fat Percentage (optional)
            </label>
            <div className="mt-1">
              <Input
                id="body_fat_percent"
                type="number"
                step="0.1"
                {...register('body_fat_percent', {
                  valueAsNumber: true,
                  min: {
                    value: 3,
                    message: 'Body fat percentage must be at least 3%',
                  },
                  max: {
                    value: 50,
                    message: 'Body fat percentage must be less than 50%',
                  },
                })}
                error={errors.body_fat_percent?.message}
              />
            </div>
          </div>
          
          {/* Activity Level */}
          <div>
            <label htmlFor="activity_level" className="block text-sm font-medium text-gray-700">
              Activity Level
            </label>
            <div className="mt-1">
              <select
                id="activity_level"
                {...register('activity_level', { required: 'Activity level is required' })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely Active (very hard exercise, physical job or training twice a day)</option>
              </select>
            </div>
            {errors.activity_level && (
              <p className="mt-1 text-xs text-red-600">{errors.activity_level.message}</p>
            )}
          </div>
          
          {/* Goal */}
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
              Fitness Goal
            </label>
            <div className="mt-1">
              <select
                id="goal"
                {...register('goal', { required: 'Goal is required' })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
              </select>
            </div>
            {errors.goal && (
              <p className="mt-1 text-xs text-red-600">{errors.goal.message}</p>
            )}
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={isSaving}>
              Update Profile
            </Button>
          </div>
        </form>
      </div>
      
      {/* Calculated Stats */}
      {profile && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Your Calculated Stats</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium text-gray-900">{profile.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">BMI</p>
              <p className="font-medium text-gray-900">
                {(profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Basal Metabolic Rate (BMR)</p>
              <p className="font-medium text-gray-900">{profile.bmr} kcal/day</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Daily Energy Expenditure (TDEE)</p>
              <p className="font-medium text-gray-900">{profile.tdee} kcal/day</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Daily Protein Target</p>
              <p className="font-medium text-gray-900">{profile.protein_gram} g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Daily Carbs Target</p>
              <p className="font-medium text-gray-900">{profile.carb_gram} g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Daily Fat Target</p>
              <p className="font-medium text-gray-900">{profile.fat_gram} g</p>
            </div>
            {profile.lean_mass_kg && (
              <div>
                <p className="text-sm text-gray-500">Lean Body Mass</p>
                <p className="font-medium text-gray-900">{profile.lean_mass_kg.toFixed(1)} kg</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
