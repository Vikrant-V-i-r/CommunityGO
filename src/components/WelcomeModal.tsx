import React, { useState } from "react";
import { createUser, setCurrentUser } from "../lib/local-db";
import { AVATARS } from "../lib/constants";
import { motion } from "motion/react";

export function WelcomeModal({ onComplete }: { onComplete: () => void }) {
  const [handle, setHandle] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim().length < 2) return;
    const user = createUser(handle, avatar);
    setCurrentUser(user.id);
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm p-6 bg-white border border-slate-100 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        
        {/* Badge */}
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
          +50 🪙 JOIN BONUS
        </div>

        <div className="flex justify-center mb-3 mt-2 text-5xl">🦸‍♀️</div>
        
        <h2 className="mb-1 text-2xl font-black text-center text-slate-800 tracking-tight">
          Community <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">GO</span>
        </h2>
        <p className="mb-6 text-sm font-bold text-center text-slate-500 uppercase tracking-widest">
          Everyone is a HERO!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Hero Name</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. PotholeSlayer"
              className="w-full px-4 py-3 font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-inner"
              maxLength={20}
              required
              minLength={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Avatar</label>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${
                    avatar === a ? "bg-amber-100 scale-105 shadow-md shadow-amber-500/20 border-2 border-amber-400" : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={handle.trim().length < 2}
            className="w-full py-4 mt-2 text-sm font-black tracking-wider text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
          >
            START YOUR JOURNEY
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
