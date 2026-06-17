# TRIVARNA Authentication Module Documentation

## 🔌 Backend API Handoff Specification

This handoff section defines the database schemas, API specifications, validation parameters, authentication policies, and user lifecycle management required for the Login and Signup module.

---

### 1. Database Schema (PostgreSQL)

```sql
-- Users Table

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    provider VARCHAR(50) DEFAULT 'email',

    email_verified BOOLEAN DEFAULT FALSE,

    onboarding_completed BOOLEAN DEFAULT FALSE,

    last_login TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Validation Rules

#### Signup Validation

* `fullName`

  * Required
  * Minimum Length: 3
  * Maximum Length: 100

* `email`

  * Required
  * Must be valid email format

* `password`

  * Required
  * Minimum Length: 8
  * Must contain:

    * One Uppercase Letter
    * One Lowercase Letter
    * One Number

* `confirmPassword`

  * Required
  * Must match password

---

#### Login Validation

* `email`

  * Required

* `password`

  * Required

---

### 3. Authentication & Security

#### Password Storage

Passwords must never be stored directly.

Use:

```text
bcrypt hashing
```

---

#### JWT Authentication

Generate:

```json
{
  "userId": "uuid",
  "email": "user@email.com"
}
```

Token Expiry:

```text
7 Days
```

Authorization Format:

```http
Authorization: Bearer JWT_TOKEN
```

---

### 4. Response Formats

#### Signup Success

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@email.com"
  }
}
```

---

#### Login Success

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "user@email.com",
    "onboardingCompleted": false
  }
}
```

---

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

---

#### Unauthorized

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 5. Authentication Lifecycle

#### New User

```text
Signup
    ↓
Account Creation
    ↓
Welcome Screen
    ↓
Onboarding Flow
    ↓
Dashboard
```

---

#### Existing User

```text
Login
    ↓
Authentication
    ↓
Dashboard
```

---

#### Existing User (Incomplete Onboarding)

```text
Login
    ↓
Authentication
    ↓
Resume Onboarding
```

---

### 6. API Versioning

Payloads must include:

```json
{
  "version": "1.0"
}
```

---

### 7. Authentication APIs

#### Signup API

```http
POST /api/auth/signup
```

Request:

```json
{
  "fullName": "John Doe",
  "email": "john@gmail.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "version": "1.0"
}
```

---

#### Login API

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@gmail.com",
  "password": "Password123",
  "version": "1.0"
}
```

---

#### Logout API

```http
POST /api/auth/logout
```

---

#### Current User API

```http
GET /api/auth/me
```

---

### 8. Future Extensibility

Supported future integrations:

* Google OAuth
* Apple Login
* Microsoft Login
* Multi-Factor Authentication
* Biometric Authentication
* Session Management
* Password Reset Flows

---

### 9. Backend Deliverables Checklist

1. User Registration API
2. Login API
3. Logout API
4. JWT Middleware
5. Password Hashing
6. Email Validation
7. Authentication Guard
8. Refresh Token Support
9. OAuth Integration Hooks
10. Unit Tests
11. Integration Tests
12. API Documentation

---

### 10. Endpoints Reference

#### A. Signup Endpoint

```http
POST /api/auth/signup
```

Response:

```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

#### B. Login Endpoint

```http
POST /api/auth/login
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {}
}
```

---

## 🎨 Design System & Styling (Frontend Reference)

### Authentication Theme

The Login and Signup interfaces follow the same wellness-focused SaaS design language used across TRIVARNA.

### Tailwind Color Mapping

* Primary Purple: `#6C4CF1`
* Secondary Purple: `#8B6CFF`
* Light Purple: `#F3F0FF`
* Text Primary: `#111827`
* Text Secondary: `#6B7280`

### UI Components

#### Login Screen

* TRIVARNA Logo
* Welcome Back Header
* Email Input
* Password Input
* Forgot Password
* Sign In Button
* Social Login Buttons
* Signup Redirect

---

#### Signup Screen

* TRIVARNA Logo
* Create Account Header
* Full Name Input
* Email Input
* Password Input
* Confirm Password Input
* Create Account Button
* Social Signup Buttons
* Login Redirect

---

## 🏗️ Technical Architecture

### State Management (Zustand)

```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false
}
```

---

### Service Layer

#### authService.js

Functions:

* signup()
* login()
* logout()
* getCurrentUser()

---

### Routing Configuration

```text
/
      → Login

/signup
      → Signup

/onboarding
      → Onboarding

/dashboard
      → Dashboard
```

---

## 🧭 Authentication Flow

```text
User Opens App
       ↓
Login / Signup
       ↓
Authentication
       ↓
Check Onboarding Status
       ↓
Onboarding (if incomplete)
       ↓
Dashboard

