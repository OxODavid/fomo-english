import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TeamSectionProps {
  locale?: string
}

export function TeamSection({ locale = "en" }: TeamSectionProps) {
  const team = [
    {
      name: "Sarah Johnson",
      role: locale === "en" ? "Founder & Lead Instructor" : "Người sáng lập & Giảng viên chính",
      bio:
        locale === "en"
          ? "10+ years teaching English to Vietnamese professionals. TESOL certified with MBA in International Business."
          : "10+ năm dạy tiếng Anh cho chuyên gia Việt Nam. Chứng chỉ TESOL với MBA Kinh doanh Quốc tế.",
      image: "/professional-woman-teacher.png",
      specialties: [
        locale === "en" ? "Business English" : "Tiếng Anh thương mại",
        locale === "en" ? "IELTS Preparation" : "Luyện thi IELTS",
      ],
    },
    {
      name: "Michael Chen",
      role: locale === "en" ? "Technical English Specialist" : "Chuyên gia tiếng Anh kỹ thuật",
      bio:
        locale === "en"
          ? "Former software engineer turned English instructor. Specializes in IT and engineering vocabulary."
          : "Cựu kỹ sư phần mềm chuyển sang giảng dạy tiếng Anh. Chuyên về từ vựng IT và kỹ thuật.",
      image: "/professional-man-teacher-technology.jpg",
      specialties: [
        locale === "en" ? "Technical Writing" : "Viết kỹ thuật",
        locale === "en" ? "IT Vocabulary" : "Từ vựng IT",
      ],
    },
    {
      name: "Dr. Emily Rodriguez",
      role: locale === "en" ? "Medical English Expert" : "Chuyên gia tiếng Anh y khoa",
      bio:
        locale === "en"
          ? "Medical doctor with expertise in teaching medical English to healthcare professionals."
          : "Bác sĩ y khoa với chuyên môn dạy tiếng Anh y khoa cho các chuyên gia chăm sóc sức khỏe.",
      image: "/professional-woman-doctor-teacher.jpg",
      specialties: [
        locale === "en" ? "Medical Terminology" : "Thuật ngữ y khoa",
        locale === "en" ? "Healthcare Communication" : "Giao tiếp y tế",
      ],
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            {locale === "en" ? "Meet Our Expert Team" : "Gặp gỡ đội ngũ chuyên gia"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {locale === "en"
              ? "Our instructors combine deep industry knowledge with proven teaching expertise."
              : "Các giảng viên của chúng tôi kết hợp kiến thức ngành sâu với chuyên môn giảng dạy đã được chứng minh."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
