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
  CheckCircle,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";
import { YouTubePlayer } from "@/components/video/youtube-player";
import Link from "next/link";

interface Video {
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
}

interface Section {
  id: string;
  title_en: string;
  title_vi: string;
  description_en?: string;
  description_vi?: string;
  sort_order: number;
  videos?: Video[];
}

interface Course {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  total_videos: number;
  sections?: Section[];
}

export default function CourseLearningPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();
  const { locale } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(
    new Set(),
  );

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
      console.log("🎓 Learning course data:", courseData);
      console.log("🎓 Learning course sections:", courseData.sections);
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
      // Mark completed videos
      const completed = new Set<string>();
      // This would be populated from the progress data
      setCompletedVideos(completed);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const markVideoComplete = async (videoId: string) => {
    try {
      await apiClient.markVideoComplete(videoId, {
        watch_time_minutes: 0, // This would be calculated from actual watch time
      });

      setCompletedVideos((prev) => new Set([...prev, videoId]));

      // Refresh progress
      await fetchProgress();
    } catch (error) {
      console.error("Failed to mark video complete:", error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-96 bg-gray-200 rounded"></div>
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
  const totalCompleted = completedVideos.size;
  const progressPercentage =
    course.total_videos > 0 ? (totalCompleted / course.total_videos) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link
              href={`/courses/${courseId}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "vi" ? "Quay lại khóa học" : "Back to Course"}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{title}</h1>

              {/* Progress */}
              {progress && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            {locale === "vi"
                              ? "Tiến độ học tập"
                              : "Learning Progress"}
                          </span>
                          <span>
                            {totalCompleted}/{course.total_videos} videos
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      <p className="text-sm text-gray-600">
                        {progressPercentage.toFixed(0)}%{" "}
                        {locale === "vi" ? "hoàn thành" : "complete"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Player */}
              {selectedVideo ? (
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <YouTubePlayer
                      videoUrl={selectedVideo.video_url}
                      title={
                        locale === "vi"
                          ? selectedVideo.title_vi
                          : selectedVideo.title_en
                      }
                      onVideoEnd={() => {
                        // Auto-mark as complete when video ends
                        if (!completedVideos.has(selectedVideo.id)) {
                          markVideoComplete(selectedVideo.id);
                        }
                      }}
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">
                        {locale === "vi"
                          ? selectedVideo.title_vi
                          : selectedVideo.title_en}
                      </h2>
                      {selectedVideo.description_en && (
                        <p className="text-gray-600 mb-4">
                          {locale === "vi"
                            ? selectedVideo.description_vi
                            : selectedVideo.description_en}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => markVideoComplete(selectedVideo.id)}
                          disabled={completedVideos.has(selectedVideo.id)}
                        >
                          {completedVideos.has(selectedVideo.id) ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {locale === "vi" ? "Đã hoàn thành" : "Completed"}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {locale === "vi"
                                ? "Đánh dấu hoàn thành"
                                : "Mark Complete"}
                            </>
                          )}
                        </Button>
                        {selectedVideo.quiz_url && (
                          <Button variant="outline" asChild>
                            <a
                              href={selectedVideo.quiz_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {locale === "vi" ? "Làm bài quiz" : "Take Quiz"}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-6">
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {locale === "vi"
                        ? "Chọn video để bắt đầu học"
                        : "Select a video to start learning"}
                    </h3>
                    <p className="text-gray-600">
                      {locale === "vi"
                        ? "Chọn video từ danh sách bên phải để bắt đầu"
                        : "Choose a video from the list on the right to begin"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === "vi" ? "Nội dung khóa học" : "Course Content"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {course.sections && course.sections.length > 0 ? (
                    course.sections.map((section, sectionIndex) => (
                      <div
                        key={section.id}
                        className="border-b last:border-b-0"
                      >
                        <div className="p-4 bg-gray-50">
                          <h4 className="font-medium text-sm">
                            {sectionIndex + 1}.{" "}
                            {locale === "vi"
                              ? section.title_vi
                              : section.title_en}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {section.videos?.length || 0}{" "}
                            {locale === "vi" ? "video" : "videos"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {section.videos && section.videos.length > 0 ? (
                            section.videos.map((video, videoIndex) => (
                              <button
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                                  selectedVideo?.id === video.id
                                    ? "bg-blue-50 border-r-2 border-blue-500"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    {completedVideos.has(video.id) ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <Play className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {videoIndex + 1}.{" "}
                                      {locale === "vi"
                                        ? video.title_vi
                                        : video.title_en}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {formatDuration(video.duration_minutes)}
                                      </span>
                                      <Star className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {video.points_reward} pts
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="text-gray-500 text-xs p-3">
                              {locale === "vi"
                                ? "Chưa có video nào"
                                : "No videos available"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">
                        {locale === "vi"
                          ? "Chưa có nội dung nào"
                          : "No content available"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
