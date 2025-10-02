# FOMO English - Backend Database Requirements

## Project Overview

FOMO English is a comprehensive English learning platform targeting Vietnamese professionals. The platform offers industry-specific English courses, workbooks, subscription plans, live classes, and community access. This document outlines the complete database schema and backend requirements for the system.

## Core Features

### 1. User Management & Authentication

- User registration and login
- Profile management
- Subscription status tracking
- Course purchase history
- Community membership status

### 2. Course Management

- Video-based courses with lifetime access
- Industry-specific content (Business, Technology, Healthcare, IELTS)
- Progress tracking and completion certificates
- Course ratings and reviews
- Instructor profiles

### 3. Workbook System

- Downloadable PDF workbooks
- Industry-specific vocabulary resources
- Free and premium content
- Purchase tracking

### 4. Subscription Plans

- Monthly, quarterly, and semi-annual plans
- Live class access
- Community group access
- Payment processing via bank transfer
- Subscription status management

### 5. Live Classes

- Scheduled live sessions via Google Meet/Zoom
- Class registration and attendance tracking
- Recording access for subscribers
- Instructor management

### 6. Community Features

- Telegram and Zalo group integration
- Community access based on subscription status
- Member communication and support

### 7. Free Services

- Industry-specific vocabulary PDF downloads
- No registration required for free resources
- Download tracking and analytics

### 8. Multi-language Support

- Vietnamese and English interface
- Localized content and pricing
- Currency support (USD and VND)

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subscription_status ENUM('none', 'active', 'expired') DEFAULT 'none',
    subscription_plan VARCHAR(50),
    subscription_expiry TIMESTAMP,
    joined_community BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_image_url VARCHAR(500),
    preferred_language ENUM('en', 'vi') DEFAULT 'en'
);
```

### Courses Table

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    price_vnd DECIMAL(12,0) NOT NULL,
    original_price_usd DECIMAL(10,2),
    original_price_vnd DECIMAL(12,0),
    level ENUM('beginner', 'intermediate', 'advanced', 'all_levels') NOT NULL,
    category ENUM('business', 'technology', 'healthcare', 'ielts') NOT NULL,
    duration_hours INTEGER NOT NULL,
    total_lessons INTEGER NOT NULL,
    instructor_id UUID REFERENCES instructors(id),
    image_url VARCHAR(500),
    is_lifetime_access BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Course Features Table

```sql
CREATE TABLE course_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    feature_en VARCHAR(255) NOT NULL,
    feature_vi VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0
);
```

### Instructors Table

```sql
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    bio_en TEXT,
    bio_vi TEXT,
    profile_image_url VARCHAR(500),
    specializations TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Course Purchases Table

```sql
CREATE TABLE user_course_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_amount DECIMAL(12,2) NOT NULL,
    payment_currency ENUM('USD', 'VND') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    UNIQUE(user_id, course_id)
);
```

### Course Progress Table

```sql
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

### Workbooks Table

```sql
CREATE TABLE workbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    price_usd DECIMAL(10,2),
    price_vnd DECIMAL(12,0),
    original_price_usd DECIMAL(10,2),
    original_price_vnd DECIMAL(12,0),
    level ENUM('beginner', 'intermediate', 'advanced', 'all_levels') NOT NULL,
    category ENUM('business', 'technology', 'healthcare', 'ielts') NOT NULL,
    pages INTEGER NOT NULL,
    pdf_url VARCHAR(500) NOT NULL,
    cover_image_url VARCHAR(500),
    is_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Workbook Features Table

```sql
CREATE TABLE workbook_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workbook_id UUID REFERENCES workbooks(id) ON DELETE CASCADE,
    feature_en VARCHAR(255) NOT NULL,
    feature_vi VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0
);
```

### User Workbook Purchases Table

```sql
CREATE TABLE user_workbook_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workbook_id UUID REFERENCES workbooks(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_amount DECIMAL(12,2),
    payment_currency ENUM('USD', 'VND'),
    download_count INTEGER DEFAULT 0,
    last_downloaded TIMESTAMP,
    UNIQUE(user_id, workbook_id)
);
```

### Subscription Plans Table

```sql
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    price_vnd DECIMAL(12,0) NOT NULL,
    original_price_usd DECIMAL(10,2),
    original_price_vnd DECIMAL(12,0),
    live_classes_count INTEGER NOT NULL,
    video_lessons_count INTEGER NOT NULL,
    support_level ENUM('email', 'priority', 'vip') NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscription Plan Features Table

```sql
CREATE TABLE subscription_plan_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    feature_en VARCHAR(255) NOT NULL,
    feature_vi VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0
);
```

### User Subscriptions Table

```sql
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    payment_amount DECIMAL(12,2) NOT NULL,
    payment_currency ENUM('USD', 'VND') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Live Classes Table

```sql
CREATE TABLE live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_vi TEXT,
    instructor_id UUID REFERENCES instructors(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link VARCHAR(500) NOT NULL,
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    recording_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Live Class Registrations Table

```sql
CREATE TABLE live_class_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES live_classes(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    attendance_duration_minutes INTEGER DEFAULT 0,
    UNIQUE(user_id, class_id)
);
```

### Free Downloads Table

```sql
CREATE TABLE free_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry ENUM('technology', 'business', 'healthcare', 'education', 'hospitality', 'engineering', 'marketing', 'legal') NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    pdf_url VARCHAR(500) NOT NULL,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Download Tracking Table

```sql
CREATE TABLE download_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES free_downloads(id),
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resource_type ENUM('free_vocabulary', 'workbook') NOT NULL
);
```

### Course Reviews Table

```sql
CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

### Workbook Reviews Table

```sql
CREATE TABLE workbook_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workbook_id UUID REFERENCES workbooks(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, workbook_id)
);
```

### Payment Requests Table

```sql
CREATE TABLE payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    notes TEXT,
    item_type ENUM('course', 'workbook', 'subscription') NOT NULL,
    item_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency ENUM('USD', 'VND') NOT NULL,
    payment_status ENUM('pending', 'verified', 'completed', 'failed') DEFAULT 'pending',
    bank_transfer_content VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Testimonials Table

```sql
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    role_vi VARCHAR(255) NOT NULL,
    company_en VARCHAR(255) NOT NULL,
    company_vi VARCHAR(255) NOT NULL,
    content_en TEXT NOT NULL,
    content_vi TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    avatar_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints Requirements

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Course Endpoints

- `GET /api/courses` - List all courses with filters
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/purchase` - Purchase a course
- `GET /api/courses/:id/progress` - Get user progress for a course
- `PUT /api/courses/:id/progress` - Update course progress

### Workbook Endpoints

- `GET /api/workbooks` - List all workbooks with filters
- `GET /api/workbooks/:id` - Get workbook details
- `POST /api/workbooks/:id/purchase` - Purchase a workbook
- `GET /api/workbooks/:id/download` - Download purchased workbook

### Subscription Endpoints

- `GET /api/subscription/plans` - List subscription plans
- `POST /api/subscription/subscribe` - Create subscription request
- `GET /api/subscription/status` - Get user subscription status
- `POST /api/subscription/cancel` - Cancel subscription

### Live Classes Endpoints

- `GET /api/live-classes` - List upcoming live classes
- `POST /api/live-classes/:id/register` - Register for a live class
- `GET /api/live-classes/my-classes` - Get user's registered classes
- `GET /api/live-classes/:id/recording` - Get class recording (subscribers only)

### Free Resources Endpoints

- `GET /api/free-resources/industries` - List available industries
- `GET /api/free-resources/:industry/download` - Download free vocabulary PDF
- `POST /api/free-resources/track-download` - Track download analytics

### Payment Endpoints

- `POST /api/payments/request` - Create payment request
- `GET /api/payments/status/:id` - Check payment status
- `POST /api/payments/verify` - Admin endpoint to verify payments

### Dashboard Endpoints

- `GET /api/dashboard/overview` - User dashboard overview
- `GET /api/dashboard/courses` - User's purchased courses
- `GET /api/dashboard/progress` - Learning progress summary
- `GET /api/dashboard/schedule` - Upcoming live classes

## Technical Requirements

### Database

- **PostgreSQL 14+** recommended for robust JSON support and performance
- **Redis** for session management and caching
- **AWS S3** or similar for file storage (PDFs, videos, images)

### Authentication

- JWT-based authentication
- Refresh token mechanism
- Password hashing with bcrypt
- Session management with Redis

### File Storage

- PDF workbooks and vocabulary files
- Course video content (consider CDN)
- User profile images
- Course and instructor images

### Payment Processing

- Bank transfer verification system
- Payment status tracking
- Automated email notifications
- Admin panel for payment verification

### Email System

- Welcome emails for new users
- Payment confirmation emails
- Subscription activation notifications
- Live class reminders
- Community group invitations

### Caching Strategy

- Course listings and details
- User session data
- Frequently accessed content
- Download counters

### Security Considerations

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting for API endpoints
- Secure file upload handling

### Monitoring & Analytics

- User engagement tracking
- Course completion rates
- Download analytics
- Payment conversion rates
- Live class attendance metrics

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fomo_english
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=fomo-english-files
AWS_REGION=ap-southeast-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment
BANK_ACCOUNT_NUMBER=1234567890
BANK_ACCOUNT_NAME=FOMO ENGLISH EDUCATION
BANK_NAME=Vietcombank

# External Services
GOOGLE_MEET_API_KEY=your-google-meet-api-key
ZOOM_API_KEY=your-zoom-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://fomoenglish.com
ADMIN_EMAIL=admin@fomoenglish.com
```

## Initial Data Setup

### Sample Subscription Plans

```sql
INSERT INTO subscription_plans (name_en, name_vi, description_en, description_vi, duration_months, price_usd, price_vnd, live_classes_count, video_lessons_count, support_level) VALUES
('Monthly Plan', 'Gói tháng', 'Perfect for getting started', 'Hoàn hảo để bắt đầu', 1, 49.00, 1199000, 4, 50, 'email'),
('3-Month Plan', 'Gói 3 tháng', 'Most popular choice', 'Lựa chọn phổ biến nhất', 3, 129.00, 3099000, 14, 150, 'priority'),
('6-Month Plan', 'Gói 6 tháng', 'Best value for serious learners', 'Giá trị tốt nhất cho người học nghiêm túc', 6, 239.00, 5799000, 30, 300, 'vip');
```

### Sample Industries for Free Downloads

```sql
INSERT INTO free_downloads (industry, title_en, title_vi, description_en, description_vi, pdf_url) VALUES
('technology', 'IT & Technology Vocabulary', 'Từ vựng CNTT & Công nghệ', 'Essential vocabulary for IT professionals', 'Từ vựng thiết yếu cho chuyên gia CNTT', '/downloads/it-vocabulary.pdf'),
('business', 'Business & Finance Vocabulary', 'Từ vựng Kinh doanh & Tài chính', 'Key terms for business professionals', 'Thuật ngữ chính cho chuyên gia kinh doanh', '/downloads/business-vocabulary.pdf'),
('healthcare', 'Healthcare & Medical Vocabulary', 'Từ vựng Y tế & Sức khỏe', 'Medical terminology for healthcare workers', 'Thuật ngữ y khoa cho nhân viên y tế', '/downloads/healthcare-vocabulary.pdf');
```

This comprehensive database schema and requirements document provides everything needed for backend developers to build a robust system supporting all features of the FOMO English platform.
