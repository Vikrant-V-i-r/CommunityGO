import React, { useState, useEffect } from "react";
import { X, Bell, Info } from "lucide-react";
import { User, Alert } from "../lib/types";
import { getAlerts, markAlertsRead } from "../lib/local-db";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

export function AlertsPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(getAlerts(user.id));
    
    // Mark as read after 2 seconds of opening
    const timer = setTimeout(() => {
      markAlertsRead(user.id);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [user.id]);

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
              <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded flex items-center justify-center">
                <Bell size={14} />
              </div>
              Notifications
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-10 space-y-3">
            {alerts.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <Bell size={40} className="mb-3 opacity-20" />
                <p className="text-sm">You have no new notifications.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-2xl border flex gap-3 shadow-sm ${
                    alert.read ? "bg-white border-slate-100" : "bg-pink-50 border-pink-100"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${alert.read ? "text-slate-400" : "text-pink-500"}`}>
                    <Info size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${alert.read ? "text-slate-600" : "text-slate-800 font-bold"}`}>
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDistanceToNow(alert.timestamp)} ago</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
