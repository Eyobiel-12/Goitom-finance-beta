"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, FileText, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
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
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const handleDownloadPDF = async (report: VATReport) => {
    setDownloadingPdf(report.id)
    
    try {
      // Create PDF with jsPDF
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      // Set up fonts and colors
      doc.setFont('helvetica')
      
      // Header with gradient background
      doc.setFillColor(251, 146, 60) // Orange
      doc.rect(0, 0, 210, 50, 'F')
      
      // Company logo placeholder
      doc.setFillColor(255, 255, 255)
      doc.circle(25, 25, 12, 'F')
      doc.setTextColor(251, 146, 60)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("GF", 20, 28)
      
      // Company name
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("Goitom Finance BETA", 45, 20)
      
      // Report title
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("BTW RAPPORT", 150, 20)
      
      // Report period
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`Periode: ${new Date(report.period_start).toLocaleDateString('nl-NL')} - ${new Date(report.period_end).toLocaleDateString('nl-NL')}`, 150, 28)
      
      // Status badge
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(150, 32, 35, 8, 2, 2, 'F')
      doc.setTextColor(251, 146, 60)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text(statusLabels[report.status as keyof typeof statusLabels]?.toUpperCase() || report.status.toUpperCase(), 152, 37)
      
      // Professional accent line
      doc.setDrawColor(251, 146, 60)
      doc.setLineWidth(2)
      doc.line(20, 45, 190, 45)
      
      // Report details section
      const detailsY = 70
      
      // Report details card
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(15, detailsY - 5, 180, 60, 3, 3, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.5)
      doc.roundedRect(15, detailsY - 5, 180, 60, 3, 3, 'S')
      
      // Report details header
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(251, 146, 60)
      doc.text("RAPPORTGEGEVENS", 20, detailsY + 2)
      
      // Report details
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(71, 85, 105)
      
      let detailY = detailsY + 8
      doc.setFont("helvetica", "bold")
      doc.text("Rapport periode:", 20, detailY)
      doc.setFont("helvetica", "normal")
      doc.text(`${new Date(report.period_start).toLocaleDateString('nl-NL')} - ${new Date(report.period_end).toLocaleDateString('nl-NL')}`, 20, detailY + 4)
      detailY += 10
      
      doc.setFont("helvetica", "bold")
      doc.text("Status:", 20, detailY)
      doc.setFont("helvetica", "normal")
      doc.text(statusLabels[report.status as keyof typeof statusLabels] || report.status, 20, detailY + 4)
      detailY += 10
      
      doc.setFont("helvetica", "bold")
      doc.text("Aangemaakt op:", 20, detailY)
      doc.setFont("helvetica", "normal")
      doc.text(new Date(report.created_at).toLocaleDateString('nl-NL'), 20, detailY + 4)
      
      // Financial summary section
      const summaryY = 150
      
      // Financial summary card
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(15, summaryY - 5, 180, 50, 3, 3, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.5)
      doc.roundedRect(15, summaryY - 5, 180, 50, 3, 3, 'S')
      
      // Financial summary header
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(251, 146, 60)
      doc.text("FINANCIËLE SAMENVATTING", 20, summaryY + 2)
      
      // Financial details
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(71, 85, 105)
      
      let summaryDetailY = summaryY + 8
      doc.setFont("helvetica", "bold")
      doc.text("Totale verkoop:", 20, summaryDetailY)
      doc.setFont("helvetica", "normal")
      doc.text(`€${report.total_sales.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 120, summaryDetailY)
      summaryDetailY += 6
      
      doc.setFont("helvetica", "bold")
      doc.text("Totale BTW:", 20, summaryDetailY)
      doc.setFont("helvetica", "normal")
      doc.text(`€${report.total_vat.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 120, summaryDetailY)
      summaryDetailY += 6
      
      // BTW percentage calculation
      const vatPercentage = report.total_sales > 0 ? (report.total_vat / report.total_sales) * 100 : 0
      doc.setFont("helvetica", "bold")
      doc.text("BTW percentage:", 20, summaryDetailY)
      doc.setFont("helvetica", "normal")
      doc.text(`${vatPercentage.toFixed(1)}%`, 120, summaryDetailY)
      
      // Footer
      const footerY = 250
      doc.setFillColor(251, 146, 60)
      doc.rect(0, footerY, 210, 20, 'F')
      
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "normal")
      doc.text('Dit BTW rapport is gegenereerd door Goitom Finance Beta', 20, footerY + 8)
      doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}`, 20, footerY + 12)
      
      // Save PDF
      const fileName = `btw-rapport-${new Date(report.period_start).toLocaleDateString('nl-NL').replace(/\//g, '-')}-${new Date(report.period_end).toLocaleDateString('nl-NL').replace(/\//g, '-')}.pdf`
      doc.save(fileName)
      
    } catch (error) {
      console.error('Error generating VAT report PDF:', error)
      toast.error('Er is een fout opgetreden bij het genereren van het BTW rapport PDF. Probeer het opnieuw.')
    } finally {
      setDownloadingPdf(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("vat_reports").delete().eq("id", deleteId)

      if (error) {
        console.error("[v0] Error deleting VAT report:", error)
        toast.error("Verwijderen van BTW rapport mislukt")
      } else {
        toast.success("BTW rapport succesvol verwijderd")
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadPDF(report)}
                      disabled={downloadingPdf === report.id}
                      className="hover:bg-green-50 hover:text-green-600"
                    >
                      {downloadingPdf === report.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
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