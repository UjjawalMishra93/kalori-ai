'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { Download, Loader2, Sparkles, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { format, subDays, isSameDay } from 'date-fns'

type Meal = {
  id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  created_at: string
}

const COLORS = {
  protein: '#22c55e', // green-500
  carbs: '#fb923c',   // orange-400
  fats: '#3b82f6',    // blue-500
  calories: '#8b5cf6', // purple-500
  target: '#9ca3af',   // gray-400
}

export default function ReportsDashboardClient({
  userId, targetCalories, targetProtein, targetCarbs, targetFats, userName
}: {
  userId: string
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFats: number
  userName: string
}) {
  const supabase = createClient()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const fetchMeals = useCallback(async () => {
    // Fetch last 30 days of meals
    const since = subDays(new Date(), 30)
    since.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('meal_items')
      .select('id, food_name, calories, protein, carbs, fats, created_at')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })

    setMeals(data || [])
    setLoading(false)
  }, [supabase, userId])

  useEffect(() => { fetchMeals() }, [fetchMeals])

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    setDownloading(true)
    
    // Slight delay to ensure UI updates before capture
    await new Promise(r => setTimeout(r, 100))

    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      // If the content is longer than one A4 page, we might need multiple pages, 
      // but for this dashboard, we'll try to fit it on one page or let it scale.
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`kalori-ai-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
      
      toast.success('Report downloaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate PDF report')
    } finally {
      setDownloading(false)
    }
  }

  // --- Process Data for Charts ---

  // 1. Calories trend (Last 30 days, grouped by day)
  const caloriesData = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i)
    const dayMeals = meals.filter(m => isSameDay(new Date(m.created_at), d))
    const totalCals = dayMeals.reduce((sum, m) => sum + m.calories, 0)
    return {
      dateStr: format(d, 'MMM dd'),
      calories: totalCals,
      target: targetCalories
    }
  })

  // 2. Average Macros (Last 7 days vs Previous 7 days)
  const last7DaysMeals = meals.filter(m => new Date(m.created_at) >= subDays(new Date(), 7))
  const prev7DaysMeals = meals.filter(m => {
    const d = new Date(m.created_at)
    return d >= subDays(new Date(), 14) && d < subDays(new Date(), 7)
  })

  const getAvgMacros = (mealArr: Meal[]) => {
    const totalP = mealArr.reduce((s, m) => s + m.protein, 0)
    const totalC = mealArr.reduce((s, m) => s + m.carbs, 0)
    const totalF = mealArr.reduce((s, m) => s + m.fats, 0)
    // Divide by 7 days
    return {
      protein: Math.round(totalP / 7),
      carbs: Math.round(totalC / 7),
      fats: Math.round(totalF / 7)
    }
  }

  const last7Avg = getAvgMacros(last7DaysMeals)
  const prev7Avg = getAvgMacros(prev7DaysMeals)

  const macroCompareData = [
    { name: 'Protein', 'Last 7 Days': last7Avg.protein, 'Previous 7 Days': prev7Avg.protein },
    { name: 'Carbs', 'Last 7 Days': last7Avg.carbs, 'Previous 7 Days': prev7Avg.carbs },
    { name: 'Fats', 'Last 7 Days': last7Avg.fats, 'Previous 7 Days': prev7Avg.fats },
  ]

  // 3. Macro Breakdown (Overall % for last 7 days)
  const totalLast7Macros = last7Avg.protein + last7Avg.carbs + last7Avg.fats
  const macroPieData = totalLast7Macros > 0 ? [
    { name: 'Protein', value: last7Avg.protein, color: COLORS.protein },
    { name: 'Carbs', value: last7Avg.carbs, color: COLORS.carbs },
    { name: 'Fats', value: last7Avg.fats, color: COLORS.fats },
  ] : []

  // 4. Meal Frequency (Meals logged per day over last 14 days)
  const frequencyData = Array.from({ length: 14 }).map((_, i) => {
    const d = subDays(new Date(), 13 - i)
    const count = meals.filter(m => isSameDay(new Date(m.created_at), d)).length
    return {
      dateStr: format(d, 'MMM dd'),
      meals: count
    }
  })

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-20 bg-white rounded-[32px] border border-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-[32px] border border-gray-100 animate-pulse" />
          <div className="h-80 bg-white rounded-[32px] border border-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading || meals.length === 0}
          className="bg-[#1a1a1a] hover:bg-[#8b5cf6] disabled:opacity-50 disabled:hover:bg-[#1a1a1a] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/30"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {downloading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>

      {/* Wrapping the content we want to capture in a div */}
      <div ref={reportRef} className="bg-gray-50/50 -m-4 p-4 rounded-3xl pb-10">
        
        {/* PDF Header (Only really styled for the PDF, but looks good in UI too) */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8b5cf6]" /> Kalori AI Report
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Nutritional Analysis for {userName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date Generated</p>
            <p className="text-lg font-bold text-[#1a1a1a]">{format(new Date(), 'MMMM do, yyyy')}</p>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="bg-white p-16 rounded-[32px] border border-gray-100 text-center shadow-sm">
            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">Not enough data</h3>
            <p className="text-gray-400 text-sm">Log some meals to see your reports and insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 30 Day Calorie Trend */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#8b5cf6]" /> 30-Day Calorie Trend
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Daily calorie intake vs your {targetCalories} kcal target</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={caloriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="dateStr" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      dx={-10}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1a1a1a', marginBottom: '4px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600 }} />
                    <Line 
                      type="monotone" 
                      name="Consumed"
                      dataKey="calories" 
                      stroke={COLORS.calories} 
                      strokeWidth={4} 
                      dot={{ r: 0 }} 
                      activeDot={{ r: 6, fill: COLORS.calories, stroke: '#fff', strokeWidth: 2 }} 
                    />
                    <Line 
                      type="step" 
                      name="Target"
                      dataKey="target" 
                      stroke={COLORS.target} 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-[#8b5cf6]" /> Macro Breakdown
                </h3>
                <p className="text-xs text-gray-500 mt-1">Average distribution over the last 7 days</p>
              </div>
              <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
                {macroPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {macroPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`${value}g/day`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 font-medium">No macros logged last 7 days.</p>
                )}
                {/* Custom Legend */}
                {macroPieData.length > 0 && (
                  <div className="absolute bottom-0 w-full flex justify-center gap-4">
                    {macroPieData.map(entry => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs font-bold text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Macro Comparison */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#8b5cf6]" /> Weekly Averages
                </h3>
                <p className="text-xs text-gray-500 mt-1">Last 7 days vs Previous 7 days</p>
              </div>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={macroCompareData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#1a1a1a', fontWeight: 'bold' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`${value}g`, '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                    <Bar dataKey="Last 7 Days" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Previous 7 Days" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Meal Logging Frequency */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">Meal Logging Frequency</h3>
                  <p className="text-xs text-gray-500 mt-1">Number of meals logged daily over the last 14 days</p>
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyData} margin={{ top: 5, right: 0, bottom: 5, left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="dateStr" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      allowDecimals={false}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="meals" name="Meals Logged" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
