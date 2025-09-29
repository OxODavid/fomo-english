'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowRight,
    Download,
    Star,
    Users,
    BookOpen,
    Sparkles,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function HeroSection() {
    const { language, t } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-cyan-100" />
            <div className="absolute inset-0 primary-gradient opacity-10" />

            <div className="absolute top-20 left-10 w-32 h-32 gradient-blue-light rounded-full opacity-20 animate-float" />
            <div
                className="absolute top-40 right-20 w-24 h-24 gradient-cyan-blue rounded-full opacity-30 animate-float"
                style={{ animationDelay: '2s' }}
            />
            <div
                className="absolute bottom-20 left-1/4 w-20 h-20 gradient-blue-dark rounded-full opacity-25 animate-float"
                style={{ animationDelay: '4s' }}
            />

            <div className="container mx-auto px-4 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div
                        className={`space-y-8 ${
                            isVisible ? 'animate-slide-in-up' : 'opacity-0'
                        }`}
                    >
                        <div className="space-y-4">
                            <Badge
                                variant="secondary"
                                className="w-fit primary-gradient text-white border-0 animate-pulse-glow"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                {t(
                                    'home.main.badge',
                                    '🚀 Khóa học mới',
                                    '🚀 New Course Available'
                                )}
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                                {language === 'vi' ? (
                                    <>
                                        Thành thạo{' '}
                                        <span className="text-gradient">
                                            tiếng Anh
                                        </span>{' '}
                                        với{' '}
                                        <span className="text-gradient">
                                            sự tự tin
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Master{' '}
                                        <span className="text-gradient">
                                            English
                                        </span>{' '}
                                        with{' '}
                                        <span className="text-gradient">
                                            Confidence
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground text-pretty">
                                {t(
                                    'home.main.description',
                                    'Tham gia cùng hàng nghìn học viên trên hành trình thành thạo tiếng Anh với các khóa học toàn diện, sách bài tập và hướng dẫn chuyên môn.',
                                    'Join thousands of learners on their journey to English fluency with our comprehensive courses, workbooks, and expert guidance.'
                                )}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2 hover-lift p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                                <Users className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">
                                    10,000+{' '}
                                    {t(
                                        'home.stats.students',
                                        'Học viên',
                                        'Students'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 hover-lift p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium">
                                    4.9/5{' '}
                                    {t(
                                        'home.stats.rating',
                                        'Đánh giá',
                                        'Rating'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 hover-lift p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">
                                    50+{' '}
                                    {t(
                                        'home.stats.courses',
                                        'Khóa học',
                                        'Courses'
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="primary-gradient text-white border-0 hover-lift animate-pulse-glow"
                            >
                                {t(
                                    'home.main.startLearning',
                                    'Học miễn phí ngay',
                                    'Start Learning Free'
                                )}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="hover-lift border-2 border-primary/20 hover:border-primary/40 bg-transparent"
                            >
                                {t(
                                    'home.main.viewCourses',
                                    'Xem khóa học',
                                    'View Courses'
                                )}
                            </Button>
                        </div>
                    </div>

                    <div
                        className={`relative ${
                            isVisible ? 'animate-fade-in' : 'opacity-0'
                        }`}
                        style={{ animationDelay: '0.3s' }}
                    >
                        <Card className="p-6 shadow-2xl hover-lift bg-white/80 backdrop-blur-sm border-0">
                            <CardContent className="p-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gradient-blue">
                                        {t(
                                            'home.main.freeDownload',
                                            'Tải từ vựng miễn phí',
                                            'Free Vocabulary Download'
                                        )}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="gradient-blue-dark text-white border-0"
                                    >
                                        {t(
                                            'home.main.free',
                                            'Miễn phí',
                                            'Free'
                                        )}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        'home.main.downloadDescription',
                                        'Chọn ngành nghề của bạn và nhận PDF từ vựng chuyên ngành ngay lập tức.',
                                        'Choose your industry and get specialized vocabulary PDFs instantly.'
                                    )}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { en: 'Technology', vi: 'Công nghệ' },
                                        { en: 'Business', vi: 'Kinh doanh' },
                                        { en: 'Healthcare', vi: 'Y tế' },
                                        { en: 'Education', vi: 'Giáo dục' },
                                    ].map((industry) => (
                                        <Button
                                            key={industry.en}
                                            variant="ghost"
                                            size="sm"
                                            className="justify-start hover:primary-gradient hover:text-white transition-all duration-300"
                                        >
                                            <Download className="mr-2 h-3 w-3" />
                                            {language === 'vi'
                                                ? industry.vi
                                                : industry.en}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="absolute -top-4 -right-4 w-20 h-20 gradient-blue-light rounded-full opacity-30 animate-float" />
                        <div
                            className="absolute -bottom-4 -left-4 w-16 h-16 gradient-cyan-blue rounded-full opacity-40 animate-float"
                            style={{ animationDelay: '1s' }}
                        />
                        <div
                            className="absolute top-1/2 -right-8 w-12 h-12 gradient-blue-dark rounded-full opacity-25 animate-float"
                            style={{ animationDelay: '3s' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
