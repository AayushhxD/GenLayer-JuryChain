"use client"

import { useEffect, useState } from "react"
import { Scale, Users, TrendingUp, Clock } from "lucide-react"

interface Stats {
  totalCases: number
  resolvedToday: number
  activeJurors: number
  avgResolutionTime: string
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCases: 0,
    resolvedToday: 0,
    activeJurors: 12,
    avgResolutionTime: "~2 min",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/getCases")
        if (response.ok) {
          const data = await response.json()
          const cases = data.cases || []
          
          // Calculate stats
          const totalCases = cases.length
          const today = new Date().toDateString()
          const resolvedToday = cases.filter((c: any) => 
            new Date(c.createdAt).toDateString() === today
          ).length

          setStats({
            totalCases,
            resolvedToday,
            activeJurors: 12,
            avgResolutionTime: "~2 min",
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      icon: Scale,
      label: "Total Cases",
      value: stats.totalCases.toString(),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/50",
    },
    {
      icon: TrendingUp,
      label: "Resolved Today",
      value: stats.resolvedToday.toString(),
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/50",
    },
    {
      icon: Users,
      label: "Active AI Jurors",
      value: stats.activeJurors.toString(),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/50",
    },
    {
      icon: Clock,
      label: "Avg Resolution",
      value: stats.avgResolutionTime,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/50",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-800/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`card border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-50">{stat.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
