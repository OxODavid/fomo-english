"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Calendar, Video, MessageCircle } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  duration: string
  isPopular?: boolean
  features: string[]
  communityAccess: boolean
  liveClasses: number
  videoLessons: number
  support: string
}

interface PricingCardProps {
  plan: PricingPlan
  locale: string
  onSubscribe: (planId: string) => void
}

export function PricingCard({ plan, locale, onSubscribe }: PricingCardProps) {
  return (
    <Card className={`relative ${plan.isPopular ? "border-primary shadow-lg scale-105" : ""}`}>
      {plan.isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
          <Star className="w-3 h-3 mr-1" />
          {locale === "en" ? "Most Popular" : "Phổ biến nhất"}
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-bold text-primary">{plan.price}</span>
            {plan.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{plan.duration}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4 text-primary" />
            <span>
              {plan.videoLessons} {locale === "en" ? "videos" : "video"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {plan.liveClasses} {locale === "en" ? "live classes" : "lớp trực tiếp"}
            </span>
          </div>
          {plan.communityAccess && (
            <div className="flex items-center space-x-2 col-span-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>{locale === "en" ? "Community access" : "Truy cập cộng đồng"}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.isPopular ? "default" : "outline"}
          onClick={() => onSubscribe(plan.id)}
        >
          {locale === "en" ? "Choose Plan" : "Chọn gói"}
        </Button>
      </CardFooter>
    </Card>
  )
}
