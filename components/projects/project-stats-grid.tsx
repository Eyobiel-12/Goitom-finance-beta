"use client"

import { ProjectStatsCard } from "./project-stats-card"

interface ProjectStatsGridProps {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalBudget: number
  projectsGrowth: number
  activeGrowth: number
  completedGrowth: number
  budgetGrowth: number
}

export function ProjectStatsGrid({
  totalProjects,
  activeProjects,
  completedProjects,
  totalBudget,
  projectsGrowth,
  activeGrowth,
  completedGrowth,
  budgetGrowth
}: ProjectStatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <ProjectStatsCard
        title="Totaal Projecten"
        value={totalProjects}
        subtitle="Alle projecten"
        iconName="FolderKanban"
        growth={projectsGrowth}
        gradient="from-blue-500 to-cyan-500"
        delay={0}
      />
      
      <ProjectStatsCard
        title="Actieve Projecten"
        value={activeProjects}
        subtitle="Momenteel lopend"
        iconName="Clock"
        growth={activeGrowth}
        gradient="from-green-500 to-emerald-500"
        delay={100}
      />
      
      <ProjectStatsCard
        title="Voltooid"
        value={completedProjects}
        subtitle="Succesvol afgerond"
        iconName="CheckCircle"
        growth={completedGrowth}
        gradient="from-purple-500 to-pink-500"
        delay={200}
      />
      
      <ProjectStatsCard
        title="Totaal Budget"
        value={`EUR ${totalBudget.toLocaleString()}`}
        subtitle="Alle projecten gecombineerd"
        iconName="DollarSign"
        growth={budgetGrowth}
        gradient="from-orange-500 to-red-500"
        delay={300}
      />
    </div>
  )
}
