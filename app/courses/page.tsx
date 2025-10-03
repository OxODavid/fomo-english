"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CourseCard } from "@/components/courses/course-card";
import { LoginModal } from "@/components/auth/login-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Play,
  Users,
  Clock,
  Plus,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";

export default function CoursesPage() {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching courses...");

        const params = {
          page,
          limit: 12,
          ...(selectedCategory !== "all" && { category: selectedCategory }),
          ...(selectedLevel !== "all" && { level: selectedLevel }),
          ...(searchQuery && { search: searchQuery }),
        };

        console.log("📋 API params:", params);
        const response = await apiClient.getCourses(params);
        console.log("✅ Courses response:", response);

        setCourses(response.data || []);
        setTotalPages(response.meta?.totalPages || 0);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        setCourses([]);
        setTotalPages(0);
      } finally {
        console.log("🏁 Loading finished");
        setLoading(false);
      }
    };

    // Add timeout fallback
    const timeoutId = setTimeout(() => {
      console.log("⏰ API timeout, stopping loading");
      setLoading(false);
    }, 10000); // 10 second timeout

    fetchCourses().finally(() => {
      clearTimeout(timeoutId);
    });
  }, [page, selectedCategory, selectedLevel, searchQuery]);

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

  // Reset page when filters change
  useEffect(() => {
    console.log("🔄 Filters changed, resetting page to 1");
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, selectedLevel]);

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
                    Master{" "}
                    <span className="text-gradient">Professional English</span>{" "}
                    with{" "}
                    <span className="text-gradient">Expert-Led Courses</span>
                  </>
                ) : (
                  <>
                    Thành thạo{" "}
                    <span className="text-gradient">
                      tiếng Anh chuyên nghiệp
                    </span>{" "}
                    với{" "}
                    <span className="text-gradient">
                      khóa học do chuyên gia dẫn dắt
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl text-muted-foreground">
                {locale === "en"
                  ? "Comprehensive video courses designed by industry experts. Learn at your own pace with lifetime access to all materials."
                  : "Khóa học video toàn diện được thiết kế bởi các chuyên gia ngành. Học theo tốc độ của bạn với quyền truy cập trọn đời vào tất cả tài liệu."}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span>
                    200+ {locale === "en" ? "Video Lessons" : "Bài học video"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    10,000+ {locale === "en" ? "Students" : "Học viên"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {locale === "en" ? "Lifetime Access" : "Truy cập trọn đời"}
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
                      ? "Search courses..."
                      : "Tìm kiếm khóa học..."
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
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      locale={locale}
                      onShowLogin={() => setShowLoginModal(true)}
                    />
                  ))}
                </div>

                {courses.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {locale === "en"
                        ? "No courses found"
                        : "Không tìm thấy khóa học"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ||
                      selectedCategory !== "all" ||
                      selectedLevel !== "all"
                        ? locale === "en"
                          ? "Try adjusting your search criteria"
                          : "Thử điều chỉnh tiêu chí tìm kiếm"
                        : locale === "en"
                        ? "Get started by creating your first course"
                        : "Bắt đầu bằng cách tạo khóa học đầu tiên"}
                    </p>
                    {!searchQuery &&
                      selectedCategory === "all" &&
                      selectedLevel === "all" && (
                        <Button
                          onClick={() =>
                            (window.location.href = "/admin/courses")
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {locale === "en" ? "Create Course" : "Tạo khóa học"}
                        </Button>
                      )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
