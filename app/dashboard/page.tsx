import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils/currency"
import { DashboardStatsGrid } from "@/components/dashboard/stats-grid"
import { DashboardQuickActions } from "@/components/dashboard/quick-actions"
import { DashboardRecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardChart } from "@/components/dashboard/chart"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch dashboard statistics
  const [clientsResult, projectsResult, invoicesResult, recentInvoices] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("invoices").select("total", { count: "exact" }),
    supabase.from("invoices").select("*, clients(name)").order("created_at", { ascending: false }).limit(5),
  ])

  const clientsCount = clientsResult.count || 0
  const projectsCount = projectsResult.count || 0
  const invoicesCount = invoicesResult.count || 0
  const totalRevenue = invoicesResult.data?.reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0

  // Calculate growth metrics (mock data for now)
  const clientsGrowth = 12.5
  const projectsGrowth = 8.2
  const invoicesGrowth = 15.3
  const revenueGrowth = 23.7

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Live Dashboard</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                Welkom terug
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Je bedrijfsprestaties in één oogopslag. Houd groei bij, beheer klanten en optimaliseer je workflow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Enhanced Stats Grid */}
          <DashboardStatsGrid
            clientsCount={clientsCount}
            projectsCount={projectsCount}
            invoicesCount={invoicesCount}
            totalRevenue={formatCurrency(totalRevenue)}
            clientsGrowth={clientsGrowth}
            projectsGrowth={projectsGrowth}
            invoicesGrowth={invoicesGrowth}
            revenueGrowth={revenueGrowth}
          />

          {/* Charts and Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardChart />
            <DashboardRecentActivity invoices={recentInvoices.data || []} />
          </div>

          {/* Enhanced Quick Actions */}
          <DashboardQuickActions />
          
        </div>
      </div>
    </div>
  )
}
