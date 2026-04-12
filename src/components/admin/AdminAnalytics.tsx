import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, FileText, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'

import analyticsService from '@/services/analyticsService'
import { cn } from '@/lib/utils'
import type { CompletionRate, DropoutData } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trackShortName(track: string): string {
  const map: Record<string, string> = {
    'Software Development (Frontend & Backend)': 'Software Dev',
    'UI/UX Design': 'UI/UX',
    'Mobile App Development': 'Mobile Dev',
    'Product/Project Management': 'Product Mgmt',
    'Quality Assurance (QA)': 'QA',
    'Data (Analysis/Science)': 'Data',
    Cybersecurity: 'Cybersecurity',
    Web3: 'Web3',
  }
  return map[track] ?? track
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="h-5 w-40 rounded bg-white/10" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 rounded bg-white/10" />
        ))}
      </div>
    </div>
  )
}

// ─── Section 1: Completion Rates ─────────────────────────────────────────────

interface BarProps {
  label: string
  value: number
  color: string
}

function Bar({ label, value, color }: BarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-right text-xs text-white/50 shrink-0">{label}</span>
      <div className="flex-1 h-5 rounded-sm bg-white/5 overflow-hidden">
        <div
          className={cn('h-full rounded-sm transition-all duration-700', color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-10 text-xs text-white/70 shrink-0">{value}%</span>
    </div>
  )
}

function CompletionRatesSection({ data }: { data: CompletionRate[] }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-5">
      <div>
        <h3 className="font-heading text-xl text-white">COMPLETION RATES BY TRACK</h3>
        <p className="text-xs text-white/40 mt-0.5">Percentage of mentees completing each milestone per track</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-tekton-purple-bright" /> Milestone 1</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-tekton-teal" /> Milestone 2</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-tekton-yellow" /> Milestone 3</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-white/40" /> Overall</span>
      </div>

      <div className="flex flex-col gap-6">
        {data.map((row) => (
          <div key={row.track} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/70">{trackShortName(row.track)}</span>
            <Bar label="M1" value={row.milestone1} color="bg-tekton-purple-bright" />
            <Bar label="M2" value={row.milestone2} color="bg-tekton-teal" />
            <Bar label="M3" value={row.milestone3} color="bg-tekton-yellow" />
            <Bar label="Overall" value={row.overall} color="bg-white/40" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section 2: Dropout Analysis ─────────────────────────────────────────────

function DropoutSection({ data }: { data: DropoutData[] }) {
  const maxPct = Math.max(...data.map((d) => d.dropoffPercentage), 1)

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-5">
      <div>
        <h3 className="font-heading text-xl text-white">DROPOUT ANALYSIS</h3>
        <p className="text-xs text-white/40 mt-0.5">Where mentees drop off across the 12-week program</p>
      </div>

      <div className="flex items-end gap-1.5 h-40">
        {data.map((d) => {
          const height = (d.dropoffPercentage / maxPct) * 100
          const isCritical = d.dropoffPercentage >= 20
          return (
            <div
              key={`${d.milestone}-${d.week}`}
              className="flex flex-col items-center gap-1 flex-1 group relative"
            >
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                <div className="bg-black border border-white/20 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
                  Wk {d.week}: {d.dropoffPercentage}% dropout
                </div>
                <div className="w-px h-2 bg-white/20" />
              </div>
              <div
                className={cn(
                  'w-full rounded-t-sm transition-all duration-700',
                  isCritical ? 'bg-red-500/70' : 'bg-tekton-teal/50',
                )}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              <span className="text-[9px] text-white/30">{d.week}</span>
            </div>
          )
        })}
      </div>

      {/* X-axis label */}
      <div className="flex items-center gap-4 text-xs text-white/40">
        <TrendingDown className="size-3.5 text-red-400" />
        <span>Hover over bars to see details. Red bars indicate critical drop-off points (≥20%)</span>
      </div>

      {/* Milestone boundaries */}
      <div className="flex gap-4 text-xs text-white/30">
        <span>M1: Weeks 1–4</span>
        <span>M2: Weeks 5–8</span>
        <span>M3: Weeks 9–12</span>
      </div>
    </div>
  )
}

// ─── Section 3: Mentor Effectiveness ─────────────────────────────────────────

interface MentorEffectivenessRow {
  mentorId: string
  mentorName: string
  track: string
  menteeCount: number
  avgMenteeProgress: number
  messagesCount: number
}

function MentorEffectivenessSection({ data }: { data: MentorEffectivenessRow[] }) {
  const [sortCol, setSortCol] = useState<keyof MentorEffectivenessRow>('avgMenteeProgress')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(col: keyof MentorEffectivenessRow) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortCol]
    const bv = b[sortCol]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  function SortHeader({ col, label }: { col: keyof MentorEffectivenessRow; label: string }) {
    const active = sortCol === col
    return (
      <button
        onClick={() => handleSort(col)}
        className={cn(
          'flex items-center gap-1 text-xs font-medium transition-colors',
          active ? 'text-tekton-purple-bright' : 'text-white/40 hover:text-white/70',
        )}
      >
        {label}
        <span className="text-[10px]">{active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-heading text-xl text-white">MENTOR EFFECTIVENESS</h3>
        <p className="text-xs text-white/40 mt-0.5">Click column headers to sort</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-left"><SortHeader col="mentorName" label="Mentor" /></th>
              <th className="pb-2 text-left"><SortHeader col="track" label="Track" /></th>
              <th className="pb-2 text-center"><SortHeader col="menteeCount" label="Mentees" /></th>
              <th className="pb-2 text-center"><SortHeader col="avgMenteeProgress" label="Avg Progress" /></th>
              <th className="pb-2 text-center"><SortHeader col="messagesCount" label="Messages" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.mentorId} className={cn('border-b border-white/5', i % 2 === 0 ? '' : 'bg-white/2')}>
                <td className="py-2.5 text-white font-medium">{row.mentorName}</td>
                <td className="py-2.5 text-white/50 text-xs">{trackShortName(row.track)}</td>
                <td className="py-2.5 text-center text-white/70">{row.menteeCount}</td>
                <td className="py-2.5 text-center">
                  <span className={cn(
                    'font-medium',
                    (row.avgMenteeProgress ?? 0) >= 70 ? 'text-tekton-green' :
                    (row.avgMenteeProgress ?? 0) >= 40 ? 'text-tekton-yellow' :
                    'text-red-400'
                  )}>
                    {(row.avgMenteeProgress ?? 0).toFixed(1)}%
                  </span>
                </td>
                <td className="py-2.5 text-center text-white/70">{row.messagesCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Section 4: Export ────────────────────────────────────────────────────────

function ExportSection() {
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null)

  async function handleExport(format: 'csv' | 'pdf') {
    setExporting(format)
    try {
      const blob = await analyticsService.exportData(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tektonx-analytics.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Analytics exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-heading text-xl text-white">EXPORT DATA</h3>
        <p className="text-xs text-white/40 mt-0.5">Download analytics data for offline reporting</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={exporting !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-tekton-green/30 bg-tekton-green/10 px-4 py-2.5 text-sm font-medium text-tekton-green smooth-hover hover:bg-tekton-green/20 transition-colors disabled:opacity-50"
        >
          <Download className="size-4" />
          {exporting === 'csv' ? 'Exporting…' : 'Export as CSV'}
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-tekton-blue/30 bg-tekton-blue/10 px-4 py-2.5 text-sm font-medium text-tekton-blue smooth-hover hover:bg-tekton-blue/20 transition-colors disabled:opacity-50"
        >
          <FileText className="size-4" />
          {exporting === 'pdf' ? 'Exporting…' : 'Export as PDF'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const { data: completionRates, isLoading: crLoading } = useQuery({
    queryKey: ['analytics-completion-rates'],
    queryFn: analyticsService.getCompletionRates,
  })

  const { data: dropoutData, isLoading: dropLoading } = useQuery({
    queryKey: ['analytics-dropout'],
    queryFn: analyticsService.getDropoutData,
  })

  const { data: effectivenessData, isLoading: effLoading } = useQuery({
    queryKey: ['analytics-mentor-effectiveness'],
    queryFn: analyticsService.getMentorEffectiveness,
  })

  const effectivenessRows = Array.isArray(effectivenessData) ? (effectivenessData as MentorEffectivenessRow[]) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Section 1 — Completion Rates */}
      {crLoading ? <SectionSkeleton /> : (
        completionRates && completionRates.length > 0 ? (
          <CompletionRatesSection data={completionRates} />
        ) : (
          <div className="glass-card rounded-xl p-8 text-center text-white/40 text-sm">
            No completion rate data available yet.
          </div>
        )
      )}

      {/* Section 2 — Dropout Analysis */}
      {dropLoading ? <SectionSkeleton /> : (
        dropoutData && dropoutData.length > 0 ? (
          <DropoutSection data={dropoutData} />
        ) : (
          <div className="glass-card rounded-xl p-8 text-center text-white/40 text-sm">
            No dropout data available yet.
          </div>
        )
      )}

      {/* Section 3 — Mentor Effectiveness */}
      {effLoading ? <SectionSkeleton /> : (
        effectivenessRows.length > 0 ? (
          <MentorEffectivenessSection data={effectivenessRows} />
        ) : (
          <div className="glass-card rounded-xl p-8 text-center text-white/40 text-sm">
            No mentor effectiveness data available yet.
          </div>
        )
      )}

      {/* Section 4 — Export */}
      <ExportSection />
    </div>
  )
}
