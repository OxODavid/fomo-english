"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CreditCard,
  DollarSign,
  Info,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Course {
  id: string;
  title_en: string;
  title_vi: string;
  price_usd: number;
  price_vnd: number;
  original_price_usd?: number;
  original_price_vnd?: number;
  image_url?: string;
  level: string;
  category: string;
  duration_hours: number;
}

interface CoursePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onPurchaseSuccess?: () => void;
}

export function CoursePurchaseModal({
  isOpen,
  onClose,
  course,
  onPurchaseSuccess,
}: CoursePurchaseModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "VND">("VND");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course || !user) return;

    setIsLoading(true);

    try {
      const purchaseData = {
        full_name: formData.full_name || user.name,
        phone: formData.phone || user.phone || "",
        notes: formData.notes,
        amount: currency === "USD" ? course.price_usd : course.price_vnd,
        currency: currency,
      };

      const response = await apiClient.purchaseCourse(course.id, purchaseData);

      toast({
        title: "Purchase Request Submitted",
        description: response.message,
      });

      onClose();
      onPurchaseSuccess?.();

      setFormData({ full_name: "", phone: "", notes: "" });
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!course) return null;

  const price = currency === "USD" ? course.price_usd : course.price_vnd;
  const originalPrice =
    currency === "USD" ? course.original_price_usd : course.original_price_vnd;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formatPrice = (amount: number, curr: string) => {
    if (curr === "USD") {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount.toLocaleString("vi-VN")} VND`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Purchase Course</span>
          </DialogTitle>
          <DialogDescription>
            Complete your purchase to get lifetime access to this course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Course Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title_en}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{course.title_en}</h3>
                  <p className="text-muted-foreground">{course.title_vi}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="outline">{course.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {course.duration_hours} hours
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Select
                      value={currency}
                      onValueChange={(value: "USD" | "VND") =>
                        setCurrency(value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="VND">VND</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {formatPrice(price, currency)}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(originalPrice!, currency)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            -{discountPercentage}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Lifetime access included</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Bank Transfer Details:</strong>
                </p>
                <div className="bg-white p-3 rounded border">
                  <p>
                    <strong>Bank:</strong> Vietcombank
                  </p>
                  <p>
                    <strong>Account Number:</strong> 1234567890
                  </p>
                  <p>
                    <strong>Account Name:</strong> FOMO ENGLISH
                  </p>
                  <p>
                    <strong>Transfer Content:</strong> FOMO ENGLISH COURSE
                    PAYMENT [Your Name]
                  </p>
                </div>
                <p className="text-muted-foreground">
                  After completing the bank transfer, our admin will verify your
                  payment within 24 hours and grant you access to the course.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <form onSubmit={handlePurchase} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || user?.name || ""}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || user?.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+84123456789"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information about your payment..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <DollarSign className="mr-2 h-4 w-4" />
                Submit Purchase Request
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
