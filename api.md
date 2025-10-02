# FOMO English - Backend API Documentation

## Project Overview

FOMO English is a comprehensive English learning platform targeting Vietnamese professionals. The platform offers industry-specific English courses with video lessons and interactive quizzes, downloadable workbooks, and free vocabulary resources. Users purchase courses individually with lifetime access.

## API Documentation

### Interactive Documentation (Swagger)

The API includes comprehensive interactive documentation powered by Swagger/OpenAPI. Once the application is running, you can access it at:

**🚀 Swagger UI: [http://localhost:3001/docs](http://localhost:3001/docs)**

#### Features:

- **Interactive Testing**: Test all API endpoints directly from the browser
- **Authentication**: Built-in JWT authentication support
- **Request/Response Examples**: Complete examples for all endpoints
- **Schema Documentation**: Detailed request and response schemas
- **Organized by Tags**: Endpoints grouped by functionality (Auth, Courses, Admin, etc.)

#### Using Swagger UI:

1. Start the application: `yarn start:dev`
2. Open [http://localhost:3001/docs](http://localhost:3001/docs) in your browser
3. For protected endpoints:
   - Click "Authorize" button
   - Enter your JWT token in the format: `Bearer your_jwt_token_here`
   - Test protected endpoints directly

### Base URL

BASE_API_URL=https://fomo-backend-production-6d3a.up.railway.app

```
http://localhost:3001
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+84123456789",
  "preferred_language": "en"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+84123456789",
    "preferred_language": "en",
    "points": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "jwt-token-here"
}
```

### Login User

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "points": 150,
    "last_login": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "jwt-token-here"
}
```

### Get User Profile

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+84123456789",
  "points": 150,
  "preferred_language": "en",
  "course_purchases": [...],
  "workbook_purchases": [...],
  "course_progress": [...]
}
```

### Update Profile

```http
PUT /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "John Smith",
  "phone": "+84987654321",
  "profile_image_url": "https://example.com/avatar.jpg",
  "preferred_language": "vi"
}
```

### Logout

```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

---

## 📚 Course Management Endpoints

### Get All Courses

```http
GET /api/courses
```

**Query Parameters:**

- `category` (optional): `business` | `technology` | `healthcare` | `ielts`
- `level` (optional): `beginner` | `intermediate` | `advanced` | `all_levels`
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: `created_at`)
- `sortOrder` (optional): `ASC` | `DESC` (default: `DESC`)

**Example:**

```http
GET /api/courses?category=business&level=intermediate&page=1&limit=5
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title_en": "Business English Fundamentals",
      "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản",
      "description_en": "Master essential business English skills",
      "description_vi": "Làm chủ các kỹ năng tiếng Anh kinh doanh thiết yếu",
      "price_usd": 99.0,
      "price_vnd": 2399000,
      "level": "intermediate",
      "category": "business",
      "duration_hours": 20,
      "total_videos": 15,
      "image_url": "https://example.com/course-image.jpg",
      "instructor": {
        "id": "uuid",
        "name": "Jane Smith",
        "bio_en": "Expert in business English"
      },
      "features": [
        {
          "feature_en": "Lifetime access",
          "feature_vi": "Truy cập trọn đời"
        }
      ]
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 5,
    "totalPages": 5
  }
}
```

### Get Course Details

```http
GET /api/courses/:id
```

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Business English Fundamentals",
  "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản",
  "description_en": "Master essential business English skills",
  "price_usd": 99.00,
  "price_vnd": 2399000,
  "level": "intermediate",
  "category": "business",
  "duration_hours": 20,
  "total_videos": 15,
  "instructor": {...},
  "features": [...],
  "sections": [...],
  "reviews": [...],
  "isPurchased": false,
  "progress": null
}
```

### Get Course Sections (Protected)

```http
GET /api/courses/:id/sections
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "id": "uuid",
    "title_en": "Introduction to Business Communication",
    "title_vi": "Giới thiệu về Giao tiếp Kinh doanh",
    "description_en": "Learn the basics of business communication",
    "sort_order": 1,
    "videos": [
      {
        "id": "uuid",
        "title_en": "Business Communication Basics",
        "title_vi": "Cơ bản về Giao tiếp Kinh doanh",
        "video_url": "https://youtube.com/watch?v=example1",
        "quiz_url": "https://quizlet.com/quiz1",
        "duration_minutes": 15,
        "points_reward": 10,
        "sort_order": 1
      }
    ]
  }
]
```

### Purchase Course (Protected)

```http
POST /api/courses/:id/purchase
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "full_name": "John Doe",
  "phone": "+84123456789",
  "notes": "Payment via Vietcombank",
  "amount": 2399000,
  "currency": "VND"
}
```

**Response:**

```json
{
  "payment_request_id": "uuid",
  "message": "Payment request created. Please complete the bank transfer and wait for admin verification."
}
```

### Get Course Progress (Protected)

```http
GET /api/courses/:id/progress
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "completed_videos": 8,
  "total_videos": 15,
  "completed_quizzes": 6,
  "progress_percentage": 53,
  "last_accessed": "2024-01-01T00:00:00.000Z",
  "completed_at": null
}
```

### Update Course Progress (Protected)

```http
PUT /api/courses/:id/progress
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "completed_videos": 10,
  "completed_quizzes": 8
}
```

---

## 🎥 Video Lessons Endpoints

### Get Section Videos (Protected)

```http
GET /api/sections/:id/videos
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "id": "uuid",
    "title_en": "Business Communication Basics",
    "title_vi": "Cơ bản về Giao tiếp Kinh doanh",
    "description_en": "Learn the fundamentals of business communication",
    "video_url": "https://youtube.com/watch?v=example1",
    "quiz_url": "https://quizlet.com/quiz1",
    "duration_minutes": 15,
    "points_reward": 10,
    "sort_order": 1
  }
]
```

### Get Video Details (Protected)

```http
GET /api/videos/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Business Communication Basics",
  "title_vi": "Cơ bản về Giao tiếp Kinh doanh",
  "description_en": "Learn the fundamentals of business communication",
  "video_url": "https://youtube.com/watch?v=example1",
  "quiz_url": "https://quizlet.com/quiz1",
  "duration_minutes": 15,
  "points_reward": 10,
  "section": {
    "id": "uuid",
    "title_en": "Introduction to Business Communication"
  }
}
```

### Mark Video as Completed (Protected)

```http
POST /api/videos/:id/complete
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "watch_time_minutes": 15
}
```

**Response:**

```json
{
  "message": "Video completed successfully",
  "points_earned": 10,
  "total_points": 160,
  "progress": {
    "is_completed": true,
    "completed_at": "2024-01-01T00:00:00.000Z",
    "points_earned": 10
  }
}
```

### Submit Quiz Completion (Protected)

```http
POST /api/videos/:id/quiz-complete
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "quiz_score": 85
}
```

**Response:**

```json
{
  "message": "Quiz completed successfully",
  "quiz_score": 85,
  "progress": {
    "quiz_completed": true,
    "quiz_score": 85
  }
}
```

### Get Video Progress (Protected)

```http
GET /api/videos/:id/progress
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "is_completed": true,
  "quiz_completed": true,
  "quiz_score": 85,
  "watch_time_minutes": 15,
  "points_earned": 10,
  "completed_at": "2024-01-01T00:00:00.000Z",
  "last_watched": "2024-01-01T00:00:00.000Z"
}
```

---

## 🏆 Points System Endpoints

### Get Points Balance (Protected)

```http
GET /api/points/balance
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "current_points": 150,
  "total_earned": 200,
  "rank": 15
}
```

### Get Points History (Protected)

```http
GET /api/points/history
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "points_earned": 10,
      "points_type": "video_completion",
      "description_en": "Completed video: Business Communication Basics",
      "description_vi": "Hoàn thành video: Cơ bản về Giao tiếp Kinh doanh",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Get Points Leaderboard

```http
GET /api/points/leaderboard
```

**Query Parameters:**

- `limit` (optional): Number of top users (default: 10)

**Response:**

```json
[
  {
    "rank": 1,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "profile_image_url": "https://example.com/avatar.jpg"
    },
    "points": 500
  },
  {
    "rank": 2,
    "user": {
      "id": "uuid",
      "name": "Jane Smith"
    },
    "points": 450
  }
]
```

---

## 📖 Workbook Endpoints

### Get All Workbooks

```http
GET /api/workbooks
```

**Query Parameters:**

- `category` (optional): `business` | `technology` | `healthcare` | `ielts`
- `level` (optional): `beginner` | `intermediate` | `advanced` | `all_levels`
- `is_free` (optional): `true` | `false`
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title_en": "Business Vocabulary Workbook",
      "title_vi": "Sách bài tập Từ vựng Kinh doanh",
      "description_en": "Essential business vocabulary exercises",
      "price_usd": 29.99,
      "price_vnd": 699000,
      "level": "intermediate",
      "category": "business",
      "pages": 120,
      "cover_image_url": "https://example.com/workbook-cover.jpg",
      "is_free": false,
      "features": [...]
    }
  ],
  "meta": {...}
}
```

### Get Workbook Details

```http
GET /api/workbooks/:id
```

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Business Vocabulary Workbook",
  "title_vi": "Sách bài tập Từ vựng Kinh doanh",
  "description_en": "Essential business vocabulary exercises",
  "description_vi": "Bài tập từ vựng kinh doanh thiết yếu",
  "price_usd": 29.99,
  "price_vnd": 699000,
  "level": "intermediate",
  "category": "business",
  "pages": 120,
  "cover_image_url": "https://example.com/workbook-cover.jpg",
  "is_free": false,
  "features": [...],
  "reviews": [...],
  "isPurchased": false
}
```

### Purchase Workbook (Protected)

```http
POST /api/workbooks/:id/purchase
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "full_name": "John Doe",
  "phone": "+84123456789",
  "amount": 699000,
  "currency": "VND"
}
```

### Download Workbook (Protected)

```http
GET /api/workbooks/:id/download
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "download_url": "https://example.com/workbook.pdf",
  "expires_at": "2024-01-01T01:00:00.000Z"
}
```

---

## 🆓 Free Resources Endpoints

### Get Available Industries

```http
GET /api/free-resources/industries
```

**Response:**

```json
[
  {
    "industry": "technology",
    "title_en": "Technology Vocabulary",
    "title_vi": "Từ vựng Công nghệ",
    "description_en": "Essential IT and technology terms",
    "download_count": 1250
  },
  {
    "industry": "business",
    "title_en": "Business Vocabulary",
    "title_vi": "Từ vựng Kinh doanh",
    "description_en": "Key business and finance terms",
    "download_count": 2100
  }
]
```

### Download Free Vocabulary

```http
GET /api/free-resources/:industry/download
```

**Response:**

```json
{
  "download_url": "https://example.com/free-vocabulary-business.pdf",
  "title_en": "Business Vocabulary",
  "title_vi": "Từ vựng Kinh doanh"
}
```

### Track Download

```http
POST /api/free-resources/track-download
```

**Request Body:**

```json
{
  "resource_id": "uuid",
  "resource_type": "free_vocabulary"
}
```

---

## 💳 Payment Endpoints

### Create Payment Request (Protected)

```http
POST /api/payments/request
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "item_type": "course",
  "item_id": "uuid",
  "full_name": "John Doe",
  "phone": "+84123456789",
  "notes": "Payment for Business English course",
  "amount": 2399000,
  "currency": "VND"
}
```

### Check Payment Status (Protected)

```http
GET /api/payments/status/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "payment_status": "pending",
  "amount": 2399000,
  "currency": "VND",
  "item_type": "course",
  "created_at": "2024-01-01T00:00:00.000Z",
  "verified_at": null,
  "admin_notes": null
}
```

### Verify Payment (Admin Only)

```http
POST /api/payments/verify
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "payment_request_id": "uuid",
  "status": "completed",
  "admin_notes": "Payment verified via bank transfer"
}
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Overview (Protected)

```http
GET /api/dashboard/overview
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "user": {
    "name": "John Doe",
    "points": 150,
    "total_courses": 3,
    "completed_courses": 1,
    "total_videos_watched": 25
  },
  "recent_activity": [
    {
      "type": "video_completed",
      "title": "Business Communication Basics",
      "points_earned": 10,
      "date": "2024-01-01T00:00:00.000Z"
    }
  ],
  "current_courses": [...]
}
```

### Get User's Courses (Protected)

```http
GET /api/dashboard/courses
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "course": {
      "id": "uuid",
      "title_en": "Business English Fundamentals",
      "image_url": "https://example.com/course.jpg"
    },
    "progress": {
      "completed_videos": 8,
      "total_videos": 15,
      "progress_percentage": 53,
      "last_accessed": "2024-01-01T00:00:00.000Z"
    },
    "purchase_date": "2023-12-01T00:00:00.000Z"
  }
]
```

### Get Learning Progress Summary (Protected)

```http
GET /api/dashboard/progress
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "total_videos_watched": 25,
  "total_quizzes_completed": 20,
  "total_points_earned": 150,
  "courses_in_progress": 2,
  "courses_completed": 1,
  "this_week": {
    "videos_watched": 5,
    "points_earned": 50
  },
  "this_month": {
    "videos_watched": 15,
    "points_earned": 150
  }
}
```

### Get Recent Videos (Protected)

```http
GET /api/dashboard/recent-videos
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "video": {
      "id": "uuid",
      "title_en": "Business Communication Basics",
      "duration_minutes": 15
    },
    "course": {
      "title_en": "Business English Fundamentals"
    },
    "last_watched": "2024-01-01T00:00:00.000Z",
    "is_completed": true
  }
]
```

### Get Points Summary (Protected)

```http
GET /api/dashboard/points-summary
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "current_points": 150,
  "this_week": {
    "points_earned": 50,
    "videos_completed": 5,
    "quizzes_completed": 4
  },
  "this_month": {
    "points_earned": 150,
    "videos_completed": 15,
    "quizzes_completed": 12
  },
  "recent_earnings": [
    {
      "points": 10,
      "description_en": "Completed video: Business Communication Basics",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 👨‍💼 Admin Endpoints

**Note**: All admin endpoints require admin role authentication.

### Get Dashboard Stats (Admin Only)

```http
GET /api/admin/dashboard/stats
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "totalUsers": 150,
  "totalCourses": 25,
  "totalPaymentRequests": 89,
  "pendingPayments": 12,
  "completedPayments": 77,
  "totalRevenue": 185000000
}
```

### Get All Payment Requests (Admin Only)

```http
GET /api/admin/payments
```

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**

- `status` (optional): `pending` | `verified` | `completed` | `failed`

**Response:**

```json
[
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "full_name": "John Doe",
    "phone": "+84123456789",
    "item_type": "course",
    "item_id": "course-uuid",
    "amount": 2399000,
    "currency": "VND",
    "payment_status": "pending",
    "notes": "Payment via Vietcombank",
    "created_at": "2024-01-01T00:00:00.000Z",
    "admin_notes": null
  }
]
```

### Verify Payment (Admin Only)

```http
POST /api/admin/payments/verify
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "payment_request_id": "uuid",
  "status": "completed",
  "admin_notes": "Payment verified via bank transfer",
  "bank_transfer_content": "FOMO ENGLISH COURSE PAYMENT"
}
```

**Response:**

```json
{
  "message": "Payment completed successfully",
  "payment_request": {
    "id": "uuid",
    "payment_status": "completed",
    "verified_at": "2024-01-01T00:00:00.000Z",
    "completed_at": "2024-01-01T00:00:00.000Z",
    "admin_notes": "Payment verified via bank transfer"
  }
}
```

### Grant Course Access (Admin Only)

```http
POST /api/admin/courses/grant-access
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "user_id": "uuid",
  "course_id": "uuid",
  "payment_amount": 2399000,
  "payment_currency": "VND"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user": {
    "id": "uuid",
    "name": "John Doe"
  },
  "course": {
    "id": "uuid",
    "title_en": "Business English Fundamentals"
  },
  "payment_status": "completed",
  "payment_amount": 2399000,
  "payment_currency": "VND",
  "purchase_date": "2024-01-01T00:00:00.000Z"
}
```

### Get All Users (Admin Only)

```http
GET /api/admin/users
```

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or email

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+84123456789",
      "role": "user",
      "points": 150,
      "preferred_language": "en",
      "created_at": "2024-01-01T00:00:00.000Z",
      "course_purchases": [...],
      "workbook_purchases": [...]
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Get User Details (Admin Only)

```http
GET /api/admin/users/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+84123456789",
  "role": "user",
  "points": 150,
  "preferred_language": "en",
  "created_at": "2024-01-01T00:00:00.000Z",
  "course_purchases": [
    {
      "id": "uuid",
      "course": {
        "id": "uuid",
        "title_en": "Business English Fundamentals"
      },
      "payment_status": "completed",
      "purchase_date": "2024-01-01T00:00:00.000Z"
    }
  ],
  "course_progress": [...],
  "points_history": [...]
}
```

### Update User (Admin Only)

```http
PUT /api/admin/users/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "name": "John Smith",
  "phone": "+84987654321",
  "role": "admin",
  "points": 200,
  "preferred_language": "vi"
}
```

### Delete User (Admin Only)

```http
DELETE /api/admin/users/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

### Get User Course Access (Admin Only)

```http
GET /api/admin/users/:id/courses
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
[
  {
    "id": "uuid",
    "course": {
      "id": "uuid",
      "title_en": "Business English Fundamentals",
      "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản"
    },
    "payment_status": "completed",
    "payment_amount": 2399000,
    "payment_currency": "VND",
    "purchase_date": "2024-01-01T00:00:00.000Z"
  }
]
```

### Revoke Course Access (Admin Only)

```http
DELETE /api/admin/users/:userId/courses/:courseId
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Course access revoked successfully"
}
```

---

## 🎓 Admin Course Management

### Get All Courses (Admin Only)

```http
GET /api/admin/courses
```

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by title

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title_en": "Business English Fundamentals",
      "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản",
      "description_en": "Master essential business English skills",
      "price_usd": 99.00,
      "price_vnd": 2399000,
      "level": "intermediate",
      "category": "business",
      "duration_hours": 20,
      "total_videos": 15,
      "instructor": {
        "id": "uuid",
        "name": "Jane Smith"
      },
      "sections": [...],
      "features": [...],
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

### Get Course Details (Admin Only)

```http
GET /api/admin/courses/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Business English Fundamentals",
  "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản",
  "description_en": "Master essential business English skills",
  "description_vi": "Làm chủ các kỹ năng tiếng Anh kinh doanh thiết yếu",
  "price_usd": 99.00,
  "price_vnd": 2399000,
  "level": "intermediate",
  "category": "business",
  "duration_hours": 20,
  "total_videos": 15,
  "instructor": {
    "id": "uuid",
    "name": "Jane Smith",
    "bio_en": "Expert in business English"
  },
  "sections": [
    {
      "id": "uuid",
      "title_en": "Introduction to Business Communication",
      "title_vi": "Giới thiệu về Giao tiếp Kinh doanh",
      "sort_order": 1,
      "videos": [
        {
          "id": "uuid",
          "title_en": "Business Communication Basics",
          "video_url": "https://youtube.com/watch?v=example1",
          "quiz_url": "https://quizlet.com/quiz1",
          "points_reward": 10,
          "sort_order": 1
        }
      ]
    }
  ],
  "features": [...],
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Create Course (Admin Only)

```http
POST /api/admin/courses
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Advanced Business English",
  "title_vi": "Tiếng Anh Kinh Doanh Nâng Cao",
  "description_en": "Advanced business English for professionals",
  "description_vi": "Tiếng Anh kinh doanh nâng cao cho chuyên gia",
  "price_usd": 149.0,
  "price_vnd": 3599000,
  "original_price_usd": 199.0,
  "original_price_vnd": 4799000,
  "level": "advanced",
  "category": "business",
  "duration_hours": 30,
  "total_videos": 25,
  "instructor_id": "uuid",
  "image_url": "https://example.com/course-image.jpg",
  "is_lifetime_access": true,
  "is_active": true
}
```

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Advanced Business English",
  "title_vi": "Tiếng Anh Kinh Doanh Nâng Cao",
  "description_en": "Advanced business English for professionals",
  "price_usd": 149.0,
  "price_vnd": 3599000,
  "level": "advanced",
  "category": "business",
  "duration_hours": 30,
  "total_videos": 25,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Course (Admin Only)

```http
PUT /api/admin/courses/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Updated Course Title",
  "price_usd": 129.0,
  "price_vnd": 3099000,
  "is_active": false
}
```

### Delete Course (Admin Only)

```http
DELETE /api/admin/courses/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Course deleted successfully"
}
```

---

## 📚 Admin Section Management

### Create Section (Admin Only)

```http
POST /api/admin/sections
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "course_id": "uuid",
  "title_en": "Advanced Communication Skills",
  "title_vi": "Kỹ năng Giao tiếp Nâng cao",
  "description_en": "Learn advanced communication techniques",
  "description_vi": "Học các kỹ thuật giao tiếp nâng cao",
  "sort_order": 2,
  "is_active": true
}
```

### Update Section (Admin Only)

```http
PUT /api/admin/sections/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Updated Section Title",
  "sort_order": 3
}
```

### Delete Section (Admin Only)

```http
DELETE /api/admin/sections/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Section deleted successfully"
}
```

---

## 🎥 Admin Video Management

### Create Video (Admin Only)

```http
POST /api/admin/videos
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "section_id": "uuid",
  "title_en": "Presentation Skills",
  "title_vi": "Kỹ năng Thuyết trình",
  "description_en": "Learn effective presentation techniques",
  "description_vi": "Học các kỹ thuật thuyết trình hiệu quả",
  "video_url": "https://youtube.com/watch?v=example4",
  "quiz_url": "https://quizlet.com/quiz4",
  "duration_minutes": 25,
  "points_reward": 15,
  "sort_order": 1,
  "is_active": true
}
```

### Update Video (Admin Only)

```http
PUT /api/admin/videos/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Updated Video Title",
  "video_url": "https://youtube.com/watch?v=updated",
  "points_reward": 20
}
```

### Delete Video (Admin Only)

```http
DELETE /api/admin/videos/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Video deleted successfully"
}
```

---

## 👨‍🏫 Admin Instructor Management

### Get All Instructors (Admin Only)

```http
GET /api/admin/instructors
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Jane Smith",
    "bio_en": "Expert in business English with 10+ years experience",
    "bio_vi": "Chuyên gia tiếng Anh kinh doanh với hơn 10 năm kinh nghiệm",
    "profile_image_url": "https://example.com/instructor.jpg",
    "specializations": ["Business English", "IELTS", "Communication"],
    "is_active": true,
    "courses": [
      {
        "id": "uuid",
        "title_en": "Business English Fundamentals"
      }
    ]
  }
]
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You must purchase this course to access its content",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Course not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Database Schema

The application uses the following main entities:

- **Users**: User accounts with authentication and profile data
- **Courses**: Video-based courses with sections and lessons
- **CourseSection**: Organize videos within courses
- **VideoLesson**: Individual video lessons with quiz links
- **UserVideoProgress**: Track video completion and quiz scores
- **PointsHistory**: Track all point transactions
- **Workbooks**: Downloadable PDF resources
- **PaymentRequest**: Handle course/workbook purchases
- **FreeDownload**: Free vocabulary resources
