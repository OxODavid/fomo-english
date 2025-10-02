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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Search,
  RefreshCw,
  BookOpen,
  Users,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";

interface Course {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  price_usd: number;
  price_vnd: number;
  level: string;
  category: string;
  duration_hours: number;
  total_videos: number;
  instructor: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CoursesResponse {
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [meta, setMeta] = useState<CoursesResponse["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();

  const fetchCourses = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 20,
        ...(search && { search }),
      };
      const data: CoursesResponse = await apiClient.getAdminCourses(params);
      setCourses(data.data);
      setMeta(data.meta);
    } catch (error: any) {
      console.error("Failed to fetch courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchCourses(1, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (usd: number, vnd: number) => {
    return (
      <div>
        <p className="font-medium">${usd}</p>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(vnd)}
        </p>
      </div>
    );
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        variant="outline"
        className={colors[level as keyof typeof colors] || ""}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant="secondary">
        {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage platform courses and content
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Search Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by course title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={() => fetchCourses(currentPage, searchQuery)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses ({meta?.total || 0})</CardTitle>
          <CardDescription>
            All courses available on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No courses found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Videos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.image_url || "/placeholder.jpg"}
                              alt={course.title_en}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{course.title_en}</p>
                              <p className="text-sm text-muted-foreground">
                                {course.title_vi}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                by {course.instructor}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(course.price_usd, course.price_vnd)}
                        </TableCell>
                        <TableCell>{getLevelBadge(course.level)}</TableCell>
                        <TableCell>
                          {getCategoryBadge(course.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-500 mr-1" />
                            <span>{course.duration_hours}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Video className="w-4 h-4 text-blue-500 mr-1" />
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCourse(course)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Course Details</DialogTitle>
                                <DialogDescription>
                                  View course information and settings
                                </DialogDescription>
                              </DialogHeader>

                              {selectedCourse && (
                                <div className="space-y-6">
                                  {/* Course Header */}
                                  <div className="flex items-start space-x-4">
                                    <img
                                      src={
                                        selectedCourse.image_url ||
                                        "/placeholder.jpg"
                                      }
                                      alt={selectedCourse.title_en}
                                      className="w-24 h-24 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold">
                                        {selectedCourse.title_en}
                                      </h3>
                                      <p className="text-lg text-muted-foreground">
                                        {selectedCourse.title_vi}
                                      </p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        by {selectedCourse.instructor}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        {getLevelBadge(selectedCourse.level)}
                                        {getCategoryBadge(
                                          selectedCourse.category,
                                        )}
                                        <Badge
                                          variant={
                                            selectedCourse.is_active
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {selectedCourse.is_active
                                            ? "Active"
                                            : "Inactive"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Course Info Grid */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Price (USD)
                                      </Label>
                                      <div className="flex items-center mt-1">
                                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                                        <span className="text-lg font-bold">
                                          ${selectedCourse.price_usd}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Price (VND)
                                      </Label>
                                      <p className="text-lg font-bold">
                                        {new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        }).format(selectedCourse.price_vnd)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Duration
                                      </Label>
                                      <div className="flex items-center mt-1">
                                        <Clock className="w-4 h-4 text-blue-600 mr-1" />
                                        <span className="font-medium">
                                          {selectedCourse.duration_hours} hours
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Total Videos
                                      </Label>
                                      <div className="flex items-center mt-1">
                                        <Video className="w-4 h-4 text-purple-600 mr-1" />
                                        <span className="font-medium">
                                          {selectedCourse.total_videos} videos
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Created
                                      </Label>
                                      <p>
                                        {formatDate(selectedCourse.created_at)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Last Updated
                                      </Label>
                                      <p>
                                        {formatDate(selectedCourse.updated_at)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Descriptions */}
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Description (English)
                                      </Label>
                                      <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                                        {selectedCourse.description_en}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Description (Vietnamese)
                                      </Label>
                                      <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                                        {selectedCourse.description_vi}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} courses
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={meta.page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(meta.totalPages, prev + 1),
                        )
                      }
                      disabled={meta.page >= meta.totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
