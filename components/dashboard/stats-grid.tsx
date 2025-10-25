"use client"

import { Users, FolderKanban, FileText, Euro } from "lucide-react"
import { DashboardStatsCard } from "@/components/dashboard/stats-card"

interface DashboardStatsGridProps {
  clientsCount: number
  projectsCount: number
  invoicesCount: number
  totalRevenue: string
  clientsGrowth: number
  projectsGrowth: number
  invoicesGrowth: number
  revenueGrowth: number
}

export function DashboardStatsGrid({
  clientsCount,
  projectsCount,
  invoicesCount,
  totalRevenue,
  clientsGrowth,
  projectsGrowth,
  invoicesGrowth,
  revenueGrowth
}: DashboardStatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardStatsCard
        title="Totaal Klanten"
        value={clientsCount}
        subtitle="Actieve klanten"
        iconName="Users"
        growth={clientsGrowth}
        gradient="from-blue-500 to-cyan-500"
        delay={0}
      />
      
      <DashboardStatsCard
        title="Actieve Projecten"
        value={projectsCount}
        subtitle="Lopende projecten"
        iconName="FolderKanban"
        growth={projectsGrowth}
        gradient="from-purple-500 to-pink-500"
        delay={100}
      />
      
      <DashboardStatsCard
        title="Totaal Facturen"
        value={invoicesCount}
        subtitle="Alle tijden"
        iconName="FileText"
        growth={invoicesGrowth}
        gradient="from-green-500 to-emerald-500"
        delay={200}
      />
      
      <DashboardStatsCard
        title="Totale Omzet"
        value={totalRevenue}
        subtitle="Van alle facturen"
        iconName="Euro"
        growth={revenueGrowth}
        gradient="from-orange-500 to-red-500"
        delay={300}
      />
    </div>
  )
}
