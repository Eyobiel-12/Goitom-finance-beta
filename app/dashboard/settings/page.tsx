import { Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/settings/settings-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const supabase = await createClient()

  const [{ data: settings }, { data: organization }, { data: profile }] = await Promise.all([
    supabase.from("settings").select("*").single(),
    supabase.from("organizations").select("*").single(),
    supabase.from("profiles").select("*").single(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Account Beheer</span>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                  Instellingen
                </h1>
                <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                  Beheer je account, bedrijfsinstellingen en personaliseer je ervaring voor optimale productiviteit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Bedrijfsinstellingen
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Configureer je account en bedrijfsvoorkeuren</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <SettingsForm settings={settings} organization={organization} profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
