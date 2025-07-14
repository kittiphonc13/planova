'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { api } from '@/lib/api/api';

interface SubscriptionData {
  is_active: boolean;
  subscription_type: string;
  start_date: string;
  end_date: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await api.subscription.getSubscription();
        setSubscription(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const subscriptionData = {
        subscription_type: 'premium',
        payment_method: 'credit_card',
      };
      
      const data = await api.subscription.subscribe(subscriptionData);
      setSubscription(data);
      setSuccess('Successfully subscribed to Premium!');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred during subscription');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.subscription.cancelSubscription();
      setSubscription(null);
      setSuccess('Your subscription has been canceled. Premium features will be available until the end of your billing period.');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while canceling subscription');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading subscription data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="mt-1 text-gray-600">
          Manage your subscription and access premium features.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className={`rounded-lg border ${!subscription?.is_active ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'} bg-white p-6 shadow-sm`}>
          <div className="flex justify-between">
            <h2 className="text-lg font-medium text-gray-900">Free Plan</h2>
            {!subscription?.is_active && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                Current Plan
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Basic features to get you started on your fitness journey.
          </p>
          <div className="mt-6">
            <p className="text-4xl font-bold text-gray-900">$0</p>
            <p className="text-sm text-gray-500">Forever free</p>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Basic profile management
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Nutrition calculator
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Basic workout tracking
            </li>
            <li className="flex items-start text-gray-400">
              <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Personalized meal plans
            </li>
            <li className="flex items-start text-gray-400">
              <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Custom workout plans
            </li>
            <li className="flex items-start text-gray-400">
              <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Progress analytics
            </li>
          </ul>
        </div>
        
        {/* Premium Plan */}
        <div className={`rounded-lg border ${subscription?.is_active ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'} bg-white p-6 shadow-sm`}>
          <div className="flex justify-between">
            <h2 className="text-lg font-medium text-gray-900">Premium Plan</h2>
            {subscription?.is_active && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                Current Plan
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Advanced features for serious fitness enthusiasts.
          </p>
          <div className="mt-6">
            <p className="text-4xl font-bold text-gray-900">$9.99</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Everything in Free plan
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <strong>Personalized meal plans</strong>
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <strong>Custom workout plans</strong>
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Detailed progress analytics
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Weekly plan adjustments
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Priority support
            </li>
          </ul>
          <div className="mt-8">
            {subscription?.is_active ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                isLoading={isProcessing}
              >
                Cancel Subscription
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleSubscribe}
                isLoading={isProcessing}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
          {subscription?.is_active && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Your subscription will renew on {new Date(subscription.end_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Feature Comparison */}
      <div className="mt-12 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Feature Comparison</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Free
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Profile Management</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nutrition Calculator</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Basic Workout Tracking</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Personalized Meal Plans</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✗</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Custom Workout Plans</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✗</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Progress Analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✗</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weekly Plan Adjustments</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✗</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Priority Support</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✗</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-12 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900">How does the billing work?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Premium subscriptions are billed monthly. You can cancel anytime, and your premium features will remain active until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Can I switch back to the free plan?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Yes, you can cancel your premium subscription at any time and revert to the free plan. Your data will be preserved, but you'll lose access to premium features.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Is there a refund policy?</h3>
            <p className="mt-2 text-sm text-gray-500">
              We offer a 7-day money-back guarantee if you're not satisfied with the premium features. Contact our support team to request a refund within this period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
