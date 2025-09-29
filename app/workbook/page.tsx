'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WorkbookCard } from '@/components/workbook/workbook-card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter } from 'lucide-react'

export default function WorkbookPage() {
    const [locale, setLocale] = useState<string>('en')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLevel, setSelectedLevel] = useState('all')

    const workbooks = [
        {
            id: '1',
            title:
                locale === 'en'
                    ? 'Business English Essentials'
                    : 'Tiếng Anh thương mại cơ bản',
            description:
                locale === 'en'
                    ? 'Master essential business vocabulary and communication skills for professional success.'
                    : 'Thành thạo từ vựng và kỹ năng giao tiếp thương mại cần thiết cho thành công nghề nghiệp.',
            price: locale === 'en' ? '$29' : '699.000đ',
            originalPrice: locale === 'en' ? '$39' : '999.000đ',
            level: locale === 'en' ? 'Intermediate' : 'Trung cấp',
            pages: 120,
            rating: 4.8,
            reviews: 234,
            category: locale === 'en' ? 'Business' : 'Kinh doanh',
            image: '/placeholder.jpg',
            features: [
                locale === 'en'
                    ? '500+ business vocabulary words'
                    : '500+ từ vựng kinh doanh',
                locale === 'en' ? 'Email writing templates' : 'Mẫu viết email',
                locale === 'en'
                    ? 'Meeting conversation guides'
                    : 'Hướng dẫn hội thoại họp',
                locale === 'en'
                    ? 'Practice exercises with answers'
                    : 'Bài tập thực hành có đáp án',
            ],
        },
        {
            id: '2',
            title:
                locale === 'en'
                    ? 'Technical English for IT Professionals'
                    : 'Tiếng Anh kỹ thuật cho chuyên gia IT',
            description:
                locale === 'en'
                    ? 'Comprehensive guide to IT terminology and technical communication in English.'
                    : 'Hướng dẫn toàn diện về thuật ngữ IT và giao tiếp kỹ thuật bằng tiếng Anh.',
            price: locale === 'en' ? '$35' : '849.000đ',
            level: locale === 'en' ? 'Advanced' : 'Nâng cao',
            pages: 150,
            rating: 4.9,
            reviews: 189,
            category: locale === 'en' ? 'Technology' : 'Công nghệ',
            image: '/professional-man-teacher-technology.jpg',
            features: [
                locale === 'en'
                    ? 'Programming terminology'
                    : 'Thuật ngữ lập trình',
                locale === 'en'
                    ? 'System documentation templates'
                    : 'Mẫu tài liệu hệ thống',
                locale === 'en'
                    ? 'Technical presentation skills'
                    : 'Kỹ năng thuyết trình kỹ thuật',
                locale === 'en'
                    ? 'Code review vocabulary'
                    : 'Từ vựng review code',
            ],
        },
        {
            id: '3',
            title:
                locale === 'en'
                    ? 'Medical English Handbook'
                    : 'Cẩm nang tiếng Anh y khoa',
            description:
                locale === 'en'
                    ? 'Essential medical vocabulary and patient communication skills for healthcare professionals.'
                    : 'Từ vựng y khoa thiết yếu và kỹ năng giao tiếp với bệnh nhân cho chuyên gia y tế.',
            price: locale === 'en' ? '$32' : '799.000đ',
            level: locale === 'en' ? 'Intermediate' : 'Trung cấp',
            pages: 140,
            rating: 4.7,
            reviews: 156,
            category: locale === 'en' ? 'Healthcare' : 'Y tế',
            image: '/professional-woman-doctor-teacher.jpg',
            features: [
                locale === 'en'
                    ? 'Medical terminology dictionary'
                    : 'Từ điển thuật ngữ y khoa',
                locale === 'en'
                    ? 'Patient consultation phrases'
                    : 'Cụm từ tư vấn bệnh nhân',
                locale === 'en'
                    ? 'Medical report writing'
                    : 'Viết báo cáo y khoa',
                locale === 'en'
                    ? 'Emergency communication'
                    : 'Giao tiếp cấp cứu',
            ],
        },
        {
            id: '4',
            title:
                locale === 'en'
                    ? 'IELTS Writing Task 2 Mastery'
                    : 'Thành thạo IELTS Writing Task 2',
            description:
                locale === 'en'
                    ? 'Complete guide to achieving band 7+ in IELTS Writing Task 2 with proven strategies.'
                    : 'Hướng dẫn hoàn chỉnh để đạt band 7+ trong IELTS Writing Task 2 với chiến lược đã được chứng minh.',
            price: locale === 'en' ? '$25' : '599.000đ',
            level: locale === 'en' ? 'All Levels' : 'Mọi cấp độ',
            pages: 100,
            rating: 4.9,
            reviews: 312,
            category: locale === 'en' ? 'IELTS' : 'IELTS',
            image: '/professional-woman-teacher.png',
            features: [
                locale === 'en'
                    ? 'Essay structure templates'
                    : 'Mẫu cấu trúc bài luận',
                locale === 'en' ? 'Band 9 sample essays' : 'Bài mẫu band 9',
                locale === 'en'
                    ? 'Common topic vocabulary'
                    : 'Từ vựng chủ đề thông dụng',
                locale === 'en'
                    ? 'Examiner feedback analysis'
                    : 'Phân tích phản hồi giám khảo',
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

    const filteredWorkbooks = workbooks.filter((workbook) => {
        const matchesSearch = workbook.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === 'all' ||
            workbook.category.toLowerCase().includes(selectedCategory)
        const matchesLevel =
            selectedLevel === 'all' ||
            workbook.level.toLowerCase().includes(selectedLevel)
        return matchesSearch && matchesCategory && matchesLevel
    })

    const handlePurchase = (workbookId: string) => {
        // This would typically open a payment modal or redirect to payment page
        console.log('Purchasing workbook:', workbookId)
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
                                        Professional{' '}
                                        <span className="text-gradient">
                                            Workbooks
                                        </span>{' '}
                                        for{' '}
                                        <span className="text-gradient">
                                            Every Industry
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gradient">
                                            Sách bài tập
                                        </span>{' '}
                                        chuyên nghiệp cho{' '}
                                        <span className="text-gradient">
                                            mọi ngành nghề
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {locale === 'en'
                                    ? 'Download comprehensive workbooks designed by industry experts. Practice with real-world scenarios and build confidence in your professional English skills.'
                                    : 'Tải xuống sách bài tập toàn diện được thiết kế bởi các chuyên gia ngành. Thực hành với các tình huống thực tế và xây dựng sự tự tin trong kỹ năng tiếng Anh chuyên nghiệp.'}
                            </p>
                            <div className="flex items-center justify-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">500+</Badge>
                                    <span>
                                        {locale === 'en'
                                            ? 'Downloads'
                                            : 'Lượt tải'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">4.8★</Badge>
                                    <span>
                                        {locale === 'en'
                                            ? 'Average Rating'
                                            : 'Đánh giá trung bình'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">PDF</Badge>
                                    <span>
                                        {locale === 'en'
                                            ? 'Instant Download'
                                            : 'Tải ngay'}
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
                                            ? 'Search workbooks...'
                                            : 'Tìm kiếm sách bài tập...'
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

                {/* Workbooks Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredWorkbooks.map((workbook) => (
                                <WorkbookCard
                                    key={workbook.id}
                                    workbook={workbook}
                                    locale={locale}
                                    onPurchase={handlePurchase}
                                />
                            ))}
                        </div>

                        {filteredWorkbooks.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {locale === 'en'
                                        ? 'No workbooks found matching your criteria.'
                                        : 'Không tìm thấy sách bài tập phù hợp.'}
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
