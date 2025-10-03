"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CourseForm } from "@/components/admin/course-form";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

interface VideoData {
  id?: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  video_url: string;
  quiz_url?: string;
  duration_minutes: number;
  points_reward: number;
  sort_order: number;
  is_active: boolean;
}

interface SectionData {
  id?: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  sort_order: number;
  is_active: boolean;
  videos: VideoData[];
}

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
  instructor?: {
    id: string;
    name: string;
  };
  instructor_id?: string;
  image_url?: string;
  is_lifetime_access?: boolean;
  is_active: boolean;
  created_at: string;
  sections?: SectionData[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log("🔍 Fetching admin courses...");
      const response = await apiClient.getAdminCourses();
      console.log("✅ Courses received:", response);
      setCourses(response.data || []);
    } catch (error: any) {
      console.error("❌ Failed to fetch courses:", error);

      // Mock data for development
      console.log("🔄 Using mock courses data");
      setCourses([
        {
          id: "1",
          title_en: "Complete Business English Mastery",
          title_vi: "Thành thạo hoàn toàn tiếng Anh thương mại",
          description_en:
            "Comprehensive course covering all aspects of business communication",
          description_vi:
            "Khóa học toàn diện bao gồm tất cả các khía cạnh của giao tiếp thương mại",
          price_usd: 149,
          price_vnd: 3599000,
          original_price_usd: 199,
          original_price_vnd: 4799000,
          level: "intermediate",
          category: "business",
          duration_hours: 12,
          total_videos: 48,
          instructor: {
            id: "1",
            name: "Sarah Johnson",
          },
          instructor_id: "1",
          image_url: "/placeholder.jpg",
          is_lifetime_access: true,
          is_active: true,
          created_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          title_en: "Technical English for Software Engineers",
          title_vi: "Tiếng Anh kỹ thuật cho kỹ sư phần mềm",
          description_en:
            "Master technical communication skills for software development",
          description_vi:
            "Thành thạo kỹ năng giao tiếp kỹ thuật cho phát triển phần mềm",
          price_usd: 179,
          price_vnd: 4299000,
          original_price_usd: 229,
          original_price_vnd: 5499000,
          level: "advanced",
          category: "technology",
          duration_hours: 15,
          total_videos: 52,
          instructor: {
            id: "2",
            name: "Michael Chen",
          },
          instructor_id: "2",
          image_url: "/professional-man-teacher-technology.jpg",
          is_lifetime_access: true,
          is_active: true,
          created_at: "2024-01-02T00:00:00.000Z",
        },
        {
          id: "3",
          title_en: "Medical English for Healthcare Professionals",
          title_vi: "Tiếng Anh y khoa cho chuyên gia y tế",
          description_en:
            "Comprehensive medical English course for healthcare professionals",
          description_vi:
            "Khóa học tiếng Anh y khoa toàn diện cho chuyên gia y tế",
          price_usd: 159,
          price_vnd: 3799000,
          original_price_usd: 199,
          original_price_vnd: 4799000,
          level: "intermediate",
          category: "healthcare",
          duration_hours: 14,
          total_videos: 45,
          instructor: {
            id: "3",
            name: "Dr. Emily Rodriguez",
          },
          instructor_id: "3",
          image_url: "/professional-woman-doctor-teacher.jpg",
          is_lifetime_access: true,
          is_active: true,
          created_at: "2024-01-03T00:00:00.000Z",
        },
      ]);

      toast({
        title: "Warning",
        description: "Using mock data - backend API not available",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await apiClient.deleteCourse(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error: any) {
      console.error("Failed to delete course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleSaveCourse = async (courseData: any) => {
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        // Update existing course
        const updatedCourse = await apiClient.updateCourse(
          editingCourse.id,
          courseData,
        );
        setCourses(
          courses.map((course) =>
            course.id === editingCourse.id
              ? { ...course, ...updatedCourse }
              : course,
          ),
        );
        setEditingCourse(null);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        // Create new course - use with-content API if sections are provided
        let newCourse;
        if (courseData.sections && courseData.sections.length > 0) {
          // Remove total_videos for with-content API as it's calculated automatically
          const { total_videos, ...courseDataWithoutTotalVideos } = courseData;
          newCourse = await apiClient.createCourseWithContent(
            courseDataWithoutTotalVideos,
          );
        } else {
          newCourse = await apiClient.createCourse(courseData);
        }
        setCourses([newCourse, ...courses]);
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
    } catch (error: any) {
      console.error("Failed to save course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatCurrency = (amount: number, currency: "USD" | "VND") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            Manage all courses in the platform
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">
              Manage all courses in the platform
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new course
                </DialogDescription>
              </DialogHeader>
              <CourseForm
                onSave={handleSaveCourse}
                onCancel={() => setIsCreateDialogOpen(false)}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>
            Manage and monitor all courses in your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{course.title_en}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.title_vi}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {course.description_en}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadgeColor(course.category)}>
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeColor(course.level)}>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatCurrency(course.price_usd, "USD")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(course.price_vnd, "VND")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration_hours}h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.total_videos}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={course.is_active ? "default" : "secondary"}
                      >
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/courses/${course.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first course"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog
          open={!!editingCourse}
          onOpenChange={() => setEditingCourse(null)}
        >
          <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update course details</DialogDescription>
            </DialogHeader>
            <CourseForm
              course={editingCourse}
              onSave={handleSaveCourse}
              onCancel={() => setEditingCourse(null)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
