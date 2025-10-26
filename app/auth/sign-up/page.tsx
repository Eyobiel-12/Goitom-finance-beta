"use client"

import type React from "react"
import Image from "next/image"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens lang zijn")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Goitom Finance Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Goitom Finance
            </h1>
          </Link>
          <p className="mt-3 text-base text-muted-foreground">Professionele facturering voor freelancers</p>
        </div>
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">Maak je account aan</CardTitle>
            <CardDescription className="text-base">Start vandaag nog met je gratis account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2.5">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Volledige Naam
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jan Janssen"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Wachtwoord
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Bevestig Wachtwoord
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full h-11 shadow-sm" disabled={isLoading}>
                  {isLoading ? "Account aanmaken..." : "Account aanmaken"}
                </Button>
              </div>
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Heb je al een account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Inloggen
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
