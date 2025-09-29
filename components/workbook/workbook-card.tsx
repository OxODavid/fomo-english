'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Star, Clock, BookOpen } from 'lucide-react'

interface WorkbookCardProps {
    workbook: {
        id: string
        title: string
        description: string
        price: string
        originalPrice?: string
        level: string
        pages: number
        rating: number
        reviews: number
        category: string
        image: string
        features: string[]
    }
    locale?: string
    onPurchase: (id: string) => void
}

export function WorkbookCard({
    workbook,
    locale = 'en',
    onPurchase,
}: WorkbookCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-[4/3] relative overflow-hidden">
                <img
                    src={
                        workbook.image ||
                        '/placeholder.svg?height=300&width=400'
                    }
                    alt={workbook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{workbook.category}</Badge>
                </div>
                {workbook.originalPrice && (
                    <div className="absolute top-4 right-4">
                        <Badge className="primary-gradient text-white">
                            {locale === 'en' ? 'Sale' : 'Giảm giá'}
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <Badge variant="outline">{workbook.level}</Badge>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {workbook.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            ({workbook.reviews})
                        </span>
                    </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                    {workbook.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {workbook.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>
                            {workbook.pages}{' '}
                            {locale === 'en' ? 'pages' : 'trang'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{locale === 'en' ? 'Self-paced' : 'Tự học'}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                        {locale === 'en' ? "What's included:" : 'Bao gồm:'}
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {workbook.features.slice(0, 3).map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary">
                                {workbook.price}
                            </span>
                            {workbook.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {workbook.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() => onPurchase(workbook.id)}
                        className="primary-gradient text-white"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {locale === 'en' ? 'Purchase' : 'Mua ngay'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
