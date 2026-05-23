'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown, TrendingUp, Star, Camera, Activity, Target, Zap, ChevronRight, CheckCircle2, Lightbulb, Check, Flame } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full z-50"
      >
        <div className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          Kalori AI
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="text-black hover:text-[#8b5cf6] transition-colors">Features</a>
          <a href="#" className="hover:text-[#8b5cf6] transition-colors">How it works</a>
          <a href="#" className="hover:text-[#8b5cf6] transition-colors">Testimonials</a>
        </div>
        <Link href="/login" className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
          Log In
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-12 pb-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.05] text-[#1a1a1a]">
            <span className="text-[#8b5cf6]">Scan Meals.</span><br />
            Hit Your Goals<span className="text-yellow-400">.</span>
          </motion.h1>

          {/* Tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <span className="px-5 py-2 rounded-full bg-white text-[#8b5cf6] text-sm font-medium shadow-sm flex items-center gap-2">
              <Camera className="w-4 h-4" /> AI Powered
            </span>
            <span className="px-5 py-2 rounded-full bg-[#8b5cf6] text-white text-sm font-medium shadow-sm flex items-center gap-2">
              Nutrition <Activity className="w-4 h-4" />
            </span>
            <span className="px-5 py-2 rounded-full bg-white text-[#8b5cf6] text-sm font-medium shadow-sm">
              Goals
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="text-gray-600 text-lg max-w-md leading-relaxed">
            Stop guessing your macros. Take a photo of your food and let our GPT-4o Vision AI instantly calculate your calories, protein, carbs, and fat.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-6 pt-4">
            <Link href="/login" className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-8 py-4 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 w-fit">
              Start Tracking Free <ArrowUpRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trust Section */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-end gap-8 pt-8">
            <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-semibold">4.9</span>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">from 10k+ reviews</span>
                </div>
              </div>
              <div className="relative h-12 w-40 overflow-hidden mt-1">
                <Image 
                  src="/images/team_avatars.png" 
                  alt="Happy Users" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative h-[500px] lg:h-[650px] w-full mt-10 lg:mt-0"
        >
          <div className="absolute inset-0 bg-[#1a1a1a] rounded-[48px] overflow-hidden group shadow-2xl">
            <Image 
              src="/images/food_scan.png" 
              alt="AI Food Scanning" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            {/* Cutout bottom left */}
            <div className="absolute -bottom-1 -left-1 w-32 h-32 bg-[#f8f9fa] rounded-tr-[48px] z-10 flex items-end justify-start"></div>
            {/* Cutout top right */}
            <div className="absolute -top-1 -right-1 w-24 h-24 bg-[#f8f9fa] rounded-bl-[48px] z-10"></div>
            
            {/* Floating content */}
            <div className="absolute bottom-12 left-12 z-20 text-white backdrop-blur-md bg-black/20 p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium tracking-wider uppercase text-gray-200">Processing</span>
              </div>
              <h3 className="text-2xl font-medium leading-snug">
                Grilled Salmon<br /><span className="text-[#8b5cf6] font-bold">42g Protein</span>
              </h3>
            </div>
            
            <button className="absolute bottom-10 right-10 z-20 w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#8b5cf6] hover:border-transparent transition-all shadow-lg">
              <ArrowDown className="w-6 h-6 animate-bounce mt-1" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* How It Works - Storytelling Section */}
      <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-sm font-bold tracking-widest uppercase mb-6">
            The Flow
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-5xl font-medium text-[#1a1a1a]">
            Dieting shouldn't involve math.
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2 z-0"></div>

          {[
            { step: '01', title: 'Snap a Photo', desc: 'No more searching databases or weighing ingredients. Just take a picture of your plate.', icon: Camera },
            { step: '02', title: 'AI Analyzes', desc: 'Our GPT-4o Vision model identifies the food, estimates portions, and cross-references Edamam APIs for perfect macros.', icon: Zap },
            { step: '03', title: 'Hit Targets', desc: 'See your daily progress instantly on your dashboard with beautiful, satisfying ring charts.', icon: Target }
          ].map((item, idx) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 relative z-10 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#8b5cf6] transition-colors duration-300">
                <item.icon className="w-8 h-8 text-[#1a1a1a] group-hover:text-white transition-colors" />
              </div>
              <div className="text-[#8b5cf6] font-bold text-lg mb-2">{item.step}</div>
              <h3 className="text-2xl font-medium mb-4 text-[#1a1a1a]">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dark Section - Features Bento */}
      <section className="bg-[#111111] text-white rounded-t-[60px] relative px-6 md:px-12 pt-32 pb-32 w-full mt-10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8"
          >
            <div className="max-w-2xl">
              <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl font-medium leading-tight">
                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d8b4fe]">succeed.</span>
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-sm text-lg leading-relaxed">
              From automated TDEE calculations to dynamic macro ring charts, Kalori AI brings your goals into focus.
            </motion.p>
          </motion.div>

          {/* Bento Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Dashboard */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#1c1c1c] rounded-[40px] p-4 flex flex-col group hover:bg-[#222] transition-colors border border-white/5 md:col-span-2"
            >
              <div className="relative h-80 w-full rounded-[32px] overflow-hidden mb-6 bg-black">
                <Image 
                  src="/images/dashboard.png" 
                  alt="Macro Dashboard" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent"></div>
                
                {/* Floating Tag */}
                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-sm font-medium">Real-time Rings</span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <h3 className="text-3xl font-medium mb-3">Daily Macro Dashboard</h3>
                <p className="text-gray-400 text-lg max-w-md">Watch your rings close as you eat. Instant feedback on calories, protein, carbs, and fats.</p>
              </div>
            </motion.div>

            {/* Card 2: Speed */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-[40px] p-10 flex flex-col items-start justify-between group overflow-hidden relative"
            >
              <div className="absolute -right-10 -top-10 opacity-20">
                <Zap className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-medium mb-4 text-white">Smart Goal Setup</h3>
                <p className="text-white/80 text-lg">
                  Tell us your body stats. We instantly calculate your perfect TDEE and daily protein targets.
                </p>
              </div>
              <button className="mt-12 bg-white text-[#6d28d9] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors w-fit relative z-10">
                Try it out <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Edamam API Accuracy Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 md:order-1 relative h-[500px] w-full rounded-[40px] bg-white shadow-2xl shadow-purple-500/10 border border-gray-100 p-8 flex flex-col justify-center overflow-hidden"
        >
          {/* Decorative background grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-xl border border-white/10 text-white transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#8b5cf6] font-bold text-sm">AI ESTIMATE</span>
                <span className="text-gray-400 text-xs">Unverified</span>
              </div>
              <p className="font-mono text-gray-300">"Looks like a large avocado. ~350 kcal."</p>
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="w-8 h-8 text-gray-300 animate-bounce" />
            </div>

            <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-2xl p-6 shadow-xl text-white transform rotate-2 hover:rotate-0 transition-transform">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">EDAMAM VERIFIED</span>
                <CheckCircle2 className="w-5 h-5 text-green-300" />
              </div>
              <div className="grid grid-cols-4 gap-4 text-center font-mono text-sm">
                <div className="flex flex-col"><span className="text-white/70 text-xs">KCAL</span>322</div>
                <div className="flex flex-col"><span className="text-white/70 text-xs">PRO</span>4g</div>
                <div className="flex flex-col"><span className="text-white/70 text-xs">FAT</span>29g</div>
                <div className="flex flex-col"><span className="text-white/70 text-xs">CARB</span>17g</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="order-1 md:order-2 flex flex-col space-y-6"
        >
          <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase w-fit mb-2">
            No Hallucinations
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium text-[#1a1a1a] leading-tight">
            Smart Vision. <br/><span className="text-[#8b5cf6]">Verified Facts.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-600 text-lg leading-relaxed">
            Unlike standard AI bots that guess your calories, Kalori AI uses GPT-4o Vision exclusively for visual recognition and portion estimation. 
          </motion.p>
          <motion.p variants={fadeUp} className="text-gray-600 text-lg leading-relaxed">
            We then cross-reference every ingredient against the massive, scientifically verified <b>Edamam Nutrition API</b>. You get the convenience of AI with the accuracy of a dietitian.
          </motion.p>
        </motion.div>
      </section>

      {/* Data that Understands You Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full rounded-[40px] bg-white shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-[#1a1a1a]">Daily Breakdown</h3>
            <span className="text-[#8b5cf6] text-sm font-medium flex items-center gap-1 cursor-pointer">
              View Details <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center gap-10 mb-10">
            {/* Circular Chart Mock */}
            <div className="relative w-36 h-36 rounded-full border-[12px] border-gray-100 flex items-center justify-center">
              {/* Fake progress arc */}
              <div className="absolute inset-0 rounded-full border-[12px] border-[#8b5cf6] border-t-transparent border-l-transparent transform rotate-45"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1a1a1a]">1,840</div>
                <div className="text-xs text-gray-500 font-medium">Cal Left</div>
              </div>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-5">
              {[
                { label: 'Protein', value: '120g / 150g', percent: '80%', color: 'bg-[#8b5cf6]' },
                { label: 'Carbs', value: '210g / 250g', percent: '84%', color: 'bg-[#6d28d9]' },
                { label: 'Fats', value: '52g / 70g', percent: '74%', color: 'bg-gray-300' }
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold text-[#1a1a1a] mb-2">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${bar.color}`}></div> {bar.label}
                    </span>
                    <span>{bar.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color}`} style={{ width: bar.percent }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Box */}
          <div className="bg-[#8b5cf6]/5 rounded-2xl p-4 flex items-start gap-4 border border-[#8b5cf6]/10">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center shrink-0 mt-1">
              <Lightbulb className="w-4 h-4 text-[#8b5cf6]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1a1a1a] mb-1">Insight of the Day</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your protein intake is 15% higher than last Tuesday. This aligns perfectly with your increased activity level today!
              </p>
            </div>
          </div>

          {/* Floating Fiber Box */}
          <div className="absolute bottom-6 right-6 bg-white shadow-xl rounded-2xl p-4 border border-gray-100 transform rotate-2">
            <div className="text-xs font-bold text-gray-500 mb-1">Fiber Goal</div>
            <div className="text-xl font-bold text-[#1a1a1a]">28g <span className="text-sm text-gray-400 font-normal">/ 30g</span></div>
            <div className="flex gap-1 mt-2">
              <div className="w-4 h-1.5 bg-[#8b5cf6] rounded-full"></div>
              <div className="w-4 h-1.5 bg-[#8b5cf6] rounded-full"></div>
              <div className="w-4 h-1.5 bg-[#8b5cf6] rounded-full"></div>
              <div className="w-4 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col space-y-8"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium text-[#1a1a1a] leading-tight">
            Data that <span className="text-[#8b5cf6]">Understands</span> You
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-600 text-lg leading-relaxed">
            Stop guessing and start knowing. Kalori AI provides tailored nutritional coaching based on your unique body composition, activity levels, and dietary goals.
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6 pt-4">
            {[
              { title: "Macronutrient Balancing", desc: "Perfectly balance your protein, carbs, and fats to fuel your specific lifestyle." },
              { title: "Micronutrient Tracking", desc: "Monitor vitamins and minerals to ensure complete physiological wellness." },
              { title: "Smart Meal Adjustments", desc: "Real-time suggestions to hit your targets as the day progresses." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <h4 className="text-[#1a1a1a] font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Streak Tracker Section */}
      <section className="py-24 px-6 md:px-12 w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#1a1a1a] rounded-[40px] p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b5cf6]/20 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Left Text & Days */}
          <div className="relative z-10 flex flex-col space-y-6 text-white">
            <h2 className="text-4xl md:text-5xl font-medium leading-tight">
              Don't break <br/>the chain.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Consistency is the secret sauce to health. Track your streak and watch your habits transform your life.
            </p>
            
            <div className="flex items-center gap-2 sm:gap-4 pt-6">
              {[
                { day: 'Mon', state: 'done' },
                { day: 'Tue', state: 'done' },
                { day: 'Wed', state: 'done' },
                { day: 'Thu', state: 'done' },
                { day: 'Fri', state: 'done' },
                { day: 'Sat', state: 'today' },
                { day: 'Sun', state: 'empty' },
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    {d.state === 'today' && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8b5cf6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        TODAY
                      </div>
                    )}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      d.state === 'done' 
                        ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' 
                        : d.state === 'today'
                        ? 'border-[#8b5cf6] text-[#8b5cf6] bg-[#8b5cf6]/10'
                        : 'border-gray-700 bg-transparent text-transparent'
                    }`}>
                      {d.state === 'done' ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : d.state === 'today' ? (
                        <div className="w-2 h-2 bg-[#8b5cf6] rounded-full"></div>
                      ) : null}
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${d.state === 'today' ? 'text-white' : 'text-gray-500'}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Glass Card */}
          <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-gray-400 text-sm font-medium mb-1">Current Streak</div>
                <div className="text-5xl font-medium text-white flex items-center gap-3">
                  12 Days <Flame className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              <div className="bg-[#8b5cf6]/20 text-[#8b5cf6] px-3 py-1 rounded-full text-xs font-bold border border-[#8b5cf6]/30">
                Personal Best
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-white">
                <span>Weekly Goal Completion</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#8b5cf6] rounded-full w-[85%] relative">
                  <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 italic pt-4">
                "You're in the top 5% of users this week!"
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Notifications Section */}
      <section className="bg-[#1a1a1a] py-32 px-6 md:px-12 w-full mt-10 rounded-[60px] mx-4 md:mx-8 max-w-[calc(100%-2rem)] md:max-w-[calc(100%-4rem)] mx-auto overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8b5cf6]/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col space-y-6"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
              A gentle nudge <br/>when you need it.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-md">
              Falling behind on your protein target? Kalori AI monitors your daily intake and sends smart, end-of-day push notifications so you never miss your goals. 
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-4 mt-4">
              {[
                "Custom meal reminder schedules",
                "Smart protein deficit alerts",
                "Weekly summary reports"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[600px] w-full flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-sm h-full drop-shadow-2xl">
              <Image 
                src="/images/notification.png" 
                alt="Push Notification Reminder" 
                fill 
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative bg-[#f8f9fa] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-medium text-[#1a1a1a] mb-8 leading-tight">
            Ready to completely <br /> change your diet?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-500 mb-12 max-w-xl">
            Join thousands of users who have stopped stressing about tracking macros. Start scanning today.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white px-10 py-5 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
              Create Free Account
            </Link>
            <button className="bg-white border border-gray-200 hover:border-gray-300 text-[#1a1a1a] px-10 py-5 rounded-full text-lg font-medium transition-all shadow-sm">
              See Pricing
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold tracking-tight text-black flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              Kalori AI
            </div>
            <p className="text-gray-500 max-w-sm mb-6">
              The smartest, fastest way to track your macros. Powered by GPT-4o Vision and verified nutritional data.
            </p>
            <p className="text-gray-400 text-sm">© 2026 Kalori AI. All rights reserved.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#1a1a1a] mb-6">Product</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Meal Scanner</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Macro Dashboard</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Goal Setup</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1a1a1a] mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#8b5cf6] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
