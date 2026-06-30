import React, { useMemo } from "react";
import { X, TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart2 } from "lucide-react";
import { Issue } from "../lib/types";
import { motion, AnimatePresence } from "motion/react";

export function StatsPanel({ issues, onClose }: { issues: Issue[]; onClose: () => void }) {
  
  const stats = useMemo(() => {
    const total = issues.length;
    const solved = issues.filter(i => i.status === "SOLVED").length;
    const wip = issues.filter(i => i.status === "WIP").length;
    const fresh = issues.filter(i => i.status === "FRESH").length;
    const solvedPct = total > 0 ? Math.round((solved / total) * 100) : 0;
    
    // Group by category for a mini breakdown
    const categoryCount = issues.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    return { total, solved, wip, fresh, solvedPct, topCategories };
  }, [issues]);

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-slate-50 rounded-t-3xl max-h-[90vh] w-full max-w-md mx-auto relative shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 flex justify-between items-center bg-white sticky top-0 z-10 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
                <BarChart2 size={14} />
              </div>
              City Impact Stats
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-10 space-y-6">
            
            {/* Resolution Rate Card */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <TrendingUp size={100} />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block mb-2">Resolution Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">{stats.solvedPct}%</span>
                </div>
                <p className="text-xs text-indigo-200 mt-2 max-w-[200px] leading-relaxed">
                  Of {stats.total} total reported issues have been verified and resolved by authorities.
                </p>
              </div>
            </div>

            {/* Numbers Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
                <CheckCircle className="text-emerald-500 mb-2" size={24} />
                <span className="text-2xl font-black text-slate-800">{stats.solved}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Resolved</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
                <Clock className="text-amber-500 mb-2" size={24} />
                <span className="text-2xl font-black text-slate-800">{stats.wip}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">In Progress</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center col-span-2">
                <AlertTriangle className="text-red-500 mb-2" size={24} />
                <span className="text-2xl font-black text-slate-800">{stats.fresh}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Open Issues</span>
              </div>
            </div>

            {/* Top Categories */}
            {stats.topCategories.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  MOST REPORTED ISSUES
                </span>
                <div className="space-y-2">
                  {stats.topCategories.map(([cat, count], idx) => (
                    <div key={cat} className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                      <div className="w-6 text-center font-bold text-slate-400 text-sm">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 font-bold text-sm text-slate-800">
                        {cat.replace("_", " ")}
                      </div>
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {count} reports
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
