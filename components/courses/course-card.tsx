'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Star, Clock, Users, CheckCircle } from 'lucide-react'

interface CourseCardProps {
    course: {
        id: string
        title: string
        description: string
        price: string
        originalPrice?: string
        level: string
        duration: string
        lessons: number
        students: number
        rating: number
        reviews: number
        category: string
        image: string
        instructor: string
        features: string[]
        isLifetime: boolean
    }
    locale?: string
    onEnroll: (id: string) => void
}

export function CourseCard({
    course,
    locale = 'en',
    onEnroll,
}: CourseCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={
                        course.image || '/placeholder.svg?height=200&width=350'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{course.category}</Badge>
                </div>
                {course.originalPrice && (
                    <div className="absolute top-4 right-4">
                        <Badge className="primary-gradient text-white">
                            {locale === 'en' ? 'Sale' : 'Giảm giá'}
                        </Badge>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary ml-1" />
                    </div>
                </div>
            </div>

            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {course.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            ({course.reviews})
                        </span>
                    </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'by' : 'bởi'} {course.instructor}
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Play className="h-4 w-4" />
                        <span>
                            {course.lessons}{' '}
                            {locale === 'en' ? 'lessons' : 'bài'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                        {locale === 'en'
                            ? "What you'll learn:"
                            : 'Bạn sẽ học được:'}
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {course.features.slice(0, 3).map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary">
                                {course.price}
                            </span>
                            {course.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {course.originalPrice}
                                </span>
                            )}
                        </div>
                        {course.isLifetime && (
                            <Badge variant="secondary" className="text-xs">
                                {locale === 'en'
                                    ? 'Lifetime Access'
                                    : 'Truy cập trọn đời'}
                            </Badge>
                        )}
                    </div>
                    <Button
                        onClick={() => onEnroll(course.id)}
                        className="primary-gradient text-white"
                    >
                        {locale === 'en' ? 'Enroll Now' : 'Đăng ký ngay'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
