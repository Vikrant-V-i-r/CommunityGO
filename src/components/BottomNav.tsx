import React, { useState, useEffect } from "react";
import { Plus, BarChart2, Trophy, Bell, User as UserIcon, X, Camera, ScanLine, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function BottomNav({ onOpenPanel, onOpenReport, onScanNearby }: { onOpenPanel: (panel: string) => void, onOpenReport: () => void, onScanNearby: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when pressing escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 z-30 bg-slate-900/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-40 pointer-events-none flex flex-col items-center px-4 pb-safe">
        
        {/* Floating Menu items */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex flex-col items-center gap-3 mb-6 pointer-events-auto"
            >
              <button 
                onClick={() => { setMenuOpen(false); onOpenReport(); }}
                className="flex items-center gap-3 px-6 py-3.5 bg-[#FF4B4B] text-white rounded-full font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
              >
                <Camera size={20} />
                Add Issue
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onScanNearby(); }}
                className="flex items-center gap-3 px-6 py-3.5 bg-white text-[#00B873] rounded-full font-bold shadow-lg active:scale-95 transition-transform"
              >
                <ScanLine size={20} />
                Scan Nearby
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onOpenPanel("PROFILE"); }}
                className="flex items-center gap-3 px-6 py-3.5 bg-white text-[#B026FF] rounded-full font-bold shadow-lg active:scale-95 transition-transform"
              >
                <History size={20} />
                My Reports
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white px-6 py-3 rounded-full shadow-2xl border border-slate-100 pointer-events-auto flex items-center gap-6 sm:gap-8">
          
          <button onClick={() => onOpenPanel("STATS")} className="flex flex-col items-center gap-1 w-10 text-slate-400 hover:text-slate-800 transition-colors">
            <BarChart2 size={24} />
            <span className="text-[10px] font-bold">Stats</span>
          </button>
          
          <button onClick={() => onOpenPanel("RANKS")} className="flex flex-col items-center gap-1 w-10 text-slate-400 hover:text-slate-800 transition-colors">
            <Trophy size={24} />
            <span className="text-[10px] font-bold">Ranks</span>
          </button>
          
          <div className="relative -mt-6">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/30 transition-transform active:scale-95 ${menuOpen ? 'bg-[#FF7A00]' : 'bg-gradient-to-tr from-[#FF512F] to-[#F09819]'}`}
            >
              {menuOpen ? <X size={28} /> : <Plus size={32} strokeWidth={2.5} />}
            </button>
          </div>
          
          <button onClick={() => onOpenPanel("ALERTS")} className="flex flex-col items-center gap-1 w-10 text-slate-400 hover:text-slate-800 transition-colors">
            <Bell size={24} />
            <span className="text-[10px] font-bold">Alerts</span>
          </button>

          <button onClick={() => onOpenPanel("PROFILE")} className="flex flex-col items-center gap-1 w-10 text-slate-400 hover:text-slate-800 transition-colors">
            <UserIcon size={24} />
            <span className="text-[10px] font-bold">Me</span>
          </button>

        </div>
      </div>
    </>
  );
}
