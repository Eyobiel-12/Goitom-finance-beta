"use client"

import { Button } from "@/components/ui/button"
import { Download, Mail, Settings } from "lucide-react"
import { generateInvoicePDF } from "@/lib/utils/pdf-generator"
import { useState } from "react"
import { PDFStyleSelector } from "./pdf-style-selector"

interface InvoiceActionsProps {
  invoice: any
  items: any[]
  organization: any
}

export function InvoiceActions({ invoice, items, organization }: InvoiceActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showStyleSelector, setShowStyleSelector] = useState(false)

  const handleDownloadPDF = async (style: 'modern' | 'classic' | 'minimal' = 'modern', colorScheme: 'blue' | 'green' | 'purple' | 'orange' = 'blue') => {
    setIsGenerating(true)
    try {
      await generateInvoicePDF(invoice, items, organization, style, colorScheme)
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Er is een fout opgetreden bij het genereren van de PDF. Probeer het opnieuw.")
    } finally {
      setIsGenerating(false)
      setShowStyleSelector(false)
    }
  }

  if (showStyleSelector) {
    return (
      <PDFStyleSelector
        invoice={invoice}
        items={items}
        organization={organization}
        onDownload={handleDownloadPDF}
        isGenerating={isGenerating}
      />
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="border-primary/20 hover:bg-primary/10 bg-transparent">
        <Mail className="mr-2 h-4 w-4" />
        Verzenden
      </Button>
      <Button
        variant="outline"
        className="border-primary/20 hover:bg-primary/10 bg-transparent"
        onClick={() => setShowStyleSelector(true)}
        disabled={isGenerating}
      >
        <Settings className="mr-2 h-4 w-4" />
        PDF Stijl Kiezen
      </Button>
      <Button
        variant="outline"
        className="border-primary/20 hover:bg-primary/10 bg-transparent"
        onClick={() => handleDownloadPDF()}
        disabled={isGenerating}
      >
        <Download className="mr-2 h-4 w-4" />
        {isGenerating ? "Genereren..." : "Snelle Download"}
      </Button>
    </div>
  )
}
