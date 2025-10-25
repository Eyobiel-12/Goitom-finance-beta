import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Building2, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ClientsTable } from "@/components/clients/clients-table"
import { ClientStatsGrid } from "@/components/clients/client-stats-grid"

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching clients:", error)
  }

  // Calculate statistics
  const totalClients = clients?.length || 0
  const activeClients = Math.floor(totalClients * 0.85) // Mock: 85% active
  const countries = new Set(clients?.map(c => c.country).filter(Boolean) || []).size
  const avgProjectsPerClient = 2.3 // Mock data

  // Mock growth data
  const clientsGrowth = 15.2
  const activeGrowth = 8.7
  const countriesGrowth = 12.5
  const projectsGrowth = 18.3

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Klantbeheer</span>
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                    Klanten
                  </h1>
                  <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                    Beheer je klantrelaties, houd projecten bij en bouw duurzame partnerschappen.
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link href="/dashboard/clients/new">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Klant Toevoegen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Client Statistics */}
          <ClientStatsGrid
            totalClients={totalClients}
            activeClients={activeClients}
            countriesCount={countries}
            avgProjectsPerClient={avgProjectsPerClient}
            clientsGrowth={clientsGrowth}
            activeGrowth={activeGrowth}
            countriesGrowth={countriesGrowth}
            projectsGrowth={projectsGrowth}
          />

          {/* Clients Table */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Alle Klanten
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Beheer en organiseer je klantendatabase</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ClientsTable clients={clients || []} />
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
