"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
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

interface VATReport {
  id: string
  period_start: string
  period_end: string
  total_sales: number
  total_vat: number
  status: string
  created_at: string
}

interface VATReportsTableProps {
  reports: VATReport[]
}

const statusColors = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
}

const statusLabels = {
  draft: "Concept",
  submitted: "Ingediend",
  approved: "Goedgekeurd",
}

export function VATReportsTable({ reports }: VATReportsTableProps) {
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

    const { error } = await supabase.from("vat_reports").delete().eq("id", deleteId)

    if (error) {
      console.error("[v0] Error deleting VAT report:", error)
      alert("Failed to delete VAT report")
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Nog geen BTW rapporten</h3>
        <p className="text-slate-600 mb-6 max-w-md">
          Start met het genereren van je eerste BTW rapport om je belastingverplichtingen bij te houden.
        </p>
        
        <Link href="/dashboard/vat/new">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            Genereer je eerste rapport
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode</TableHead>
              <TableHead className="hidden md:table-cell">Totale Verkoop</TableHead>
              <TableHead className="hidden lg:table-cell">Totale BTW</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {new Date(report.period_start).toLocaleDateString('nl-NL')} -{" "}
                  {new Date(report.period_end).toLocaleDateString('nl-NL')}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(report.total_sales)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(report.total_vat)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[report.status as keyof typeof statusColors]}>
                    {statusLabels[report.status as keyof typeof statusLabels] || report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/vat/${report.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(report.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal het BTW rapport permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}