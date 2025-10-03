"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WorkbookCard } from "@/components/workbook/workbook-card";
import { WorkbookPurchaseModal } from "@/components/workbook/workbook-purchase-modal";
import { LoginModal } from "@/components/auth/login-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";
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
  is_free: boolean;
  features?: Array<{
    feature_en: string;
    feature_vi?: string;
  }>;
  is_purchased?: boolean;
  purchase_date?: string;
}

export default function WorkbookPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedWorkbook, setSelectedWorkbook] = useState<Workbook | null>(
    null,
  );

  useEffect(() => {
    fetchWorkbooks();
  }, [searchQuery, selectedCategory, selectedLevel, selectedType]);

  const fetchWorkbooks = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedLevel !== "all") params.level = selectedLevel;
      if (selectedType !== "all") params.is_free = selectedType === "free";

      const response = await apiClient.getWorkbooks(params);
      console.log("📚 Workbooks data:", response.data);
      setWorkbooks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch workbooks:", error);
      setWorkbooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data removed - using API data instead
  const mockWorkbooks = [
    {
      id: "1",
      title:
        locale === "en"
          ? "Business English Essentials"
          : "Tiếng Anh thương mại cơ bản",
      description:
        locale === "en"
          ? "Master essential business vocabulary and communication skills for professional success."
          : "Thành thạo từ vựng và kỹ năng giao tiếp thương mại cần thiết cho thành công nghề nghiệp.",
      price: locale === "en" ? "$29" : "699.000đ",
      originalPrice: locale === "en" ? "$39" : "999.000đ",
      level: locale === "en" ? "Intermediate" : "Trung cấp",
      pages: 120,
      rating: 4.8,
      reviews: 234,
      category: locale === "en" ? "Business" : "Kinh doanh",
      image: "/placeholder.jpg",
      features: [
        locale === "en"
          ? "500+ business vocabulary words"
          : "500+ từ vựng kinh doanh",
        locale === "en" ? "Email writing templates" : "Mẫu viết email",
        locale === "en"
          ? "Meeting conversation guides"
          : "Hướng dẫn hội thoại họp",
        locale === "en"
          ? "Practice exercises with answers"
          : "Bài tập thực hành có đáp án",
      ],
    },
    {
      id: "2",
      title:
        locale === "en"
          ? "Technical English for IT Professionals"
          : "Tiếng Anh kỹ thuật cho chuyên gia IT",
      description:
        locale === "en"
          ? "Comprehensive guide to IT terminology and technical communication in English."
          : "Hướng dẫn toàn diện về thuật ngữ IT và giao tiếp kỹ thuật bằng tiếng Anh.",
      price: locale === "en" ? "$35" : "849.000đ",
      level: locale === "en" ? "Advanced" : "Nâng cao",
      pages: 150,
      rating: 4.9,
      reviews: 189,
      category: locale === "en" ? "Technology" : "Công nghệ",
      image: "/professional-man-teacher-technology.jpg",
      features: [
        locale === "en" ? "Programming terminology" : "Thuật ngữ lập trình",
        locale === "en"
          ? "System documentation templates"
          : "Mẫu tài liệu hệ thống",
        locale === "en"
          ? "Technical presentation skills"
          : "Kỹ năng thuyết trình kỹ thuật",
        locale === "en" ? "Code review vocabulary" : "Từ vựng review code",
      ],
    },
    {
      id: "3",
      title:
        locale === "en"
          ? "Medical English Handbook"
          : "Cẩm nang tiếng Anh y khoa",
      description:
        locale === "en"
          ? "Essential medical vocabulary and patient communication skills for healthcare professionals."
          : "Từ vựng y khoa thiết yếu và kỹ năng giao tiếp với bệnh nhân cho chuyên gia y tế.",
      price: locale === "en" ? "$32" : "799.000đ",
      level: locale === "en" ? "Intermediate" : "Trung cấp",
      pages: 140,
      rating: 4.7,
      reviews: 156,
      category: locale === "en" ? "Healthcare" : "Y tế",
      image: "/professional-woman-doctor-teacher.jpg",
      features: [
        locale === "en"
          ? "Medical terminology dictionary"
          : "Từ điển thuật ngữ y khoa",
        locale === "en"
          ? "Patient consultation phrases"
          : "Cụm từ tư vấn bệnh nhân",
        locale === "en" ? "Medical report writing" : "Viết báo cáo y khoa",
        locale === "en" ? "Emergency communication" : "Giao tiếp cấp cứu",
      ],
    },
    {
      id: "4",
      title:
        locale === "en"
          ? "IELTS Writing Task 2 Mastery"
          : "Thành thạo IELTS Writing Task 2",
      description:
        locale === "en"
          ? "Complete guide to achieving band 7+ in IELTS Writing Task 2 with proven strategies."
          : "Hướng dẫn hoàn chỉnh để đạt band 7+ trong IELTS Writing Task 2 với chiến lược đã được chứng minh.",
      price: locale === "en" ? "$25" : "599.000đ",
      level: locale === "en" ? "All Levels" : "Mọi cấp độ",
      pages: 100,
      rating: 4.9,
      reviews: 312,
      category: locale === "en" ? "IELTS" : "IELTS",
      image: "/professional-woman-teacher.png",
      features: [
        locale === "en" ? "Essay structure templates" : "Mẫu cấu trúc bài luận",
        locale === "en" ? "Band 9 sample essays" : "Bài mẫu band 9",
        locale === "en"
          ? "Common topic vocabulary"
          : "Từ vựng chủ đề thông dụng",
        locale === "en"
          ? "Examiner feedback analysis"
          : "Phân tích phản hồi giám khảo",
      ],
    },
  ];

  const categories = [
    {
      value: "all",
      label: locale === "en" ? "All Categories" : "Tất cả danh mục",
    },
    {
      value: "business",
      label: locale === "en" ? "Business" : "Kinh doanh",
    },
    {
      value: "technology",
      label: locale === "en" ? "Technology" : "Công nghệ",
    },
    { value: "healthcare", label: locale === "en" ? "Healthcare" : "Y tế" },
    { value: "ielts", label: "IELTS" },
  ];

  const levels = [
    { value: "all", label: locale === "en" ? "All Levels" : "Mọi cấp độ" },
    { value: "beginner", label: locale === "en" ? "Beginner" : "Cơ bản" },
    {
      value: "intermediate",
      label: locale === "en" ? "Intermediate" : "Trung cấp",
    },
    { value: "advanced", label: locale === "en" ? "Advanced" : "Nâng cao" },
  ];

  const filteredWorkbooks = workbooks;

  const handlePurchase = (workbookId: string) => {
    // Check if user is logged in
    if (!user) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    const workbook = workbooks.find((w) => w.id === workbookId);
    if (workbook) {
      setSelectedWorkbook(workbook);
      setShowPurchaseModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                {locale === "en" ? (
                  <>
                    Professional{" "}
                    <span className="text-gradient">Workbooks</span> for{" "}
                    <span className="text-gradient">Every Industry</span>
                  </>
                ) : (
                  <>
                    <span className="text-gradient">Sách bài tập</span> chuyên
                    nghiệp cho{" "}
                    <span className="text-gradient">mọi ngành nghề</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-muted-foreground">
                {locale === "en"
                  ? "Download comprehensive workbooks designed by industry experts. Practice with real-world scenarios and build confidence in your professional English skills."
                  : "Tải xuống sách bài tập toàn diện được thiết kế bởi các chuyên gia ngành. Thực hành với các tình huống thực tế và xây dựng sự tự tin trong kỹ năng tiếng Anh chuyên nghiệp."}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">500+</Badge>
                  <span>{locale === "en" ? "Downloads" : "Lượt tải"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">4.8★</Badge>
                  <span>
                    {locale === "en" ? "Average Rating" : "Đánh giá trung bình"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">PDF</Badge>
                  <span>
                    {locale === "en" ? "Instant Download" : "Tải ngay"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    locale === "en"
                      ? "Search workbooks..."
                      : "Tìm kiếm sách bài tập..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {locale === "en" ? "All Types" : "Tất cả"}
                    </SelectItem>
                    <SelectItem value="free">
                      {locale === "en" ? "Free" : "Miễn phí"}
                    </SelectItem>
                    <SelectItem value="paid">
                      {locale === "en" ? "Paid" : "Trả phí"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Workbooks Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWorkbooks.map((workbook) => (
                    <WorkbookCard
                      key={workbook.id}
                      workbook={workbook}
                      locale={locale}
                      onPurchase={handlePurchase}
                      onShowLogin={() => setShowLoginModal(true)}
                    />
                  ))}
                </div>

                {filteredWorkbooks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {locale === "en"
                          ? "No workbooks found"
                          : "Không tìm thấy sách bài tập"}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {locale === "en"
                          ? "Try adjusting your search or filter criteria"
                          : "Thử điều chỉnh tiêu chí tìm kiếm hoặc lọc"}
                      </p>
                      {user && (
                        <Button asChild>
                          <Link href="/admin/workbooks">
                            <Plus className="mr-2 h-4 w-4" />
                            {locale === "en"
                              ? "Create Workbook"
                              : "Tạo sách bài tập"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Purchase Modal */}
      {selectedWorkbook && (
        <WorkbookPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedWorkbook(null);
          }}
          workbook={selectedWorkbook}
          onPurchaseSuccess={() => {
            // Refresh workbooks to show updated purchase status
            fetchWorkbooks();
          }}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
