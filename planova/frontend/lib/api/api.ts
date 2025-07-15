/**
 * API utility for making authenticated requests to the backend
 * Handles token management, error handling, and request formatting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiError {
  status: number;
  message: string;
  details?: any;
}

/**
 * Makes an API request to the backend
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Request options
 * @returns Promise with the response data
 * @throws ApiError if the request fails
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
  } = options;

  // Build request URL
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Prepare headers
  const requestHeaders: Record<string, string> = { ...headers };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  // Add body if provided
  if (body) {
    if (body instanceof URLSearchParams) {
      // Let the browser set the Content-Type for URLSearchParams
      requestOptions.body = body;
    } else {
      requestHeaders['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    // Make the request
    const response = await fetch(url, requestOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') === -1) {
      if (!response.ok) {
        throw {
          status: response.status,
          message: response.statusText || 'Request failed',
        };
      }
      return response.text() as unknown as T;
    }

    // Parse JSON response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.detail || 'Request failed',
        details: data,
      };
    }

    return data;
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (error instanceof Error) {
      throw {
        status: 0,
        message: error.message || 'Network error',
      };
    }
    throw error;
  }
}

/**
 * API endpoints for authentication
 */
export const authApi = {
  login: (email: string, password: string) => {
    const body = new URLSearchParams();
    body.append('username', email);
    body.append('password', password);

    return apiRequest<{ access_token: string; token_type: string }>('/api/v1/auth/login', {
      method: 'POST',
      body,
      requiresAuth: false,
    });
  },

  register: (email: string, password: string) =>
    apiRequest<{ message: string }>('/api/v1/auth/register', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false,
    }),
};

/**
 * API endpoints for user profile
 */
export const userApi = {
  getProfile: () => apiRequest('/user/profile'),
  
  createProfile: (profileData: any) =>
    apiRequest('/user/profile', {
      method: 'POST',
      body: profileData,
    }),
  
  updateProfile: (profileData: any) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: profileData,
    }),
};

/**
 * API endpoints for nutrition
 */
export const nutritionApi = {
  getNutritionPlan: () => apiRequest('/nutrition/plan'),
  
  getMealPlan: (date: string) => apiRequest(`/nutrition/meal-plan/${date}`),
  
  generateMealPlan: (date: string) =>
    apiRequest(`/nutrition/generate-meal-plan/${date}`, {
      method: 'POST',
    }),
  
  addCustomMeal: (mealPlanId: number, mealData: any) =>
    apiRequest(`/nutrition/meal-plan/${mealPlanId}/meal`, {
      method: 'POST',
      body: mealData,
    }),
  
  addFoodToMeal: (mealId: number, foodData: any) =>
    apiRequest(`/nutrition/meal/${mealId}/food`, {
      method: 'POST',
      body: foodData,
    }),
};

/**
 * API endpoints for workouts
 */
export const workoutApi = {
  getWorkoutPlan: () => apiRequest('/workout/plan'),
  
  getWorkoutDays: (planId: number) => apiRequest(`/workout/plan/${planId}/days`),
  
  generateWorkoutPlan: () =>
    apiRequest('/workout/generate-plan', {
      method: 'POST',
    }),
  
  logWorkout: (workoutData: any) =>
    apiRequest('/workout/log', {
      method: 'POST',
      body: workoutData,
    }),
};

/**
 * API endpoints for subscription
 */
export const subscriptionApi = {
  getSubscription: () => apiRequest('/subscription'),
  
  subscribe: (subscriptionData: any) =>
    apiRequest('/subscription/subscribe', {
      method: 'POST',
      body: subscriptionData,
    }),
  
  cancelSubscription: () =>
    apiRequest('/subscription/cancel', {
      method: 'POST',
    }),
};

/**
 * Combined API object for easier imports
 */
export const api = {
  auth: authApi,
  user: userApi,
  nutrition: nutritionApi,
  workout: workoutApi,
  subscription: subscriptionApi,
};
