'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Download, FileText, CheckCircle } from 'lucide-react'

interface FreeServiceSectionProps {
    locale?: string
}

const industries = [
    { id: 'technology', en: 'Technology & IT', vi: 'Công nghệ & IT' },
    { id: 'business', en: 'Business & Finance', vi: 'Kinh doanh & Tài chính' },
    { id: 'healthcare', en: 'Healthcare & Medicine', vi: 'Y tế & Sức khỏe' },
    { id: 'education', en: 'Education & Training', vi: 'Giáo dục & Đào tạo' },
    {
        id: 'hospitality',
        en: 'Hospitality & Tourism',
        vi: 'Khách sạn & Du lịch',
    },
    { id: 'engineering', en: 'Engineering', vi: 'Kỹ thuật' },
    { id: 'marketing', en: 'Marketing & Sales', vi: 'Marketing & Bán hàng' },
    { id: 'legal', en: 'Legal & Law', vi: 'Pháp lý & Luật' },
]

export function FreeServiceSection({ locale = 'en' }: FreeServiceSectionProps) {
    const [selectedIndustry, setSelectedIndustry] = useState<string>('')
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadComplete, setDownloadComplete] = useState(false)

    const handleDownload = async () => {
        if (!selectedIndustry) return

        setIsDownloading(true)

        // Simulate download process
        setTimeout(() => {
            setIsDownloading(false)
            setDownloadComplete(true)

            // Reset after 3 seconds
            setTimeout(() => {
                setDownloadComplete(false)
                setSelectedIndustry('')
            }, 3000)
        }, 2000)
    }

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold">
                        {locale === 'en'
                            ? 'Free Vocabulary Resources'
                            : 'Tài liệu từ vựng miễn phí'}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {locale === 'en'
                            ? 'Get industry-specific vocabulary PDFs tailored to your professional needs. No registration required.'
                            : 'Nhận PDF từ vựng chuyên ngành phù hợp với nhu cầu nghề nghiệp của bạn. Không cần đăng ký.'}
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-center">
                                {locale === 'en'
                                    ? 'Choose Your Industry'
                                    : 'Chọn ngành nghề của bạn'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Select
                                    value={selectedIndustry}
                                    onValueChange={setSelectedIndustry}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                locale === 'en'
                                                    ? 'Select an industry...'
                                                    : 'Chọn một ngành nghề...'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industries.map((industry) => (
                                            <SelectItem
                                                key={industry.id}
                                                value={industry.id}
                                            >
                                                {locale === 'en'
                                                    ? industry.en
                                                    : industry.vi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedIndustry && (
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <span className="font-medium">
                                                {locale === 'en'
                                                    ? "What you'll get:"
                                                    : 'Bạn sẽ nhận được:'}
                                            </span>
                                        </div>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {locale === 'en'
                                                        ? '500+ essential vocabulary words'
                                                        : '500+ từ vựng thiết yếu'}
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {locale === 'en'
                                                        ? 'Pronunciation guide and examples'
                                                        : 'Hướng dẫn phát âm và ví dụ'}
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {locale === 'en'
                                                        ? 'Common phrases and expressions'
                                                        : 'Cụm từ và thành ngữ thông dụng'}
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {locale === 'en'
                                                        ? 'Practice exercises included'
                                                        : 'Bài tập thực hành đi kèm'}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                <Button
                                    onClick={handleDownload}
                                    disabled={
                                        !selectedIndustry ||
                                        isDownloading ||
                                        downloadComplete
                                    }
                                    className="w-full primary-gradient text-white"
                                    size="lg"
                                >
                                    {downloadComplete ? (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {locale === 'en'
                                                ? 'Downloaded!'
                                                : 'Đã tải!'}
                                        </>
                                    ) : isDownloading ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            {locale === 'en'
                                                ? 'Downloading...'
                                                : 'Đang tải...'}
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            {locale === 'en'
                                                ? 'Download Free PDF'
                                                : 'Tải PDF miễn phí'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <Card className="text-center p-6">
                        <div className="w-12 h-12 primary-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            {locale === 'en'
                                ? 'Industry-Specific'
                                : 'Chuyên ngành'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {locale === 'en'
                                ? 'Vocabulary tailored to your professional field'
                                : 'Từ vựng được thiết kế riêng cho lĩnh vực chuyên môn của bạn'}
                        </p>
                    </Card>

                    <Card className="text-center p-6">
                        <div className="w-12 h-12 primary-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Download className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            {locale === 'en'
                                ? 'Instant Download'
                                : 'Tải ngay lập tức'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {locale === 'en'
                                ? 'Get your PDF immediately, no waiting required'
                                : 'Nhận PDF ngay lập tức, không cần chờ đợi'}
                        </p>
                    </Card>

                    <Card className="text-center p-6">
                        <div className="w-12 h-12 primary-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            {locale === 'en'
                                ? 'No Registration'
                                : 'Không cần đăng ký'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {locale === 'en'
                                ? 'Access free resources without creating an account'
                                : 'Truy cập tài liệu miễn phí mà không cần tạo tài khoản'}
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
