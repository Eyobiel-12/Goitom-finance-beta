"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FolderKanban, Calendar, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Project {
  id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  budget: number | null
  clients: { name: string } | null
}

interface ProjectsTableProps {
  projects: Project[]
}

const statusColors = {
  active: "bg-green-500/10 text-green-700 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  on_hold: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
}

const statusGradients = {
  active: "from-green-500 to-emerald-500",
  completed: "from-blue-500 to-cyan-500",
  on_hold: "from-yellow-500 to-orange-500",
  cancelled: "from-red-500 to-pink-500",
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("projects").delete().eq("id", deleteId)

    if (error) {
      console.error("[v0] Error deleting project:", error)
      alert("Failed to delete project")
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (projects.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-16 text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
            <FolderKanban className="h-12 w-12 text-slate-400" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-slate-900">Nog geen projecten</h3>
        <p className="mt-2 text-slate-600 max-w-md">Begin met het volgen van je werk door je eerste project aan te maken. Beheer tijdlijnen, budgetten en deliverables.</p>
        <Link href="/dashboard/projects/new">
          <Button className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <FolderKanban className="mr-2 h-4 w-4" />
            Maak je eerste project
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className={cn(
        "overflow-x-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-slate-100/50">
                <TableHead className="font-semibold text-slate-700">Project</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-slate-700">Klant</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold text-slate-700">Status</TableHead>
                <TableHead className="hidden xl:table-cell font-semibold text-slate-700">Budget</TableHead>
                <TableHead className="hidden xl:table-cell font-semibold text-slate-700">Timeline</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow 
                  key={project.id}
                  className={cn(
                    "group border-slate-200/30 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-300 hover:shadow-sm",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{
                    transitionDelay: `${300 + (index * 50)}ms`,
                    transitionDuration: "0.6s",
                    transitionTimingFunction: "ease-out"
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white font-semibold shadow-lg group-hover:scale-110 transition-transform duration-200",
                        statusGradients[project.status as keyof typeof statusGradients] || "from-slate-500 to-slate-600"
                      )}>
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                          {project.name}
                        </div>
                        {project.start_date && (
                          <div className="text-xs text-slate-500">
                            Started {new Date(project.start_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {project.clients?.name ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <User className="h-3 w-3 text-blue-500" />
                        <span>{project.clients.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">No client</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "border font-medium",
                        statusColors[project.status as keyof typeof statusColors]
                      )}
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {project.budget ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <DollarSign className="h-3 w-3 text-green-500" />
                        <span>{new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(project.budget)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {project.start_date && project.end_date ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <Calendar className="h-3 w-3 text-purple-500" />
                        <span>
                          {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    ) : project.start_date ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <Calendar className="h-3 w-3 text-purple-500" />
                        <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDeleteId(project.id)}
                        className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
