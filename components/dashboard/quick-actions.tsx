"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderKanban, FileText, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function DashboardQuickActions() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const actions = [
    {
      title: "Klant Toevoegen",
      description: "Maak een nieuw klantprofiel aan",
      icon: Users,
      href: "/dashboard/clients/new",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Nieuw Project",
      description: "Begin met het volgen van een nieuw project",
      icon: FolderKanban,
      href: "/dashboard/projects/new",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "Factuur Aanmaken",
      description: "Genereer een nieuwe factuur",
      icon: FileText,
      href: "/dashboard/invoices/new",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ]

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Snelle Acties
            </CardTitle>
            <p className="text-slate-600 mt-1">Krijg dingen sneller gedaan</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-slate-300/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                transitionDelay: `${400 + (index * 100)}ms`,
                transitionDuration: "0.6s",
                transitionTimingFunction: "ease-out"
              }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                    {action.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
                
                {/* Animated border */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${action.gradient} w-0 group-hover:w-full transition-all duration-500`} />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
