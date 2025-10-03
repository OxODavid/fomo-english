"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, X } from "lucide-react";

interface CourseFormData {
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
  instructor_id?: string;
  image_url?: string;
  is_lifetime_access?: boolean;
  is_active: boolean;
}

interface CourseFormProps {
  course?: CourseFormData;
  onSave: (data: CourseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all_levels", label: "All Levels" },
];

const categories = [
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ielts", label: "IELTS" },
];

export function CourseForm({
  course,
  onSave,
  onCancel,
  isLoading = false,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title_en: "",
    title_vi: "",
    description_en: "",
    description_vi: "",
    price_usd: 0,
    price_vnd: 0,
    original_price_usd: 0,
    original_price_vnd: 0,
    level: "intermediate",
    category: "business",
    duration_hours: 0,
    total_videos: 0,
    instructor_id: "",
    image_url: "",
    is_lifetime_access: true,
    is_active: true,
  });

  const [instructors, setInstructors] = useState<any[]>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
    fetchInstructors();
  }, [course]);

  const fetchInstructors = async () => {
    setIsLoadingInstructors(true);
    try {
      // Mock instructors for now
      setInstructors([
        { id: "1", name: "Sarah Johnson" },
        { id: "2", name: "Michael Chen" },
        { id: "3", name: "Dr. Emily Rodriguez" },
      ]);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    } finally {
      setIsLoadingInstructors(false);
    }
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title_en || !formData.title_vi) {
      toast({
        title: "Error",
        description: "Please fill in both English and Vietnamese titles",
        variant: "destructive",
      });
      return;
    }

    if (formData.price_usd <= 0 || formData.price_vnd <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid prices",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">English Title *</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleInputChange("title_en", e.target.value)}
                placeholder="Course title in English"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_vi">Vietnamese Title *</Label>
              <Input
                id="title_vi"
                value={formData.title_vi}
                onChange={(e) => handleInputChange("title_vi", e.target.value)}
                placeholder="Tiêu đề khóa học bằng tiếng Việt"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_en">English Description</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) =>
                  handleInputChange("description_en", e.target.value)
                }
                placeholder="Course description in English"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_vi">Vietnamese Description</Label>
              <Textarea
                id="description_vi"
                value={formData.description_vi}
                onChange={(e) =>
                  handleInputChange("description_vi", e.target.value)
                }
                placeholder="Mô tả khóa học bằng tiếng Việt"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://example.com/course-image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
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

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duration (hours) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  min="0"
                  value={formData.duration_hours}
                  onChange={(e) =>
                    handleInputChange(
                      "duration_hours",
                      Number(e.target.value) || 0,
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_videos">Total Videos *</Label>
                <Input
                  id="total_videos"
                  type="number"
                  min="0"
                  value={formData.total_videos}
                  onChange={(e) =>
                    handleInputChange(
                      "total_videos",
                      Number(e.target.value) || 0,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor_id">Instructor</Label>
              <Select
                value={formData.instructor_id || ""}
                onValueChange={(value) =>
                  handleInputChange("instructor_id", value)
                }
                disabled={isLoadingInstructors}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Current Price</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_usd">USD Price *</Label>
                  <Input
                    id="price_usd"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_usd}
                    onChange={(e) =>
                      handleInputChange(
                        "price_usd",
                        Number(e.target.value) || 0,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_vnd">VND Price *</Label>
                  <Input
                    id="price_vnd"
                    type="number"
                    min="0"
                    value={formData.price_vnd}
                    onChange={(e) =>
                      handleInputChange(
                        "price_vnd",
                        Number(e.target.value) || 0,
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Original Price (Optional)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original_price_usd">Original USD</Label>
                  <Input
                    id="original_price_usd"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.original_price_usd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "original_price_usd",
                        Number(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price_vnd">Original VND</Label>
                  <Input
                    id="original_price_vnd"
                    type="number"
                    min="0"
                    value={formData.original_price_vnd || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "original_price_vnd",
                        Number(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_lifetime_access">Lifetime Access</Label>
              <p className="text-sm text-muted-foreground">
                Users get lifetime access to this course
              </p>
            </div>
            <Switch
              id="is_lifetime_access"
              checked={formData.is_lifetime_access}
              onCheckedChange={(checked) =>
                handleInputChange("is_lifetime_access", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Course is visible and purchasable
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleInputChange("is_active", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
