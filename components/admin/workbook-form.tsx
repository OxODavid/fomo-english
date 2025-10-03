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

interface WorkbookFormData {
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  price_usd?: number;
  price_vnd?: number;
  original_price_usd?: number;
  original_price_vnd?: number;
  level: string;
  category: string;
  pages: number;
  pdf_url?: string;
  cover_image_url?: string;
  is_free: boolean;
  is_active: boolean;
}

interface WorkbookFormProps {
  workbook?: WorkbookFormData;
  onSave: (data: WorkbookFormData) => void;
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

export function WorkbookForm({
  workbook,
  onSave,
  onCancel,
  isLoading = false,
}: WorkbookFormProps) {
  const [formData, setFormData] = useState<WorkbookFormData>({
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
    pages: 0,
    pdf_url: "",
    cover_image_url: "",
    is_free: false,
    is_active: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (workbook) {
      setFormData(workbook);
    }
  }, [workbook]);

  const handleInputChange = (field: keyof WorkbookFormData, value: any) => {
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

    if (
      !formData.is_free &&
      (formData.price_usd! <= 0 || formData.price_vnd! <= 0)
    ) {
      toast({
        title: "Error",
        description: "Please enter valid prices for paid workbooks",
        variant: "destructive",
      });
      return;
    }

    if (!formData.pdf_url) {
      toast({
        title: "Error",
        description: "Please provide a PDF URL",
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
                placeholder="Workbook title in English"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_vi">Vietnamese Title *</Label>
              <Input
                id="title_vi"
                value={formData.title_vi}
                onChange={(e) => handleInputChange("title_vi", e.target.value)}
                placeholder="Tiêu đề sách bài tập bằng tiếng Việt"
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
                placeholder="Workbook description in English"
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
                placeholder="Mô tả sách bài tập bằng tiếng Việt"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                value={formData.cover_image_url || ""}
                onChange={(e) =>
                  handleInputChange("cover_image_url", e.target.value)
                }
                placeholder="https://example.com/workbook-cover.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workbook Details */}
        <Card>
          <CardHeader>
            <CardTitle>Workbook Details</CardTitle>
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

            <div className="space-y-2">
              <Label htmlFor="pages">Number of Pages *</Label>
              <Input
                id="pages"
                type="number"
                min="0"
                value={formData.pages}
                onChange={(e) =>
                  handleInputChange("pages", Number(e.target.value) || 0)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf_url">PDF URL *</Label>
              <Input
                id="pdf_url"
                value={formData.pdf_url}
                onChange={(e) => handleInputChange("pdf_url", e.target.value)}
                placeholder="https://example.com/workbook.pdf"
                required
              />
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_free">Free Workbook</Label>
              <p className="text-sm text-muted-foreground">
                Make this workbook available for free download
              </p>
            </div>
            <Switch
              id="is_free"
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                handleInputChange("is_free", checked)
              }
            />
          </div>

          {!formData.is_free && (
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
                      value={formData.price_usd || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price_usd",
                          Number(e.target.value) || 0,
                        )
                      }
                      required={!formData.is_free}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_vnd">VND Price *</Label>
                    <Input
                      id="price_vnd"
                      type="number"
                      min="0"
                      value={formData.price_vnd || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price_vnd",
                          Number(e.target.value) || 0,
                        )
                      }
                      required={!formData.is_free}
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
          )}
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
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Workbook is visible and downloadable
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
          {workbook ? "Update Workbook" : "Create Workbook"}
        </Button>
      </div>
    </form>
  );
}
