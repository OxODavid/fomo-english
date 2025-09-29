'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    BookOpen,
    Users,
    Video,
    MessageCircle,
    User,
    Building,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

export function ServicesOverview() {
    const { language, t } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const services = [
        {
            icon: BookOpen,
            title: t(
                'home.services.courses.title',
                'Khóa học một lần',
                'Premium Courses'
            ),
            description: t(
                'home.services.courses.description',
                'Khóa học video toàn diện với quyền truy cập trọn đời',
                'Comprehensive video courses with lifetime access'
            ),
            price: t(
                'home.services.courses.price',
                'Từ 1.200.000đ',
                'From $49'
            ),
            badge: t(
                'home.services.courses.badge',
                'Truy cập trọn đời',
                'Lifetime Access'
            ),
            href: '/courses',
            gradient: 'primary-gradient',
        },
        {
            icon: Users,
            title: t(
                'home.services.subscription.title',
                'Đăng ký hàng tháng',
                'Monthly Subscription'
            ),
            description: t(
                'home.services.subscription.description',
                'Lớp học trực tiếp, truy cập cộng đồng và hỗ trợ cá nhân hóa',
                'Live classes, community access, and personalized support'
            ),
            price: t(
                'home.services.subscription.price',
                '699.000đ/tháng',
                '$29/month'
            ),
            badge: t(
                'home.services.subscription.badge',
                'Truy cập cộng đồng',
                'Community Access'
            ),
            href: '/subscription',
            gradient: 'gradient-blue-dark',
        },
        {
            icon: Video,
            title: t(
                'home.services.live.title',
                'Lớp học trực tuyến',
                'Live Online Classes'
            ),
            description: t(
                'home.services.live.description',
                'Buổi học tương tác qua Google Meet/Zoom. Đặt lịch học dễ dàng.',
                'Interactive sessions via Google Meet/Zoom. Book your schedule easily.'
            ),
            price: t('home.services.live.price', 'Đã bao gồm', 'Included'),
            badge: t('home.services.live.badge', 'Tương tác', 'Interactive'),
            href: '/subscription',
            gradient: 'gradient-blue-light',
        },
        {
            icon: MessageCircle,
            title: t(
                'home.services.community.title',
                'Nhóm cộng đồng',
                'Community Groups'
            ),
            description: t(
                'home.services.community.description',
                'Tham gia nhóm Zalo/Telegram để học tập và hỗ trợ liên tục.',
                'Join Zalo/Telegram groups for continuous learning and support.'
            ),
            price: t(
                'home.services.community.price',
                'Miễn phí với gói đăng ký',
                'Free with subscription'
            ),
            badge: t(
                'home.services.community.badge',
                'Hỗ trợ 24/7',
                '24/7 Support'
            ),
            href: '/subscription',
            gradient: 'gradient-blue-dark',
        },
        {
            icon: User,
            title: t(
                'home.services.coaching.title',
                'Coaching 1:1',
                '1:1 Coaching'
            ),
            description: t(
                'home.services.coaching.description',
                'Buổi coaching cá nhân được thiết kế riêng cho nhu cầu và mục tiêu của bạn.',
                'Personal coaching sessions tailored to your specific needs and goals.'
            ),
            price: t(
                'home.services.coaching.price',
                'Liên hệ để biết giá',
                'Contact for pricing'
            ),
            badge: t(
                'home.services.coaching.badge',
                'Cá nhân hóa',
                'Personalized'
            ),
            href: '/contact',
            gradient: 'primary-gradient',
        },
        {
            icon: Building,
            title: t(
                'home.services.corporate.title',
                'Đào tạo doanh nghiệp',
                'Corporate Training'
            ),
            description: t(
                'home.services.corporate.description',
                'Chương trình đào tạo tiếng Anh tùy chỉnh cho doanh nghiệp và tổ chức.',
                'Customized English training programs for businesses and organizations.'
            ),
            price: t(
                'home.services.corporate.price',
                'Liên hệ để báo giá',
                'Contact for quote'
            ),
            badge: t(
                'home.services.corporate.badge',
                'Giải pháp tùy chỉnh',
                'Custom Solutions'
            ),
            href: '/contact',
            gradient: 'gradient-blue-light',
        },
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100">
            <div className="container mx-auto px-4">
                <div
                    className={`text-center space-y-4 mb-12 ${
                        isVisible ? 'animate-slide-in-up' : 'opacity-0'
                    }`}
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
                        {t(
                            'home.services.title',
                            'Dịch vụ của chúng tôi',
                            'Our Services'
                        )}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t(
                            'home.services.subtitle',
                            'Chọn con đường học tập phù hợp với mục tiêu và lịch trình của bạn',
                            'Choose the learning path that fits your goals and schedule'
                        )}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        return (
                            <Card
                                key={index}
                                className={`relative group hover-lift bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                                    isVisible ? 'animate-fade-in' : 'opacity-0'
                                }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`w-12 h-12 ${service.gradient} rounded-lg flex items-center justify-center animate-pulse-glow`}
                                        >
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/90 text-gray-700"
                                        >
                                            {service.badge}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg text-gradient-blue">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-primary text-lg">
                                            {service.price}
                                        </span>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Link href={service.href}>
                                                {t(
                                                    'home.services.learnMore',
                                                    'Tìm hiểu thêm',
                                                    'Learn More'
                                                )}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div
                    className={`text-center mt-12 ${
                        isVisible ? 'animate-slide-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: '0.8s' }}
                >
                    <Button
                        size="lg"
                        className="primary-gradient text-white border-0 hover-lift animate-pulse-glow"
                    >
                        {t(
                            'home.services.viewAll',
                            'Xem tất cả dịch vụ',
                            'View All Services'
                        )}
                    </Button>
                </div>
            </div>
        </section>
    )
}
