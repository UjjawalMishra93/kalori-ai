'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image as ImageIcon, Loader2, Sparkles, CheckCircle2, X, Zap, Clock, Flame } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

type MealHistoryItem = {
  id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  confidence: number
  created_at: string
}

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<MealHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('meal_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setHistory(data || [])
    setLoadingHistory(false)
  }, [supabase])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setStatus('idle')
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (!droppedFile.type.startsWith('image/')) {
        toast.error('Please drop a valid image file.')
        return
      }
      setFile(droppedFile)
      setPreviewUrl(URL.createObjectURL(droppedFile))
      setStatus('idle')
      setResult(null)
    }
  }

  const uploadImage = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      toast.error('Image upload failed: ' + uploadError.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('meal-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const saveMealToDb = async (mealData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Upload image to Supabase Storage
    let imageUrl = null
    if (file) {
      imageUrl = await uploadImage(file)
    }

    const { error: mealError } = await supabase.from('meal_items').insert({
      user_id: user.id,
      food_name: mealData.foodName,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fats: mealData.fats,
      confidence: mealData.confidence,
      image_url: imageUrl
    })

    if (mealError) {
      toast.error('Failed to save meal: ' + mealError.message)
      return
    }

    // Update Streak & Stats
    const today = new Date().toISOString().split('T')[0]
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!stats) {
      await supabase.from('user_stats').insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_log_date: today,
        total_meals_logged: 1,
      })
    } else {
      let newStreak = stats.current_streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (stats.last_log_date === today) {
        // already logged today
      } else if (stats.last_log_date === yesterdayStr) {
        newStreak += 1
      } else {
        newStreak = 1
      }

      await supabase.from('user_stats').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, stats.longest_streak),
        last_log_date: today,
        total_meals_logged: stats.total_meals_logged + 1,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    }

    toast.success('Meal saved and logged to your dashboard!')
    fetchHistory()
  }

  const handleAnalysis = async () => {
    if (!file) return
    setStatus('analyzing')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/scan', { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      setResult(data)
      setStatus('complete')

      // Auto-save meal to database
      await saveMealToDb(data)
    } catch (err: any) {
      toast.error(err.message || 'Failed to analyze meal')
      setStatus('idle')
    }
  }

  const resetScanner = () => {
    setFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setResult(null)
  }

  const macroColors: Record<string, string> = {
    protein: 'bg-green-500',
    carbs: 'bg-orange-400',
    fats: 'bg-blue-500',
    fiber: 'bg-yellow-400',
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#8b5cf6]" /> AI Meal Scanner
        </h1>
        <p className="text-gray-500">Snap a photo or upload an image — AI will identify and calculate the nutrition instantly.</p>
      </header>

      {/* Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* Left: Uploader */}
        <div className="w-full">
          {!previewUrl ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-[500px] border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center p-8 transition-all cursor-pointer bg-white group ${
                isDragging ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 scale-[0.99]' : 'border-gray-200 hover:border-[#8b5cf6]/50 hover:bg-gray-50'
              }`}
            >
              <div className="w-24 h-24 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all">
                <Upload className={`w-10 h-10 ${isDragging ? 'text-[#8b5cf6]' : 'text-gray-400 group-hover:text-[#8b5cf6]'}`} />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2 text-center">Drag &amp; drop your meal</h3>
              <p className="text-gray-500 mb-8 text-center max-w-sm">
                Supports JPG, PNG, or HEIC up to 10MB. Or click to browse files.
              </p>
              <button className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#8b5cf6] transition-colors">
                <ImageIcon className="w-5 h-5" /> Browse Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden bg-black shadow-2xl border border-gray-200">
              <Image
                src={previewUrl}
                alt="Meal preview"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-all duration-1000 ${
                  status === 'analyzing' ? 'scale-105 opacity-80 brightness-75' :
                  status === 'complete' ? 'opacity-90' : 'opacity-100'
                }`}
              />

              {/* Scanning Laser */}
              {status === 'analyzing' && (
                <>
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute left-0 w-full h-1 bg-[#8b5cf6] shadow-[0_0_20px_10px_rgba(139,92,246,0.4)] z-20"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf622_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf622_1px,transparent_1px)] bg-[size:40px_40px] z-10" />
                </>
              )}

              {/* Overlay Controls */}
              <div className="absolute inset-0 z-30 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  {status === 'idle' && (
                    <button onClick={resetScanner} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {status !== 'idle' && <div />}

                  <div className={`backdrop-blur-md px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold transition-all ${
                    status === 'analyzing' ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50 text-white' :
                    status === 'complete' ? 'bg-green-500/20 border-green-500/50 text-white' :
                    'bg-black/40 border-white/20 text-white'
                  }`}>
                    {status === 'idle' && 'Ready to scan'}
                    {status === 'analyzing' && <><Loader2 className="w-4 h-4 animate-spin" /> Analysing with Gemini...</>}
                    {status === 'complete' && <><CheckCircle2 className="w-4 h-4 text-green-400" /> Saved to Dashboard</>}
                  </div>
                </div>

                {status === 'idle' && (
                  <button
                    onClick={handleAnalysis}
                    className="w-full bg-[#8b5cf6] hover:bg-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-1"
                  >
                    Analyze &amp; Save Meal
                  </button>
                )}

                {status === 'complete' && (
                  <button
                    onClick={resetScanner}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:bg-white/20"
                  >
                    Scan Another Meal
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="w-full h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'analyzing' ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-[500px]"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${status === 'analyzing' ? 'bg-[#8b5cf6]/10 animate-pulse' : 'bg-gray-50'}`}>
                  {status === 'analyzing' ? (
                    <Sparkles className="w-10 h-10 text-[#8b5cf6]" />
                  ) : (
                    <Zap className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">
                  {status === 'analyzing' ? 'AI is working...' : 'Awaiting Image'}
                </h3>
                <p className="text-gray-500 max-w-sm leading-relaxed">
                  {status === 'analyzing'
                    ? 'Gemini Vision is identifying ingredients and calculating your macros. Hold on!'
                    : 'Upload a picture of your meal. The AI will calculate calories, protein, carbs, fats and fiber instantly — and save it automatically.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-purple-500/5"
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100">
                    <CheckCircle2 className="w-3 h-3" /> {result?.confidence}% Confidence
                  </div>
                  <div className="bg-[#8b5cf6]/10 text-[#8b5cf6] px-3 py-1 rounded-full text-xs font-bold border border-[#8b5cf6]/20">
                    Saved ✓
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6 leading-snug">{result?.foodName}</h2>

                {/* Calorie Big Number */}
                <div className="bg-[#f8f9fa] rounded-3xl p-6 mb-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <div className="text-sm font-bold text-gray-500 mb-1">Estimated Calories</div>
                      <div className="text-5xl font-black text-[#1a1a1a] tracking-tight">{result?.calories}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#8b5cf6]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 border-t border-gray-200 pt-6">
                    {[
                      { label: 'Protein', val: result?.protein, dot: 'bg-green-500' },
                      { label: 'Carbs', val: result?.carbs, dot: 'bg-orange-400' },
                      { label: 'Fats', val: result?.fats, dot: 'bg-blue-500' },
                      { label: 'Fiber', val: result?.fiber ?? '—', dot: 'bg-yellow-400' },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                          <span className="text-xs font-bold text-gray-500 uppercase">{m.label}</span>
                        </div>
                        <div className="text-xl font-bold text-[#1a1a1a]">{m.val}g</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                {result?.ingredients && result.ingredients.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identified Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.ingredients.map((ing: any, i: number) => (
                        <span key={i} className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#8b5cf6]/20">
                          {ing.quantity} {ing.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Meal History Section ────────────────────────────────────── */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#8b5cf6]" /> Scan History
          </h2>
          <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold">
            {history.length} meals
          </span>
        </div>

        {loadingHistory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 border border-gray-100 animate-pulse h-36" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 border border-gray-100 text-center">
            <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No meals scanned yet</h3>
            <p className="text-gray-400 text-sm">Scan your first meal above and it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {history.map((meal, idx) => {
                const isToday = new Date(meal.created_at).toDateString() === new Date().toDateString()
                const timeStr = new Date(meal.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                const dateStr = isToday ? `Today, ${timeStr}` : new Date(meal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` • ${timeStr}`

                return (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#8b5cf6]/20 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {meal.image_url ? (
                          <img src={meal.image_url} alt={meal.food_name} className="object-cover w-full h-full" />
                        ) : (
                          <Flame className="w-5 h-5 text-[#8b5cf6]" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{dateStr}</span>
                    </div>

                    <h4 className="font-bold text-[#1a1a1a] mb-3 leading-snug line-clamp-2">{meal.food_name}</h4>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#1a1a1a]">{meal.calories} <span className="text-sm font-normal text-gray-400">kcal</span></span>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className="text-green-500">{meal.protein}g P</span>
                        <span className="text-orange-400">{meal.carbs}g C</span>
                        <span className="text-blue-500">{meal.fats}g F</span>
                      </div>
                    </div>

                    {meal.confidence && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8b5cf6] rounded-full transition-all"
                            style={{ width: `${meal.confidence}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{meal.confidence}% AI Confidence</p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
