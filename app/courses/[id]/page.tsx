"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  ArrowLeft,
  Download,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";
import { CoursePurchaseModal } from "@/components/courses/course-purchase-modal";
import { YouTubePlayer } from "@/components/video/youtube-player";
import { LoginModal } from "@/components/auth/login-modal";
import Link from "next/link";

interface Course {
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
    id: string;
    name: string;
    bio_en?: string;
    bio_vi?: string;
    profile_image_url?: string;
  };
  features?: Array<{
    feature_en: string;
    feature_vi?: string;
  }>;
  sections?: Array<{
    id: string;
    title_en: string;
    title_vi: string;
    description_en?: string;
    description_vi?: string;
    sort_order: number;
    videos?: Array<{
      id: string;
      title_en: string;
      title_vi: string;
      description_en?: string;
      description_vi?: string;
      video_url: string;
      quiz_url?: string;
      duration_minutes: number;
      points_reward: number;
      sort_order: number;
      is_completed?: boolean;
    }>;
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
  progress?: {
    completed_videos: number;
    total_videos: number;
    progress_percentage: number;
    last_accessed: string;
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();
  const { locale } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<any>(null);

  useEffect(() => {
    fetchCourseDetails();
    if (user) {
      fetchProgress();
    }
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseData = await apiClient.getCourse(courseId);
      console.log("📚 Course data:", courseData);
      console.log("📚 Course sections:", courseData.sections);
      setCourse(courseData);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const progressData = await apiClient.getCourseProgress(courseId);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <p className="text-gray-600 mb-6">
              The course you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/courses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = locale === "vi" ? course.title_vi : course.title_en;
  const description =
    locale === "vi"
      ? course.description_vi || course.description_en
      : course.description_en;
  const instructorName = course.instructor?.name || "Unknown Instructor";
  const instructorBio =
    locale === "vi"
      ? course.instructor?.bio_vi || course.instructor?.bio_en
      : course.instructor?.bio_en;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "vi" ? "Quay lại khóa học" : "Back to Courses"}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryBadgeColor(course.category)}>
                  {course.category}
                </Badge>
                <Badge className={getLevelBadgeColor(course.level)}>
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-gray-600 mb-6">{description}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_hours}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.total_videos} videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            {course.image_url && (
              <div className="mb-8">
                <img
                  src={course.image_url}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Progress Section */}
            {course.isPurchased && progress && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {locale === "vi" ? "Tiến độ học tập" : "Learning Progress"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>
                          {locale === "vi" ? "Hoàn thành" : "Completed"}
                        </span>
                        <span>
                          {progress.completed_videos}/{progress.total_videos}{" "}
                          videos
                        </span>
                      </div>
                      <Progress
                        value={progress.progress_percentage}
                        className="h-2"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {progress.progress_percentage}%{" "}
                      {locale === "vi" ? "hoàn thành" : "complete"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  {locale === "vi" ? "Tổng quan" : "Overview"}
                </TabsTrigger>
                <TabsTrigger value="curriculum">
                  {locale === "vi" ? "Nội dung" : "Curriculum"}
                </TabsTrigger>
                <TabsTrigger value="instructor">
                  {locale === "vi" ? "Giảng viên" : "Instructor"}
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
                        ? "Mô tả khóa học"
                        : "Course Description"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>

                {course.features && course.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {locale === "vi" ? "Tính năng" : "Features"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.features.map((feature, index) => (
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
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                {course.sections && course.sections.length > 0 ? (
                  <div className="space-y-4">
                    {course.sections.map((section, sectionIndex) => (
                      <Card key={section.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {sectionIndex + 1}.{" "}
                            {locale === "vi"
                              ? section.title_vi
                              : section.title_en}
                          </CardTitle>
                          {section.description_en && (
                            <p className="text-sm text-gray-600">
                              {locale === "vi"
                                ? section.description_vi
                                : section.description_en}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {section.videos && section.videos.length > 0 ? (
                              section.videos.map((video, videoIndex) => (
                                <div
                                  key={video.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                                      {videoIndex + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-medium">
                                        {locale === "vi"
                                          ? video.title_vi
                                          : video.title_en}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {video.duration_minutes} min •{" "}
                                        {video.points_reward} points
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {video.is_completed && (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setPreviewVideo(video)}
                                    >
                                      <Play className="h-4 w-4 mr-2" />
                                      {locale === "vi" ? "Xem" : "Watch"}
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">
                                {locale === "vi"
                                  ? "Chưa có video nào"
                                  : "No videos available"}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {locale === "vi"
                          ? "Nội dung khóa học đang được cập nhật"
                          : "Course content is being updated"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {course.instructor?.profile_image_url && (
                        <img
                          src={course.instructor.profile_image_url}
                          alt={instructorName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {instructorName}
                        </h3>
                        {instructorBio && (
                          <p className="text-gray-600 leading-relaxed">
                            {instructorBio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {course.reviews && course.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
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
                          ? "Hãy là người đầu tiên đánh giá khóa học này"
                          : "Be the first to review this course"}
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
                    ? "Thông tin khóa học"
                    : "Course Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatPrice(course.price_usd, course.price_vnd)}
                  </div>
                  {course.original_price_usd && course.original_price_vnd && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(
                        course.original_price_usd,
                        course.original_price_vnd,
                      )}
                    </div>
                  )}
                </div>

                {/* Purchase Status */}
                {course.isPurchased ? (
                  <div className="space-y-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/courses/${courseId}/learn`}>
                        <Play className="mr-2 h-4 w-4" />
                        {locale === "vi" ? "Bắt đầu học" : "Start Learning"}
                      </Link>
                    </Button>
                    <div className="text-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      {locale === "vi"
                        ? "Bạn đã sở hữu khóa học này"
                        : "You own this course"}
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
                        setShowPurchaseModal(true);
                      }}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {locale === "vi" ? "Mua khóa học" : "Purchase Course"}
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      {locale === "vi"
                        ? "Truy cập trọn đời"
                        : "Lifetime access"}
                    </p>
                  </div>
                )}

                {/* Course Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Thời lượng:" : "Duration:"}
                    </span>
                    <span>{course.duration_hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Số video:" : "Videos:"}
                    </span>
                    <span>{course.total_videos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Cấp độ:" : "Level:"}
                    </span>
                    <span className="capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "vi" ? "Truy cập:" : "Access:"}
                    </span>
                    <span>{locale === "vi" ? "Trọn đời" : "Lifetime"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Purchase Modal */}
      {course && (
        <CoursePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          course={course}
          onPurchaseSuccess={() => {
            // Refresh the page to show updated purchase status
            window.location.reload();
          }}
        />
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {locale === "vi"
                  ? previewVideo.title_vi
                  : previewVideo.title_en}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewVideo(null)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <YouTubePlayer
                videoUrl={previewVideo.video_url}
                title={
                  locale === "vi"
                    ? previewVideo.title_vi
                    : previewVideo.title_en
                }
              />
              {previewVideo.description_en && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    {locale === "vi"
                      ? previewVideo.description_vi
                      : previewVideo.description_en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
