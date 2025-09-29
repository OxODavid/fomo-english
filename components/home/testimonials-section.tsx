'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const testimonials = [
    {
        id: 1,
        name: 'Nguyễn Minh Anh',
        nameEn: 'Nguyen Minh Anh',
        role: 'Marketing Manager',
        roleEn: 'Marketing Manager',
        company: 'Tech Startup',
        companyEn: 'Tech Startup',
        content:
            'FOMO English đã giúp tôi cải thiện đáng kể khả năng tiếng Anh trong công việc. Từ vựng chuyên ngành rất hữu ích!',
        contentEn:
            'FOMO English has significantly improved my English skills at work. The specialized vocabulary is very helpful!',
        rating: 5,
        avatar: '/placeholder-user.jpg',
    },
    {
        id: 2,
        name: 'Trần Văn Hùng',
        nameEn: 'Tran Van Hung',
        role: 'Software Developer',
        roleEn: 'Software Developer',
        company: 'FPT Software',
        companyEn: 'FPT Software',
        content:
            'Khóa học IT English rất thực tế. Tôi có thể tự tin giao tiếp với khách hàng quốc tế hơn.',
        contentEn:
            'The IT English course is very practical. I can communicate more confidently with international clients.',
        rating: 5,
        avatar: '/placeholder.svg',
    },
    {
        id: 3,
        name: 'Lê Thị Mai',
        nameEn: 'Le Thi Mai',
        role: 'Sales Executive',
        roleEn: 'Sales Executive',
        company: 'Vingroup',
        companyEn: 'Vingroup',
        content:
            'Phương pháp học qua tình huống thực tế giúp tôi nhớ từ vựng lâu hơn. Rất recommend!',
        contentEn:
            'Learning through real-life scenarios helps me remember vocabulary longer. Highly recommend!',
        rating: 5,
        avatar: '/placeholder.svg',
    },
    {
        id: 4,
        name: 'Phạm Đức Thành',
        nameEn: 'Pham Duc Thanh',
        role: 'Business Analyst',
        roleEn: 'Business Analyst',
        company: 'Vietcombank',
        companyEn: 'Vietcombank',
        content:
            'Từ vựng ngân hàng và tài chính rất chuyên sâu. Giúp tôi thăng tiến trong công việc.',
        contentEn:
            'Banking and finance vocabulary is very comprehensive. It helped me advance in my career.',
        rating: 5,
        avatar: '/placeholder.svg',
    },
    {
        id: 5,
        name: 'Hoàng Thị Lan',
        nameEn: 'Hoang Thi Lan',
        role: 'HR Manager',
        roleEn: 'HR Manager',
        company: 'Samsung Vietnam',
        companyEn: 'Samsung Vietnam',
        content:
            'Workbook rất tiện lợi, có thể học mọi lúc mọi nơi. Nội dung cập nhật liên tục.',
        contentEn:
            'The workbook is very convenient, can study anytime anywhere. Content is constantly updated.',
        rating: 5,
        avatar: '/placeholder.svg',
    },
    {
        id: 6,
        name: 'Vũ Minh Tuấn',
        nameEn: 'Vu Minh Tuan',
        role: 'Project Manager',
        roleEn: 'Project Manager',
        company: 'Grab Vietnam',
        companyEn: 'Grab Vietnam',
        content:
            'Giá cả hợp lý, chất lượng tốt. Đặc biệt là phần từ vựng logistics rất hữu ích.',
        contentEn:
            'Reasonable price, good quality. Especially the logistics vocabulary is very useful.',
        rating: 5,
        avatar: '/placeholder.svg',
    },
]

export default function TestimonialsSection() {
    const { language, t } = useLanguage()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const visibleTestimonials = [
        testimonials[currentIndex],
        testimonials[(currentIndex + 1) % testimonials.length],
        testimonials[(currentIndex + 2) % testimonials.length],
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100">
            <div className="container mx-auto px-4">
                <div
                    className={`text-center mb-16 ${
                        isVisible ? 'animate-slide-in-up' : 'opacity-0'
                    }`}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                        {t(
                            'home.testimonials.title',
                            'Học viên nói gì về FOMO English?',
                            'What do students say about FOMO English?'
                        )}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        {t(
                            'home.testimonials.subtitle',
                            'Hàng nghìn học viên đã tin tưởng và đạt được mục tiêu tiếng Anh của mình',
                            'Thousands of students have trusted us and achieved their English goals'
                        )}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {visibleTestimonials.map((testimonial, index) => (
                        <Card
                            key={testimonial.id}
                            className={`hover-lift animate-fade-in bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                                index === 1
                                    ? 'md:scale-105 animate-pulse-glow'
                                    : ''
                            }`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <CardContent className="p-8">
                                <div className="flex items-center mb-4">
                                    <Quote className="w-8 h-8 text-primary/30 mr-3" />
                                    <div className="flex">
                                        {[...Array(testimonial.rating)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    "
                                    {language === 'vi'
                                        ? testimonial.content
                                        : testimonial.contentEn}
                                    "
                                </p>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center text-white font-bold text-lg mr-4">
                                        {(language === 'vi'
                                            ? testimonial.name
                                            : testimonial.nameEn
                                        ).charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {language === 'vi'
                                                ? testimonial.name
                                                : testimonial.nameEn}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {language === 'vi'
                                                ? testimonial.role
                                                : testimonial.roleEn}{' '}
                                            •{' '}
                                            {language === 'vi'
                                                ? testimonial.company
                                                : testimonial.companyEn}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                Math.floor(index / 3) ===
                                Math.floor(currentIndex / 3)
                                    ? 'bg-primary scale-125'
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
