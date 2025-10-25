"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { FolderKanban, Building2, Calendar, DollarSign, FileText, ArrowLeft, Save, Users } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
  budget: number | null
  client_id: string | null
}

interface Client {
  id: string
  name: string
}

interface ProjectFormProps {
  project?: Project
  clients: Client[]
}

export function ProjectForm({ project, clients }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<string>(project?.client_id || "none")
  const [selectedStatus, setSelectedStatus] = useState<string>(project?.status || "active")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const projectData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      status: selectedStatus,
      start_date: (formData.get("start_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
      budget: formData.get("budget") ? Number(formData.get("budget")) : null,
      client_id: selectedClient !== "none" ? selectedClient : null,
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      if (project) {
        // Update existing project
        const { error } = await supabase.from("projects").update(projectData).eq("id", project.id)

        if (error) throw error
      } else {
        // Create new project
        const { error } = await supabase.from("projects").insert({ ...projectData, user_id: user.id })

        if (error) throw error
      }

      router.push("/dashboard/projects")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving project:", err)
      setError(err instanceof Error ? err.message : "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-indigo-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">
                  {project ? "Edit Project" : "New Project"}
                </span>
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent leading-tight">
                {project ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                {project 
                  ? "Update project details and manage its progress."
                  : "Set up a new project to track progress, budget, and deliverables."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Project Information
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Fill in the details below</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <FolderKanban className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                        Project Name <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Website Redesign" 
                        defaultValue={project?.name} 
                        required 
                        className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client_id" className="text-sm font-medium text-slate-700">Client</Label>
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200">
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No client</SelectItem>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Project Details</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Project details and requirements..."
                        rows={4}
                        defaultValue={project?.description || ""}
                        className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-slate-700">Budget (EUR)</Label>
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          step="0.01"
                          placeholder="50000.00"
                          defaultValue={project?.budget || ""}
                          className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-sm font-medium text-slate-700">Start Date</Label>
                      <Input 
                        id="start_date" 
                        name="start_date" 
                        type="date" 
                        defaultValue={project?.start_date || ""} 
                        className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date" className="text-sm font-medium text-slate-700">End Date</Label>
                      <Input 
                        id="end_date" 
                        name="end_date" 
                        type="date" 
                        defaultValue={project?.end_date || ""} 
                        className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <p className="text-sm font-medium text-red-800">Error</p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/dashboard/projects")} 
                    disabled={isLoading}
                    className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
