"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  User,
  BookOpen,
  Trophy,
  Calendar,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoading, updateProfile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profile_image_url: "",
    preferred_language: "en",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profile_image_url: user.profile_image_url || "",
        preferred_language: user.preferred_language || "en",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      profile_image_url: user.profile_image_url || "",
      preferred_language: user.preferred_language || "en",
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="workbooks">My Workbooks</TabsTrigger>
            <TabsTrigger value="points">Points & Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profile_image_url} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {user.points} points
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    {isEditing ? (
                      <Select
                        value={formData.preferred_language}
                        onValueChange={(value) =>
                          handleInputChange("preferred_language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {user.preferred_language === "vi"
                            ? "Tiếng Việt"
                            : "English"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you have purchased</CardDescription>
              </CardHeader>
              <CardContent>
                {user.course_purchases && user.course_purchases.length > 0 ? (
                  <div className="space-y-4">
                    {user.course_purchases.map((purchase: any) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <BookOpen className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">
                              {purchase.course?.title_en}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Purchased on {formatDate(purchase.purchase_date)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            purchase.payment_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {purchase.payment_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No courses purchased yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workbooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Workbooks</CardTitle>
                <CardDescription>Workbooks you have purchased</CardDescription>
              </CardHeader>
              <CardContent>
                {user.workbook_purchases &&
                user.workbook_purchases.length > 0 ? (
                  <div className="space-y-4">
                    {user.workbook_purchases.map((purchase: any) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <BookOpen className="h-8 w-8 text-green-500" />
                          <div>
                            <h3 className="font-semibold">
                              {purchase.workbook?.title_en}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Purchased on {formatDate(purchase.purchase_date)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            purchase.payment_status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {purchase.payment_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No workbooks purchased yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="points" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points & Progress</CardTitle>
                <CardDescription>
                  Your learning progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user.points}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {user.course_purchases?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Courses Owned
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {user.course_progress?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Courses in Progress
                    </p>
                  </div>
                </div>

                {user.course_progress && user.course_progress.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Progress</h3>
                    {user.course_progress.map((progress: any) => (
                      <div key={progress.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            {progress.course?.title_en}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {progress.progress_percentage}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${progress.progress_percentage}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {progress.completed_videos}/{progress.total_videos}{" "}
                          videos completed
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
