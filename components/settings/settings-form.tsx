"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Building2, Receipt, Save, CheckCircle, AlertCircle, Loader2, Euro, Percent, FileText, Upload, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

interface Settings {
  id?: string
  currency: string
  tax_rate: number
  invoice_prefix: string
  invoice_terms: string | null
  invoice_notes: string | null
  logo_url?: string | null
}

interface Organization {
  id?: string
  name: string
  address: string | null
  city: string | null
  country: string | null
  postal_code: string | null
  phone: string | null
  email: string | null
  website: string | null
  tax_id: string | null
  logo_url?: string | null
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
}

interface SettingsFormProps {
  settings: Settings | null
  organization: Organization | null
  profile: Profile | null
}

export function SettingsForm({ settings, organization, profile }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(organization?.logo_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Separate useEffect for localStorage initialization
  useEffect(() => {
    const storedLogo = localStorage.getItem('organization_logo')
    if (storedLogo && !logoPreview) {
      setLogoPreview(storedLogo)
    }
  }, [logoPreview])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Alleen afbeeldingen zijn toegestaan')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Bestand is te groot. Maximum 5MB toegestaan.')
      return
    }

    setUploadingLogo(true)

    try {
      const supabase = createClient()

      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error:', authError)
        throw new Error(`Authenticatie fout: ${authError.message}`)
      }
      
      if (!user) {
        throw new Error('Je moet ingelogd zijn om bestanden te uploaden.')
      }
      
      console.log('User authenticated:', user.id)

      // Test Supabase connection
      console.log('Testing Supabase connection...')
      const { data: testData, error: testError } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
      
      if (testError) {
        console.error('Supabase connection test failed:', testError)
        throw new Error(`Database verbinding fout: ${testError.message}`)
      }
      
      console.log('Supabase connection test successful')

      // Try to list buckets (this might fail due to permissions)
      console.log('Checking available buckets...')
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.warn('Could not list buckets (permissions issue):', bucketsError)
        console.log('This is normal - proceeding with direct upload attempt')
      } else {
        console.log('Available buckets:', buckets?.map(b => b.name))
        const logosBucket = buckets?.find(bucket => bucket.name === 'logos')
        
        if (logosBucket) {
          console.log('Logos bucket found:', logosBucket)
        } else {
          console.log('Logos bucket not found in list, but bucket exists in dashboard')
        }
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      console.log('Attempting to upload file:', fileName, 'to logos bucket')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError.error
        })
        
        // If bucket doesn't exist, try to create it
        if (uploadError.message?.includes('not found') || uploadError.message?.includes('does not exist')) {
          console.log('Attempting to create logos bucket...')
          
          const { data: createData, error: createError } = await supabase.storage.createBucket('logos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
          })
          
          if (createError) {
            console.error('Failed to create bucket:', createError)
            throw new Error(`Kon logos bucket niet aanmaken: ${createError.message}`)
          }
          
          console.log('Bucket created successfully, retrying upload...')
          
          // Retry upload after creating bucket
          const { data: retryUploadData, error: retryUploadError } = await supabase.storage
            .from('logos')
            .upload(fileName, file)
          
          if (retryUploadError) {
            console.error('Retry upload failed:', retryUploadError)
            throw retryUploadError
          }
          
          console.log('Retry upload successful:', retryUploadData)
          // Continue with the successful retry
        } else {
          throw uploadError
        }
      } else {
        console.log('Upload successful:', uploadData)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      // Update organization with logo URL
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ logo_url: publicUrl })
        .eq('id', organization?.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      setLogoPreview(publicUrl)
      
      // Also store in localStorage as fallback
      localStorage.setItem('organization_logo', publicUrl)
      
      toast.success('Logo succesvol geüpload!')

    } catch (error) {
      console.error('Error uploading logo:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      console.error('Error keys:', error ? Object.keys(error) : 'No keys')
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('bucket')) {
          toast.error('Storage bucket bestaat niet. Controleer Supabase configuratie.')
        } else if (error.message.includes('permission')) {
          toast.error('Geen toestemming om bestanden te uploaden.')
        } else if (error.message.includes('not found')) {
          toast.error('Storage bucket niet gevonden. Controleer of de bucket correct is aangemaakt.')
        } else {
          toast.error(`Upload fout: ${error.message}`)
        }
      } else if (error && typeof error === 'object') {
        // Handle Supabase error objects
        const supabaseError = error as any
        if (supabaseError.message) {
          toast.error(`Supabase fout: ${supabaseError.message}`)
        } else if (supabaseError.error) {
          toast.error(`Supabase fout: ${supabaseError.error}`)
        } else {
          toast.error('Supabase storage fout. Controleer je authenticatie en bucket configuratie.')
        }
      } else {
        console.error('Unknown error type:', error)
        toast.error('Onbekende fout bij uploaden van logo. Controleer je internetverbinding en Supabase configuratie.')
      }
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      // Update or create settings
      const settingsData = {
        currency: formData.get("currency") as string,
        tax_rate: Number(formData.get("tax_rate")),
        invoice_prefix: formData.get("invoice_prefix") as string,
        invoice_terms: (formData.get("invoice_terms") as string) || null,
        invoice_notes: (formData.get("invoice_notes") as string) || null,
        user_id: user.id,
      }

      if (settings?.id) {
        await supabase.from("settings").update(settingsData).eq("id", settings.id)
      } else {
        await supabase.from("settings").insert(settingsData)
      }

      // Update or create organization
      const orgData = {
        name: formData.get("org_name") as string,
        address: (formData.get("org_address") as string) || null,
        city: (formData.get("org_city") as string) || null,
        country: (formData.get("org_country") as string) || null,
        postal_code: (formData.get("org_postal_code") as string) || null,
        phone: (formData.get("org_phone") as string) || null,
        email: (formData.get("org_email") as string) || null,
        website: (formData.get("org_website") as string) || null,
        tax_id: (formData.get("org_tax_id") as string) || null,
        user_id: user.id,
      }

      if (organization?.id) {
        await supabase.from("organizations").update(orgData).eq("id", organization.id)
      } else {
        await supabase.from("organizations").insert(orgData)
      }

      // Update profile
      const profileData = {
        full_name: (formData.get("full_name") as string) || null,
        phone: (formData.get("phone") as string) || null,
      }

      await supabase.from("profiles").update(profileData).eq("id", profile.id)

      setSuccess("Instellingen succesvol opgeslagen!")
      toast.success("Instellingen opgeslagen", {
        description: "Je account en bedrijfsinstellingen zijn bijgewerkt.",
      })
      
      setTimeout(() => {
      router.refresh()
      }, 1500)
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      setError("Er is een fout opgetreden bij het opslaan van de instellingen.")
      toast.error("Opslaan mislukt", {
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 backdrop-blur-sm rounded-xl p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profiel
            </TabsTrigger>
            <TabsTrigger 
              value="organization" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Organisatie
            </TabsTrigger>
            <TabsTrigger 
              value="invoicing" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Facturering
            </TabsTrigger>
        </TabsList>

          {/* Success/Error Messages */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 pt-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Persoonlijke Informatie</CardTitle>
                    <CardDescription>Beheer je persoonlijke accountgegevens</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                      Volledige Naam
                    </Label>
                    <Input 
                      id="full_name" 
                      name="full_name" 
                      defaultValue={profile?.full_name || ""} 
                      className="bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="Je volledige naam"
                    />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Adres
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      defaultValue={profile?.email} 
                      disabled 
                      className="bg-slate-50 border-slate-200 text-slate-500"
                    />
                    <p className="text-xs text-slate-500">Email kan niet worden gewijzigd</p>
            </div>
          </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Telefoonnummer
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    defaultValue={profile?.phone || ""} 
                    className="bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="+31 6 12345678"
                  />
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization" className="space-y-6 pt-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Bedrijfsinformatie</CardTitle>
                    <CardDescription>Configureer je bedrijfsgegevens voor facturen</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">Bedrijfslogo</h4>
                      <p className="text-sm text-slate-600">Upload je bedrijfslogo voor facturen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Logo Preview */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Bedrijfslogo"
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingLogo}
                        className="flex items-center gap-2"
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploaden...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Logo Uploaden
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-slate-500">
                        PNG, JPG of SVG. Maximaal 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />
                
                <div className="space-y-2">
                  <Label htmlFor="org_name" className="text-sm font-medium text-slate-700">
                    Bedrijfsnaam
                  </Label>
                  <Input 
                    id="org_name" 
                    name="org_name" 
                    defaultValue={organization?.name || ""} 
                    required
                    className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                    placeholder="Je bedrijfsnaam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org_address" className="text-sm font-medium text-slate-700">
                    Adres
                  </Label>
                  <Input 
                    id="org_address" 
                    name="org_address" 
                    defaultValue={organization?.address || ""} 
                    className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                    placeholder="Straat en huisnummer"
                  />
            </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="org_city" className="text-sm font-medium text-slate-700">
                      Stad
                    </Label>
                    <Input 
                      id="org_city" 
                      name="org_city" 
                      defaultValue={organization?.city || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="Amsterdam"
                    />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="org_postal_code" className="text-sm font-medium text-slate-700">
                      Postcode
                    </Label>
                    <Input 
                      id="org_postal_code" 
                      name="org_postal_code" 
                      defaultValue={organization?.postal_code || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="1234 AB"
                    />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="org_country" className="text-sm font-medium text-slate-700">
                      Land
                    </Label>
                    <Input 
                      id="org_country" 
                      name="org_country" 
                      defaultValue={organization?.country || "Nederland"} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="Nederland"
                    />
                  </div>
            </div>

                <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                    <Label htmlFor="org_phone" className="text-sm font-medium text-slate-700">
                      Bedrijfstelefoon
                    </Label>
                    <Input 
                      id="org_phone" 
                      name="org_phone" 
                      defaultValue={organization?.phone || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="+31 20 1234567"
                    />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="org_email" className="text-sm font-medium text-slate-700">
                      Bedrijfsemail
                    </Label>
                    <Input 
                      id="org_email" 
                      name="org_email" 
                      type="email" 
                      defaultValue={organization?.email || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="info@bedrijf.nl"
                    />
                  </div>
            </div>

                <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                    <Label htmlFor="org_website" className="text-sm font-medium text-slate-700">
                      Website
                    </Label>
                    <Input 
                      id="org_website" 
                      name="org_website" 
                      defaultValue={organization?.website || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="https://www.bedrijf.nl"
                    />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="org_tax_id" className="text-sm font-medium text-slate-700">
                      BTW-nummer
                    </Label>
                    <Input 
                      id="org_tax_id" 
                      name="org_tax_id" 
                      defaultValue={organization?.tax_id || ""} 
                      className="bg-white/80 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="NL123456789B01"
                    />
            </div>
          </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Invoicing Tab */}
          <TabsContent value="invoicing" className="space-y-6 pt-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Factuur Instellingen</CardTitle>
                    <CardDescription>Configureer je factuurvoorkeuren en standaarden</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Valuta
                    </Label>
                    <Select name="currency" defaultValue={settings?.currency || "EUR"}>
                      <SelectTrigger className="bg-white/80 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20">
                        <SelectValue placeholder="Selecteer valuta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
                  
            <div className="space-y-2">
                    <Label htmlFor="tax_rate" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      BTW Percentage
                    </Label>
              <Input
                id="tax_rate"
                name="tax_rate"
                type="number"
                      min="0" 
                      max="100" 
                step="0.01"
                      defaultValue={settings?.tax_rate || 21} 
                      className="bg-white/80 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                      placeholder="21"
              />
                    <p className="text-xs text-slate-500">Standaard Nederlandse BTW: 21%</p>
                  </div>
            </div>

            <div className="space-y-2">
                  <Label htmlFor="invoice_prefix" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Factuur Voorvoegsel
                  </Label>
                  <Input 
                    id="invoice_prefix" 
                    name="invoice_prefix" 
                    defaultValue={settings?.invoice_prefix || "INV"} 
                    className="bg-white/80 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                    placeholder="INV"
                  />
                  <p className="text-xs text-slate-500">Bijvoorbeeld: INV-2024-001</p>
            </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800">Factuur Standaarden</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoice_terms" className="text-sm font-medium text-slate-700">
                      Algemene Voorwaarden
                    </Label>
                    <Textarea 
                      id="invoice_terms" 
                      name="invoice_terms" 
                      defaultValue={settings?.invoice_terms || ""} 
                      className="bg-white/80 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 min-h-[100px]"
                      placeholder="Betalingsvoorwaarden en algemene voorwaarden..."
                    />
            </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoice_notes" className="text-sm font-medium text-slate-700">
                      Standaard Notities
                    </Label>
                    <Textarea 
                      id="invoice_notes" 
                      name="invoice_notes" 
                      defaultValue={settings?.invoice_notes || ""} 
                      className="bg-white/80 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 min-h-[80px]"
                      placeholder="Aanvullende notities die standaard op facturen verschijnen..."
                    />
            </div>
          </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Instellingen Opslaan
              </>
            )}
      </Button>
        </div>
    </form>
    </div>
  )
}