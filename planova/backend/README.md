# Planova Backend

A FastAPI-based backend for the Planova Nutrition and Weight Training Web Application.

## Features

- User authentication with JWT tokens
- User profile management
- Nutrition plan calculation (BMR, TDEE, macros)
- Meal plan generation
- Workout plan generation
- Subscription management (Free/Premium tiers)
- Role-based access control

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **SQLite**: Lightweight database
- **JWT**: JSON Web Tokens for authentication
- **Uvicorn**: ASGI server

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── nutrition.py
│   │   │   ├── subscription.py
│   │   │   ├── users.py
│   │   │   └── workout.py
│   │   └── api.py
│   ├── core/
│   │   └── security.py
│   ├── db/
│   │   └── database.py
│   ├── models/
│   │   └── models.py
│   ├── schemas/
│   │   └── schemas.py
│   ├── services/
│   │   ├── meal_service.py
│   │   ├── nutrition_service.py
│   │   └── workout_service.py
│   └── main.py
├── data/
│   └── planova.db
├── .env
├── requirements.txt
└── run.py
```

## Setup and Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following variables:
   ```
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ADMIN_EMAIL=admin@planova.com
   ADMIN_PASSWORD=adminpassword
   ```

5. Run the application:
   ```
   python run.py
   ```

6. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login and get access token

### User Profile
- `POST /api/v1/user/profile`: Create user profile
- `GET /api/v1/user/profile`: Get current user profile
- `PUT /api/v1/user/profile`: Update user profile

### Nutrition
- `GET /api/v1/nutrition/plan`: Get nutrition plan
- `GET /api/v1/nutrition/meal-plan`: Get all meal plans
- `POST /api/v1/nutrition/meal-plan/generate`: Generate a meal plan
- `GET /api/v1/nutrition/meal-plan/{day}`: Get meal plan for a specific day
- `POST /api/v1/nutrition/meal-plan/{day}/meal`: Add a custom meal (Premium)
- `POST /api/v1/nutrition/meal/{meal_id}/food`: Add a food item to a meal (Premium)

### Workout
- `GET /api/v1/workout/plan`: Get all workout plans
- `POST /api/v1/workout/plan/generate`: Generate a workout plan
- `GET /api/v1/workout/plan/{day}`: Get workout plan for a specific day
- `PUT /api/v1/workout/plan/{workout_plan_id}`: Update a workout plan (Premium)
- `POST /api/v1/workout/plan/{workout_plan_id}/exercise`: Add a custom exercise (Premium)
- `PUT /api/v1/workout/exercise/{exercise_id}`: Update an exercise (Premium)
- `DELETE /api/v1/workout/exercise/{exercise_id}`: Delete an exercise (Premium)

### Subscription
- `POST /api/v1/subscription/subscribe`: Subscribe to premium
- `GET /api/v1/subscription/subscription`: Get current subscription
- `POST /api/v1/subscription/cancel-subscription`: Cancel subscription

## Security

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation with Pydantic
