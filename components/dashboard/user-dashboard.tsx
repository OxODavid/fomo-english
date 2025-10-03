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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  MessageCircle,
  Video,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { apiClient } from "@/lib/api";

interface PurchasedCourse {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  price_usd: number;
  price_vnd: number;
  level: string;
  category: string;
  duration_hours: number;
  total_videos: number;
  image_url?: string;
  is_lifetime_access: boolean;
  purchased_at: string;
  payment_amount: number;
  payment_currency: string;
  instructor: {
    id: string;
    name: string;
    profile_image_url?: string;
  };
}

export function UserDashboard() {
  const { user, hasPurchasedCourse, refreshUserData } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(
    [],
  );
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      setIsLoadingCourses(true);
      // Refresh user data first to get latest purchases
      await refreshUserData();
      const response = await apiClient.getMyCourses();
      setPurchasedCourses(response.courses || []);
    } catch (error) {
      console.error("Failed to fetch purchased courses:", error);
      // Fallback to mock data if API fails
      setPurchasedCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  if (!user) return null;

  // Helper functions for backward compatibility
  const hasActiveSubscription = () => {
    // Check if user has any purchased courses from API
    return purchasedCourses.length > 0;
  };

  const getPurchasedCoursesCount = () => {
    return purchasedCourses.length;
  };

  const hasJoinedCommunity = () => {
    // For now, assume users with completed purchases have community access
    return getPurchasedCoursesCount() > 0;
  };

  const upcomingClasses = [
    {
      id: "1",
      title: "Business English Conversation",
      date: "2024-01-15",
      time: "19:00",
      instructor: "Sarah Johnson",
      meetingLink: "https://meet.google.com/abc-def-ghi",
    },
    {
      id: "2",
      title: "IELTS Speaking Practice",
      date: "2024-01-17",
      time: "20:00",
      instructor: "Michael Chen",
      meetingLink: "https://zoom.us/j/123456789",
    },
  ];

  // Get real course progress from API data
  const getCourseProgress = () => {
    if (isLoadingCourses) return [];

    return purchasedCourses.map((course) => ({
      id: course.id,
      title: course.title_en,
      progress: 0, // Will be fetched from progress API later
      totalLessons: course.total_videos || 0,
      completedLessons: 0, // Will be fetched from progress API later
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Track your progress and access your learning materials
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="schedule">Live Classes</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscription Status
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hasActiveSubscription() ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasActiveSubscription()
                    ? "Based on course purchases"
                    : "No active subscription"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Purchased Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getPurchasedCoursesCount()}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime access</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Community Access
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hasJoinedCommunity() ? (
                    <Badge variant="default">Joined</Badge>
                  ) : (
                    <Badge variant="secondary">Not Joined</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasJoinedCommunity()
                    ? "Active member"
                    : "Purchase courses to join"}
                </p>
              </CardContent>
            </Card>
          </div>

          {hasActiveSubscription() && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Classes</CardTitle>
                <CardDescription>
                  Your scheduled classes this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((class_) => (
                    <div
                      key={class_.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{class_.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{class_.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{class_.time}</span>
                          </div>
                          <span>with {class_.instructor}</span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <a
                          href={class_.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Class
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Track your progress in purchased courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Loading your courses...
                  </p>
                </div>
              ) : getPurchasedCoursesCount() > 0 ? (
                <div className="space-y-6">
                  {getCourseProgress().map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant="outline">
                          {course.progress}% Complete
                        </Badge>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons completed
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/courses/${course.id}`}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Continue Learning
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase courses to start your learning journey
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Class Schedule</CardTitle>
              <CardDescription>
                {hasActiveSubscription()
                  ? "Your upcoming live classes and recordings"
                  : "Purchase courses to access live classes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription() ? (
                <div className="space-y-4">
                  {upcomingClasses.map((class_) => (
                    <div
                      key={class_.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{class_.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{class_.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{class_.time}</span>
                          </div>
                          <span>with {class_.instructor}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Recording
                        </Button>
                        <Button size="sm" asChild>
                          <a
                            href={class_.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Purchase Courses to Access Live Classes
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Buy courses to participate in live interactive classes
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Access</CardTitle>
              <CardDescription>
                {hasJoinedCommunity()
                  ? "You're part of our learning community"
                  : "Join our community to connect with other learners"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasJoinedCommunity() ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">
                        You're connected!
                      </h4>
                      <p className="text-sm text-green-600">
                        Access your community groups below
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 bg-transparent"
                      asChild
                    >
                      <a
                        href="https://t.me/fomoenglish"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-left">
                          <div className="font-medium">Telegram Group</div>
                          <div className="text-sm text-muted-foreground">
                            Daily practice & discussions
                          </div>
                        </div>
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 bg-transparent"
                      asChild
                    >
                      <a
                        href="https://zalo.me/g/fomoenglish"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-left">
                          <div className="font-medium">Zalo Group</div>
                          <div className="text-sm text-muted-foreground">
                            Vietnamese community
                          </div>
                        </div>
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Join Our Learning Community
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase courses to get access to our exclusive community
                    groups
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
