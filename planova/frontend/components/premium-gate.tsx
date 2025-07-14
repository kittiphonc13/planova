'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PremiumGate component that restricts access to premium features
 * Shows the children if the user has a premium subscription
 * Otherwise shows a fallback component or a default upgrade prompt
 */
export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const isPremium = user?.role === 'premium';
  
  const handleUpgradeClick = () => {
    setIsLoading(true);
    router.push('/dashboard/subscription');
  };
  
  // If user is premium, show the children
  if (isPremium) {
    return <>{children}</>;
  }
  
  // If a custom fallback is provided, show it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default fallback with upgrade prompt
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-primary-100 p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Premium Feature</h3>
      <p className="mb-4 text-sm text-gray-600">
        This feature is available exclusively to premium subscribers.
        Upgrade your plan to unlock all premium features.
      </p>
      <Button 
        onClick={handleUpgradeClick} 
        disabled={isLoading}
        className="w-full max-w-xs"
      >
        {isLoading ? 'Redirecting...' : 'Upgrade to Premium'}
      </Button>
    </div>
  );
}
