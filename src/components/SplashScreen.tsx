import { motion } from "motion/react";
import { useEffect } from "react";

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[100dvh] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      
      {/* Floating Emojis */}
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: -50, opacity: 0.3 }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} className="absolute text-3xl left-10 top-20">🕳️</motion.div>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 50, opacity: 0.3 }} transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }} className="absolute text-3xl right-16 top-40">💡</motion.div>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 50, opacity: 0.3 }} transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse" }} className="absolute text-3xl left-20 bottom-40">🗑️</motion.div>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: -50, opacity: 0.3 }} transition={{ duration: 2.7, repeat: Infinity, repeatType: "reverse" }} className="absolute text-3xl right-10 bottom-20">🌊</motion.div>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 0.3 }} transition={{ duration: 2.1, repeat: Infinity, repeatType: "reverse" }} className="absolute text-3xl left-1/3 top-10">🚧</motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 border border-white/20">
            <span className="text-5xl">🦸</span>
          </div>
          <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/50 animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Community <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">GO</span>
          </h1>
          <p className="text-sm font-bold tracking-widest text-indigo-300 uppercase">everyone is a HERO!</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-16 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden"
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-rose-400 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
