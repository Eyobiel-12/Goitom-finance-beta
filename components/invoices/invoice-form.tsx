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
import { Plus, Trash2, FileText, Building2, Calendar, DollarSign, ArrowLeft, Save, Users, FolderKanban } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/currency"

interface Invoice {
  id: string
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
  client_id: string | null
  project_id: string | null
}

interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface Client {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
}

interface Settings {
  tax_rate: number
  invoice_prefix: string
  invoice_terms: string | null
  invoice_notes: string | null
}

interface InvoiceFormProps {
  invoice?: Invoice
  items?: InvoiceItem[]
  clients: Client[]
  projects: Project[]
  settings: Settings | null
}

export function InvoiceForm({ invoice, items = [], clients, projects, settings }: InvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<string>(invoice?.client_id || "none")
  const [selectedProject, setSelectedProject] = useState<string>(invoice?.project_id || "none")
  const [selectedStatus, setSelectedStatus] = useState<string>(invoice?.status || "draft")
  const [taxRate, setTaxRate] = useState<number>(invoice?.tax_rate || settings?.tax_rate || 21)
  const [isVisible, setIsVisible] = useState(false)
  const [lineItems, setLineItems] = useState<InvoiceItem[]>(
    items.length > 0 ? items : [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const calculateItemAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * taxRate) / 100
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...lineItems]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "unit_price") {
      newItems[index].amount = calculateItemAmount(Number(newItems[index].quantity), Number(newItems[index].unit_price))
    }

    setLineItems(newItems)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { subtotal, taxAmount, total } = calculateTotals()

    const invoiceData = {
      invoice_number: formData.get("invoice_number") as string,
      issue_date: formData.get("issue_date") as string,
      due_date: formData.get("due_date") as string,
      status: selectedStatus,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: (formData.get("notes") as string) || null,
      terms: (formData.get("terms") as string) || null,
      client_id: selectedClient !== "none" ? selectedClient : null,
      project_id: selectedProject !== "none" ? selectedProject : null,
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      let invoiceId = invoice?.id

      if (invoice) {
        // Update existing invoice
        const { error } = await supabase.from("invoices").update(invoiceData).eq("id", invoice.id)
        if (error) throw error

        // Delete old items
        await supabase.from("invoice_items").delete().eq("invoice_id", invoice.id)
      } else {
        // Create new invoice
        const { data, error } = await supabase
          .from("invoices")
          .insert({ ...invoiceData, user_id: user.id })
          .select()
          .single()

        if (error) throw error
        invoiceId = data.id
      }

      // Insert line items
      const itemsToInsert = lineItems.map((item) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)
      if (itemsError) throw itemsError

      router.push("/dashboard/invoices")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving invoice:", err)
      setError(err instanceof Error ? err.message : "Failed to save invoice")
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-cyan-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard/invoices">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">
                  {invoice ? "Factuur Bewerken" : "Nieuwe Factuur"}
                </span>
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent leading-tight">
                {invoice ? "Factuur Bewerken" : "Nieuwe Factuur Aanmaken"}
              </h1>
              <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                {invoice 
                  ? "Werk factuurdetails bij en beheer factureringsinformatie."
                  : "Maak een professionele factuur met regels en automatische berekeningen."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Invoice Header */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Factuur Details
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Basis factuur informatie</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="invoice_number" className="text-sm font-medium text-slate-700">
                      Factuurnummer <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="invoice_number"
                      name="invoice_number"
                      placeholder={`${settings?.invoice_prefix || "INV"}-001`}
                      defaultValue={invoice?.invoice_number}
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue_date" className="text-sm font-medium text-slate-700">
                      Factuurdatum <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="issue_date"
                      name="issue_date"
                      type="date"
                      defaultValue={invoice?.issue_date || new Date().toISOString().split("T")[0]}
                      required
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-sm font-medium text-slate-700">
                      Vervaldatum <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="due_date" 
                      name="due_date" 
                      type="date" 
                      defaultValue={invoice?.due_date} 
                      required 
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_id" className="text-sm font-medium text-slate-700">Klant</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200">
                        <SelectValue placeholder="Selecteer een klant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Geen klant</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_id" className="text-sm font-medium text-slate-700">Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200">
                        <SelectValue placeholder="Selecteer een project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Geen project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Concept</SelectItem>
                        <SelectItem value="sent">Verzonden</SelectItem>
                        <SelectItem value="paid">Betaald</SelectItem>
                        <SelectItem value="overdue">Achterstallig</SelectItem>
                        <SelectItem value="cancelled">Geannuleerd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Factuurregels
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Voeg diensten en producten toe</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addLineItem}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Item Toevoegen
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <Card key={index} className="border-slate-200/50">
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-12">
                          <div className="md:col-span-5">
                            <Label htmlFor={`description-${index}`} className="text-sm font-medium text-slate-700">
                              Omschrijving
                            </Label>
                            <Input
                              id={`description-${index}`}
                              placeholder="Omschrijving van dienst of product"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, "description", e.target.value)}
                              required
                              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-slate-700">
                              Aantal
                            </Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                              required
                              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`unit_price-${index}`} className="text-sm font-medium text-slate-700">
                              Prijs per Stuk (EUR)
                            </Label>
                            <Input
                              id={`unit_price-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                              required
                              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-slate-700">Bedrag</Label>
                            <Input 
                              value={item.amount.toFixed(2)} 
                              disabled 
                              className="border-slate-200 bg-slate-50"
                            />
                          </div>
                          <div className="flex items-end md:col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLineItem(index)}
                              disabled={lineItems.length === 1}
                              className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Factuur Totalen
                    </CardTitle>
                    <p className="text-slate-600 mt-1">BTW en eindberekeningen</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_rate" className="text-sm font-medium text-slate-700">BTW Percentage (%)</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotaal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">BTW ({taxRate}%):</span>
                        <span className="font-medium">{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 text-lg font-bold">
                        <span>Totaal:</span>
                        <span className="text-emerald-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Terms */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Aanvullende Informatie
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Notities en voorwaarden</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Notities</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Aanvullende notities voor de klant..."
                      rows={4}
                      defaultValue={invoice?.notes || settings?.invoice_notes || ""}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms" className="text-sm font-medium text-slate-700">Algemene Voorwaarden</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      placeholder="Betalingsvoorwaarden en algemene voorwaarden..."
                      rows={4}
                      defaultValue={invoice?.terms || settings?.invoice_terms || ""}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500" />
                  <p className="text-sm font-medium text-red-800">Error</p>
                </div>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Opslaan..." : invoice ? "Factuur Bijwerken" : "Factuur Aanmaken"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/dashboard/invoices")} 
                disabled={isLoading}
                className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                Annuleren
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
