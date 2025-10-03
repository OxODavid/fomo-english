"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Banknote } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface WorkbookPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  workbook: {
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
    pages: number;
    cover_image_url?: string;
    is_free: boolean;
  };
  onPurchaseSuccess?: () => void;
}

export function WorkbookPurchaseModal({
  isOpen,
  onClose,
  workbook,
  onPurchaseSuccess,
}: WorkbookPurchaseModalProps) {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    notes: "",
    currency: "VND",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = locale === "vi" ? workbook.title_vi : workbook.title_en;
  const description =
    locale === "vi"
      ? workbook.description_vi || workbook.description_en
      : workbook.description_en;

  const formatPrice = (usd: number, vnd: number) => {
    if (locale === "vi") {
      return `${Number(vnd).toLocaleString("vi-VN")} VND`;
    }
    return `$${Number(usd).toFixed(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.full_name.trim()) {
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Vui lòng nhập họ tên đầy đủ."
            : "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Vui lòng nhập số điện thoại."
            : "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    if (workbook.is_free) {
      // For free workbooks, download directly
      try {
        const response = await apiClient.downloadWorkbook(workbook.id);

        // Create download link with proper attributes for actual download
        const link = document.createElement("a");
        link.href = response.download_url;
        link.download = `${(locale === "vi"
          ? workbook.title_vi
          : workbook.title_en
        ).replace(/[^a-zA-Z0-9\s]/g, "")}.pdf`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute(
          "download",
          `${(locale === "vi" ? workbook.title_vi : workbook.title_en).replace(
            /[^a-zA-Z0-9\s]/g,
            "",
          )}.pdf`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description:
            locale === "vi"
              ? "Sách bài tập miễn phí đã được tải xuống thành công!"
              : "Free workbook downloaded successfully!",
        });
      } catch (error) {
        console.error("Free workbook download failed:", error);
        toast({
          title: locale === "vi" ? "Lỗi" : "Error",
          description:
            locale === "vi"
              ? "Không thể tải xuống sách bài tập miễn phí. Vui lòng thử lại."
              : "Failed to download free workbook. Please try again.",
          variant: "destructive",
        });
      }

      onClose();
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
      return;
    }

    try {
      setIsSubmitting(true);

      const rawAmount =
        formData.currency === "VND" ? workbook.price_vnd : workbook.price_usd;
      const amount = Number(rawAmount);

      console.log("🔍 Purchase debug:", {
        currency: formData.currency,
        rawAmount,
        amount,
        isNaN: isNaN(amount),
        workbook: {
          price_usd: workbook.price_usd,
          price_vnd: workbook.price_vnd,
        },
      });

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: locale === "vi" ? "Lỗi" : "Error",
          description:
            locale === "vi"
              ? "Giá sách bài tập không hợp lệ. Vui lòng thử lại."
              : "Invalid workbook price. Please try again.",
          variant: "destructive",
        });
        return;
      }

      await apiClient.purchaseWorkbook(workbook.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        notes: formData.notes,
        amount: amount,
        currency: formData.currency,
      });

      // Show success message
      toast({
        title: locale === "vi" ? "Thành công" : "Success",
        description:
          locale === "vi"
            ? "Yêu cầu thanh toán đã được tạo. Vui lòng chuyển khoản và chờ admin xác nhận."
            : "Payment request created. Please complete the bank transfer and wait for admin verification.",
      });

      onClose();
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Có lỗi xảy ra khi tạo yêu cầu thanh toán. Vui lòng thử lại."
            : "Failed to create payment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {workbook.is_free
              ? locale === "vi"
                ? "Tải xuống sách bài tập"
                : "Download Workbook"
              : locale === "vi"
              ? "Mua sách bài tập"
              : "Purchase Workbook"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workbook Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            {workbook.cover_image_url && (
              <img
                src={workbook.cover_image_url}
                alt={title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{workbook.category}</Badge>
                <Badge variant="outline">{workbook.level}</Badge>
                <span className="text-sm text-gray-500">
                  {workbook.pages} {locale === "vi" ? "trang" : "pages"}
                </span>
              </div>
            </div>
          </div>

          {workbook.is_free ? (
            // Free Workbook
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === "vi" ? "Sách bài tập miễn phí" : "Free Workbook"}
              </h3>
              <p className="text-gray-600 mb-6">
                {locale === "vi"
                  ? "Bạn có thể tải xuống sách bài tập này ngay lập tức mà không cần thanh toán."
                  : "You can download this workbook immediately without payment."}
              </p>
              <Button onClick={handleSubmit} size="lg" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {locale === "vi" ? "Tải xuống ngay" : "Download Now"}
              </Button>
            </div>
          ) : (
            // Paid Workbook
            <>
              {/* Price Display */}
              <div className="text-center py-6 border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(workbook.price_usd, workbook.price_vnd)}
                </div>
                {workbook.original_price_usd && workbook.original_price_vnd && (
                  <div className="text-lg text-gray-500 line-through">
                    {formatPrice(
                      workbook.original_price_usd,
                      workbook.original_price_vnd,
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  {locale === "vi" ? "Truy cập trọn đời" : "Lifetime access"}
                </p>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">
                      {locale === "vi" ? "Họ và tên *" : "Full Name *"}
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      required
                      placeholder={
                        locale === "vi"
                          ? "Nhập họ và tên"
                          : "Enter your full name"
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {locale === "vi" ? "Số điện thoại *" : "Phone Number *"}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                      placeholder={
                        locale === "vi"
                          ? "Nhập số điện thoại"
                          : "Enter phone number"
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currency">
                    {locale === "vi" ? "Loại tiền tệ" : "Currency"}
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      handleInputChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND (Vietnamese Dong)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">
                    {locale === "vi" ? "Ghi chú thanh toán" : "Payment Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={
                      locale === "vi"
                        ? "Ghi chú về phương thức thanh toán..."
                        : "Notes about payment method..."
                    }
                    rows={3}
                  />
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    {locale === "vi"
                      ? "Hướng dẫn thanh toán"
                      : "Payment Instructions"}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      {locale === "vi"
                        ? "1. Chuyển khoản theo thông tin sau:"
                        : "1. Transfer to the following account:"}
                    </p>
                    <p className="font-mono text-xs bg-white p-2 rounded">
                      {locale === "vi"
                        ? "Ngân hàng: Vietcombank\nSố tài khoản: 1234567890\nNội dung: FOMO ENGLISH WORKBOOK"
                        : "Bank: Vietcombank\nAccount: 1234567890\nContent: FOMO ENGLISH WORKBOOK"}
                    </p>
                    <p>
                      {locale === "vi"
                        ? "2. Sau khi chuyển khoản, admin sẽ xác nhận và cấp quyền truy cập."
                        : "2. After transfer, admin will verify and grant access."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    {locale === "vi" ? "Hủy" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      locale === "vi" ? (
                        "Đang xử lý..."
                      ) : (
                        "Processing..."
                      )
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {locale === "vi"
                          ? "Tạo yêu cầu thanh toán"
                          : "Create Payment Request"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
