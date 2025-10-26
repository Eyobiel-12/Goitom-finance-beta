"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Bug, Lightbulb, Star, Clock, CheckCircle, Archive } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Feedback {
  id: string
  user_id: string
  type: 'general' | 'bug' | 'feature' | 'improvement'
  message: string
  status: 'new' | 'read' | 'resolved' | 'archived'
  created_at: string
}

const typeIcons = {
  general: MessageSquare,
  bug: Bug,
  feature: Lightbulb,
  improvement: Star
}

const typeLabels = {
  general: "Algemeen",
  bug: "Bug",
  feature: "Feature",
  improvement: "Verbetering"
}

const typeColors = {
  general: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  bug: "bg-red-500/10 text-red-500 border-red-500/20",
  feature: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  improvement: "bg-green-500/10 text-green-500 border-green-500/20"
}

const statusLabels = {
  new: "Nieuw",
  read: "Gelezen",
  resolved: "Opgelost",
  archived: "Gearchiveerd"
}

const statusColors = {
  new: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  read: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    loadFeedback()
  }, [selectedStatus])

  const loadFeedback = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      let query = supabase.from("feedback").select("*")

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setFeedback(data || [])
    } catch (error) {
      console.error("Error loading feedback:", error)
      toast.error("Kon feedback niet laden")
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: Feedback['status']) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id)

      if (error) throw error

      toast.success("Status bijgewerkt")
      loadFeedback()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Kon status niet bijwerken")
    }
  }

  const stats = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    read: feedback.filter(f => f.status === 'read').length,
    resolved: feedback.filter(f => f.status === 'resolved').length
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Feedback laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback Beheer</h1>
        <p className="text-muted-foreground">Bekijk en beheer alle beta feedback</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nieuw</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gelezen</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.read}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opgelost</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          onClick={() => setSelectedStatus("all")}
        >
          Alles
        </Button>
        <Button
          variant={selectedStatus === "new" ? "default" : "outline"}
          onClick={() => setSelectedStatus("new")}
        >
          Nieuw
        </Button>
        <Button
          variant={selectedStatus === "read" ? "default" : "outline"}
          onClick={() => setSelectedStatus("read")}
        >
          Gelezen
        </Button>
        <Button
          variant={selectedStatus === "resolved" ? "default" : "outline"}
          onClick={() => setSelectedStatus("resolved")}
        >
          Opgelost
        </Button>
      </div>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Feedback</CardTitle>
          <CardDescription>Bekijk en beheer gebruikersfeedback</CardDescription>
        </CardHeader>
        <CardContent>
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Geen feedback gevonden</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Bericht</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.map((item) => {
                  const Icon = typeIcons[item.type]
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline" className={cn(typeColors[item.type])}>
                          <Icon className="mr-2 h-3 w-3" />
                          {typeLabels[item.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2">{item.message}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(statusColors[item.status])}>
                          {statusLabels[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString("nl-NL")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {item.status === "new" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(item.id, "read")}
                            >
                              Markeer als gelezen
                            </Button>
                          )}
                          {item.status !== "resolved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(item.id, "resolved")}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
