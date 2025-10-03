# FOMO English - Backend API Documentation

## Project Overview

FOMO English is a comprehensive English learning platform targeting Vietnamese professionals. The platform offers industry-specific English courses with video lessons and interactive quizzes, downloadable workbooks, and free vocabulary resources. Users purchase courses individually with lifetime access.

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fomo-backend

# Install dependencies
yarn install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run database migrations
yarn build
yarn start:dev
```

### Environment Variables

```env
# Database
POSTGRESHOST=localhost
POSTGRESPORT=5432
POSTGRESUSER=your_username
POSTGRESPASSWORD=your_password
POSTGRESDB=fomo_english

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h

# Application
NODE_ENV=development
PORT=3001
```

## Project Structure

```
src/
├── entities/
│   └── user.entity.ts          # User entity definition
├── modules/
│   └── user/
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── user.controller.ts   # User REST endpoints
│       ├── user.service.ts      # User business logic
│       └── user.module.ts       # User module configuration
├── app.module.ts               # Main application module
└── main.ts                     # Application entry point
```

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

```
http://localhost:3001
```

### Authentication

The API supports both authenticated and unauthenticated access:

**Protected Endpoints** (require authentication):

- User profile management
- Course purchases
- Progress tracking
- Video completion
- Workbook purchases
- Workbook downloads

**Optional Authentication Endpoints** (work with or without authentication):

- Get all courses (`GET /api/courses`)
- Get course details (`GET /api/courses/:id`)
- Get all workbooks (`GET /api/workbooks`)
- Get workbook details (`GET /api/workbooks/:id`)

**Unauthenticated Endpoints**:

- User registration
- User login
- Free resources

For protected endpoints, include the Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

For optional authentication endpoints, the token is optional but recommended for personalized content.

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

**Headers:** `Authorization: Bearer <user-token>` (optional - for purchase status and user context)

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

**Note:** If user is authenticated, each course will include `is_purchased` and `purchase_date` fields.

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
      ],
      "is_purchased": true,
      "purchase_date": "2024-01-01T00:00:00.000Z"
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

### Get My Courses (User's Purchased Courses)

```http
GET /api/courses/my-courses
```

**Headers:** `Authorization: Bearer <user-token>`

**Response:**

```json
{
  "courses": [
    {
      "id": "uuid",
      "title_en": "Complete English Grammar Course",
      "title_vi": "Khóa Học Ngữ Pháp Tiếng Anh Hoàn Chỉnh",
      "description_en": "Complete English grammar course with exercises",
      "description_vi": "Khóa học ngữ pháp tiếng Anh hoàn chỉnh với bài tập",
      "price_usd": 99.0,
      "price_vnd": 2399000,
      "level": "intermediate",
      "category": "grammar",
      "duration_hours": 20,
      "total_videos": 15,
      "image_url": "https://example.com/grammar-course.jpg",
      "is_lifetime_access": true,
      "purchased_at": "2024-01-01T00:00:00.000Z",
      "payment_amount": 99.0,
      "payment_currency": "USD",
      "instructor": {
        "id": "uuid",
        "name": "John Smith",
        "profile_image_url": "https://example.com/instructor.jpg"
      }
    }
  ],
  "total": 1
}
```

### Get Course Details

```http
GET /api/courses/:id
```

**Headers:** `Authorization: Bearer <user-token>` (optional - for purchase status)

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Business English Fundamentals",
  "title_vi": "Tiếng Anh Kinh Doanh Cơ Bản",
  "description_en": "Master essential business English skills",
  "price_usd": 99.0,
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
  "features": [
    {
      "feature_en": "Lifetime access",
      "feature_vi": "Truy cập trọn đời"
    }
  ],
  "sections": [
    {
      "id": "uuid",
      "title_en": "Introduction to Business Communication",
      "title_vi": "Giới thiệu về Giao tiếp Kinh doanh",
      "description_en": "Learn the basics of business communication",
      "description_vi": "Học những điều cơ bản về giao tiếp kinh doanh",
      "sort_order": 1,
      "videos": [
        {
          "id": "uuid",
          "title_en": "Business Communication Basics",
          "title_vi": "Cơ bản về Giao tiếp Kinh doanh",
          "description_en": "Learn the fundamentals of business communication",
          "description_vi": "Học những điều cơ bản về giao tiếp kinh doanh",
          "video_url": "https://youtube.com/watch?v=example1",
          "quiz_url": "https://quizlet.com/quiz1",
          "duration_minutes": 15,
          "points_reward": 10,
          "sort_order": 1
        },
        {
          "id": "uuid",
          "title_en": "Email Writing Skills",
          "title_vi": "Kỹ năng Viết Email",
          "description_en": "Master professional email writing",
          "description_vi": "Làm chủ kỹ năng viết email chuyên nghiệp",
          "video_url": "https://youtube.com/watch?v=example2",
          "quiz_url": "https://quizlet.com/quiz2",
          "duration_minutes": 20,
          "points_reward": 12,
          "sort_order": 2
        }
      ]
    },
    {
      "id": "uuid",
      "title_en": "Advanced Communication",
      "title_vi": "Giao tiếp Nâng cao",
      "description_en": "Advanced business communication techniques",
      "description_vi": "Các kỹ thuật giao tiếp kinh doanh nâng cao",
      "sort_order": 2,
      "videos": [
        {
          "id": "uuid",
          "title_en": "Presentation Skills",
          "title_vi": "Kỹ năng Thuyết trình",
          "description_en": "Learn effective presentation techniques",
          "description_vi": "Học các kỹ thuật thuyết trình hiệu quả",
          "video_url": "https://youtube.com/watch?v=example3",
          "quiz_url": "https://quizlet.com/quiz3",
          "duration_minutes": 25,
          "points_reward": 15,
          "sort_order": 1
        }
      ]
    }
  ],
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment_en": "Excellent course!",
      "comment_vi": "Khóa học tuyệt vời!",
      "user": {
        "name": "John Doe"
      },
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "isPurchased": false,
  "progress": null
}
```

**Note:**

- Sections are ordered by `sort_order` (ascending)
- Videos within each section are ordered by `sort_order` (ascending)
- If user is authenticated, `isPurchased` and `progress` fields will be included
- If user is not authenticated, `isPurchased` will be `false` and `progress` will be `null`

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

**Headers:** `Authorization: Bearer <user-token>` (optional - for purchase status and user context)

**Query Parameters:**

- `category` (optional): `business` | `technology` | `healthcare` | `ielts`
- `level` (optional): `beginner` | `intermediate` | `advanced` | `all_levels`
- `is_free` (optional): `true` | `false`
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: `created_at`)
- `sortOrder` (optional): `ASC` | `DESC` (default: `DESC`)

**Response:**

```json
{
  "data": [
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
      "features": [
        {
          "feature_en": "120 pages of exercises",
          "feature_vi": "120 trang bài tập"
        }
      ],
      "is_purchased": true,
      "purchase_date": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### Get My Workbooks (Protected)

```http
GET /api/workbooks/my-workbooks
```

**Headers:** `Authorization: Bearer <user-token>`

**Response:**

```json
{
  "workbooks": [
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
      "is_lifetime_access": true,
      "purchased_at": "2024-01-01T00:00:00.000Z",
      "payment_amount": 699000,
      "payment_currency": "VND"
    }
  ],
  "total": 1
}
```

### Get Workbook Details

```http
GET /api/workbooks/:id
```

**Headers:** `Authorization: Bearer <user-token>` (optional - for purchase status)

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
  "features": [
    {
      "feature_en": "120 pages of exercises",
      "feature_vi": "120 trang bài tập"
    }
  ],
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment_en": "Great workbook!",
      "comment_vi": "Sách bài tập tuyệt vời!",
      "user": {
        "name": "John Doe"
      },
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "isPurchased": true,
  "purchase": {
    "id": "uuid",
    "payment_amount": 699000,
    "payment_currency": "VND",
    "purchase_date": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:**

- If user is authenticated, `isPurchased` and `purchase` fields will be included
- If user is not authenticated, `isPurchased` will be `false` and `purchase` will be `null`

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
  "notes": "Payment via Vietcombank",
  "amount": 699000,
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

**Note:** Free workbooks can be downloaded without purchase, but paid workbooks require purchase verification.

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

### Create Course with Content (Admin Only)

```http
POST /api/admin/courses/with-content
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Complete English Grammar Course",
  "title_vi": "Khóa Học Ngữ Pháp Tiếng Anh Hoàn Chỉnh",
  "description_en": "Complete English grammar course with exercises",
  "description_vi": "Khóa học ngữ pháp tiếng Anh hoàn chỉnh với bài tập",
  "price_usd": 99.0,
  "price_vnd": 2399000,
  "original_price_usd": 149.0,
  "original_price_vnd": 3599000,
  "level": "intermediate",
  "category": "grammar",
  "duration_hours": 20,
  "instructor_id": "uuid",
  "image_url": "https://example.com/grammar-course.jpg",
  "is_lifetime_access": true,
  "is_active": true,
  "sections": [
    {
      "title_en": "Basic Tenses",
      "title_vi": "Các Thì Cơ Bản",
      "description_en": "Learn basic English tenses",
      "description_vi": "Học các thì tiếng Anh cơ bản",
      "sort_order": 1,
      "is_active": true,
      "videos": [
        {
          "title_en": "Present Simple Tense",
          "title_vi": "Thì Hiện Tại Đơn",
          "description_en": "Learn present simple tense",
          "description_vi": "Học thì hiện tại đơn",
          "video_url": "https://youtube.com/watch?v=abc123",
          "quiz_url": "https://quizlet.com/quiz1",
          "duration_minutes": 15,
          "points_reward": 10,
          "sort_order": 1,
          "is_active": true
        },
        {
          "title_en": "Past Simple Tense",
          "title_vi": "Thì Quá Khứ Đơn",
          "description_en": "Learn past simple tense",
          "description_vi": "Học thì quá khứ đơn",
          "video_url": "https://youtube.com/watch?v=def456",
          "quiz_url": "https://quizlet.com/quiz2",
          "duration_minutes": 18,
          "points_reward": 12,
          "sort_order": 2,
          "is_active": true
        }
      ]
    },
    {
      "title_en": "Advanced Tenses",
      "title_vi": "Các Thì Nâng Cao",
      "description_en": "Learn advanced English tenses",
      "description_vi": "Học các thì tiếng Anh nâng cao",
      "sort_order": 2,
      "is_active": true,
      "videos": [
        {
          "title_en": "Present Perfect Tense",
          "title_vi": "Thì Hiện Tại Hoàn Thành",
          "description_en": "Learn present perfect tense",
          "description_vi": "Học thì hiện tại hoàn thành",
          "video_url": "https://youtube.com/watch?v=ghi789",
          "quiz_url": "https://quizlet.com/quiz3",
          "duration_minutes": 20,
          "points_reward": 15,
          "sort_order": 1,
          "is_active": true
        }
      ]
    }
  ]
}
```

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Complete English Grammar Course",
  "title_vi": "Khóa Học Ngữ Pháp Tiếng Anh Hoàn Chỉnh",
  "description_en": "Complete English grammar course with exercises",
  "price_usd": 99.0,
  "price_vnd": 2399000,
  "level": "intermediate",
  "category": "grammar",
  "duration_hours": 20,
  "total_videos": 3,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "sections": [
    {
      "id": "uuid",
      "title_en": "Basic Tenses",
      "title_vi": "Các Thì Cơ Bản",
      "sort_order": 1,
      "videos": [
        {
          "id": "uuid",
          "title_en": "Present Simple Tense",
          "title_vi": "Thì Hiện Tại Đơn",
          "video_url": "https://youtube.com/watch?v=abc123",
          "quiz_url": "https://quizlet.com/quiz1",
          "duration_minutes": 15,
          "points_reward": 10,
          "sort_order": 1
        }
      ]
    }
  ],
  "instructor": {
    "id": "uuid",
    "name": "John Smith"
  }
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

## 📖 Admin Workbook Management

### Get All Workbooks (Admin Only)

```http
GET /api/admin/workbooks
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
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "features": [...],
      "reviews": [...]
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

### Get Workbook Details (Admin Only)

```http
GET /api/admin/workbooks/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

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
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "features": [...],
  "reviews": [...]
}
```

### Create Workbook (Admin Only)

```http
POST /api/admin/workbooks
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Advanced Business Writing",
  "title_vi": "Viết Kinh doanh Nâng cao",
  "description_en": "Advanced business writing techniques",
  "description_vi": "Kỹ thuật viết kinh doanh nâng cao",
  "price_usd": 39.99,
  "price_vnd": 999000,
  "original_price_usd": 49.99,
  "original_price_vnd": 1199000,
  "level": "advanced",
  "category": "business",
  "pages": 150,
  "pdf_url": "https://example.com/advanced-business-writing.pdf",
  "cover_image_url": "https://example.com/workbook-cover.jpg",
  "is_free": false,
  "is_active": true
}
```

**Response:**

```json
{
  "id": "uuid",
  "title_en": "Advanced Business Writing",
  "title_vi": "Viết Kinh doanh Nâng cao",
  "description_en": "Advanced business writing techniques",
  "price_usd": 39.99,
  "price_vnd": 999000,
  "level": "advanced",
  "category": "business",
  "pages": 150,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Workbook (Admin Only)

```http
PUT /api/admin/workbooks/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "title_en": "Updated Workbook Title",
  "price_usd": 34.99,
  "price_vnd": 849000,
  "is_active": false
}
```

### Delete Workbook (Admin Only)

```http
DELETE /api/admin/workbooks/:id
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Workbook deleted successfully"
}
```

### Grant Workbook Access (Admin Only)

```http
POST /api/admin/workbooks/grant-access
```

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "user_id": "uuid",
  "workbook_id": "uuid",
  "payment_amount": 999000,
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
  "workbook": {
    "id": "uuid",
    "title_en": "Advanced Business Writing"
  },
  "payment_status": "completed",
  "payment_amount": 999000,
  "payment_currency": "VND",
  "purchase_date": "2024-01-01T00:00:00.000Z"
}
```

### Get User Workbook Access (Admin Only)

```http
GET /api/admin/users/:id/workbooks
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
[
  {
    "id": "uuid",
    "workbook": {
      "id": "uuid",
      "title_en": "Business Vocabulary Workbook",
      "title_vi": "Sách bài tập Từ vựng Kinh doanh"
    },
    "payment_status": "completed",
    "payment_amount": 699000,
    "payment_currency": "VND",
    "purchase_date": "2024-01-01T00:00:00.000Z"
  }
]
```

### Revoke Workbook Access (Admin Only)

```http
DELETE /api/admin/users/:userId/workbooks/:workbookId
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**

```json
{
  "message": "Workbook access revoked successfully"
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

## Development Setup

### Prerequisites

- Node.js 22+
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Local Development with Docker

1. Clone the repository
2. Copy environment variables:

   ```bash
   cp env.example .env
   ```

3. Start the development environment:

   ```bash
   docker-compose up -d
   ```

4. The API will be available at `http://localhost:3000`

### Local Development without Docker

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up PostgreSQL database and update environment variables in `.env`

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Railway Deployment

### Automatic Deployment

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.json` configuration
3. Set the following environment variables in Railway dashboard:

### Required Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (Railway will provide these automatically if you add PostgreSQL service)
POSTGRESHOST=your_railway_postgres_host
POSTGRESPORT=5432
POSTGRESUSER=your_railway_postgres_user
POSTGRESPASSWORD=your_railway_postgres_password
POSTGRESDB=your_railway_postgres_db
```

### Manual Deployment Steps

1. Install Railway CLI:

   ```bash
   yarn global add @railway/cli
   # or
   npm install -g @railway/cli
   ```

2. Login to Railway:

   ```bash
   railway login
   ```

3. Initialize Railway project:

   ```bash
   railway init
   ```

4. Add PostgreSQL service:

   ```bash
   railway add postgresql
   ```

5. Deploy:
   ```bash
   railway up
   ```

### Database Configuration

Railway automatically provides PostgreSQL connection variables. The application is configured to:

- Use SSL in production
- Auto-synchronize database schema (disable in production if needed)
- Connect using individual connection parameters or DATABASE_URL

## Environment Variables

| Variable           | Description       | Default       |
| ------------------ | ----------------- | ------------- |
| `NODE_ENV`         | Environment mode  | `development` |
| `PORT`             | Application port  | `3000`        |
| `POSTGRESHOST`     | Database host     | `localhost`   |
| `POSTGRESPORT`     | Database port     | `5432`        |
| `POSTGRESUSER`     | Database username | `postgres`    |
| `POSTGRESPASSWORD` | Database password | `postgres`    |
| `POSTGRESDB`       | Database name     | `fomo_db`     |

## Scripts

- `yarn build` - Build the application
- `yarn start` - Start production server
- `yarn start:dev` - Start development server with hot reload
- `yarn start:prod` - Start production server from built files

## Health Check

The application includes a health check endpoint at `/health` that Railway uses to monitor the service health.

## Database Schema

### Users Table

| Column    | Type      | Constraints                 |
| --------- | --------- | --------------------------- |
| id        | INTEGER   | PRIMARY KEY, AUTO INCREMENT |
| username  | VARCHAR   | UNIQUE, NOT NULL            |
| email     | VARCHAR   | UNIQUE, NOT NULL            |
| createdAt | TIMESTAMP | DEFAULT NOW()               |
| updatedAt | TIMESTAMP | DEFAULT NOW()               |

## Security Features

- Input validation using class-validator
- Unique constraints on username and email
- CORS enabled for cross-origin requests
- Non-root user in Docker container
- Health checks for monitoring

## Troubleshooting

### Common Issues

1. **Database connection failed**: Check environment variables and ensure PostgreSQL is running
2. **Port already in use**: Change the PORT environment variable
3. **Build fails**: Ensure all dependencies are installed with `yarn install`

### Logs

View application logs in Railway dashboard or use:

```bash
railway logs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
