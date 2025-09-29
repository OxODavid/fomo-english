"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingCard } from "@/components/subscription/pricing-card"
import { PaymentModal } from "@/components/subscription/payment-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Video, Calendar, MessageCircle, Star, CheckCircle, Clock, Zap } from "lucide-react"

export default function SubscriptionPage() {
  const [locale, setLocale] = useState<string>("en")
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: string } | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const plans = [
    {
      id: "monthly",
      name: locale === "en" ? "Monthly Plan" : "Gói tháng",
      description: locale === "en" ? "Perfect for getting started" : "Hoàn hảo để bắt đầu",
      price: locale === "en" ? "$49" : "1.199.000đ",
      duration: locale === "en" ? "per month" : "mỗi tháng",
      features: [
        locale === "en" ? "Access to all video lessons" : "Truy cập tất cả bài học video",
        locale === "en" ? "4 live classes per month" : "4 lớp học trực tiếp mỗi tháng",
        locale === "en" ? "Community group access" : "Truy cập nhóm cộng đồng",
        locale === "en" ? "Email support" : "Hỗ trợ qua email",
        locale === "en" ? "Monthly progress reports" : "Báo cáo tiến độ hàng tháng",
      ],
      communityAccess: true,
      liveClasses: 4,
      videoLessons: 50,
      support: locale === "en" ? "Email" : "Email",
    },
    {
      id: "quarterly",
      name: locale === "en" ? "3-Month Plan" : "Gói 3 tháng",
      description: locale === "en" ? "Most popular choice" : "Lựa chọn phổ biến nhất",
      price: locale === "en" ? "$129" : "3.099.000đ",
      originalPrice: locale === "en" ? "$147" : "3.597.000đ",
      duration: locale === "en" ? "for 3 months" : "cho 3 tháng",
      isPopular: true,
      features: [
        locale === "en" ? "Everything in Monthly Plan" : "Tất cả trong gói tháng",
        locale === "en" ? "12% discount (save $18)" : "Giảm 12% (tiết kiệm 498.000đ)",
        locale === "en" ? "Priority support" : "Hỗ trợ ưu tiên",
        locale === "en" ? "Bonus: 2 extra live classes" : "Thưởng: 2 lớp học trực tiếp thêm",
        locale === "en" ? "Detailed progress analytics" : "Phân tích tiến độ chi tiết",
        locale === "en" ? "1-on-1 consultation session" : "Buổi tư vấn 1-1",
      ],
      communityAccess: true,
      liveClasses: 14,
      videoLessons: 150,
      support: locale === "en" ? "Priority" : "Ưu tiên",
    },
    {
      id: "semi-annual",
      name: locale === "en" ? "6-Month Plan" : "Gói 6 tháng",
      description: locale === "en" ? "Best value for serious learners" : "Giá trị tốt nhất cho người học nghiêm túc",
      price: locale === "en" ? "$239" : "5.799.000đ",
      originalPrice: locale === "en" ? "$294" : "7.194.000đ",
      duration: locale === "en" ? "for 6 months" : "cho 6 tháng",
      features: [
        locale === "en" ? "Everything in 3-Month Plan" : "Tất cả trong gói 3 tháng",
        locale === "en" ? "19% discount (save $55)" : "Giảm 19% (tiết kiệm 1.395.000đ)",
        locale === "en" ? "VIP community access" : "Truy cập cộng đồng VIP",
        locale === "en" ? "Monthly 1-on-1 sessions" : "Buổi 1-1 hàng tháng",
        locale === "en" ? "Custom learning path" : "Lộ trình học tùy chỉnh",
        locale === "en" ? "Certificate of completion" : "Chứng chỉ hoàn thành",
        locale === "en" ? "Lifetime access to materials" : "Truy cập trọn đời tài liệu",
      ],
      communityAccess: true,
      liveClasses: 30,
      videoLessons: 300,
      support: locale === "en" ? "VIP" : "VIP",
    },
  ]

  const benefits = [
    {
      icon: Video,
      title: locale === "en" ? "Expert-Led Video Lessons" : "Bài học video do chuyên gia dẫn dắt",
      description:
        locale === "en"
          ? "High-quality video content covering all aspects of professional English"
          : "Nội dung video chất lượng cao bao gồm tất cả khía cạnh của tiếng Anh chuyên nghiệp",
    },
    {
      icon: Calendar,
      title: locale === "en" ? "Live Interactive Classes" : "Lớp học tương tác trực tiếp",
      description:
        locale === "en"
          ? "Join live sessions with instructors and fellow students for real-time practice"
          : "Tham gia các buổi học trực tiếp với giảng viên và học viên khác để thực hành theo thời gian thực",
    },
    {
      icon: MessageCircle,
      title: locale === "en" ? "Exclusive Community" : "Cộng đồng độc quyền",
      description:
        locale === "en"
          ? "Connect with like-minded learners and get support from our community"
          : "Kết nối với những người học cùng chí hướng và nhận hỗ trợ từ cộng đồng của chúng tôi",
    },
    {
      icon: Star,
      title: locale === "en" ? "Personalized Support" : "Hỗ trợ cá nhân hóa",
      description:
        locale === "en"
          ? "Get personalized feedback and guidance from our expert instructors"
          : "Nhận phản hồi và hướng dẫn cá nhân hóa từ các giảng viên chuyên gia của chúng tôi",
    },
  ]

  const handleSubscribe = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (plan) {
      setSelectedPlan({
        id: plan.id,
        name: plan.name,
        price: plan.price,
      })
      setIsPaymentModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <Badge variant="secondary" className="mb-4">
                {locale === "en" ? "Monthly Subscription Plans" : "Gói đăng ký hàng tháng"}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                {locale === "en" ? (
                  <>
                    Join Our <span className="text-gradient">Learning Community</span> and{" "}
                    <span className="text-gradient">Master English</span>
                  </>
                ) : (
                  <>
                    Tham gia <span className="text-gradient">cộng đồng học tập</span> và{" "}
                    <span className="text-gradient">thành thạo tiếng Anh</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-muted-foreground">
                {locale === "en"
                  ? "Get unlimited access to live classes, expert guidance, and a supportive community of English learners."
                  : "Nhận quyền truy cập không giới hạn vào các lớp học trực tiếp, hướng dẫn chuyên gia và cộng đồng hỗ trợ người học tiếng Anh."}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>5,000+ {locale === "en" ? "Active Members" : "Thành viên tích cực"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>95% {locale === "en" ? "Success Rate" : "Tỷ lệ thành công"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{locale === "en" ? "24/7 Support" : "Hỗ trợ 24/7"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {locale === "en" ? "Why Choose Our Subscription?" : "Tại sao chọn gói đăng ký của chúng tôi?"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {locale === "en"
                  ? "Our subscription plans are designed to provide you with comprehensive learning experience and continuous support."
                  : "Các gói đăng ký của chúng tôi được thiết kế để cung cấp cho bạn trải nghiệm học tập toàn diện và hỗ trợ liên tục."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <benefit.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {locale === "en" ? "Choose Your Learning Journey" : "Chọn hành trình học tập của bạn"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {locale === "en"
                  ? "Select the plan that best fits your learning goals and schedule. All plans include access to our community and live classes."
                  : "Chọn gói phù hợp nhất với mục tiêu học tập và lịch trình của bạn. Tất cả các gói đều bao gồm quyền truy cập vào cộng đồng và các lớp học trực tiếp."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} locale={locale} onSubscribe={handleSubscribe} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>{locale === "en" ? "Money-Back Guarantee" : "Đảm bảo hoàn tiền"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === "en"
                      ? "Not satisfied with your learning experience? Get a full refund within the first 7 days of your subscription."
                      : "Không hài lòng với trải nghiệm học tập? Nhận hoàn tiền đầy đủ trong vòng 7 ngày đầu tiên của đăng ký."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {locale === "en" ? "Frequently Asked Questions" : "Câu hỏi thường gặp"}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === "en"
                      ? "How do I join the community after payment?"
                      : "Làm thế nào để tham gia cộng đồng sau khi thanh toán?"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === "en"
                      ? "After your payment is verified (within 24 hours), you'll receive an email with instructions to join our exclusive Telegram/Zalo community group."
                      : "Sau khi thanh toán được xác minh (trong vòng 24 giờ), bạn sẽ nhận được email với hướng dẫn tham gia nhóm cộng đồng Telegram/Zalo độc quyền của chúng tôi."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === "en" ? "How do live classes work?" : "Các lớp học trực tiếp hoạt động như thế nào?"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === "en"
                      ? "Live classes are conducted via Google Meet/Zoom. You can view the schedule and register for classes through your member dashboard. Each class is limited to ensure quality interaction."
                      : "Các lớp học trực tiếp được thực hiện qua Google Meet/Zoom. Bạn có thể xem lịch trình và đăng ký lớp học thông qua bảng điều khiển thành viên. Mỗi lớp có giới hạn để đảm bảo tương tác chất lượng."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === "en"
                      ? "Can I cancel my subscription anytime?"
                      : "Tôi có thể hủy đăng ký bất cứ lúc nào không?"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === "en"
                      ? "Yes, you can cancel your subscription at any time. For multi-month plans, you'll continue to have access until the end of your paid period."
                      : "Có, bạn có thể hủy đăng ký bất cứ lúc nào. Đối với các gói nhiều tháng, bạn sẽ tiếp tục có quyền truy cập cho đến hết thời gian đã thanh toán."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />

      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedPlan(null)
          }}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          locale={locale}
        />
      )}
    </div>
  )
}
