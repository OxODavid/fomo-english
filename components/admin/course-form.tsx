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
import { Loader2, Save, X, Plus } from "lucide-react";

interface VideoData {
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
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  sort_order: number;
  is_active: boolean;
  videos: VideoData[];
}

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
  total_videos?: number;
  instructor_id?: string;
  image_url?: string;
  is_lifetime_access?: boolean;
  is_active: boolean;
  sections?: SectionData[];
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
    sections: [],
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

    // Calculate total_videos from sections if sections exist
    let submitData = { ...formData };
    if (formData.sections && formData.sections.length > 0) {
      const totalVideos = formData.sections.reduce(
        (total, section) => total + (section.videos?.length || 0),
        0,
      );
      submitData = {
        ...formData,
        total_videos: totalVideos,
      };
    }

    onSave(submitData);
  };

  // Section management functions
  const addSection = () => {
    const newSection: SectionData = {
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      sort_order: (formData.sections?.length || 0) + 1,
      is_active: true,
      videos: [],
    };

    setFormData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const updateSection = (
    index: number,
    field: keyof SectionData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections:
        prev.sections?.map((section, i) =>
          i === index ? { ...section, [field]: value } : section,
        ) || [],
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections?.filter((_, i) => i !== index) || [],
    }));
  };

  // Video management functions
  const addVideo = (sectionIndex: number) => {
    const newVideo: VideoData = {
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      video_url: "",
      quiz_url: "",
      duration_minutes: 0,
      points_reward: 0,
      sort_order: (formData.sections?.[sectionIndex]?.videos?.length || 0) + 1,
      is_active: true,
    };

    setFormData((prev) => ({
      ...prev,
      sections:
        prev.sections?.map((section, i) =>
          i === sectionIndex
            ? { ...section, videos: [...(section.videos || []), newVideo] }
            : section,
        ) || [],
    }));
  };

  const updateVideo = (
    sectionIndex: number,
    videoIndex: number,
    field: keyof VideoData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections:
        prev.sections?.map((section, i) =>
          i === sectionIndex
            ? {
                ...section,
                videos:
                  section.videos?.map((video, j) =>
                    j === videoIndex ? { ...video, [field]: value } : video,
                  ) || [],
              }
            : section,
        ) || [],
    }));
  };

  const removeVideo = (sectionIndex: number, videoIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      sections:
        prev.sections?.map((section, i) =>
          i === sectionIndex
            ? {
                ...section,
                videos:
                  section.videos?.filter((_, j) => j !== videoIndex) || [],
              }
            : section,
        ) || [],
    }));
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

      {/* Course Content - Sections and Videos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Content</CardTitle>
            <Button type="button" onClick={addSection} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.sections?.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Section {sectionIndex + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Section Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title (English) *</Label>
                    <Input
                      value={section.title_en}
                      onChange={(e) =>
                        updateSection(sectionIndex, "title_en", e.target.value)
                      }
                      placeholder="Enter section title in English"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Title (Vietnamese) *</Label>
                    <Input
                      value={section.title_vi}
                      onChange={(e) =>
                        updateSection(sectionIndex, "title_vi", e.target.value)
                      }
                      placeholder="Enter section title in Vietnamese"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      value={section.description_en}
                      onChange={(e) =>
                        updateSection(
                          sectionIndex,
                          "description_en",
                          e.target.value,
                        )
                      }
                      placeholder="Enter section description in English"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Vietnamese)</Label>
                    <Textarea
                      value={section.description_vi || ""}
                      onChange={(e) =>
                        updateSection(
                          sectionIndex,
                          "description_vi",
                          e.target.value,
                        )
                      }
                      placeholder="Enter section description in Vietnamese"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      min="1"
                      value={section.sort_order}
                      onChange={(e) =>
                        updateSection(
                          sectionIndex,
                          "sort_order",
                          Number(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`section-active-${sectionIndex}`}
                      checked={section.is_active}
                      onCheckedChange={(checked) =>
                        updateSection(sectionIndex, "is_active", checked)
                      }
                    />
                    <Label htmlFor={`section-active-${sectionIndex}`}>
                      Active
                    </Label>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Videos</h5>
                    <Button
                      type="button"
                      onClick={() => addVideo(sectionIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </div>

                  {section.videos?.map((video, videoIndex) => (
                    <Card key={videoIndex} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h6 className="font-medium">
                            Video {videoIndex + 1}
                          </h6>
                          <Button
                            type="button"
                            onClick={() =>
                              removeVideo(sectionIndex, videoIndex)
                            }
                            variant="destructive"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Video Title (English) *</Label>
                            <Input
                              value={video.title_en}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "title_en",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter video title in English"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Video Title (Vietnamese) *</Label>
                            <Input
                              value={video.title_vi}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "title_vi",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter video title in Vietnamese"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Description (English)</Label>
                            <Textarea
                              value={video.description_en}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "description_en",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter video description in English"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description (Vietnamese)</Label>
                            <Textarea
                              value={video.description_vi || ""}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "description_vi",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter video description in Vietnamese"
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Video URL *</Label>
                            <Input
                              value={video.video_url}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "video_url",
                                  e.target.value,
                                )
                              }
                              placeholder="https://youtube.com/watch?v=example"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quiz URL</Label>
                            <Input
                              value={video.quiz_url || ""}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "quiz_url",
                                  e.target.value,
                                )
                              }
                              placeholder="https://quizlet.com/quiz1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Duration (minutes) *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={video.duration_minutes}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "duration_minutes",
                                  Number(e.target.value) || 0,
                                )
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Points Reward *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={video.points_reward}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "points_reward",
                                  Number(e.target.value) || 0,
                                )
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Sort Order</Label>
                            <Input
                              type="number"
                              min="1"
                              value={video.sort_order}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "sort_order",
                                  Number(e.target.value) || 1,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`video-active-${sectionIndex}-${videoIndex}`}
                              checked={video.is_active}
                              onCheckedChange={(checked) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "is_active",
                                  checked,
                                )
                              }
                            />
                            <Label
                              htmlFor={`video-active-${sectionIndex}-${videoIndex}`}
                            >
                              Active
                            </Label>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {(!formData.sections || formData.sections.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sections added yet. Click "Add Section" to get started.</p>
            </div>
          )}
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
