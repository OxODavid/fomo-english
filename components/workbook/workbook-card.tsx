"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface WorkbookCardProps {
  workbook: {
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
    pages: number;
    category: string;
    cover_image_url?: string;
    is_free: boolean;
    features?: Array<{
      feature_en: string;
      feature_vi?: string;
    }>;
    is_purchased?: boolean;
    purchase_date?: string;
  };
  locale?: string;
  onPurchase: (id: string) => void;
  onShowLogin?: () => void;
}

export function WorkbookCard({
  workbook,
  locale = "en",
  onPurchase,
  onShowLogin,
}: WorkbookCardProps) {
  const { user } = useAuth();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={
            workbook.cover_image_url || "/placeholder.svg?height=300&width=400"
          }
          alt={locale === "vi" ? workbook.title_vi : workbook.title_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary">{workbook.category}</Badge>
        </div>
        {workbook.is_free && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-800">
              {locale === "en" ? "Free" : "Miễn phí"}
            </Badge>
          </div>
        )}
        {workbook.original_price_usd && workbook.original_price_vnd && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-100 text-red-800">
              {locale === "en" ? "Sale" : "Giảm giá"}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{workbook.level}</Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{workbook.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({workbook.reviews})
            </span>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">
          {locale === "vi" ? workbook.title_vi : workbook.title_en}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {locale === "vi"
            ? workbook.description_vi || workbook.description_en
            : workbook.description_en}
        </p>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>
              {workbook.pages} {locale === "en" ? "pages" : "trang"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{locale === "en" ? "Self-paced" : "Tự học"}</span>
          </div>
        </div>

        {workbook.features && workbook.features.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {locale === "en" ? "What's included:" : "Bao gồm:"}
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {workbook.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>
                    {locale === "vi" ? feature.feature_vi : feature.feature_en}
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
                {workbook.is_free
                  ? locale === "en"
                    ? "Free"
                    : "Miễn phí"
                  : locale === "vi"
                  ? `${Number(workbook.price_vnd).toLocaleString("vi-VN")} VND`
                  : `$${Number(workbook.price_usd).toFixed(2)}`}
              </span>
              {workbook.original_price_usd && workbook.original_price_vnd && (
                <span className="text-sm text-muted-foreground line-through">
                  {locale === "vi"
                    ? `${Number(workbook.original_price_vnd).toLocaleString(
                        "vi-VN",
                      )} VND`
                    : `$${Number(workbook.original_price_usd).toFixed(2)}`}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => {
              if (!user) {
                onShowLogin?.();
                return;
              }
              onPurchase(workbook.id);
            }}
            className="primary-gradient text-white"
            disabled={workbook.is_purchased}
          >
            <Download className="mr-2 h-4 w-4" />
            {workbook.is_purchased
              ? locale === "en"
                ? "Download"
                : "Tải xuống"
              : workbook.is_free
              ? locale === "en"
                ? "Download Free"
                : "Tải miễn phí"
              : locale === "en"
              ? "Purchase"
              : "Mua ngay"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
