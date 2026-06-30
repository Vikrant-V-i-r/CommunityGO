import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, Loader2, Image as ImageIcon, MapPin, AlertTriangle, Wand2, CheckCircle2, Building2, ShieldAlert, Droplet, Zap, HeartPulse, UserCircle } from "lucide-react";
import { User, AIAnalysisResponse, IssueCategory, IssueSeverity, AuthorityDept } from "../lib/types";
import { createIssue } from "../lib/local-db";

const DEPT_INFO: Record<AuthorityDept, { name: string, icon: any }> = {
  "BBMP": { name: "Municipal Corp (BBMP)", icon: Building2 },
  "BTP": { name: "Traffic Police", icon: ShieldAlert },
  "BWSSB": { name: "Water Board (BWSSB)", icon: Droplet },
  "BESCOM": { name: "Electricity (BESCOM)", icon: Zap },
  "FIRE": { name: "Fire & Emergency", icon: HeartPulse },
  "POLICE": { name: "City Police", icon: UserCircle },
  "OTHER": { name: "Other Authority", icon: Building2 },
};

export function ReportSheet({ user, onClose }: { user: User; onClose: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [category, setCategory] = useState<IssueCategory>("OTHER");
  const [severity, setSeverity] = useState<IssueSeverity>("MEDIUM");
  const [dept, setDept] = useState<AuthorityDept>("BBMP");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        }
      );
    }
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: photo })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        setCategory(data.analysis.category);
        setSeverity(data.analysis.severity);
        setDept(data.analysis.authorityDept);
        setTitle(data.analysis.title);
        setDesc(data.analysis.description);
      }
    } catch (e) {
      console.error("Analysis failed", e);
      // Fallback
      setTitle("Civic Issue");
      setDesc("Issue spotted manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !title) return;
    
    createIssue({
      reporterId: user.id,
      category,
      severity,
      authorityDept: dept,
      title,
      description: desc,
      lat,
      lng,
      photoUrl: photo,
      status: "FRESH",
      confidence: analysis?.confidence || 0,
      safetyTips: analysis?.safetyTips || "",
      estimatedImpact: analysis?.estimatedImpact || ""
    });
    
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-[32px] max-h-[95vh] overflow-y-auto w-full max-w-4xl mx-auto relative shadow-2xl pb-8"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </div>

          {isSuccess ? (
            <div className="px-6 py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-[#00B873] rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">Issue Posted! 🎉</h2>
              <p className="text-slate-500 text-center max-w-sm">
                Your report is saved on your device & live on the map.
              </p>
              <div className="px-6 py-2 bg-[#FFF8E7] text-[#D97706] rounded-full font-bold border border-[#FDE68A] mt-4">
                🪙 +50 Civic Coins earned!
              </div>
              <p className="text-xs text-slate-400 mt-8 animate-pulse">Opening issue card...</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-2 flex items-center gap-3">
                <Camera size={24} className="text-[#FF4B4B]" />
                <h2 className="text-2xl font-black text-slate-800">Report an Issue</h2>
              </div>
              <p className="text-center text-sm text-slate-500 mb-4 px-6">
                Snap a photo. AI will categorize & describe it. You confirm before posting.
              </p>

              <div className="px-6 space-y-6">
                {/* Photo Section */}
                {!photo ? (
                  <div className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#FF512F] to-[#F09819] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                      <Camera size={28} className="text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">Snap the issue</h3>
                    <p className="text-sm text-slate-500 text-center mb-6">
                      Pothole, water leak, broken streetlight, garbage pile... get it in frame.
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#FF4B4B] hover:bg-red-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
                      >
                        <Camera size={18} />
                        Take Photo
                      </button>
                      <button 
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl active:scale-95 transition-transform shadow-sm"
                      >
                        <ImageIcon size={18} />
                        Gallery
                      </button>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={galleryInputRef}
                      onChange={handlePhotoSelect}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-full overflow-hidden h-[300px] rounded-2xl border border-slate-200">
                      <img src={photo} alt="Issue" className="object-cover w-full h-full" />
                      <button 
                        onClick={() => setPhoto(null)}
                        className="absolute p-2 bg-black/60 backdrop-blur-md rounded-full top-3 right-3 text-white hover:bg-black/80 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* AI Action */}
                    {!analysis && (
                      <div className="space-y-2">
                        <button
                          onClick={handleAnalyze}
                          disabled={analyzing}
                          className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white bg-[#B026FF] rounded-xl hover:bg-purple-600 active:scale-95 transition-transform disabled:opacity-50 shadow-lg shadow-purple-500/20"
                        >
                          {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                          {analyzing ? "ANALYZING..." : "ANALYZE WITH AI"}
                        </button>
                        <p className="text-center text-xs text-slate-500">
                          Gemini Vision will categorize the issue, suggest title & description, and route to the right authority.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!photo && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-[#FFF8E7] border border-[#FDE68A] rounded-xl text-sm">
                      <AlertTriangle className="text-[#D97706] shrink-0" size={18} />
                      <p className="text-[#92400E]">
                        <strong className="font-bold">Stay safe.</strong> Don't put yourself in danger to capture a photo.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                      <MapPin className="text-[#FF4B4B] shrink-0" size={18} />
                      <p className="text-slate-600">
                        Location: <strong className="font-bold text-slate-800">Indiranagar, Bengaluru, Karnataka 560038, India</strong>
                      </p>
                    </div>
                  </>
                )}

                {/* Form */}
                {(analysis || (photo && !analyzing)) && (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CATEGORY</label>
                        <select 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value as IssueCategory)}
                          className="w-full p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          {["POTHOLE", "GARBAGE", "ROAD_DAMAGE", "DRAINAGE", "WATER_LEAK", "STREETLIGHT", "TRAFFIC_SIGNAL", "OTHER"].map(c => (
                            <option key={c} value={c}>{c.replace("_", " ")}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEVERITY</label>
                        <select 
                          value={severity} 
                          onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                          className="w-full p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AUTHORITY DEPARTMENT</label>
                      <select 
                        value={dept} 
                        onChange={(e) => setDept(e.target.value as AuthorityDept)}
                        className="w-full p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {(Object.entries(DEPT_INFO) as [AuthorityDept, {name: string, icon: any}][]).map(([k, v]) => (
                          <option key={k} value={k}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">TITLE</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">DESCRIPTION</label>
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={3}
                        className="w-full p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                    </div>
                    
                    {analysis?.safetyTips && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-red-800">
                          <span className="font-bold">Safety Tip:</span> {analysis.safetyTips}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 mt-6 font-bold text-white bg-[#FF7A00] rounded-xl hover:bg-orange-600 active:scale-95 transition-transform shadow-lg shadow-orange-500/20"
                    >
                      POST REPORT & EARN +50 🪙
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
