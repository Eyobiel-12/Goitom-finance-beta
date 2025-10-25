"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Download, FileText, Calendar, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { generateInvoicePDF } from '@/lib/utils/pdf-generator'
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
import jsPDF from "jspdf"

interface Invoice {
  id: string
  invoice_number: string
  issue_date: string
  due_date: string
  status: string
  total: number
  tax_amount: number
  subtotal: number
  tax_rate: number
  clients: { name: string } | null
  projects: { name: string } | null
  invoice_items: Array<{
    description: string
    quantity: number
    unit_price: number
    amount: number
  }>
  notes: string | null
  terms: string | null
}

interface InvoicesTableProps {
  invoices: Invoice[]
}

const statusColors = {
  draft: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  sent: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  paid: "bg-green-500/10 text-green-700 border-green-500/20",
  overdue: "bg-red-500/10 text-red-700 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-700 border-gray-500/20",
}

const statusLabels = {
  draft: "Concept",
  sent: "Verzonden",
  paid: "Betaald",
  overdue: "Achterstallig",
  cancelled: "Geannuleerd",
}

const statusGradients = {
  draft: "from-gray-500 to-slate-500",
  sent: "from-blue-500 to-cyan-500",
  paid: "from-green-500 to-emerald-500",
  overdue: "from-red-500 to-pink-500",
  cancelled: "from-gray-500 to-slate-500",
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
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

  const handleDownloadPDF = async (invoice: Invoice) => {
    setDownloadingPdf(invoice.id)
    
    try {
      const supabase = createClient()
      
      // Fetch complete invoice data with better error handling
      const { data: fullInvoice, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients(name, email, phone, address, city, postal_code, country),
          projects(name),
          invoice_items(description, quantity, unit_price, amount)
        `)
        .eq('id', invoice.id)
        .single()

      // Also fetch organization data separately
      const { data: organizationData } = await supabase
        .from('organizations')
        .select('*')
        .single()

      if (error) {
        console.warn('Error fetching detailed invoice data:', error)
        console.log('Using basic invoice data for PDF generation')
        // Continue with basic invoice data instead of throwing error
      }

      // Prepare data for enterprise PDF generator with fallbacks
      const invoiceData = {
        invoice_number: invoice.invoice_number || 'N/A',
        issue_date: invoice.issue_date || new Date().toISOString(),
        due_date: invoice.due_date || new Date().toISOString(),
        status: invoice.status || 'draft',
        subtotal: invoice.subtotal || invoice.total || 0,
        tax_rate: invoice.tax_rate || 21,
        tax_amount: invoice.tax_amount || ((invoice.subtotal || invoice.total || 0) * 21 / 100),
        total: invoice.total || (invoice.subtotal || 0) + ((invoice.subtotal || 0) * 21 / 100),
        notes: invoice.notes || null,
        terms: invoice.terms || null,
        clients: fullInvoice?.clients || invoice.clients || {
          name: 'Onbekende Klant',
          email: null,
          phone: null,
          address: null,
          city: null,
          country: null
        }
      }

      const items = fullInvoice?.invoice_items || [{
        description: 'Dienstverlening',
        quantity: 1,
        unit_price: invoice.subtotal || invoice.total || 0,
        amount: invoice.subtotal || invoice.total || 0
      }]

      // Use organization data from database, fallback to defaults
      const organization = organizationData || {
        name: 'GOITOM FINANCE',
        email: 'info@goitomfinance.nl',
        phone: '+31 6 12345678',
        address: 'Hoofdstraat 123',
        city: 'Amsterdam',
        country: 'Nederland',
        tax_id: 'NL123456789B01',
        logo_url: null
      }

      // Generate enterprise PDF with default modern blue style
      await generateInvoicePDF(invoiceData, items, organization, 'modern', 'blue')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      
      // More specific error messages
      let errorMessage = 'Er is een fout opgetreden bij het genereren van de PDF.'
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Kon factuurgegevens niet ophalen. Controleer je internetverbinding.'
        } else if (error.message.includes('PDF')) {
          errorMessage = 'PDF generatie mislukt. Probeer het opnieuw.'
        } else {
          errorMessage = `PDF fout: ${error.message}`
        }
      }
      
             toast.error(errorMessage)
    } finally {
      setDownloadingPdf(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("invoices").delete().eq("id", deleteId)

      if (error) {
        console.error("[v0] Error deleting invoice:", error)
        toast.error("Verwijderen van factuur mislukt")
      } else {
        toast.success("Factuur succesvol verwijderd")
        router.refresh()
      }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Nog geen facturen</h3>
        <p className="text-slate-600 mb-6 max-w-md">
          Start met factureren door je eerste factuur aan te maken. Houd betalingen bij en beheer je omzet.
        </p>
        
        <Link href="/dashboard/invoices/new">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            Maak je eerste factuur
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className={`overflow-x-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200/50">
              <TableHead className="text-slate-700 font-semibold">Factuur</TableHead>
              <TableHead className="hidden md:table-cell text-slate-700 font-semibold">Klant</TableHead>
              <TableHead className="hidden md:table-cell text-slate-700 font-semibold">Factuurdatum</TableHead>
              <TableHead className="hidden lg:table-cell text-slate-700 font-semibold">Vervaldatum</TableHead>
              <TableHead className="text-slate-700 font-semibold">Status</TableHead>
              <TableHead className="text-slate-700 font-semibold">Totaal</TableHead>
              <TableHead className="text-right text-slate-700 font-semibold">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow 
                key={invoice.id} 
                className={`border-slate-200/50 hover:bg-slate-50/50 transition-colors ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${statusGradients[invoice.status as keyof typeof statusGradients]} shadow-sm`}>
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{invoice.invoice_number}</div>
                      <div className="text-xs text-slate-500">#{invoice.id.slice(-6)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                      {invoice.clients?.name ? invoice.clients.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-slate-700">{invoice.clients?.name || 'Geen klant'}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(invoice.issue_date).toLocaleDateString('nl-NL')}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(invoice.due_date).toLocaleDateString('nl-NL')}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-medium",
                      statusColors[invoice.status as keyof typeof statusColors]
                    )}
                  >
                    {statusLabels[invoice.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">
                      {new Intl.NumberFormat('nl-NL', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(invoice.total)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownloadPDF(invoice)}
                      disabled={downloadingPdf === invoice.id}
                      className="hover:bg-green-50 hover:text-green-600"
                    >
                      {downloadingPdf === invoice.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setDeleteId(invoice.id)}
                      className="hover:bg-red-50 hover:text-red-600"
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de factuur en alle regels permanent verwijderen.
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