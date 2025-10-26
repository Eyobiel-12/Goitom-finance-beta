"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FolderKanban, FileText, BarChart3, Settings, Menu, X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/dashboard/feedback-modal"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Klanten", href: "/dashboard/clients", icon: Users },
  { name: "Projecten", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Facturen", href: "/dashboard/invoices", icon: FileText },
  { name: "BTW Rapporten", href: "/dashboard/vat", icon: BarChart3 },
  { name: "Instellingen", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/90 backdrop-blur-sm shadow-lg border-slate-200/50 hover:bg-white hover:shadow-xl transition-all duration-200"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform border-r border-slate-200/50 bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Compact */}
          <div className={cn("flex items-center border-b border-slate-200/50 transition-all duration-300", isCollapsed ? "h-16 px-2 justify-center" : "h-16 px-4")}>
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Goitom Finance Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Goitom Finance
                  </h1>
                </div>
              )}
            </Link>
            
            {/* Collapse button - Always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute right-1 h-6 w-6 hover:bg-slate-100 hover:scale-105 transition-all duration-200 rounded-lg"
              title={isCollapsed ? "Uitklappen" : "Inklappen"}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>

          {/* Navigation - Compact */}
          <nav className={cn("flex-1 space-y-1 transition-all duration-300", isCollapsed ? "p-1" : "p-3")}>
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center rounded-lg transition-all duration-200 hover:scale-[1.02]",
                    isCollapsed ? "justify-center px-1 py-2" : "gap-3 px-3 py-3",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{
                    transitionDelay: `${100 + (index * 30)}ms`,
                    transitionDuration: "0.4s",
                    transitionTimingFunction: "ease-out"
                  }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-md transition-all duration-200",
                    isCollapsed ? "h-6 w-6" : "h-8 w-8",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-slate-100 group-hover:bg-slate-200"
                  )}>
                    <item.icon className={cn(
                      "transition-colors",
                      isCollapsed ? "h-3 w-3" : "h-4 w-4",
                      isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900"
                    )} />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.name}</span>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Beta Feedback Button */}
          <div className={cn("border-t border-slate-200/50 p-3", isCollapsed && "px-1")}>
            <Button
              onClick={() => setShowFeedback(true)}
              className={cn(
                "w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg",
                isCollapsed ? "h-10 w-10 p-0 justify-center" : "justify-start"
              )}
              variant="ghost"
            >
              <MessageSquare className="h-4 w-4" />
              {!isCollapsed && <span className="text-sm font-medium">Beta Feedback</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Feedback Modal */}
      <FeedbackModal open={showFeedback} onOpenChange={setShowFeedback} />
    </>
  )
}
