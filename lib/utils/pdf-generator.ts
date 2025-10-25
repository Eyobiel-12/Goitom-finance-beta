"use client"

/**
 * PDF Generation utility for invoices
 * Uses jsPDF for client-side PDF generation
 */

interface InvoiceData {
  invoice_number: string
  issue_date: string
  due_date: string
  status: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes: string | null
  terms: string | null
  clients: {
    name: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
  } | null
}

interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface Organization {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  vat_number?: string
  tax_id?: string
  logo_url?: string
}

export async function generateInvoicePDF(
  invoice: InvoiceData,
  items: InvoiceItem[],
  organization: Organization | null,
  style: 'modern' | 'classic' | 'minimal' = 'modern',
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' = 'blue'
) {
  // Dynamically import jsPDF to avoid SSR issues
  const { default: jsPDF } = await import("jspdf")
  
  const doc = new jsPDF()
  
  // Try to import and setup autoTable
  try {
    const autoTableModule = await import("jspdf-autotable")
    const autoTable = autoTableModule.default
    ;(doc as any).autoTable = autoTable
  } catch (error) {
    console.warn('Could not load jspdf-autotable, using manual table:', error)
  }

  // Color schemes
  const colorSchemes = {
    blue: {
      primary: [59, 130, 246], // blue-500
      secondary: [37, 99, 235], // blue-600
      accent: [147, 197, 253], // blue-300
      text: [15, 23, 42], // slate-900
      light: [248, 250, 252] // slate-50
    },
    green: {
      primary: [34, 197, 94], // green-500
      secondary: [22, 163, 74], // green-600
      accent: [134, 239, 172], // green-300
      text: [15, 23, 42], // slate-900
      light: [240, 253, 244] // green-50
    },
    purple: {
      primary: [168, 85, 247], // purple-500
      secondary: [147, 51, 234], // purple-600
      accent: [196, 181, 253], // purple-300
      text: [15, 23, 42], // slate-900
      light: [250, 245, 255] // purple-50
    },
    orange: {
      primary: [249, 115, 22], // orange-500
      secondary: [234, 88, 12], // orange-600
      accent: [253, 186, 116], // orange-300
      text: [15, 23, 42], // slate-900
      light: [255, 247, 237] // orange-50
    }
  }

  const colors = colorSchemes[colorScheme]

  // Start content from top of page

  // Enterprise-Level Professional Header
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  
  // Company Logo Area (Left)
  if (organization?.logo_url) {
    // Placeholder for logo - would need image loading implementation
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.circle(25, 25, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("LOGO", 20, 28)
  }
  
  // Company Name (Left)
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(organization?.name || "GOITOM FINANCE", 20, 20)
  
  // Professional Subtitle
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text("Professionele Financiële Diensten", 20, 26)
  
  // Invoice Header (Right)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("FACTUUR", 150, 20)
  
  // Invoice Number with Professional Styling
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  doc.text(`#${invoice.invoice_number}`, 150, 28)
  
  // Professional Status Badge
  const statusMap = {
    draft: 'Concept',
    sent: 'Verzonden', 
    paid: 'Betaald',
    overdue: 'Achterstallig',
    cancelled: 'Geannuleerd'
  }
  const status = statusMap[invoice.status as keyof typeof statusMap] || invoice.status
  
  // Status badge with professional styling
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.roundedRect(150, 32, 35, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text(status.toUpperCase(), 152, 37)
  
  // Professional Accent Line
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.setLineWidth(2)
  doc.line(20, 45, 190, 45)

  // Professional Company Information Section
  const companyY = 55
  
  // Company Info Card Background
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(15, companyY - 5, 85, 35, 3, 3, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, companyY - 5, 85, 35, 3, 3, 'S')
  
  // Company Section Header
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("BEDRIJFSGEGEVENS", 20, companyY + 2)
  
  // Company Details
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  let companyYPos = companyY + 8
  
  if (organization?.name) {
    doc.setFont("helvetica", "bold")
    doc.text(organization.name, 20, companyYPos)
    companyYPos += 5
    doc.setFont("helvetica", "normal")
  }
  
  if (organization?.address) {
    doc.text(organization.address, 20, companyYPos)
    companyYPos += 4
  }
  
  if (organization?.city) {
    doc.text(organization.city, 20, companyYPos)
    companyYPos += 4
  }
  
  if (organization?.country) {
    doc.text(organization.country, 20, companyYPos)
    companyYPos += 4
  }
  
  if (organization?.phone) {
    doc.text(`Tel: ${organization.phone}`, 20, companyYPos)
    companyYPos += 4
  }
  
  if (organization?.email) {
    doc.text(`Email: ${organization.email}`, 20, companyYPos)
    companyYPos += 4
  }
  
  if (organization?.tax_id) {
    doc.text(`BTW: ${organization.tax_id}`, 20, companyYPos)
  }

  // Professional Client Information Section
  const clientY = 100
  
  // Client Info Card Background
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(15, clientY - 5, 85, 40, 3, 3, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, clientY - 5, 85, 40, 3, 3, 'S')
  
  // Client Section Header
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("FACTUUR AAN", 20, clientY + 2)
  
  // Client Details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  let yPos = clientY + 8
  if (invoice.clients) {
    doc.setFont("helvetica", "bold")
    doc.text(invoice.clients.name, 20, yPos)
    yPos += 6
    doc.setFont("helvetica", "normal")
    if (invoice.clients.address) {
      doc.text(invoice.clients.address, 20, yPos)
      yPos += 4
    }
    if (invoice.clients.city && invoice.clients.country) {
      doc.text(`${invoice.clients.city}, ${invoice.clients.country}`, 20, yPos)
      yPos += 4
    }
    if (invoice.clients.email) {
      doc.text(invoice.clients.email, 20, yPos)
    }
  }

  // Professional Invoice Details Card
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(110, clientY - 5, 85, 40, 3, 3, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.roundedRect(110, clientY - 5, 85, 40, 3, 3, 'S')
  
  // Invoice Details Header
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("FACTUURGEGEVENS", 115, clientY + 2)
  
  // Invoice Details
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  
  let detailY = clientY + 8
  doc.setFont("helvetica", "bold")
  doc.text("Factuurdatum:", 115, detailY)
  doc.setFont("helvetica", "normal")
  doc.text(new Date(invoice.issue_date).toLocaleDateString("nl-NL"), 115, detailY + 4)
  detailY += 10
  
  doc.setFont("helvetica", "bold")
  doc.text("Vervaldatum:", 115, detailY)
  doc.setFont("helvetica", "normal")
  doc.text(new Date(invoice.due_date).toLocaleDateString("nl-NL"), 115, detailY + 4)

  // Line Items Table
  const tableData = items.map((item) => [
    item.description,
    item.quantity.toString(),
    `€${item.unit_price.toFixed(2)}`,
    `€${item.amount.toFixed(2)}`,
  ])
  
  // Check if autoTable is available
  if ((doc as any).autoTable && typeof (doc as any).autoTable === 'function') {
    try {
      // Use autoTable
      ;(doc as any).autoTable({
        startY: 150,
        head: [["Omschrijving", "Aantal", "Prijs per Stuk", "Bedrag"]],
        body: tableData,
        theme: style === 'minimal' ? 'plain' : 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
          halign: "center",
        },
        bodyStyles: {
          textColor: colors.text,
          fontSize: 10,
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: colors.light,
        },
        styles: {
          cellPadding: 8,
          lineColor: colors.primary,
          lineWidth: 0.2,
          fontSize: 10,
        },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 30, halign: "right" },
          2: { cellWidth: 35, halign: "right" },
          3: { cellWidth: 35, halign: "right" },
        },
      })
    } catch (error) {
      console.warn('autoTable failed, using manual table:', error)
      createManualTable(doc, items, colors)
    }
  } else {
    // Use manual table
    createManualTable(doc, items, colors)
  }
  
  function createManualTable(doc: any, items: InvoiceItem[], colors: any) {
    let tableY = 150
    
    // Professional table header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.rect(15, tableY - 8, 180, 14, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Omschrijving', 20, tableY)
    doc.text('Aantal', 120, tableY)
    doc.text('Prijs per Stuk', 140, tableY)
    doc.text('Bedrag', 170, tableY)
    
    // Table rows
    tableY += 10
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(colors.light[0], colors.light[1], colors.light[2])
        doc.rect(15, tableY - 4, 180, 10, 'F')
      }
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
      doc.text(item.description, 20, tableY)
      doc.text(item.quantity.toString(), 120, tableY)
      doc.text(`€${item.unit_price.toFixed(2)}`, 140, tableY)
      doc.text(`€${item.amount.toFixed(2)}`, 170, tableY)
      tableY += 10
    })
    
    // Set finalY for totals calculation
    ;(doc as any).lastAutoTable = { finalY: tableY }
  }

  // Professional Totals Section
  const finalY = (doc as any).lastAutoTable.finalY + 15

  // Totals Card Background
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(120, finalY - 8, 75, 35, 3, 3, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.roundedRect(120, finalY - 8, 75, 35, 3, 3, 'S')
  
  // Totals Header
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("TOTALEN", 125, finalY - 2)
  
  // Subtotal
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
  doc.text("Subtotaal:", 125, finalY + 5)
  doc.text(`€${invoice.subtotal.toFixed(2)}`, 185, finalY + 5, { align: "right" })

  // Tax
  doc.text(`BTW (${invoice.tax_rate}%):`, 125, finalY + 12)
  doc.text(`€${invoice.tax_amount.toFixed(2)}`, 185, finalY + 12, { align: "right" })

  // Professional separator line
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.setLineWidth(1)
  doc.line(125, finalY + 16, 185, finalY + 16)

  // Total with emphasis
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("TOTAAL:", 125, finalY + 22)
  doc.text(`€${invoice.total.toFixed(2)}`, 185, finalY + 22, { align: "right" })

  // Notes and Terms
  if (invoice.notes || invoice.terms) {
    let notesY = finalY + 30
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])

    if (invoice.notes) {
      doc.text("Notities:", 20, notesY)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      const notesLines = doc.splitTextToSize(invoice.notes, 170)
      doc.text(notesLines, 20, notesY + 5)
      notesY += notesLines.length * 5 + 10
    }

    if (invoice.terms) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.text("Algemene Voorwaarden:", 20, notesY)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      const termsLines = doc.splitTextToSize(invoice.terms, 170)
      doc.text(termsLines, 20, notesY + 5)
    }
  }

  // Enterprise Footer Section
  const footerY = 280
  
  // Professional separator line
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.setLineWidth(1)
  doc.line(20, footerY - 10, 190, footerY - 10)
  
  // Company information at bottom
  if (organization) {
    doc.setFontSize(9)
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.setFont("helvetica", "bold")
    doc.text(organization.name || "GOITOM FINANCE", 20, footerY)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    let companyY = footerY + 5
    if (organization.address) doc.text(organization.address, 20, companyY), companyY += 4
    if (organization.city && organization.country) {
      doc.text(`${organization.city}, ${organization.country}`, 20, companyY), companyY += 4
    }
    if (organization.email) doc.text(organization.email, 20, companyY), companyY += 4
    if (organization.phone) doc.text(organization.phone, 20, companyY), companyY += 4
    if (organization.tax_id) doc.text(`BTW: ${organization.tax_id}`, 20, companyY)
  }
  
  // Professional thank you message
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  doc.text("Bedankt voor je vertrouwen!", 105, footerY, { align: "center" })
  
  // Generation timestamp
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}`, 105, footerY + 8, { align: "center" })

  // Save the PDF
  doc.save(`factuur-${invoice.invoice_number}.pdf`)
}

// Export the function
export { generateInvoicePDF }
