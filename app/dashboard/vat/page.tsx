import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"
import { VATReportsTable } from "@/components/vat/vat-reports-table"
import { VATSummaryCards } from "@/components/vat/vat-summary-cards"

export default async function VATPage() {
  const supabase = await createClient()

  // Fetch VAT reports
  const { data: reports, error } = await supabase
    .from("vat_reports")
    .select("*")
    .order("period_start", { ascending: false })

  // Calculate current period VAT from invoices
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const periodStart = new Date(currentYear, currentMonth, 1).toISOString().split("T")[0]
  const periodEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0]

  const { data: currentInvoices } = await supabase
    .from("invoices")
    .select("total, tax_amount, status")
    .gte("issue_date", periodStart)
    .lte("issue_date", periodEnd)
    .in("status", ["sent", "paid"])

  const currentPeriodSales = currentInvoices?.reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0
  const currentPeriodVAT = currentInvoices?.reduce((sum, inv) => sum + Number(inv.tax_amount || 0), 0) || 0

  // Calculate year-to-date VAT
  const yearStart = new Date(currentYear, 0, 1).toISOString().split("T")[0]
  const { data: ytdInvoices } = await supabase
    .from("invoices")
    .select("total, tax_amount")
    .gte("issue_date", yearStart)
    .in("status", ["sent", "paid"])

  const ytdSales = ytdInvoices?.reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0
  const ytdVAT = ytdInvoices?.reduce((sum, inv) => sum + Number(inv.tax_amount || 0), 0) || 0

  if (error) {
    console.error("[v0] Error fetching VAT reports:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-red-600/5 to-pink-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">BTW Beheer</span>
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 bg-clip-text text-transparent leading-tight">
                    BTW Rapporten
                  </h1>
                  <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                    Houd je BTW verplichtingen bij, genereer rapporten en blijf compliant met Nederlandse belastingwetgeving.
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link href="/dashboard/vat/new">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                    <Plus className="mr-2 h-5 w-5" />
                    Rapport Genereren
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
          
          {/* Summary Cards */}
          <VATSummaryCards
            currentPeriodSales={currentPeriodSales}
            currentPeriodVAT={currentPeriodVAT}
            ytdSales={ytdSales}
            ytdVAT={ytdVAT}
          />

          {/* Reports Table */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    BTW Rapporten Geschiedenis
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Beheer en houd je BTW rapporten bij</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <VATReportsTable reports={reports || []} />
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
