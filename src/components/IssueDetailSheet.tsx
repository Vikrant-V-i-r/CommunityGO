import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, MapPin, Share2, Hammer, Navigation, Clock, Building2, ShieldAlert, Droplet, Zap, HeartPulse, UserCircle } from "lucide-react";
import { User, Issue, TimelineEntry, IssueStatus } from "../lib/types";
import { getDB, verifyIssue, updateIssueStatus } from "../lib/local-db";
import { CATEGORY_EMOJIS } from "../lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ShareModal } from "./ShareModal";

const DEPT_INFO: Record<string, { name: string, icon: any }> = {
  "BBMP": { name: "Municipal Corp (BBMP)", icon: Building2 },
  "BTP": { name: "Traffic Police", icon: ShieldAlert },
  "BWSSB": { name: "Water Board (BWSSB)", icon: Droplet },
  "BESCOM": { name: "Electricity (BESCOM)", icon: Zap },
  "FIRE": { name: "Fire & Emergency", icon: HeartPulse },
  "POLICE": { name: "City Police", icon: UserCircle },
  "OTHER": { name: "Other Authority", icon: Building2 },
};

const STATUS_CONFIG = {
  "FRESH": { color: "bg-[#FF4B4B]", text: "ACTIVE" },
  "WIP": { color: "bg-amber-500", text: "IN PROGRESS" },
  "SOLVED": { color: "bg-[#00B873]", text: "SOLVED" }
};

export function IssueDetailSheet({ issueId, user, onClose }: { issueId: string; user: User; onClose: () => void }) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [timelines, setTimelines] = useState<TimelineEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [showUpdateMode, setShowUpdateMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<Issue["status"]>("WIP");
  const [updateComment, setUpdateComment] = useState("");

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("db-update", handleUpdate);
    return () => window.removeEventListener("db-update", handleUpdate);
  }, [issueId]);

  const refresh = () => {
    const db = getDB();
    const found = db.issues.find(i => i.id === issueId);
    if (found) {
      setIssue(found);
      setTimelines(db.timelines.filter(t => t.issueId === issueId).sort((a,b) => b.timestamp - a.timestamp));
      setUsers(db.users);
    }
  };

  if (!issue) return null;

  const hasVerified = issue.verifications.includes(user.id) || issue.reporterId === user.id;

  const handleVerify = () => {
    verifyIssue(issue.id, user.id);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateComment.trim()) return;
    updateIssueStatus(issue.id, user.id, updateStatus, updateComment);
    setShowUpdateMode(false);
    setUpdateComment("");
  };

  const getUser = (uid: string) => users.find(u => u.id === uid);
  const reporter = getUser(issue.reporterId);
  const deptInfo = DEPT_INFO[issue.authorityDept] || DEPT_INFO["OTHER"];
  const DeptIcon = deptInfo.icon;
  const statusConf = STATUS_CONFIG[issue.status];

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl max-h-[90vh] w-full max-w-md mx-auto relative shadow-2xl flex flex-col"
        >
          <div className="flex-1 overflow-y-auto pb-6">
            {/* Header Image */}
            <div className="relative w-full h-56 shrink-0 overflow-hidden">
              <img src={issue.photoUrl} alt="Issue" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <button onClick={onClose} className="absolute p-2 bg-black/40 backdrop-blur-md rounded-full top-4 right-4 text-white hover:bg-black/60 transition-colors">
                <X size={20} />
              </button>
              
              {/* Top Pills */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md ${statusConf.color}`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  {statusConf.text}
                </div>
              </div>
              <div className="absolute top-4 right-16">
                <div className="px-3 py-1 text-xs font-bold text-white bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/20">
                  <span className="text-[#FF4B4B]"><MapPin size={12} fill="currentColor" /></span>
                  {issue.category === "OTHER" ? "Other" : issue.category.replace("_", " ")}
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl font-bold leading-tight shadow-sm">{issue.title}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Reported by {reporter?.handle || "Someone"} · {formatDistanceToNow(issue.createdAt)} ago
                </p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              
              {/* 3 Stat Boxes */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Severity</span>
                  <span className={`text-sm font-bold ${issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? 'text-[#FF4B4B]' : issue.severity === 'LOW' ? 'text-[#00B873]' : 'text-[#FF7A00]'}`}>
                    {issue.severity.charAt(0) + issue.severity.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verifications</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    👥 {issue.verifications.length}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Confidence</span>
                  <span className="text-sm font-bold text-[#B026FF]">{Math.round(issue.confidence)}%</span>
                </div>
              </div>

              {/* Description */}
              <div className="border border-slate-200 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">DESCRIPTION</span>
                <p className="text-sm text-slate-700 leading-relaxed">{issue.description}</p>
              </div>

              {/* Location & Directions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin size={12} className="text-[#FF4B4B]" />
                    <span className="text-[10px] font-bold text-[#FF4B4B] uppercase tracking-wider">LOCATION</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Indiranagar, Bengaluru, Karnataka...</p>
                  <p className="text-[10px] text-slate-500 mt-1">{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</p>
                </div>
                <button className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 text-left hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-1 mb-1">
                    <Navigation size={12} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">DIRECTIONS</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Open in Google Maps</p>
                  <p className="text-[10px] text-slate-500 mt-1">Live link to the spot</p>
                </button>
              </div>

              {/* Routed To */}
              <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">ROUTED TO</span>
                  <div className="flex items-center gap-2">
                    <DeptIcon size={16} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-800">{deptInfo.name}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* Action Buttons */}
              {!showUpdateMode ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={hasVerified || issue.status === "SOLVED"}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      hasVerified || issue.status === "SOLVED" 
                        ? "bg-slate-50 text-slate-400 border border-slate-200" 
                        : "bg-white text-[#00B873] border border-[#00B873] hover:bg-[#00B873]/5"
                    }`}
                  >
                    <CheckCircle size={18} />
                    {hasVerified ? "Verified" : "Verify (+10🪙)"}
                  </button>
                  <button
                    onClick={() => setShowUpdateMode(true)}
                    disabled={issue.status === "SOLVED"}
                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Hammer size={18} />
                    Update Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-800">Post Update</h3>
                    <button type="button" onClick={() => setShowUpdateMode(false)} className="text-slate-400"><X size={16}/></button>
                  </div>
                  <select 
                    value={updateStatus} 
                    onChange={(e) => setUpdateStatus(e.target.value as IssueStatus)}
                    className="w-full p-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg outline-none"
                  >
                    {issue.status === "FRESH" && <option value="WIP">Work in Progress (+10🪙)</option>}
                    <option value="SOLVED">Solved! (+100🪙)</option>
                  </select>
                  <textarea
                    value={updateComment}
                    onChange={(e) => setUpdateComment(e.target.value)}
                    placeholder="What happened?"
                    required
                    rows={2}
                    className="w-full p-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg outline-none resize-none"
                  />
                  <button type="submit" className="w-full py-2 bg-[#FF7A00] text-white font-bold rounded-lg hover:bg-orange-600">
                    SUBMIT UPDATE
                  </button>
                </form>
              )}

              {/* Timeline */}
              <div className="pt-2 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-slate-800" />
                  <h3 className="text-sm font-bold text-slate-800">Timeline</h3>
                </div>
                <div className="space-y-6 pl-3 border-l border-slate-200">
                  {/* Map the actual timeline, and add the initial report as the last entry */}
                  {timelines.map((t) => {
                    const u = getUser(t.userId);
                    return (
                      <div key={t.id} className="relative pl-5">
                        <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 border-2 border-white ${
                          t.status === 'SOLVED' ? 'bg-[#00B873]' : t.status === 'WIP' ? 'bg-amber-500' : 'bg-[#FF4B4B]'
                        }`} />
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-slate-800">{u?.avatar} {u?.handle}</span>
                            <span className="text-[10px] text-slate-500">{formatDistanceToNow(t.timestamp)} ago</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{t.comment}</p>
                          <div className={`mt-2 inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                            t.status === 'SOLVED' ? 'bg-[#00B873] text-white' : t.status === 'WIP' ? 'bg-amber-500 text-white' : 'bg-[#FF4B4B] text-white'
                          }`}>
                            {t.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Initial report entry */}
                  <div className="relative pl-5">
                    <div className="absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 border-2 border-white bg-[#FF4B4B]" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{reporter?.handle}</span>
                        <p className="text-xs text-slate-600 mt-1">
                          Issue reported by {reporter?.handle}. AI categorized as {issue.category.replace("_", " ")} ({Math.round(issue.confidence*100)}% confidence). {issue.safetyTips ? `Safety: ${issue.safetyTips}` : ''}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{formatDistanceToNow(issue.createdAt)} ago</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {showShareModal && (
            <ShareModal issue={issue} onClose={() => setShowShareModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
