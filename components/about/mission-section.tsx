import { Card, CardContent } from '@/components/ui/card'
import { Target, Heart, Lightbulb, Users } from 'lucide-react'

interface MissionSectionProps {
    locale?: string
}

export function MissionSection({ locale = 'en' }: MissionSectionProps) {
    const values = [
        {
            icon: Target,
            title: locale === 'en' ? 'Our Mission' : 'Sứ mệnh',
            description:
                locale === 'en'
                    ? 'To empower Vietnamese learners with practical English skills that open doors to global opportunities and career advancement.'
                    : 'Trao quyền cho người học Việt Nam với kỹ năng tiếng Anh thực tế mở ra cơ hội toàn cầu và thăng tiến nghề nghiệp.',
        },
        {
            icon: Heart,
            title: locale === 'en' ? 'Our Values' : 'Giá trị cốt lõi',
            description:
                locale === 'en'
                    ? 'We believe in accessible, practical education that respects your time and delivers real results through proven methodologies.'
                    : 'Chúng tôi tin vào giáo dục dễ tiếp cận, thực tế, tôn trọng thời gian và mang lại kết quả thực sự qua phương pháp đã được chứng minh.',
        },
        {
            icon: Lightbulb,
            title: locale === 'en' ? 'Our Approach' : 'Phương pháp',
            description:
                locale === 'en'
                    ? 'Industry-focused learning combined with interactive community support to ensure you master English in your professional context.'
                    : 'Học tập tập trung vào ngành nghề kết hợp với hỗ trợ cộng đồng tương tác để đảm bảo bạn thành thạo tiếng Anh trong bối cảnh chuyên môn.',
        },
        {
            icon: Users,
            title: locale === 'en' ? 'Our Community' : 'Cộng đồng',
            description:
                locale === 'en'
                    ? 'A supportive network of learners and professionals helping each other achieve English fluency and career success.'
                    : 'Một mạng lưới hỗ trợ gồm người học và chuyên gia giúp đỡ lẫn nhau đạt được sự thành thạo tiếng Anh và thành công trong sự nghiệp.',
        },
    ]

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold">
                        {locale === 'en'
                            ? 'Why Choose FOMO English?'
                            : 'Tại sao chọn FOMO English?'}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {locale === 'en'
                            ? "We're more than just an English learning platform. We're your partners in professional growth."
                            : 'Chúng tôi không chỉ là một nền tảng học tiếng Anh. Chúng tôi là đối tác trong sự phát triển nghề nghiệp của bạn.'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <Card
                                key={index}
                                className="p-6 hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="p-0 space-y-4">
                                    <div className="w-12 h-12 primary-gradient rounded-lg flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
