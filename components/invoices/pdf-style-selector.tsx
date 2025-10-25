"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Palette, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

interface PDFStyleSelectorProps {
  invoice: any
  items: any[]
  organization: any
  onDownload: (style: 'modern' | 'classic' | 'minimal', colorScheme: 'blue' | 'green' | 'purple' | 'orange') => void
  isGenerating: boolean
}

const styles = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Moderne stijl met gradients en schaduwen',
    preview: 'bg-gradient-to-r from-blue-500 to-purple-500'
  },
  {
    id: 'classic' as const,
    name: 'Klassiek',
    description: 'Traditionele zakelijke stijl',
    preview: 'bg-gradient-to-r from-slate-600 to-slate-800'
  },
  {
    id: 'minimal' as const,
    name: 'Minimaal',
    description: 'Eenvoudige, schone stijl',
    preview: 'bg-gradient-to-r from-gray-400 to-gray-600'
  }
]

const colorSchemes = [
  {
    id: 'blue' as const,
    name: 'Blauw',
    color: 'bg-blue-500',
    description: 'Professioneel blauw'
  },
  {
    id: 'green' as const,
    name: 'Groen',
    color: 'bg-green-500',
    description: 'Natuurlijk groen'
  },
  {
    id: 'purple' as const,
    name: 'Paars',
    color: 'bg-purple-500',
    description: 'Creatief paars'
  },
  {
    id: 'orange' as const,
    name: 'Oranje',
    color: 'bg-orange-500',
    description: 'Energiek oranje'
  }
]

export function PDFStyleSelector({ invoice, items, organization, onDownload, isGenerating }: PDFStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<'modern' | 'classic' | 'minimal'>('modern')
  const [selectedColor, setSelectedColor] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue')

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PDF Stijl Kiezen
            </CardTitle>
            <p className="text-slate-600 text-sm">Kies je gewenste factuur stijl en kleuren</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Style Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Stijl</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {styles.map((style) => (
              <div
                key={style.id}
                className={cn(
                  "relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  selectedStyle === style.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                )}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="p-4">
                  <div className={cn("h-8 w-full rounded mb-2", style.preview)} />
                  <h4 className="font-medium text-slate-900">{style.name}</h4>
                  <p className="text-xs text-slate-600">{style.description}</p>
                </div>
                {selectedStyle === style.id && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white">
                    Geselecteerd
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Kleurenschema</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={cn(
                  "relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  selectedColor === scheme.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                )}
                onClick={() => setSelectedColor(scheme.id)}
              >
                <div className="p-3 text-center">
                  <div className={cn("h-6 w-6 rounded-full mx-auto mb-2", scheme.color)} />
                  <h4 className="font-medium text-slate-900 text-sm">{scheme.name}</h4>
                  <p className="text-xs text-slate-600">{scheme.description}</p>
                </div>
                {selectedColor === scheme.id && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            onClick={() => onDownload(selectedStyle, selectedColor)}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "PDF Genereren..." : `Factuur Downloaden (${styles.find(s => s.id === selectedStyle)?.name} - ${colorSchemes.find(c => c.id === selectedColor)?.name})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
