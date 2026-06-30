import React, { useState, useEffect } from "react";
import { X, LogOut, MapPin, Award, Star, Coins, User as UserIcon } from "lucide-react";
import { User, Issue } from "../lib/types";
import { clearCurrentUser, getDB } from "../lib/local-db";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";

export function ProfilePanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState<"reported" | "verified">("reported");

  useEffect(() => {
    const db = getDB();
    const myIssues = db.issues.filter(i => i.reporterId === user.id).sort((a, b) => b.createdAt - a.createdAt);
    setIssues(myIssues);
    // Note: To truly support 'verified' we'd need tracking of who verified what, 
    // for now we'll just show empty or mock for 'verified'.
  }, [user.id]);

  const handleSignOut = () => {
    clearCurrentUser();
    window.location.reload();
  };

  const nextLevelXp = user.level * 500;
  const progressPercent = Math.min(100, Math.round((user.xp / nextLevelXp) * 100));

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
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                <UserIcon size={14} />
              </div>
              Citizen Profile
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-10 space-y-6">
            
            {/* User Info Header */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl shadow-sm border border-slate-200">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-800 truncate">{user.handle}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <MapPin size={12} />
                    <span>Bengaluru, KA</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Level {user.level}</span>
                  <span className="text-slate-500">{user.xp} / {nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Total XP</span>
                  <div className="flex items-center gap-2">
                    <Star className="text-indigo-500" size={16} />
                    <span className="text-lg font-black text-slate-800">{user.xp}</span>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Coins</span>
                  <div className="flex items-center gap-2">
                    <Coins className="text-amber-500" size={16} />
                    <span className="text-lg font-black text-slate-800">{user.coins}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {user.badges.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Earned Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                      <Award size={14} className="text-amber-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            <div>
              <div className="flex items-center gap-4 border-b border-slate-200 mb-4">
                <button 
                  onClick={() => setActiveTab("reported")}
                  className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "reported" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Reported ({issues.length})
                </button>
                <button 
                  onClick={() => setActiveTab("verified")}
                  className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "verified" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Verified (0)
                </button>
              </div>

              {activeTab === "reported" && (
                <div className="space-y-3">
                  {issues.length > 0 ? (
                    issues.map(issue => (
                      <div key={issue.id} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 shadow-sm items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          {issue.photoUrl ? (
                            <img src={issue.photoUrl} alt="Issue" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              📷
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{issue.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              issue.status === "FRESH" ? "bg-red-100 text-red-600" :
                              issue.status === "WIP" ? "bg-amber-100 text-amber-600" :
                              "bg-emerald-100 text-emerald-600"
                            }`}>
                              {issue.status === "FRESH" ? "OPEN" : issue.status === "WIP" ? "IN PROGRESS" : "SOLVED"}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {formatDistanceToNow(issue.createdAt)} ago
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold text-[#D97706]">+10 🪙</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500 text-sm">No reports yet.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "verified" && (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm">You haven't verified any issues yet.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button 
                onClick={handleSignOut}
                className="w-full py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
