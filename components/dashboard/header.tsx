"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, UserIcon, Bell, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const userInitials = user.email?.split("@")[0].slice(0, 2).toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="w-12 lg:hidden" /> {/* Spacer for mobile menu button */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="Goitom Finance Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent md:text-2xl">
              Welkom terug
            </h2>
            <p className="text-sm text-slate-600">Klaar om je bedrijf te beheren?</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold shadow-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 backdrop-blur-md border-slate-200/50 shadow-xl">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900">Mijn Account</p>
                <p className="text-xs text-slate-600">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200/50" />
            
            <DropdownMenuItem asChild className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              <a href="/dashboard/settings" className="cursor-pointer flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <UserIcon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Profiel Instellingen</p>
                  <p className="text-xs text-slate-600">Beheer je account</p>
                </div>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              <a href="/dashboard/settings" className="cursor-pointer flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <Settings className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Voorkeuren</p>
                  <p className="text-xs text-slate-600">Pas je ervaring aan</p>
                </div>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-slate-200/50" />
            
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Uitloggen</p>
                <p className="text-xs text-red-600">Beëindig je sessie</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
