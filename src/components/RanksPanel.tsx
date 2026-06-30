import React, { useState, useEffect } from "react";
import { X, Trophy, Medal, Award } from "lucide-react";
import { User } from "../lib/types";
import { getDB } from "../lib/local-db";
import { motion, AnimatePresence } from "motion/react";

export function RanksPanel({ currentUser, onClose }: { currentUser: User; onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const db = getDB();
    const sorted = [...db.users].sort((a, b) => b.xp - a.xp);
    setUsers(sorted);
  }, []);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  const getRankBadgeColors = (index: number) => {
    if (index === 0) return "bg-amber-400 text-white border-white";
    if (index === 1) return "bg-slate-400 text-white border-white";
    if (index === 2) return "bg-orange-500 text-white border-white";
    return "bg-slate-200 text-slate-500 border-white";
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl max-h-[90vh] w-full max-w-md mx-auto relative shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 flex justify-between items-center bg-white sticky top-0 z-10 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Leaderboard
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Trophy size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800">City Leaderboard</h2>
            </div>

            {/* Podium */}
            {top3.length >= 3 && (
              <div className="flex items-end justify-center gap-3 h-52 mb-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-3xl shadow-sm border border-slate-200 z-10 relative">
                      {top3[1].avatar}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 z-20 ${getRankBadgeColors(1)}`}>
                      2
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 w-full text-center truncate">{top3[1].handle}</span>
                  <span className="text-[10px] font-bold text-[#D97706] mb-2 flex items-center gap-0.5">🪙 {top3[1].coins}</span>
                  <div className="w-full h-20 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-lg shadow-inner flex justify-center items-start pt-2">
                    <span className="text-xs font-bold text-slate-500">LVL {top3[1].level}</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1 -mt-4">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-4xl shadow-md border border-amber-200 z-10 relative">
                      {top3[0].avatar}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 z-20 ${getRankBadgeColors(0)}`}>
                      1
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-800 w-full text-center truncate">{top3[0].handle}</span>
                  <span className="text-xs font-bold text-[#D97706] mb-2 flex items-center gap-0.5">🪙 {top3[0].coins}</span>
                  <div className="w-full h-28 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-xl shadow-inner flex justify-center items-start pt-2">
                    <span className="text-xs font-bold text-white">LVL {top3[0].level}</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-2">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-orange-200 z-10 relative">
                      {top3[2].avatar}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 z-20 ${getRankBadgeColors(2)}`}>
                      3
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 w-full text-center truncate">{top3[2].handle}</span>
                  <span className="text-[10px] font-bold text-[#D97706] mb-2 flex items-center gap-0.5">🪙 {top3[2].coins}</span>
                  <div className="w-full h-16 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg shadow-inner flex justify-center items-start pt-2">
                    <span className="text-xs font-bold text-white">LVL {top3[2].level}</span>
                  </div>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {rest.map((u, i) => {
                const rank = i + 4;
                const isMe = u.id === currentUser.id;
                
                return (
                  <div 
                    key={u.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border ${
                      isMe ? "bg-red-50 border-red-200" : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <div className="w-6 text-center font-bold text-slate-400 text-sm">
                      {rank}
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl shrink-0">
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-800 truncate">{u.handle}</h3>
                        {isMe && <span className="bg-[#FF4B4B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Level {u.level} • {Math.floor(u.level / 2) + 1} badges</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm text-[#D97706] flex items-center gap-1 justify-end">
                        🪙 {u.coins}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                        <span className="text-slate-300">↗</span> {u.xp} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Earnable Badges section */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-4">
                ALL EARNABLE BADGES
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                    <Award className="text-amber-500" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">First Report</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Award className="text-blue-500" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">10 Verifications</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Award className="text-purple-500" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">City Hero</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
