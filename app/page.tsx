"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BarChart3, 
  FileText, 
  Users, 
  CheckCircle, 
  Star,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Users,
      title: "Klantbeheer",
      description: "Beheer je klanten en hun contactgegevens op één georganiseerde plek.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: FileText,
      title: "Factuur Generatie",
      description: "Maak professionele facturen met automatische berekeningen en directe PDF export.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: BarChart3,
      title: "BTW Rapporten",
      description: "Geautomatiseerde BTW berekeningen en rapportage voor naleving van regelgeving.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: TrendingUp,
      title: "Dashboard Analytics",
      description: "Houd je bedrijfsprestaties bij met real-time analytics en insights.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Shield,
      title: "Veilige Opslag",
      description: "Je gegevens worden veilig opgeslagen met enterprise-grade beveiliging.",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: Zap,
      title: "Snelle Workflow",
      description: "Optimaliseer je workflow met geautomatiseerde processen en slimme tools.",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    }
  ]

  const benefits = [
    "Professionele facturen in seconden",
    "Automatische BTW berekeningen",
    "Real-time dashboard analytics",
    "Veilige cloud opslag",
    "24/7 beschikbaarheid",
    "Nederlandse belastingwetgeving"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

        <header className="relative z-10 sticky top-0 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Goitom Finance Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent lg:text-3xl">
                Goitom Finance
                <span className="ml-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-medium">
                  BETA
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="lg" className="hidden sm:inline-flex hover:bg-slate-100/50">
                  Inloggen
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Gratis Starten
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="container mx-auto px-4 py-32 md:py-40 lg:py-48">
            <div className="mx-auto max-w-5xl text-center">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/20 backdrop-blur-sm mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">BETA - Nu beschikbaar in Nederland</span>
                <Sparkles className="h-4 w-4 text-orange-500" />
              </div>

              {/* Main Heading */}
              <h2 className={`text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                Professionele
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Financiële Diensten
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-slate-600">
                  Voor Ondernemers
                </span>
              </h2>

              {/* Subtitle */}
              <p className={`mt-8 text-lg text-slate-600 text-balance md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
                Beheer klanten, houd projecten bij, genereer facturen en regel BTW rapportage
                <br className="hidden md:block" />
                met elegantie en precisie. <span className="font-medium text-orange-600">Beta versie</span> - Speciaal ontworpen voor Nederlandse ondernemers.
              </p>

              {/* CTA Buttons */}
              <div className={`mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Beta Testen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto h-14 px-8 text-base bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200"
                  >
                    Inloggen
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className={`mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Veilig & Beveiligd</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>24/7 Beschikbaar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Enterprise Kwaliteit</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-32 md:py-40 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-6xl">
                <div className="text-center mb-20">
                  <Badge variant="outline" className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/20">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Alles wat je nodig hebt
                  </Badge>
                  <h3 className="text-4xl font-bold tracking-tight md:text-5xl mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Krachtige Functies
                  </h3>
                  <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
                    Professionele tools om je freelance bedrijf te beheren en te laten groeien
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <Card
                      key={feature.title}
                      className={`group relative overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out hover:shadow-xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${100 + (index * 100)}ms` }}
                    >
                      <CardContent className="p-8">
                        {/* Background gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        <div className="relative">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-200`}>
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          
                          <h4 className="text-xl font-semibold mb-4 text-slate-900 group-hover:text-slate-800 transition-colors">
                            {feature.title}
                          </h4>
                          
                          <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                            {feature.description}
                          </p>
                          
                          {/* Animated border */}
                          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-32 md:py-40">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <div className="text-center mb-20">
                  <Badge variant="outline" className="mb-6 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200/20">
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                    Waarom Goitom Finance?
                  </Badge>
                  <h3 className="text-4xl font-bold tracking-tight md:text-5xl mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Voordelen voor je Bedrijf
                  </h3>
                  <p className="text-xl text-slate-600 font-light">
                    Ontdek waarom duizenden ondernemers vertrouwen op Goitom Finance
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {benefits.map((benefit, index) => (
                    <div
                      key={benefit}
                      className={`flex items-center gap-4 p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${200 + (index * 100)}ms` }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 md:py-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <h3 className="text-4xl font-bold text-white mb-6 md:text-5xl">
                  Klaar om te beginnen?
                </h3>
                <p className="text-xl text-blue-100 mb-12 font-light">
                  Sluit je aan bij de beta testers die hun financiën beheren met Goitom Finance
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/auth/sign-up">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 text-base bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Start Beta Test
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-14 px-8 text-base bg-transparent border-white/30 text-white hover:bg-white/10 transition-all duration-200"
                    >
                      Inloggen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Goitom Finance Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Goitom Finance
                <span className="ml-2 text-xs bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-medium">
                  BETA
                </span>
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Professionele financiële diensten voor Nederlandse ondernemers
            </p>
            <p className="text-xs text-slate-400">
              &copy; 2025 Goitom Finance. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
