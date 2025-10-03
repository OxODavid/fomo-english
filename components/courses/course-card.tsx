"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Star,
  Clock,
  Users,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { CoursePurchaseModal } from "./course-purchase-modal";

interface CourseCardProps {
  course: {
    id: string;
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi?: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    level: string;
    category: string;
    duration_hours: number;
    total_videos: number;
    image_url?: string;
    instructor?: {
      name: string;
    };
    features?: Array<{
      feature_en: string;
      feature_vi?: string;
    }>;
  };
  locale?: string;
}

export function CourseCard({ course, locale = "en" }: CourseCardProps) {
  const { user, hasPurchasedCourse } = useAuth();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const isPurchased = user ? hasPurchasedCourse(course.id) : false;
  const title = locale === "vi" ? course.title_vi : course.title_en;
  const description =
    locale === "vi"
      ? course.description_vi || course.description_en
      : course.description_en;

  const formatPrice = (usd: number, vnd: number) => {
    if (locale === "vi") {
      return `${Number(vnd).toLocaleString("vi-VN")} VND`;
    }
    return `$${Number(usd).toFixed(2)}`;
  };

  const handlePurchaseClick = () => {
    if (!user) {
      // Could trigger login modal here
      return;
    }
    setShowPurchaseModal(true);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.image_url || "/placeholder.svg?height=200&width=350"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary">{course.category}</Badge>
          </div>
          {(course.original_price_usd || course.original_price_vnd) && (
            <div className="absolute top-4 right-4">
              <Badge className="primary-gradient text-white">
                {locale === "en" ? "Sale" : "Giảm giá"}
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
            {isPurchased && (
              <Badge variant="default" className="bg-green-500">
                {locale === "en" ? "Owned" : "Đã sở hữu"}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          {course.instructor && (
            <p className="text-sm text-muted-foreground">
              {locale === "en" ? "by" : "bởi"} {course.instructor.name}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration_hours}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>
                {course.total_videos} {locale === "en" ? "videos" : "video"}
              </span>
            </div>
          </div>

          {course.features && course.features.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {locale === "en" ? "What you'll learn:" : "Bạn sẽ học được:"}
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {course.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>
                      {locale === "vi"
                        ? feature.feature_vi || feature.feature_en
                        : feature.feature_en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(
                    Number(course.price_usd),
                    Number(course.price_vnd),
                  )}
                </span>
                {(course.original_price_usd || course.original_price_vnd) && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(
                      Number(course.original_price_usd || course.price_usd),
                      Number(course.original_price_vnd || course.price_vnd),
                    )}
                  </span>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {locale === "en" ? "Lifetime Access" : "Truy cập trọn đời"}
              </Badge>
            </div>
            <Button
              onClick={handlePurchaseClick}
              className="primary-gradient text-white"
              disabled={isPurchased}
            >
              {isPurchased ? (
                locale === "en" ? (
                  "Owned"
                ) : (
                  "Đã sở hữu"
                )
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {locale === "en" ? "Purchase" : "Mua ngay"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CoursePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        course={course}
        onPurchaseSuccess={() => {
          // Refresh user data or show success message
        }}
      />
    </>
  );
}
