"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, CreditCard, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: string
  locale: string
}

export function PaymentModal({ isOpen, onClose, planName, planPrice, locale }: PaymentModalProps) {
  const [step, setStep] = useState<"payment-info" | "confirmation" | "success">("payment-info")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  })
  const { toast } = useToast()

  const bankInfo = {
    bankName: "Vietcombank",
    accountNumber: "1234567890",
    accountName: "FOMO ENGLISH EDUCATION",
    transferContent: `FOMO ${planName.replace(/\s+/g, "")} ${formData.fullName || "[TenCuaBan]"}`,
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: locale === "en" ? "Copied!" : "Đã sao chép!",
      description: locale === "en" ? "Information copied to clipboard" : "Thông tin đã được sao chép vào clipboard",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "payment-info") {
      setStep("confirmation")
    } else if (step === "confirmation") {
      // Here you would typically send the data to your backend
      console.log("Submitting payment request:", { ...formData, planName, planPrice })
      setStep("success")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "success"
              ? locale === "en"
                ? "Payment Request Submitted"
                : "Yêu cầu thanh toán đã được gửi"
              : locale === "en"
                ? "Complete Your Subscription"
                : "Hoàn tất đăng ký"}
          </DialogTitle>
          <DialogDescription>
            {step === "success"
              ? locale === "en"
                ? "We'll verify your payment and activate your subscription within 24 hours."
                : "Chúng tôi sẽ xác minh thanh toán và kích hoạt đăng ký của bạn trong vòng 24 giờ."
              : locale === "en"
                ? `You're subscribing to ${planName} for ${planPrice}`
                : `Bạn đang đăng ký gói ${planName} với giá ${planPrice}`}
          </DialogDescription>
        </DialogHeader>

        {step === "payment-info" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{locale === "en" ? "Full Name" : "Họ và tên"} *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{locale === "en" ? "Phone Number" : "Số điện thoại"} *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                {locale === "en" ? "Additional Notes (Optional)" : "Ghi chú thêm (Tùy chọn)"}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder={
                  locale === "en" ? "Any special requests or questions..." : "Yêu cầu đặc biệt hoặc câu hỏi..."
                }
              />
            </div>

            <Button type="submit" className="w-full">
              {locale === "en" ? "Continue to Payment" : "Tiếp tục thanh toán"}
            </Button>
          </form>
        )}

        {step === "confirmation" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>{locale === "en" ? "Bank Transfer Information" : "Thông tin chuyển khoản"}</span>
                </CardTitle>
                <CardDescription>
                  {locale === "en"
                    ? "Please transfer the exact amount to the following account:"
                    : "Vui lòng chuyển khoản chính xác số tiền đến tài khoản sau:"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{locale === "en" ? "Bank" : "Ngân hàng"}</p>
                      <p className="text-sm text-muted-foreground">{bankInfo.bankName}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.bankName)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{locale === "en" ? "Account Number" : "Số tài khoản"}</p>
                      <p className="text-sm text-muted-foreground">{bankInfo.accountNumber}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountNumber)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{locale === "en" ? "Account Name" : "Tên tài khoản"}</p>
                      <p className="text-sm text-muted-foreground">{bankInfo.accountName}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountName)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-medium text-primary">{locale === "en" ? "Amount" : "Số tiền"}</p>
                      <p className="text-sm font-bold">{planPrice}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(planPrice.replace(/[^\d]/g, ""))}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{locale === "en" ? "Transfer Content" : "Nội dung chuyển khoản"}</p>
                      <p className="text-sm text-muted-foreground">{bankInfo.transferContent}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.transferContent)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">{locale === "en" ? "Important:" : "Quan trọng:"}</p>
                    <p className="text-amber-700">
                      {locale === "en"
                        ? "Please include the exact transfer content to ensure quick processing. Your subscription will be activated within 24 hours after payment verification."
                        : "Vui lòng ghi chính xác nội dung chuyển khoản để đảm bảo xử lý nhanh chóng. Đăng ký của bạn sẽ được kích hoạt trong vòng 24 giờ sau khi xác minh thanh toán."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep("payment-info")} className="flex-1">
                {locale === "en" ? "Back" : "Quay lại"}
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                {locale === "en" ? "I've Made the Transfer" : "Tôi đã chuyển khoản"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {locale === "en" ? "Thank you for your subscription!" : "Cảm ơn bạn đã đăng ký!"}
              </h3>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "We've received your payment request and will verify it within 24 hours. You'll receive an email confirmation once your subscription is activated."
                  : "Chúng tôi đã nhận được yêu cầu thanh toán của bạn và sẽ xác minh trong vòng 24 giờ. Bạn sẽ nhận được email xác nhận khi đăng ký được kích hoạt."}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">
                {locale === "en" ? "What happens next?" : "Điều gì sẽ xảy ra tiếp theo?"}
              </p>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <p>
                  •{" "}
                  {locale === "en"
                    ? "Payment verification (within 24 hours)"
                    : "Xác minh thanh toán (trong vòng 24 giờ)"}
                </p>
                <p>
                  •{" "}
                  {locale === "en" ? "Email confirmation with access details" : "Email xác nhận với thông tin truy cập"}
                </p>
                <p>• {locale === "en" ? "Community group invitation" : "Lời mời tham gia nhóm cộng đồng"}</p>
                <p>• {locale === "en" ? "Access to live class schedule" : "Truy cập lịch học trực tiếp"}</p>
              </div>
            </div>

            <Button onClick={onClose} className="w-full">
              {locale === "en" ? "Close" : "Đóng"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
