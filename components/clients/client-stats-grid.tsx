"use client"

import { ClientStatsCard } from "./client-stats-card"

interface ClientStatsGridProps {
  totalClients: number
  activeClients: number
  countriesCount: number
  avgProjectsPerClient: number
  clientsGrowth: number
  activeGrowth: number
  countriesGrowth: number
  projectsGrowth: number
}

export function ClientStatsGrid({
  totalClients,
  activeClients,
  countriesCount,
  avgProjectsPerClient,
  clientsGrowth,
  activeGrowth,
  countriesGrowth,
  projectsGrowth
}: ClientStatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <ClientStatsCard
        title="Totaal Klanten"
        value={totalClients}
        subtitle="Alle geregistreerde klanten"
        iconName="Users"
        growth={clientsGrowth}
        gradient="from-blue-500 to-cyan-500"
        delay={0}
      />
      
      <ClientStatsCard
        title="Actieve Klanten"
        value={activeClients}
        subtitle="Momenteel betrokken"
        iconName="Building2"
        growth={activeGrowth}
        gradient="from-purple-500 to-pink-500"
        delay={100}
      />
      
      <ClientStatsCard
        title="Landen"
        value={countriesCount}
        subtitle="Wereldwijde aanwezigheid"
        iconName="Globe"
        growth={countriesGrowth}
        gradient="from-green-500 to-emerald-500"
        delay={200}
      />
      
      <ClientStatsCard
        title="Gem. Projecten"
        value={avgProjectsPerClient.toFixed(1)}
        subtitle="Per klant"
        iconName="TrendingUp"
        growth={projectsGrowth}
        gradient="from-orange-500 to-red-500"
        delay={300}
      />
    </div>
  )
}
