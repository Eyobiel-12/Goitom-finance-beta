import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Goitom Finance</h1>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="lg" className="hidden sm:inline-flex">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" className="shadow-sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-32 md:py-40 lg:py-48">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now available in the Netherlands
            </div>
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
              Professional Invoicing
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="mt-8 text-lg text-muted-foreground text-balance md:text-xl lg:text-2xl font-light leading-relaxed">
              Manage clients, track projects, generate invoices, and handle VAT reporting
              <br className="hidden md:block" />
              with elegance and precision.
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-transparent">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t py-32 md:py-40">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-20">
                <h3 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">Everything you need</h3>
                <p className="text-xl text-muted-foreground font-light">
                  Powerful features to manage your freelance business
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Client Management</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Keep track of all your clients and their contact information in one organized place.
                  </p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Invoice Generation</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Create professional invoices with automatic calculations and instant PDF export.
                  </p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">VAT Reporting</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Automated VAT calculations and reporting to stay compliant with regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2025 Goitom Finance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
