import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { InvoiceStatsGrid } from "@/components/invoices/invoice-stats-grid"

export default async function InvoicesPage() {
  const supabase = await createClient()

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching invoices:", error)
  }

  // Calculate statistics
  const totalInvoices = invoices?.length || 0
  const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0
  const pendingInvoices = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'draft').length || 0
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0

  // Mock growth data
  const invoicesGrowth = 22.3
  const revenueGrowth = 28.7
  const pendingGrowth = 15.2
  const paidGrowth = 31.5

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-cyan-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Factuurbeheer</span>
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent leading-tight">
                    Facturen
                  </h1>
                  <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                    Maak professionele facturen, houd betalingen bij en beheer je omzet met gemak.
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link href="/dashboard/invoices/new">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Factuur Aanmaken
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
          
          {/* Invoice Statistics */}
          <InvoiceStatsGrid
            totalInvoices={totalInvoices}
            totalRevenue={totalRevenue}
            pendingInvoices={pendingInvoices}
            paidInvoices={paidInvoices}
            invoicesGrowth={invoicesGrowth}
            revenueGrowth={revenueGrowth}
            pendingGrowth={pendingGrowth}
            paidGrowth={paidGrowth}
          />

          {/* Invoices Table */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Alle Facturen
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Beheer en houd je factuurportfolio bij</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <InvoicesTable invoices={invoices || []} />
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
