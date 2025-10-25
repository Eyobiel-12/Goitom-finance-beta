"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Mock data for the chart
const chartData = [
  { month: 'Jan', revenue: 12000, invoices: 8 },
  { month: 'Feb', revenue: 15000, invoices: 12 },
  { month: 'Mar', revenue: 18000, invoices: 15 },
  { month: 'Apr', revenue: 22000, invoices: 18 },
  { month: 'May', revenue: 25000, invoices: 22 },
  { month: 'Jun', revenue: 28000, invoices: 25 },
]

export function DashboardChart() {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Omzet Trend
            </CardTitle>
            <p className="text-slate-600 mt-1">Maandelijkse prestatie overzicht</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="invoicesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#475569', fontWeight: '600' }}
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? `€${value.toLocaleString('nl-NL')}` : value,
                  name === 'revenue' ? 'Omzet' : 'Facturen'
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Omzet Groei</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900">+23.7%</div>
            <div className="text-xs text-emerald-600">vs vorige maand</div>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Factuur Aantal</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">+15.3%</div>
            <div className="text-xs text-blue-600">vs vorige maand</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
