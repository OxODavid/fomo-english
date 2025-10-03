"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, BookOpen, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MyWorkbook {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  price_usd: number;
  price_vnd: number;
  level: string;
  category: string;
  pages: number;
  cover_image_url: string;
  is_lifetime_access: boolean;
  purchased_at: string;
  payment_amount: number;
  payment_currency: string;
}

export default function MyWorkbooksPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const [workbooks, setWorkbooks] = useState<MyWorkbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyWorkbooks();
    }
  }, [user]);

  const fetchMyWorkbooks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyWorkbooks();
      setWorkbooks(response.workbooks || []);
    } catch (error) {
      console.error("Failed to fetch my workbooks:", error);
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Không thể tải danh sách sách bài tập. Vui lòng thử lại."
            : "Failed to load workbooks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (workbookId: string, title: string) => {
    try {
      const response = await apiClient.downloadWorkbook(workbookId);

      // Create download link with proper attributes for actual download
      const link = document.createElement("a");
      link.href = response.download_url;
      link.download = `${title.replace(/[^a-zA-Z0-9\s]/g, "")}.pdf`; // Clean filename
      link.target = "_blank"; // Open in new tab as fallback
      link.rel = "noopener noreferrer"; // Security

      // Force download by setting attributes
      link.setAttribute(
        "download",
        `${title.replace(/[^a-zA-Z0-9\s]/g, "")}.pdf`,
      );

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: locale === "vi" ? "Thành công" : "Success",
        description:
          locale === "vi"
            ? "Sách bài tập đã được tải xuống thành công!"
            : "Workbook downloaded successfully!",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Không thể tải xuống sách bài tập. Vui lòng thử lại."
            : "Failed to download workbook. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (usd: number, vnd: number, currency: string) => {
    if (currency === "VND") {
      return `${Number(vnd).toLocaleString("vi-VN")} VND`;
    }
    return `$${Number(usd).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "vi" ? "vi-VN" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const getLevelColor = (level: string) => {
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

  const getCategoryColor = (category: string) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === "vi" ? "Sách Bài Tập Của Tôi" : "My Workbooks"}
            </h1>
            <p className="text-gray-600">
              {locale === "vi"
                ? "Vui lòng đăng nhập để xem sách bài tập của bạn."
                : "Please log in to view your workbooks."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === "vi" ? "Sách Bài Tập Của Tôi" : "My Workbooks"}
          </h1>
          <p className="text-gray-600">
            {locale === "vi"
              ? "Quản lý và tải xuống các sách bài tập bạn đã mua"
              : "Manage and download your purchased workbooks"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workbooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {locale === "vi"
                ? "Chưa có sách bài tập nào"
                : "No workbooks yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {locale === "vi"
                ? "Bạn chưa mua sách bài tập nào. Hãy khám phá và mua sách bài tập phù hợp với bạn."
                : "You haven't purchased any workbooks yet. Explore and buy workbooks that suit you."}
            </p>
            <Button asChild>
              <a href="/workbook">
                {locale === "vi"
                  ? "Khám phá sách bài tập"
                  : "Explore Workbooks"}
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workbooks.map((workbook) => (
              <Card
                key={workbook.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={workbook.cover_image_url || "/placeholder.jpg"}
                    alt={
                      locale === "vi" ? workbook.title_vi : workbook.title_en
                    }
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getLevelColor(workbook.level)}>
                      {locale === "vi"
                        ? workbook.level === "beginner"
                          ? "Cơ bản"
                          : workbook.level === "intermediate"
                          ? "Trung cấp"
                          : "Nâng cao"
                        : workbook.level.charAt(0).toUpperCase() +
                          workbook.level.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {locale === "vi" ? workbook.title_vi : workbook.title_en}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {workbook.pages} {locale === "vi" ? "trang" : "pages"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {locale === "vi"
                      ? workbook.description_vi
                      : workbook.description_en}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={getCategoryColor(workbook.category)}>
                        {locale === "vi"
                          ? workbook.category === "business"
                            ? "Kinh doanh"
                            : workbook.category === "technology"
                            ? "Công nghệ"
                            : workbook.category === "healthcare"
                            ? "Y tế"
                            : "IELTS"
                          : workbook.category.charAt(0).toUpperCase() +
                            workbook.category.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {locale === "vi" ? "Mua ngày" : "Purchased on"}:{" "}
                        {formatDate(workbook.purchased_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {formatPrice(
                          workbook.price_usd,
                          workbook.price_vnd,
                          workbook.payment_currency,
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleDownload(
                        workbook.id,
                        locale === "vi" ? workbook.title_vi : workbook.title_en,
                      )
                    }
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {locale === "vi" ? "Tải xuống" : "Download"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
