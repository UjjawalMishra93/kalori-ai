'use client'

import { useRef } from 'react'
import { TrendingUp } from 'lucide-react'

type DayBar = {
  label: string      // 'Mon', 'Tue', etc.
  dateStr: string    // 'May 24'
  pct: number        // 0–100
  consumed: number   // grams
  target: number     // grams
  isToday: boolean
}

export default function ProteinChart({
  targetProtein,
  initialBars = [],
}: {
  targetProtein: number
  userId: string
  initialBars?: DayBar[]
}) {
  // bars are pre-computed server-side — no client fetch needed on mount
  const bars = initialBars

  const avgPct = bars.length
    ? Math.round(bars.reduce((s, b) => s + b.pct, 0) / bars.length)
    : 0

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" /> 7-Day Protein
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Daily protein vs. your {targetProtein}g target</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
          avgPct >= 80 ? 'bg-green-100 text-green-600' :
          avgPct >= 50 ? 'bg-amber-100 text-amber-600' :
          'bg-red-100 text-red-500'
        }`}>
          {avgPct}% avg
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 mt-4">
        {bars.map((bar) => (
          <div key={bar.dateStr} className="flex-1 flex flex-col items-center gap-1.5 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-[#1a1a1a] text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-lg">
                <div className="font-bold">{bar.consumed}g / {bar.target}g</div>
                <div className="text-gray-400">{bar.dateStr}</div>
              </div>
            </div>

            {/* Bar track */}
            <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden" style={{ height: '112px' }}>
              {/* Fill */}
              <div
                className={`absolute bottom-0 w-full rounded-xl transition-all duration-700 ${
                  bar.pct >= 80 ? 'bg-green-500' :
                  bar.pct >= 50 ? 'bg-amber-400' :
                  bar.pct === 0 ? 'bg-gray-100' :
                  'bg-red-400'
                } ${bar.isToday ? 'ring-2 ring-[#8b5cf6] ring-offset-1' : ''}`}
                style={{ height: `${Math.max(bar.pct, bar.pct === 0 ? 0 : 4)}%` }}
              />
              {/* Target line at 100% */}
              <div className="absolute top-0 left-0 w-full h-px bg-gray-300 opacity-60" />
            </div>

            {/* % label */}
            <span className={`text-[10px] font-bold ${bar.pct >= 80 ? 'text-green-600' : bar.pct >= 50 ? 'text-amber-500' : 'text-gray-400'}`}>
              {bar.pct > 0 ? `${Math.round(bar.pct)}%` : '—'}
            </span>

            {/* Day label */}
            <span className={`text-[11px] font-bold ${bar.isToday ? 'text-[#8b5cf6]' : 'text-gray-400'}`}>
              {bar.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        {[['bg-green-500', '≥80% goal'], ['bg-amber-400', '50–79%'], ['bg-red-400', '<50%']].map(([cls, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
