"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function VATReportForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [status, setStatus] = useState("draft")
  const [calculatedSales, setCalculatedSales] = useState(0)
  const [calculatedVAT, setCalculatedVAT] = useState(0)

  useEffect(() => {
    if (periodStart && periodEnd) {
      calculateVAT()
    }
  }, [periodStart, periodEnd])

  const calculateVAT = async () => {
    const supabase = createClient()

    const { data: invoices } = await supabase
      .from("invoices")
      .select("total, tax_amount")
      .gte("issue_date", periodStart)
      .lte("issue_date", periodEnd)
      .in("status", ["sent", "paid"])

    const totalSales = invoices?.reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0
    const totalVAT = invoices?.reduce((sum, inv) => sum + Number(inv.tax_amount || 0), 0) || 0

    setCalculatedSales(totalSales)
    setCalculatedVAT(totalVAT)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const reportData = {
      period_start: periodStart,
      period_end: periodEnd,
      total_sales: calculatedSales,
      total_vat: calculatedVAT,
      status,
      notes: (formData.get("notes") as string) || null,
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase.from("vat_reports").insert({ ...reportData, user_id: user.id })

      if (error) throw error

      router.push("/dashboard/vat")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creating VAT report:", err)
      setError(err instanceof Error ? err.message : "Failed to create VAT report")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="period_start">
            Period Start <span className="text-destructive">*</span>
          </Label>
          <Input
            id="period_start"
            name="period_start"
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period_end">
            Period End <span className="text-destructive">*</span>
          </Label>
          <Input
            id="period_end"
            name="period_end"
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calculated Totals */}
      {periodStart && periodEnd && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Calculated Totals</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-ET", {
                    style: "currency",
                    currency: "ETB",
                  }).format(calculatedSales)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">Total VAT:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-ET", {
                    style: "currency",
                    currency: "ETB",
                  }).format(calculatedVAT)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Additional notes about this VAT period..." rows={4} />
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading || !periodStart || !periodEnd}>
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/vat")} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
