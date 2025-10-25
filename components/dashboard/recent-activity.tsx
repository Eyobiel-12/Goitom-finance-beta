"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Euro, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDistanceToNow } from "date-fns"

interface Invoice {
  id: string
  invoice_number: string
  total: number
  status: string
  created_at: string
  clients?: {
    name: string
  }
}

interface DashboardRecentActivityProps {
  invoices: Invoice[]
}

export function DashboardRecentActivity({ invoices }: DashboardRecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'sent':
        return 'bg-blue-100 text-blue-700'
      case 'draft':
        return 'bg-gray-100 text-gray-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Betaald'
      case 'sent':
        return 'Verzonden'
      case 'draft':
        return 'Concept'
      case 'overdue':
        return 'Achterstallig'
      default:
        return status
    }
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Recente Activiteit
            </CardTitle>
            <p className="text-slate-600 mt-1">Laatste factuur activiteit</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500">Geen recente facturen</p>
              <p className="text-sm text-slate-400 mt-1">Maak je eerste factuur aan om activiteit hier te zien</p>
            </div>
          ) : (
            invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm hover:shadow-md hover:border-slate-300/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards"
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                        {invoice.invoice_number}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {invoice.clients?.name || 'Onbekende Klant'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      {formatCurrency(invoice.total)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Totaal
                    </div>
                  </div>
                  
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
        
        {invoices.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200/50">
            <a
              href="/dashboard/invoices"
              className="group flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Bekijk alle facturen
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
