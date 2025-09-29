import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StorySectionProps {
  locale?: string
}

export function StorySection({ locale = "en" }: StorySectionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="w-fit mx-auto">
              {locale === "en" ? "Our Story" : "Câu chuyện của chúng tôi"}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              {locale === "en" ? "From FOMO to Fluency" : "Từ FOMO đến thành thạo"}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                {locale === "en"
                  ? "FOMO English was born from a simple observation: too many talented Vietnamese professionals were missing out on global opportunities due to language barriers."
                  : "FOMO English ra đời từ một quan sát đơn giản: quá nhiều chuyên gia Việt Nam tài năng đã bỏ lỡ cơ hội toàn cầu do rào cản ngôn ngữ."}
              </p>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "We realized that traditional English learning methods weren't addressing the specific needs of working professionals. Generic courses couldn't provide the industry-specific vocabulary and practical communication skills needed in today's global workplace."
                  : "Chúng tôi nhận ra rằng các phương pháp học tiếng Anh truyền thống không giải quyết được nhu cầu cụ thể của các chuyên gia đang làm việc. Các khóa học chung chung không thể cung cấp từ vựng chuyên ngành và kỹ năng giao tiếp thực tế cần thiết trong môi trường làm việc toàn cầu ngày nay."}
              </p>
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "That's why we created FOMO English - to bridge this gap with practical, industry-focused learning that fits into your busy professional life."
                  : "Đó là lý do chúng tôi tạo ra FOMO English - để thu hẹp khoảng cách này bằng việc học tập thực tế, tập trung vào ngành nghề phù hợp với cuộc sống nghề nghiệp bận rộn của bạn."}
              </p>
            </div>

            <Card className="p-8 shadow-lg">
              <CardContent className="p-0 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">10,000+</div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "en" ? "Professionals Trained" : "Chuyên gia được đào tạo"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Success Rate" : "Tỷ lệ thành công"}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Industries Covered" : "Ngành nghề"}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Community Support" : "Hỗ trợ cộng đồng"}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">3+</div>
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Years Experience" : "Năm kinh nghiệm"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
