import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils/currency"
import { InvoiceActions } from "@/components/invoices/invoice-actions"

export default async function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/dashboard/invoices/new")
  }

  const supabase = await createClient()

  const [{ data: invoice, error }, { data: items }, { data: organization }] = await Promise.all([
    supabase.from("invoices").select("*, clients(*)").eq("id", id).single(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id),
    supabase.from("organizations").select("*").maybeSingle(),
  ])

  if (error || !invoice) {
    notFound()
  }

  const statusColors = {
    draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    paid: "bg-green-500/10 text-green-500 border-green-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Invoice {invoice.invoice_number}</h1>
            <p className="mt-2 text-muted-foreground">View and manage invoice details</p>
          </div>
        </div>
        <InvoiceActions invoice={invoice} items={items || []} organization={organization} />
      </div>

      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-6 md:p-8 lg:p-12">
          {/* Invoice Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 border-b border-border/50 pb-8 md:flex-row">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary">{organization?.name || "Goitom Finance"}</h2>
              {organization && (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {organization.address && <p>{organization.address}</p>}
                  {organization.city && organization.country && (
                    <p>
                      {organization.city}, {organization.country}
                    </p>
                  )}
                  {organization.email && <p className="text-primary">{organization.email}</p>}
                  {organization.phone && <p>{organization.phone}</p>}
                  {organization.vat_number && <p>VAT: {organization.vat_number}</p>}
                </div>
              )}
            </div>
            <div className="text-right">
              <Badge
                variant="outline"
                className={`${statusColors[invoice.status as keyof typeof statusColors]} px-4 py-1.5 text-xs font-semibold uppercase tracking-wide`}
              >
                {invoice.status}
              </Badge>
              <p className="mt-4 text-sm font-medium text-muted-foreground">Invoice Number</p>
              <p className="text-xl font-bold">{invoice.invoice_number}</p>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Bill To</h3>
              {invoice.clients && (
                <div className="space-y-1 text-sm">
                  <p className="text-lg font-semibold text-foreground">{invoice.clients.name}</p>
                  {invoice.clients.address && <p className="text-muted-foreground">{invoice.clients.address}</p>}
                  {invoice.clients.city && invoice.clients.country && (
                    <p className="text-muted-foreground">
                      {invoice.clients.city}, {invoice.clients.country}
                    </p>
                  )}
                  {invoice.clients.email && <p className="text-primary">{invoice.clients.email}</p>}
                </div>
              )}
            </div>
            <div className="space-y-4 md:text-right">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                <p className="text-lg font-semibold">
                  {new Date(invoice.issue_date).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="text-lg font-semibold">
                  {new Date(invoice.due_date).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <div className="overflow-hidden rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="text-right font-semibold">Qty</TableHead>
                    <TableHead className="text-right font-semibold">Unit Price</TableHead>
                    <TableHead className="text-right font-semibold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items?.map((item) => (
                    <TableRow key={item.id} className="border-border/30">
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3 rounded-lg border border-border/50 bg-muted/20 p-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">Tax ({invoice.tax_rate}%):</span>
                <span className="font-semibold">{formatCurrency(invoice.tax_amount)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-3 text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 space-y-6 border-t border-border/50 pt-8">
              {invoice.notes && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notes</h3>
                  <p className="text-sm leading-relaxed text-foreground">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Terms & Conditions
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
