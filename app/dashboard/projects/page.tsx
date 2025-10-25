import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FolderKanban, CheckCircle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { ProjectsTable } from "@/components/projects/projects-table"
import { ProjectStatsGrid } from "@/components/projects/project-stats-grid"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching projects:", error)
  }

  // Calculate statistics
  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
  const totalBudget = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0

  // Mock growth data
  const projectsGrowth = 18.5
  const activeGrowth = 12.3
  const completedGrowth = 25.7
  const budgetGrowth = 22.1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-indigo-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Projectbeheer</span>
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent leading-tight">
                    Projecten
                  </h1>
                  <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                    Houd voortgang bij, beheer tijdlijnen en lever uitzonderlijke resultaten voor je klanten.
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link href="/dashboard/projects/new">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    New Project
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
          
          {/* Project Statistics */}
          <ProjectStatsGrid
            totalProjects={totalProjects}
            activeProjects={activeProjects}
            completedProjects={completedProjects}
            totalBudget={totalBudget}
            projectsGrowth={projectsGrowth}
            activeGrowth={activeGrowth}
            completedGrowth={completedGrowth}
            budgetGrowth={budgetGrowth}
          />

          {/* Projects Table */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Alle Projecten
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Beheer en houd je projectportfolio bij</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <FolderKanban className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ProjectsTable projects={projects || []} />
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
