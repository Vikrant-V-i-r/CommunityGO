import { useState, useEffect } from "react";
import { getCurrentUser, getDB, useDBListener } from "./lib/local-db";
import { User, Issue } from "./lib/types";
import { MapView } from "./components/MapView";
import { WelcomeModal } from "./components/WelcomeModal";
import { ReportSheet } from "./components/ReportSheet";
import { IssueDetailSheet } from "./components/IssueDetailSheet";
import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";
import { SplashScreen } from "./components/SplashScreen";
import { ProfilePanel } from "./components/ProfilePanel";
import { StatsPanel } from "./components/StatsPanel";
import { RanksPanel } from "./components/RanksPanel";
import { AlertsPanel } from "./components/AlertsPanel";
import { AnimatePresence, motion } from "motion/react";
import { ScanLine } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Check if we need to show splash
    const timer = setTimeout(() => {
      setLoading(false);
      refreshData();
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setCurrentUser(getCurrentUser());
    setIssues(getDB().issues);
  };

  const handleScanNearby = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  useDBListener(() => {
    refreshData();
  });

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 text-slate-100 font-sans">
      {!currentUser && <WelcomeModal onComplete={refreshData} />}
      
      {currentUser && (
        <>
          <TopBar 
            user={currentUser} 
            issuesCount={issues.length} 
            onOpenPanel={setActivePanel} 
          />
          
          <div className="absolute inset-0">
            <MapView 
              issues={issues} 
              onSelectIssue={(id) => setSelectedIssueId(id)} 
            />
          </div>

          <BottomNav 
            onOpenPanel={setActivePanel} 
            onOpenReport={() => setShowReportSheet(true)}
            onScanNearby={handleScanNearby}
          />

          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none"
              >
                <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-slate-800">
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-indigo-500/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-8 h-8 bg-indigo-500 rounded-full shadow-lg z-10 flex items-center justify-center text-white">
                      <ScanLine size={16} />
                    </div>
                  </div>
                  <div className="font-bold">Scanning Area...</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showReportSheet && (
            <ReportSheet 
              user={currentUser} 
              onClose={() => setShowReportSheet(false)} 
            />
          )}

          {selectedIssueId && (
            <IssueDetailSheet 
              issueId={selectedIssueId} 
              user={currentUser}
              onClose={() => setSelectedIssueId(null)} 
            />
          )}

          <AnimatePresence>
            {activePanel === "STATS" && (
              <StatsPanel issues={issues} onClose={() => setActivePanel(null)} />
            )}
            {activePanel === "RANKS" && (
              <RanksPanel currentUser={currentUser} onClose={() => setActivePanel(null)} />
            )}
            {activePanel === "ALERTS" && (
              <AlertsPanel user={currentUser} onClose={() => setActivePanel(null)} />
            )}
            {activePanel === "PROFILE" && (
              <ProfilePanel user={currentUser} onClose={() => setActivePanel(null)} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
