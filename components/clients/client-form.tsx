"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Users, Building2, Mail, Phone, MapPin, FileText, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  postal_code: string | null
  tax_id: string | null
  notes: string | null
}

interface ClientFormProps {
  client?: Client
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const clientData = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      city: (formData.get("city") as string) || null,
      country: (formData.get("country") as string) || null,
      postal_code: (formData.get("postal_code") as string) || null,
      tax_id: (formData.get("tax_id") as string) || null,
      notes: (formData.get("notes") as string) || null,
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      if (client) {
        // Update existing client
        const { error } = await supabase.from("clients").update(clientData).eq("id", client.id)

        if (error) throw error
      } else {
        // Create new client
        const { error } = await supabase.from("clients").insert({ ...clientData, user_id: user.id })

        if (error) throw error
      }

      router.push("/dashboard/clients")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving client:", err)
      setError(err instanceof Error ? err.message : "Failed to save client")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard/clients">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">
                  {client ? "Klant Bewerken" : "Nieuwe Klant"}
                </span>
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                {client ? "Klant Bewerken" : "Nieuwe Klant Toevoegen"}
              </h1>
              <p className="mt-4 text-xl text-slate-600 max-w-2xl leading-relaxed">
                {client 
                  ? "Werk klantinformatie bij en beheer hun details."
                  : "Maak een nieuw klantprofiel aan om projecten en facturen bij te houden."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Klant Informatie
                    </CardTitle>
                    <p className="text-slate-600 mt-1">Vul de details hieronder in</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                           <h3 className="text-lg font-semibold text-slate-900">Basis Informatie</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                        Klantnaam <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Bedrijfsnaam" 
                        defaultValue={client?.name} 
                        required 
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax_id" className="text-sm font-medium text-slate-700">Tax ID</Label>
                      <Input 
                        id="tax_id" 
                        name="tax_id" 
                        placeholder="TIN123456789" 
                        defaultValue={client?.tax_id || ""} 
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                           <h3 className="text-lg font-semibold text-slate-900">Contact Informatie</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@acme.com"
                        defaultValue={client?.email || ""}
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        placeholder="+251 911 234567" 
                        defaultValue={client?.phone || ""} 
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                           <h3 className="text-lg font-semibold text-slate-900">Adres Informatie</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-slate-700">Adres</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="Straat en huisnummer" 
                        defaultValue={client?.address || ""} 
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-slate-700">Stad</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="Amsterdam" 
                          defaultValue={client?.city || ""} 
                          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-slate-700">Land</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          placeholder="Nederland" 
                          defaultValue={client?.country || ""} 
                          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postal_code" className="text-sm font-medium text-slate-700">Postcode</Label>
                        <Input 
                          id="postal_code" 
                          name="postal_code" 
                          placeholder="1234 AB" 
                          defaultValue={client?.postal_code || ""} 
                          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Additional Notes</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional information about the client..."
                      rows={4}
                      defaultValue={client?.notes || ""}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <p className="text-sm font-medium text-red-800">Error</p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : client ? "Update Client" : "Create Client"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/dashboard/clients")} 
                    disabled={isLoading}
                    className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
