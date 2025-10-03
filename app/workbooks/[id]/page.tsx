"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Star,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";
import { LoginModal } from "@/components/auth/login-modal";
import Link from "next/link";

interface Workbook {
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
  pages: number;
  cover_image_url?: string;
  pdf_url?: string;
  is_free: boolean;
  is_lifetime_access?: boolean;
  features?: Array<{
    feature_en: string;
    feature_vi?: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment_en: string;
    comment_vi?: string;
    user: {
      name: string;
    };
    created_at: string;
  }>;
  isPurchased?: boolean;
  purchase?: {
    id: string;
    payment_amount: number;
    payment_currency: string;
    purchase_date: string;
  };
}

export default function WorkbookDetailPage() {
  const params = useParams();
  const workbookId = params.id as string;
  const { user } = useAuth();
  const { locale } = useLanguage();

  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchWorkbookDetails();
  }, [workbookId]);

  const fetchWorkbookDetails = async () => {
    try {
      setLoading(true);
      const workbookData = await apiClient.getWorkbook(workbookId);
      console.log("📚 Workbook data:", workbookData);
      setWorkbook(workbookData);
    } catch (error) {
      console.error("Failed to fetch workbook details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (usd: number, vnd: number) => {
    if (locale === "vi") {
      return `${Number(vnd).toLocaleString("vi-VN")} VND`;
    }
    return `$${Number(usd).toFixed(2)}`;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 text-blue-800";
      case "technology":
        return "bg-purple-100 text-purple-800";
      case "healthcare":
        return "bg-green-100 text-green-800";
      case "ielts":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownload = async () => {
    if (!workbook) return;

    try {
      if (workbook.is_free || workbook.isPurchased) {
        let downloadUrl: string;

        if (workbook.pdf_url) {
          downloadUrl = workbook.pdf_url;
        } else {
          // Call download API for purchased workbooks
          const response = await apiClient.downloadWorkbook(workbook.id);
          downloadUrl = response.download_url;
        }

        // Create download link with proper attributes for actual download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${(locale === "vi"
          ? workbook.title_vi
          : workbook.title_en
        ).replace(/[^a-zA-Z0-9\s]/g, "")}.pdf`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute(
          "download",
          `${(locale === "vi" ? workbook.title_vi : workbook.title_en).replace(
            /[^a-zA-Z0-9\s]/g,
            "",
          )}.pdf`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Show purchase modal or redirect to purchase
        console.log("Workbook needs to be purchased first");
      }
    } catch (error) {
      console.error("Failed to download workbook:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workbook) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Workbook not found</h1>
            <p className="text-gray-600 mb-6">
              The workbook you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/workbooks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workbooks
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = locale === "vi" ? workbook.title_vi : workbook.title_en;
  const description =
    locale === "vi"
      ? workbook.description_vi || workbook.description_en
      : workbook.description_en;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link
              href="/workbooks"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "vi" ? "Quay lại sách bài tập" : "Back to Workbooks"}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Workbook Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryBadgeColor(workbook.category)}>
                  {workbook.category}
                </Badge>
                <Badge className={getLevelBadgeColor(workbook.level)}>
                  {workbook.level}
                </Badge>
                {workbook.is_free && (
                  <Badge className="bg-green-100 text-green-800">
                    {locale === "vi" ? "Miễn phí" : "Free"}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-gray-600 mb-6">{description}</p>

              {/* Workbook Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>
                    {workbook.pages} {locale === "vi" ? "trang" : "pages"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{workbook.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {locale === "vi" ? "Truy cập trọn đời" : "Lifetime access"}
                  </span>
                </div>
              </div>
            </div>

            {/* Workbook Cover */}
            {workbook.cover_image_url && (
              <div className="mb-8">
                <img
                  src={workbook.cover_image_url}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Workbook Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  {locale === "vi" ? "Tổng quan" : "Overview"}
                </TabsTrigger>
                <TabsTrigger value="features">
                  {locale === "vi" ? "Tính năng" : "Features"}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  {locale === "vi" ? "Đánh giá" : "Reviews"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {locale === "vi"
                        ? "Mô tả sách bài tập"
                        : "Workbook Description"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                {workbook.features && workbook.features.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {locale === "vi" ? "Tính năng" : "Features"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {workbook.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              {locale === "vi"
                                ? feature.feature_vi
                                : feature.feature_en}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {locale === "vi"
                          ? "Chưa có thông tin tính năng"
                          : "No features information available"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {workbook.reviews && workbook.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {workbook.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                              {review.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">
                                  {review.user.name}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">
                                {locale === "vi"
                                  ? review.comment_vi
                                  : review.comment_en}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  review.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {locale === "vi"
                          ? "Chưa có đánh giá nào"
                          : "No reviews yet"}
                      </h3>
                      <p className="text-gray-600">
                        {locale === "vi"
                          ? "Hãy là người đầu tiên đánh giá sách bài tập này"
                          : "Be the first to review this workbook"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>
                  {locale === "vi"
                    ? "Thông tin sách bài tập"
                    : "Workbook Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                {!workbook.is_free && (
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(workbook.price_usd, workbook.price_vnd)}
                    </div>
                    {workbook.original_price_usd &&
                      workbook.original_price_vnd && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(
                            workbook.original_price_usd,
                            workbook.original_price_vnd,
                          )}
                        </div>
                      )}
                  </div>
                )}

                {/* Download Status */}
                {workbook.is_free || workbook.isPurchased ? (
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {locale === "vi" ? "Tải xuống" : "Download"}
                    </Button>
                    <div className="text-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      {workbook.is_free
                        ? locale === "vi"
                          ? "Sách bài tập miễn phí"
                          : "Free workbook"
                        : locale === "vi"
                        ? "Bạn đã sở hữu sách bài tập này"
                        : "You own this workbook"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        if (!user) {
                          setShowLoginModal(true);
                          return;
                        }
                        // Open purchase modal or redirect to purchase page
                        console.log(
                          "Open purchase modal for workbook:",
                          workbook.id,
                        );
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {locale === "vi"
                        ? "Mua để tải xuống"
                        : "Purchase to Download"}
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      {locale === "vi"
                        ? "Cần mua để tải xuống"
                        : "Purchase required to download"}
                    </p>
                  </div>
                )}

                {/* Workbook Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Số trang:" : "Pages:"}
                    </span>
                    <span>{workbook.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Cấp độ:" : "Level:"}
                    </span>
                    <span className="capitalize">{workbook.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Truy cập:" : "Access:"}
                    </span>
                    <span>{locale === "vi" ? "Trọn đời" : "Lifetime"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Loại:" : "Type:"}
                    </span>
                    <span>
                      {workbook.is_free
                        ? locale === "vi"
                          ? "Miễn phí"
                          : "Free"
                        : locale === "vi"
                        ? "Trả phí"
                        : "Paid"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
