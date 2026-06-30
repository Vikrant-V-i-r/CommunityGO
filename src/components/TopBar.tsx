import { Bell } from "lucide-react";
import { User, Alert } from "../lib/types";
import { getAlerts } from "../lib/local-db";

export function TopBar({ user, issuesCount, onOpenPanel }: { user: User, issuesCount: number, onOpenPanel: (panel: string) => void }) {
  const unreadCount = getAlerts(user.id).filter(a => !a.read).length;

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none pt-safe">
      <div className="flex items-start justify-between p-4">
        
        {/* Left: User Profile */}
        <div 
          onClick={() => onOpenPanel("PROFILE")}
          className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full pointer-events-auto cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-xl">{user.avatar}</span>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none text-slate-800">{user.handle}</span>
            <span className="text-[10px] text-[#00B873] font-bold">● Lvl {user.level}</span>
          </div>
        </div>

        {/* Center: City Status Pill */}
        <div className="hidden md:flex items-center gap-1 px-4 py-2 bg-white shadow-md rounded-full pointer-events-auto text-xs font-medium text-slate-600">
          <span className="text-slate-400">IN</span>
          <span className="font-bold text-slate-800">Bengaluru Demo City</span>
          <span className="text-slate-300">•</span>
          <span>{issuesCount} issues live</span>
          <span className="text-slate-300">•</span>
          <span>offline</span>
        </div>

        {/* Right: Coins and Alerts */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF8E7] text-[#D97706] shadow-md rounded-full font-bold text-sm border border-[#FDE68A]">
            <span className="opacity-80">🪙</span>
            {user.coins}
          </div>
          
          <button 
            onClick={() => onOpenPanel("ALERTS")}
            className="relative p-2 bg-white shadow-md rounded-full text-slate-600 hover:text-slate-900 active:scale-95 transition-transform"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF4B4B] rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Center Pill */}
      <div className="md:hidden flex justify-center -mt-2 pointer-events-auto pb-2">
        <div className="flex items-center gap-1 px-4 py-1.5 bg-white shadow-md rounded-full text-[10px] font-medium text-slate-600">
          <span className="text-slate-400">IN</span>
          <span className="font-bold text-slate-800">Bengaluru Demo City</span>
          <span className="text-slate-300">•</span>
          <span>{issuesCount} issues live</span>
          <span className="text-slate-300">•</span>
          <span>offline</span>
        </div>
      </div>
    </div>
  );
}
