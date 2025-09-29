'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StorySection } from '@/components/about/story-section'
import { MissionSection } from '@/components/about/mission-section'
import { TeamSection } from '@/components/about/team-section'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
    const [locale, setLocale] = useState<string>('en')

    return (
        <div className="min-h-screen">
            <Header locale={locale} onLocaleChange={setLocale} />
            <main>
                {/* Hero Section */}
                <section className="py-20 lg:py-32 bg-muted/30">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                                {locale === 'en' ? (
                                    <>
                                        Empowering{' '}
                                        <span className="text-gradient">
                                            Vietnamese Professionals
                                        </span>{' '}
                                        with{' '}
                                        <span className="text-gradient">
                                            Global English Skills
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Trao quyền cho{' '}
                                        <span className="text-gradient">
                                            chuyên gia Việt Nam
                                        </span>{' '}
                                        với{' '}
                                        <span className="text-gradient">
                                            kỹ năng tiếng Anh toàn cầu
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {locale === 'en'
                                    ? "We bridge the gap between traditional English learning and the practical skills needed in today's global workplace."
                                    : 'Chúng tôi thu hẹp khoảng cách giữa việc học tiếng Anh truyền thống và các kỹ năng thực tế cần thiết trong môi trường làm việc toàn cầu ngày nay.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="primary-gradient text-white"
                                >
                                    <Link href="/courses">
                                        {locale === 'en'
                                            ? 'Explore Courses'
                                            : 'Khám phá khóa học'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="/contact">
                                        {locale === 'en'
                                            ? 'Contact Us'
                                            : 'Liên hệ'}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <StorySection locale={locale} />
                <MissionSection locale={locale} />
                <TeamSection locale={locale} />

                {/* CTA Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold">
                                {locale === 'en'
                                    ? 'Ready to Start Your Journey?'
                                    : 'Sẵn sàng bắt đầu hành trình?'}
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                {locale === 'en'
                                    ? 'Join thousands of professionals who have transformed their careers with FOMO English.'
                                    : 'Tham gia cùng hàng nghìn chuyên gia đã thay đổi sự nghiệp với FOMO English.'}
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="primary-gradient text-white"
                            >
                                <Link href="/">
                                    {locale === 'en'
                                        ? 'Get Started Today'
                                        : 'Bắt đầu ngay hôm nay'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
