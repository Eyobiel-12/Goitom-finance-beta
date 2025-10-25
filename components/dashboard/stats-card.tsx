"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, FolderKanban, FileText, Euro } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface DashboardStatsCardProps {
  title: string
  value: string | number
  subtitle: string
  iconName: "Users" | "FolderKanban" | "FileText" | "Euro"
  growth: number
  gradient: string
  delay?: number
}

const iconMap = {
  Users,
  FolderKanban,
  FileText,
  Euro
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  iconName,
  growth,
  gradient,
  delay = 0
}: DashboardStatsCardProps) {
  const Icon = iconMap[iconName]
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/90 before:to-white/70 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "0.6s",
        transitionTimingFunction: "ease-out"
      }}
    >
      <CardContent className="relative p-6">
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500",
          gradient
        )} />
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              gradient
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                {title}
              </h3>
            </div>
          </div>
          
          {/* Growth indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+{growth}%</span>
          </div>
        </div>
        
        {/* Value */}
        <div className="relative mb-2">
          <div className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
            {value}
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
          {subtitle}
        </p>
        
        {/* Animated border */}
        <div className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:w-full",
          gradient,
          "w-0"
        )} />
      </CardContent>
    </Card>
  )
}
