"use client"

import { InvoiceStatsCard } from "./invoice-stats-card"

interface InvoiceStatsGridProps {
  totalInvoices: number
  totalRevenue: number
  pendingInvoices: number
  paidInvoices: number
  invoicesGrowth: number
  revenueGrowth: number
  pendingGrowth: number
  paidGrowth: number
}

export function InvoiceStatsGrid({
  totalInvoices,
  totalRevenue,
  pendingInvoices,
  paidInvoices,
  invoicesGrowth,
  revenueGrowth,
  pendingGrowth,
  paidGrowth
}: InvoiceStatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <InvoiceStatsCard
        title="Totaal Facturen"
        value={totalInvoices}
        subtitle="Alle facturen"
        iconName="FileText"
        growth={invoicesGrowth}
        gradient="from-emerald-500 to-teal-500"
        delay={0}
      />
      
      <InvoiceStatsCard
        title="Totale Omzet"
        value={`EUR ${totalRevenue.toLocaleString()}`}
        subtitle="Van alle facturen"
        iconName="DollarSign"
        growth={revenueGrowth}
        gradient="from-green-500 to-emerald-500"
        delay={100}
      />
      
      <InvoiceStatsCard
        title="Openstaand"
        value={pendingInvoices}
        subtitle="Wachtend op betaling"
        iconName="Clock"
        growth={pendingGrowth}
        gradient="from-orange-500 to-red-500"
        delay={200}
      />
      
      <InvoiceStatsCard
        title="Betaald"
        value={paidInvoices}
        subtitle="Succesvol betaald"
        iconName="CheckCircle"
        growth={paidGrowth}
        gradient="from-blue-500 to-cyan-500"
        delay={300}
      />
    </div>
  )
}
