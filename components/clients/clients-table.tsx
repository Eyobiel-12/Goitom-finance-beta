"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
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

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  city: string | null
  country: string | null
  created_at: string
}

interface ClientsTableProps {
  clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
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

    const { error } = await supabase.from("clients").delete().eq("id", deleteId)

    if (error) {
      console.error("[v0] Error deleting client:", error)
      alert("Failed to delete client")
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (clients.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-16 text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
            <Users className="h-12 w-12 text-slate-400" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-slate-900">Nog geen klanten</h3>
        <p className="mt-2 text-slate-600 max-w-md">Begin met het opbouwen van je klantenbestand door je eerste klant toe te voegen. Houd projecten bij, beheer facturen en laat je bedrijf groeien.</p>
        <Link href="/dashboard/clients/new">
          <Button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Users className="mr-2 h-4 w-4" />
            Voeg je eerste klant toe
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className={cn(
        "overflow-x-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-slate-100/50">
                <TableHead className="font-semibold text-slate-700">Klant</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-slate-700">Contact</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold text-slate-700">Locatie</TableHead>
                <TableHead className="hidden xl:table-cell font-semibold text-slate-700">Aangemaakt</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow 
                  key={client.id}
                  className={cn(
                    "group border-slate-200/30 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 hover:shadow-sm",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{
                    transitionDelay: `${300 + (index * 50)}ms`,
                    transitionDuration: "0.6s",
                    transitionTimingFunction: "ease-out"
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold shadow-lg group-hover:scale-110 transition-transform duration-200">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                          {client.name}
                        </div>
                        {client.tax_id && (
                          <div className="text-xs text-slate-500">Tax ID: {client.tax_id}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-2">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                          <Mail className="h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-[200px]">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                          <Phone className="h-3 w-3 text-green-500" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {client.city && client.country ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span>{client.city}, {client.country}</span>
                      </div>
                    ) : client.country || client.city ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span>{client.country || client.city}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                      <Calendar className="h-3 w-3 text-purple-500" />
                      <span>{new Date(client.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/clients/${client.id}/edit`}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDeleteId(client.id)}
                        className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110"
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de klant en alle bijbehorende gegevens permanent verwijderen.
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
