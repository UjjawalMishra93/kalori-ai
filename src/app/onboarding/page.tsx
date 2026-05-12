'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, Target, Zap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingFlow() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain' | null>(null)
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [age, setAge] = useState<string>('')
  const [weight, setWeight] = useState<string>('') // in kg
  const [height, setHeight] = useState<string>('') // in cm
  const [activity, setActivity] = useState<number | null>(null)

  const activityLevels = [
    { value: 1.2, label: 'Sedentary', desc: 'Little to no exercise' },
    { value: 1.375, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
    { value: 1.55, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
    { value: 1.725, label: 'Very Active', desc: 'Heavy exercise 6-7 days/week' },
  ]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const calculateAndSave = async () => {
    setLoading(true)
    
    // 1. Calculate BMR (Mifflin-St Jeor)
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseInt(age)
    
    let bmr = (10 * w) + (6.25 * h) - (5 * a)
    bmr = gender === 'male' ? bmr + 5 : bmr - 161

    // 2. Calculate TDEE
    let tdee = Math.round(bmr * (activity || 1.2))

    // 3. Adjust for Goal
    if (goal === 'lose') tdee -= 500
    if (goal === 'gain') tdee += 500

    // 4. Calculate Macros
    // Protein: 2g per kg
    const protein = Math.round(w * 2)
    // Fats: 0.8g per kg
    const fats = Math.round(w * 0.8)
    // Carbs: Remaining calories
    const proteinCals = protein * 4
    const fatsCals = fats * 9
    const carbsCals = tdee - (proteinCals + fatsCals)
    const carbs = Math.max(0, Math.round(carbsCals / 4))

    // Save to Supabase User Metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        is_onboarded: true,
        goal, gender, age: a, weight: w, height: h, activity_level: activity,
        target_calories: tdee,
        target_protein: protein,
        target_carbs: carbs,
        target_fats: fats
      }
    })

    if (error) {
      toast.error('Failed to save your profile. Please try again.')
      setLoading(false)
      return
    }

    toast.success('Profile setup complete!')
    // Move to final success step
    setStep(5)
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 2000)
  }

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.95 }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
      
      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full max-w-xl mb-12">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handleBack} className={`text-gray-400 hover:text-[#1a1a1a] transition-colors ${step === 0 ? 'invisible' : ''}`}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#8b5cf6]' : i < step ? 'w-4 bg-[#8b5cf6]/40' : 'w-4 bg-gray-200'}`} />
              ))}
            </div>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>
      )}

      {/* Dynamic Content Container */}
      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* Step 0: Goal */}
          {step === 0 && (
            <motion.div key="step-0" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="p-10 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">What's your primary goal?</h2>
              <p className="text-gray-500 mb-8">This helps us calculate your calorie deficit or surplus.</p>
              
              <div className="space-y-4 flex-1">
                {[
                  { id: 'lose', label: 'Lose Weight', desc: 'Caloric deficit for fat loss' },
                  { id: 'maintain', label: 'Maintain Weight', desc: 'Eat at maintenance calories' },
                  { id: 'gain', label: 'Build Muscle', desc: 'Caloric surplus for muscle gain' }
                ].map((g) => (
                  <button key={g.id} onClick={() => { setGoal(g.id as any); setTimeout(handleNext, 300); }} 
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${goal === g.id ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-gray-100 hover:border-[#8b5cf6]/30 bg-white'}`}>
                    <div className="font-bold text-lg text-[#1a1a1a] mb-1">{g.label}</div>
                    <div className="text-sm text-gray-500">{g.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Gender & Age */}
          {step === 1 && (
            <motion.div key="step-1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="p-10 flex-1 flex flex-col">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8">Tell us about yourself</h2>
              
              <div className="space-y-8 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Biological Sex</label>
                  <div className="flex gap-4">
                    <button onClick={() => setGender('male')} className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${gender === 'male' ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                      Male
                    </button>
                    <button onClick={() => setGender('female')} className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${gender === 'female' ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Age</label>
                  <input type="number" placeholder="e.g. 25" value={age} onChange={(e) => setAge(e.target.value)} 
                    className="w-full text-2xl font-bold p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none transition-colors" />
                </div>
              </div>

              <button onClick={handleNext} disabled={!gender || !age} className="w-full mt-8 bg-[#1a1a1a] text-white py-4 rounded-2xl font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Weight & Height */}
          {step === 2 && (
            <motion.div key="step-2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="p-10 flex-1 flex flex-col">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8">Body Metrics</h2>
              
              <div className="space-y-8 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 75" value={weight} onChange={(e) => setWeight(e.target.value)} 
                    className="w-full text-2xl font-bold p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Height (cm)</label>
                  <input type="number" placeholder="e.g. 180" value={height} onChange={(e) => setHeight(e.target.value)} 
                    className="w-full text-2xl font-bold p-4 rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none transition-colors" />
                </div>
              </div>

              <button onClick={handleNext} disabled={!weight || !height} className="w-full mt-8 bg-[#1a1a1a] text-white py-4 rounded-2xl font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <motion.div key="step-3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="p-10 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Activity Level</h2>
              <p className="text-gray-500 mb-8">How active are you on an average week?</p>
              
              <div className="space-y-3 flex-1">
                {activityLevels.map((lvl) => (
                  <button key={lvl.label} onClick={() => { setActivity(lvl.value); setTimeout(handleNext, 300); }} 
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${activity === lvl.value ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-gray-100 hover:border-[#8b5cf6]/30 bg-white'}`}>
                    <div className="font-bold text-[#1a1a1a]">{lvl.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Final Calculation */}
          {step === 4 && (
            <motion.div key="step-4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="p-10 flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-[#8b5cf6]/10 rounded-full flex items-center justify-center mb-8 relative">
                {loading && <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-transparent border-t-[#8b5cf6] rounded-full" />}
                <Zap className={`w-10 h-10 text-[#8b5cf6] ${loading ? 'animate-pulse' : ''}`} />
              </div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">You're all set!</h2>
              <p className="text-gray-500 mb-10 max-w-sm">We have everything we need to calculate your precise caloric needs and macro splits.</p>
              
              <button onClick={calculateAndSave} disabled={loading} className="w-full bg-[#8b5cf6] hover:bg-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all flex justify-center items-center">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate My Macros'}
              </button>
            </motion.div>
          )}

          {/* Step 5: Success Transition */}
          {step === 5 && (
            <motion.div key="step-5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 flex-1 flex flex-col justify-center items-center text-center bg-[#1a1a1a] text-white">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">Profile Created</h2>
              <p className="text-gray-400">Taking you to your personalized dashboard...</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
