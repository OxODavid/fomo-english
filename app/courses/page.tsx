'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseCard } from '@/components/courses/course-card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Play, Users, Clock } from 'lucide-react'

export default function CoursesPage() {
    const [locale, setLocale] = useState<string>('en')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLevel, setSelectedLevel] = useState('all')

    const courses = [
        {
            id: '1',
            title:
                locale === 'en'
                    ? 'Complete Business English Mastery'
                    : 'Thành thạo hoàn toàn tiếng Anh thương mại',
            description:
                locale === 'en'
                    ? 'Comprehensive course covering all aspects of business communication, from emails to presentations.'
                    : 'Khóa học toàn diện bao gồm tất cả các khía cạnh của giao tiếp thương mại, từ email đến thuyết trình.',
            price: locale === 'en' ? '$149' : '3.599.000đ',
            originalPrice: locale === 'en' ? '$199' : '4.799.000đ',
            level: locale === 'en' ? 'Intermediate' : 'Trung cấp',
            duration: '12 hours',
            lessons: 48,
            students: 2340,
            rating: 4.9,
            reviews: 456,
            category: locale === 'en' ? 'Business' : 'Kinh doanh',
            image: '/placeholder.jpg',
            instructor: 'Sarah Johnson',
            isLifetime: true,
            features: [
                locale === 'en'
                    ? 'Professional email writing'
                    : 'Viết email chuyên nghiệp',
                locale === 'en'
                    ? 'Meeting and presentation skills'
                    : 'Kỹ năng họp và thuyết trình',
                locale === 'en'
                    ? 'Negotiation techniques'
                    : 'Kỹ thuật đàm phán',
                locale === 'en'
                    ? 'Business vocabulary mastery'
                    : 'Thành thạo từ vựng kinh doanh',
            ],
        },
        {
            id: '2',
            title:
                locale === 'en'
                    ? 'Technical English for Software Engineers'
                    : 'Tiếng Anh kỹ thuật cho kỹ sư phần mềm',
            description:
                locale === 'en'
                    ? 'Master technical communication skills essential for software development teams and international projects.'
                    : 'Thành thạo kỹ năng giao tiếp kỹ thuật cần thiết cho các nhóm phát triển phần mềm và dự án quốc tế.',
            price: locale === 'en' ? '$179' : '4.299.000đ',
            level: locale === 'en' ? 'Advanced' : 'Nâng cao',
            duration: '15 hours',
            lessons: 52,
            students: 1890,
            rating: 4.8,
            reviews: 234,
            category: locale === 'en' ? 'Technology' : 'Công nghệ',
            image: '/professional-man-teacher-technology.jpg',
            instructor: 'Michael Chen',
            isLifetime: true,
            features: [
                locale === 'en'
                    ? 'Code documentation writing'
                    : 'Viết tài liệu code',
                locale === 'en'
                    ? 'Technical presentations'
                    : 'Thuyết trình kỹ thuật',
                locale === 'en' ? 'API documentation' : 'Tài liệu API',
                locale === 'en'
                    ? 'Agile methodology vocabulary'
                    : 'Từ vựng phương pháp Agile',
            ],
        },
        {
            id: '3',
            title:
                locale === 'en'
                    ? 'Medical English for Healthcare Professionals'
                    : 'Tiếng Anh y khoa cho chuyên gia y tế',
            description:
                locale === 'en'
                    ? 'Comprehensive medical English course for doctors, nurses, and healthcare professionals.'
                    : 'Khóa học tiếng Anh y khoa toàn diện cho bác sĩ, y tá và chuyên gia chăm sóc sức khỏe.',
            price: locale === 'en' ? '$159' : '3.799.000đ',
            level: locale === 'en' ? 'Intermediate' : 'Trung cấp',
            duration: '14 hours',
            lessons: 45,
            students: 1567,
            rating: 4.7,
            reviews: 189,
            category: locale === 'en' ? 'Healthcare' : 'Y tế',
            image: '/professional-woman-doctor-teacher.jpg',
            instructor: 'Dr. Emily Rodriguez',
            isLifetime: true,
            features: [
                locale === 'en'
                    ? 'Patient consultation skills'
                    : 'Kỹ năng tư vấn bệnh nhân',
                locale === 'en' ? 'Medical terminology' : 'Thuật ngữ y khoa',
                locale === 'en'
                    ? 'Case study discussions'
                    : 'Thảo luận ca bệnh',
                locale === 'en'
                    ? 'Medical report writing'
                    : 'Viết báo cáo y khoa',
            ],
        },
        {
            id: '4',
            title:
                locale === 'en'
                    ? 'IELTS Speaking Band 7+ Masterclass'
                    : 'Masterclass IELTS Speaking Band 7+',
            description:
                locale === 'en'
                    ? 'Intensive course designed to help you achieve band 7+ in IELTS Speaking with proven strategies.'
                    : 'Khóa học chuyên sâu được thiết kế để giúp bạn đạt band 7+ trong IELTS Speaking với chiến lược đã được chứng minh.',
            price: locale === 'en' ? '$99' : '2.399.000đ',
            level: locale === 'en' ? 'All Levels' : 'Mọi cấp độ',
            duration: '8 hours',
            lessons: 32,
            students: 3456,
            rating: 4.9,
            reviews: 567,
            category: 'IELTS',
            image: '/professional-woman-teacher.png',
            instructor: 'Sarah Johnson',
            isLifetime: true,
            features: [
                locale === 'en'
                    ? 'Mock speaking tests'
                    : 'Bài kiểm tra nói mô phỏng',
                locale === 'en'
                    ? 'Fluency improvement techniques'
                    : 'Kỹ thuật cải thiện độ trôi chảy',
                locale === 'en'
                    ? 'Advanced vocabulary strategies'
                    : 'Chiến lược từ vựng nâng cao',
                locale === 'en'
                    ? 'Pronunciation masterclass'
                    : 'Masterclass phát âm',
            ],
        },
    ]

    const categories = [
        {
            value: 'all',
            label: locale === 'en' ? 'All Categories' : 'Tất cả danh mục',
        },
        {
            value: 'business',
            label: locale === 'en' ? 'Business' : 'Kinh doanh',
        },
        {
            value: 'technology',
            label: locale === 'en' ? 'Technology' : 'Công nghệ',
        },
        { value: 'healthcare', label: locale === 'en' ? 'Healthcare' : 'Y tế' },
        { value: 'ielts', label: 'IELTS' },
    ]

    const levels = [
        { value: 'all', label: locale === 'en' ? 'All Levels' : 'Mọi cấp độ' },
        { value: 'beginner', label: locale === 'en' ? 'Beginner' : 'Cơ bản' },
        {
            value: 'intermediate',
            label: locale === 'en' ? 'Intermediate' : 'Trung cấp',
        },
        { value: 'advanced', label: locale === 'en' ? 'Advanced' : 'Nâng cao' },
    ]

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === 'all' ||
            course.category.toLowerCase().includes(selectedCategory)
        const matchesLevel =
            selectedLevel === 'all' ||
            course.level.toLowerCase().includes(selectedLevel)
        return matchesSearch && matchesCategory && matchesLevel
    })

    const handleEnroll = (courseId: string) => {
        // This would typically open a payment modal or redirect to payment page
        console.log('Enrolling in course:', courseId)
        alert(
            locale === 'en'
                ? 'Redirecting to payment...'
                : 'Chuyển hướng đến thanh toán...'
        )
    }

    return (
        <div className="min-h-screen">
            <Header locale={locale} onLocaleChange={setLocale} />
            <main>
                {/* Hero Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                                {locale === 'en' ? (
                                    <>
                                        Master{' '}
                                        <span className="text-gradient">
                                            Professional English
                                        </span>{' '}
                                        with{' '}
                                        <span className="text-gradient">
                                            Expert-Led Courses
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Thành thạo{' '}
                                        <span className="text-gradient">
                                            tiếng Anh chuyên nghiệp
                                        </span>{' '}
                                        với{' '}
                                        <span className="text-gradient">
                                            khóa học do chuyên gia dẫn dắt
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {locale === 'en'
                                    ? 'Comprehensive video courses designed by industry experts. Learn at your own pace with lifetime access to all materials.'
                                    : 'Khóa học video toàn diện được thiết kế bởi các chuyên gia ngành. Học theo tốc độ của bạn với quyền truy cập trọn đời vào tất cả tài liệu.'}
                            </p>
                            <div className="flex items-center justify-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Play className="h-4 w-4 text-primary" />
                                    <span>
                                        200+{' '}
                                        {locale === 'en'
                                            ? 'Video Lessons'
                                            : 'Bài học video'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>
                                        10,000+{' '}
                                        {locale === 'en'
                                            ? 'Students'
                                            : 'Học viên'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>
                                        {locale === 'en'
                                            ? 'Lifetime Access'
                                            : 'Truy cập trọn đời'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={
                                        locale === 'en'
                                            ? 'Search courses...'
                                            : 'Tìm kiếm khóa học...'
                                    }
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-48">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedLevel}
                                    onValueChange={setSelectedLevel}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem
                                                key={level.value}
                                                value={level.value}
                                            >
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    locale={locale}
                                    onEnroll={handleEnroll}
                                />
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {locale === 'en'
                                        ? 'No courses found matching your criteria.'
                                        : 'Không tìm thấy khóa học phù hợp.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
