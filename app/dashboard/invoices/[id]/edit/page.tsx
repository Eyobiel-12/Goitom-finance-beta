import { createClient } from "@/lib/supabase/server"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound, redirect } from "next/navigation"

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/dashboard/invoices/new")
  }

  const supabase = await createClient()

  const [{ data: invoice, error }, { data: items }, { data: clients }, { data: projects }, { data: settings }] =
    await Promise.all([
      supabase.from("invoices").select("*").eq("id", id).single(),
      supabase.from("invoice_items").select("*").eq("invoice_id", id),
      supabase.from("clients").select("id, name").order("name"),
      supabase.from("projects").select("id, name").order("name"),
      supabase.from("settings").select("*").maybeSingle(),
    ])

  if (error || !invoice) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">Edit Invoice</h1>
          <p className="mt-2 text-muted-foreground">Update invoice details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            invoice={invoice}
            items={items || []}
            clients={clients || []}
            projects={projects || []}
            settings={settings}
          />
        </CardContent>
      </Card>
    </div>
  )
}
