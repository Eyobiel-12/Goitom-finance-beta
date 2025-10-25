"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, Calendar, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VATSummaryCardsProps {
  currentPeriodSales: number
  currentPeriodVAT: number
  ytdSales: number
  ytdVAT: number
}

export function VATSummaryCards({ currentPeriodSales, currentPeriodVAT, ytdSales, ytdVAT }: VATSummaryCardsProps) {
  const currentMonth = new Date().toLocaleDateString("nl-NL", { month: "long", year: "numeric" })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    {
      title: "Huidige Periode Verkoop",
      value: currentPeriodSales,
      subtitle: currentMonth,
      icon: DollarSign,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      delay: 0
    },
    {
      title: "Huidige Periode BTW",
      value: currentPeriodVAT,
      subtitle: currentMonth,
      icon: FileText,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      delay: 100
    },
    {
      title: "Jaar-tot-datum Verkoop",
      value: ytdSales,
      subtitle: `${new Date().getFullYear()}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      delay: 200
    },
    {
      title: "Jaar-tot-datum BTW",
      value: ytdVAT,
      subtitle: `${new Date().getFullYear()}`,
      icon: Calendar,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      delay: 300
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className={cn(
            "relative overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out hover:shadow-xl hover:scale-[1.02] group",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: `${card.delay}ms` }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors">
              {card.title}
            </CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${card.gradient} shadow-md group-hover:scale-110 transition-transform duration-200`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              {new Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(card.value)}
            </div>
            <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors mt-1">
              {card.subtitle}
            </p>
            
            {/* Animated border */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.gradient} w-0 group-hover:w-full transition-all duration-500`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
