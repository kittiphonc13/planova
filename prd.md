
# 🏋️‍♂️ Nutrition & Weight Training Web App Design

## 🧱 Tech Stack

- **Frontend:** React.js / Next.js
- **Backend:** FastAPI (Python)
- **Database:** SQLite (scalable with SQLAlchemy)
- **Authentication:** JWT
- **Membership Tiers:** Free, Premium

---

## 🎯 System Goals

Design a personalized nutrition and weight training plan based on:
- Age
- Gender
- Weight
- Height
- Activity Level
- Goal: [Lose weight, Maintain, Gain muscle]

---

## 🧮 Core Calculations

### BMR (Basal Metabolic Rate)
```python
# Male
BMR = 10 * weight + 6.25 * height - 5 * age + 5

# Female
BMR = 10 * weight + 6.25 * height - 5 * age - 161
```

### TDEE (Total Daily Energy Expenditure)

| Activity Level        | Multiplier |
|-----------------------|------------|
| Sedentary             | 1.2        |
| Light Exercise        | 1.375      |
| Moderate Exercise     | 1.55       |
| Intense Exercise      | 1.725      |

```python
TDEE = BMR * activity_multiplier
```

### Macronutrient Split (Example for Muscle Gain)
- Protein: 2g per kg of body weight
- Fat: 25–30% of total calories
- Carbs: remaining calories

---

## 🧩 Modules Overview

### 1. Authentication & User Management
- Register / Login / Logout
- JWT Auth
- Role: Free / Premium
- Profile: Age, Gender, Height, Weight, Goals

### 2. Nutrition & Training Engine
- Calculate BMR, TDEE, macros
- Suggest meal plan based on macros
- Suggest workout plan (Beginner/Intermediate/Advanced)

### 3. Workout Plan
- Split workout by days & muscle groups
- Customization for Premium
- Option to track progress

### 4. Meal/Nutrition Plan
- Suggested meals per day based on macros
- Add/edit meals (Premium feature)
- Searchable food database (optional)

### 5. Subscription System
- Tier-based feature access
- Premium = full feature access
- Integration-ready for Stripe/Paddle

---

## 🗃️ Database Schema (ER Overview)

### Tables:
- **User**: id, email, hashed_password, role
- **Profile**: user_id, age, gender, height, weight, goal
- **WorkoutPlan**: id, user_id, day, muscle_group, notes
- **MealPlan**: id, user_id, day, meals, total_kcal
- **Subscription**: user_id, tier, start_date, end_date

---

## 🧪 FastAPI Endpoints

```http
POST   /register
POST   /login
GET    /user/profile
PUT    /user/profile
GET    /nutrition/plan
GET    /workout/plan
POST   /subscribe
```

---

## 🧑‍💻 Development Steps

1. Define core use cases (Register, Profile, Plan Generation)
2. Create ER Diagram & API Spec
3. Build backend (FastAPI + SQLite + SQLAlchemy)
4. Setup frontend (Next.js + Tailwind + Zustand/SWR)
5. Add auth system and subscription logic

---

## ✅ Future Enhancements
- Calendar integration for training
- Export plans to PDF
- AI meal suggestion
- Admin dashboard for managing plans

---

---

## 🗃️ Table Design: `user_profile`

รายละเอียดการออกแบบตารางเพื่อเก็บข้อมูลของผู้ใช้สำหรับการวิเคราะห์แผนโภชนาการและการออกกำลังกาย:

### 🔸 ตาราง: `user_profile`

| Field Name           | Data Type     | Description |
|----------------------|---------------|-------------|
| `id`                 | INTEGER (PK)  | รหัสโปรไฟล์ (Auto Increment) |
| `user_id`            | INTEGER (FK)  | เชื่อมกับตาราง `user` |
| `gender`             | TEXT          | เพศ (male, female, other) |
| `date_of_birth`      | DATE          | วันเดือนปีเกิด เพื่อใช้คำนวณอายุอัตโนมัติ |
| `age`                | INTEGER       | อายุ (อัปเดตอัตโนมัติจากวันเกิด, redundancy เพื่อ query เร็ว) |
| `height_cm`          | REAL          | ส่วนสูง (เซนติเมตร) |
| `weight_kg`          | REAL          | น้ำหนัก (กิโลกรัม) |
| `activity_level`     | TEXT          | ระดับกิจกรรม: sedentary, light, moderate, intense |
| `goal`               | TEXT          | เป้าหมาย: lose_fat, maintain, gain_muscle |
| `body_fat_percent`   | REAL          | เปอร์เซ็นต์ไขมันในร่างกาย (optional, หากทราบ) |
| `lean_mass_kg`       | REAL          | มวลกล้ามเนื้อ (คำนวณจาก body fat ถ้ามี) |
| `bmr`                | REAL          | Basal Metabolic Rate ที่คำนวณล่าสุด |
| `tdee`               | REAL          | Total Daily Energy Expenditure ที่คำนวณล่าสุด |
| `protein_gram`       | REAL          | ปริมาณโปรตีนที่ควรบริโภคต่อวัน |
| `carb_gram`          | REAL          | ปริมาณคาร์โบไฮเดรตที่ควรบริโภคต่อวัน |
| `fat_gram`           | REAL          | ปริมาณไขมันที่ควรบริโภคต่อวัน |
| `created_at`         | DATETIME      | วันที่สร้างโปรไฟล์ |
| `updated_at`         | DATETIME      | วันที่แก้ไขล่าสุด |

### 📦 SQL Schema (สำหรับ SQLite / SQLAlchemy)

```sql
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE NOT NULL,
    age INTEGER,
    height_cm REAL NOT NULL,
    weight_kg REAL NOT NULL,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'intense')),
    goal TEXT CHECK (goal IN ('lose_fat', 'maintain', 'gain_muscle')),
    body_fat_percent REAL,
    lean_mass_kg REAL,
    bmr REAL,
    tdee REAL,
    protein_gram REAL,
    carb_gram REAL,
    fat_gram REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

---
