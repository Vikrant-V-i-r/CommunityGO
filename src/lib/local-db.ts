import { useEffect } from "react";
import { User, Issue, TimelineEntry, Alert, AuthorityContact } from "./types";
import { calculateLevel } from "./utils";
import { AUTHORITY_CONTACTS } from "./constants";

const DB_KEY = "community-go-db-v4";

interface DBData {
  users: User[];
  issues: Issue[];
  timelines: TimelineEntry[];
  alerts: Alert[];
  authorities: AuthorityContact[];
}

const defaultData: DBData = {
  users: [],
  issues: [],
  timelines: [],
  alerts: [],
  authorities: [],
};

// --- Seed Data Setup ---
function seedDatabase(): DBData {
  const users: User[] = [
    { id: "u1", handle: "CivicRaptor", avatar: "🦖", coins: 550, xp: 1200, level: 2, badges: ["First Report"] },
    { id: "u2", handle: "PotholeHunter", avatar: "🕵️", coins: 120, xp: 200, level: 1, badges: [] },
    { id: "u3", handle: "BengaluruBrave", avatar: "🐯", coins: 800, xp: 2100, level: 3, badges: ["First Report", "Pothole Slayer"] },
    { id: "u4", handle: "JungleRani", avatar: "🦚", coins: 400, xp: 900, level: 2, badges: ["Neighborhood Watch"] },
    { id: "u5", handle: "StreetWatch", avatar: "🐘", coins: 1500, xp: 3500, level: 4, badges: ["Verified Reporter", "Civic Hero"] },
    { id: "u6", handle: "FixItFox", avatar: "🦊", coins: 50, xp: 50, level: 1, badges: [] }
  ];

  const now = Date.now();
  const day = 86400000;

  const issues: Issue[] = [
    {
      id: "i1",
      reporterId: "u1",
      category: "POTHOLE",
      severity: "CRITICAL",
      status: "FRESH",
      authorityDept: "BBMP",
      title: "Deep pothole on 100 Feet Road, Indiranagar",
      description: "Massive crater causing traffic jams.",
      lat: 12.9784,
      lng: 77.6408,
      photoUrl: "https://images.unsplash.com/photo-1597007069834-7b1c6fbf1c69?w=800&q=80",
      confidence: 95,
      safetyTips: "Drive slowly in the left lane.",
      estimatedImpact: "Affects 5000+ daily commuters",
      createdAt: now - day * 2,
      updatedAt: now - day,
      verifications: ["u2", "u3"]
    },
    {
      id: "i2",
      reporterId: "u2",
      category: "STREETLIGHT",
      severity: "HIGH",
      status: "WIP",
      authorityDept: "BESCOM",
      title: "Streetlight not working, Koramangala 5th block",
      description: "Pitch dark street, unsafe for pedestrians.",
      lat: 12.9345,
      lng: 77.6266,
      photoUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80",
      confidence: 88,
      safetyTips: "Use flashlight while walking.",
      estimatedImpact: "Safety risk for residents",
      createdAt: now - day * 3,
      updatedAt: now - day * 1,
      verifications: ["u4"]
    },
    {
      id: "i3",
      reporterId: "u3",
      category: "WATER_LEAK",
      severity: "HIGH",
      status: "WIP",
      authorityDept: "BWSSB",
      title: "Water leakage near HSR BDA Complex",
      description: "Thousands of liters wasting daily.",
      lat: 12.9121,
      lng: 77.6446,
      photoUrl: "https://images.unsplash.com/photo-1572865764715-9ba4b67c1d50?w=800&q=80",
      confidence: 90,
      safetyTips: "Road is slippery, two-wheelers be careful.",
      estimatedImpact: "Wasting drinking water",
      createdAt: now - day * 4,
      updatedAt: now - day * 2,
      verifications: ["u1", "u5"]
    },
    {
      id: "i4",
      reporterId: "u4",
      category: "GARBAGE",
      severity: "MEDIUM",
      status: "FRESH",
      authorityDept: "BBMP",
      title: "Garbage pileup near Bellandur lake gate",
      description: "Uncollected waste piling up over 3 days.",
      lat: 12.9279,
      lng: 77.6689,
      photoUrl: "https://images.unsplash.com/photo-1604917626779-9a9d2079c8e6?w=800&q=80",
      confidence: 85,
      safetyTips: "Avoid walking nearby due to hygiene.",
      estimatedImpact: "Health hazard",
      createdAt: now - day * 1,
      updatedAt: now - day * 1,
      verifications: []
    },
    {
      id: "i5",
      reporterId: "u5",
      category: "ROAD_DAMAGE",
      severity: "HIGH",
      status: "SOLVED",
      authorityDept: "BBMP",
      title: "Damaged road divider on ORR",
      description: "Divider blocks broken and scattered on fast lane.",
      lat: 12.9354,
      lng: 77.6953,
      photoUrl: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80",
      confidence: 92,
      safetyTips: "Keep left.",
      estimatedImpact: "Accident risk",
      createdAt: now - day * 10,
      updatedAt: now - day * 2,
      verifications: ["u1", "u2", "u3"]
    },
    {
      id: "i6",
      reporterId: "u6",
      category: "DRAINAGE",
      severity: "CRITICAL",
      status: "FRESH",
      authorityDept: "BBMP",
      title: "Open drain cover missing, Whitefield",
      description: "Very dangerous open manhole.",
      lat: 12.9698,
      lng: 77.7499,
      photoUrl: "https://images.unsplash.com/photo-1574359411659-15673a2c1ba0?w=800&q=80",
      confidence: 96,
      safetyTips: "Do not walk here at night.",
      estimatedImpact: "Fatal risk",
      createdAt: now - day * 0.5,
      updatedAt: now - day * 0.5,
      verifications: []
    },
    {
      id: "i7",
      reporterId: "u1",
      category: "POTHOLE",
      severity: "HIGH",
      status: "WIP",
      authorityDept: "BBMP",
      title: "Pothole cluster near EGL Park junction",
      description: "Multiple deep potholes.",
      lat: 12.9532,
      lng: 77.6402,
      photoUrl: "https://images.unsplash.com/photo-1597007069834-7b1c6fbf1c69?w=800&q=80",
      confidence: 89,
      safetyTips: "Navigate carefully.",
      estimatedImpact: "Slows down traffic",
      createdAt: now - day * 5,
      updatedAt: now - day * 1,
      verifications: ["u4"]
    },
    {
      id: "i8",
      reporterId: "u2",
      category: "OTHER",
      severity: "MEDIUM",
      status: "SOLVED",
      authorityDept: "BBMP",
      title: "Tree fallen on MG Road",
      description: "Blocking half the road.",
      lat: 12.9738,
      lng: 77.6119,
      photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
      confidence: 98,
      safetyTips: "Road blocked.",
      estimatedImpact: "Traffic jam",
      createdAt: now - day * 8,
      updatedAt: now - day * 6,
      verifications: ["u3", "u5"]
    },
    {
      id: "i9",
      reporterId: "u3",
      category: "TRAFFIC_SIGNAL",
      severity: "CRITICAL",
      status: "FRESH",
      authorityDept: "BTP",
      title: "Broken traffic signal at Silk Board",
      description: "All lights off, causing chaos.",
      lat: 12.9176,
      lng: 77.6238,
      photoUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      confidence: 94,
      safetyTips: "Follow manual police direction.",
      estimatedImpact: "Massive congestion",
      createdAt: now - day * 0.2,
      updatedAt: now - day * 0.2,
      verifications: ["u1", "u2", "u4", "u5", "u6"]
    },
    {
      id: "i10",
      reporterId: "u5",
      category: "DRAINAGE",
      severity: "CRITICAL",
      status: "FRESH",
      authorityDept: "BBMP",
      title: "Sewage overflow on CMH Road",
      description: "Terrible smell, unhygienic.",
      lat: 12.9788,
      lng: 77.6385,
      photoUrl: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
      confidence: 91,
      safetyTips: "Wear mask, avoid splashing.",
      estimatedImpact: "Health hazard",
      createdAt: now - day * 1,
      updatedAt: now - day * 1,
      verifications: ["u1"]
    }
  ];

  const timelines: TimelineEntry[] = [];
  issues.forEach(issue => {
    timelines.push({
      id: "t_" + Math.random(),
      issueId: issue.id,
      userId: issue.reporterId,
      status: "FRESH",
      comment: "Issue reported.",
      timestamp: issue.createdAt,
      photoUrl: issue.photoUrl
    });
    if (issue.status === "WIP" || issue.status === "SOLVED") {
      timelines.push({
        id: "t_" + Math.random(),
        issueId: issue.id,
        userId: "u3", // someone updated
        status: "WIP",
        comment: "Team has started work.",
        timestamp: issue.createdAt + day
      });
    }
    if (issue.status === "SOLVED") {
      timelines.push({
        id: "t_" + Math.random(),
        issueId: issue.id,
        userId: "u5", // someone updated
        status: "SOLVED",
        comment: "Issue resolved completely.",
        timestamp: issue.updatedAt
      });
    }
  });

  const alerts: Alert[] = users.map(u => ({
    id: "a_" + Math.random(),
    userId: u.id,
    type: "WELCOME",
    message: "Welcome to Community GO! You received +50 🪙.",
    timestamp: now,
    read: false
  }));

  return { users, issues, timelines, alerts, authorities: AUTHORITY_CONTACTS };
}

export function getDB(): DBData {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const seeded = seedDatabase();
    saveDB(seeded);
    return seeded;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultData;
  }
}

export function saveDB(data: DBData) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("db-update"));
}

export function useDBListener(callback: () => void) {
  useEffect(() => {
    window.addEventListener("db-update", callback);
    return () => window.removeEventListener("db-update", callback);
  }, [callback]);
}

// --- User Actions ---
export function createUser(handle: string, avatar: string): User {
  const db = getDB();
  const newUser: User = {
    id: "u_" + Date.now(),
    handle,
    avatar,
    coins: 50, // Welcome bonus
    xp: 0,
    level: 1,
    badges: []
  };
  db.users.push(newUser);
  db.alerts.push({
    id: "a_" + Date.now(),
    userId: newUser.id,
    type: "WELCOME",
    message: "Welcome to Community GO! You received +50 🪙.",
    timestamp: Date.now(),
    read: false
  });
  saveDB(db);
  return newUser;
}

export function getCurrentUser(): User | null {
  const userId = localStorage.getItem("current_user_id");
  if (!userId) return null;
  const db = getDB();
  return db.users.find((u) => u.id === userId) || null;
}

export function setCurrentUser(userId: string) {
  localStorage.setItem("current_user_id", userId);
}

export function clearCurrentUser() {
  localStorage.removeItem("current_user_id");
}

export function addXPAndCoins(userId: string, xpAmt: number, coinsAmt: number) {
  const db = getDB();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.xp += xpAmt;
    user.coins += coinsAmt;
    user.level = calculateLevel(user.xp);
    saveDB(db);
  }
}

// --- Issue Actions ---
export function createIssue(issueData: Omit<Issue, "id" | "createdAt" | "updatedAt" | "verifications">): Issue {
  const db = getDB();
  const newIssue: Issue = {
    ...issueData,
    id: "i_" + Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    verifications: []
  };
  db.issues.push(newIssue);
  
  const tlEntry: TimelineEntry = {
    id: "t_" + Date.now(),
    issueId: newIssue.id,
    userId: issueData.reporterId,
    status: "FRESH",
    comment: "Issue reported.",
    timestamp: Date.now(),
    photoUrl: issueData.photoUrl
  };
  db.timelines.push(tlEntry);
  
  // Create alerts for civic agents (just simulated for all other users)
  db.users.forEach(u => {
    if (u.id !== issueData.reporterId) {
      db.alerts.push({
        id: "a_" + Math.random(),
        userId: u.id,
        type: "NEW_ISSUE",
        message: `New ${issueData.severity} issue reported near you: ${issueData.title}`,
        issueId: newIssue.id,
        timestamp: Date.now(),
        read: false
      });
    }
  });

  saveDB(db);
  
  // Rewards: Report +50 coins, +100 XP
  addXPAndCoins(issueData.reporterId, 100, 50);
  
  return newIssue;
}

export function verifyIssue(issueId: string, userId: string) {
  const db = getDB();
  const issue = db.issues.find(i => i.id === issueId);
  if (issue && !issue.verifications.includes(userId)) {
    issue.verifications.push(userId);
    
    db.alerts.push({
      id: "a_" + Date.now(),
      userId: issue.reporterId,
      type: "VERIFICATION",
      message: `Someone verified your report: ${issue.title}`,
      issueId: issue.id,
      timestamp: Date.now(),
      read: false
    });

    saveDB(db);
    // Rewards: Verify +10 coins, +20 XP
    addXPAndCoins(userId, 20, 10);
  }
}

export function updateIssueStatus(issueId: string, userId: string, newStatus: Issue["status"], comment: string, photoUrl?: string) {
  const db = getDB();
  const issue = db.issues.find(i => i.id === issueId);
  if (issue) {
    issue.status = newStatus;
    issue.updatedAt = Date.now();
    
    const tlEntry: TimelineEntry = {
      id: "t_" + Date.now(),
      issueId: issue.id,
      userId: userId,
      status: newStatus,
      comment,
      timestamp: Date.now(),
      photoUrl
    };
    db.timelines.push(tlEntry);

    // Alert reporter and verifiers
    const usersToAlert = Array.from(new Set([issue.reporterId, ...issue.verifications]));
    usersToAlert.forEach(uid => {
      db.alerts.push({
        id: "a_" + Math.random(),
        userId: uid,
        type: "STATUS_CHANGE",
        message: `Issue "${issue.title}" status updated to ${newStatus}`,
        issueId: issue.id,
        timestamp: Date.now(),
        read: false
      });
    });

    saveDB(db);
    
    if (newStatus === "WIP") {
      addXPAndCoins(userId, 50, 10); // +10 coins, +50 XP
    } else if (newStatus === "SOLVED") {
      addXPAndCoins(userId, 500, 100); // +100 coins, +500 XP
    }
  }
}

export function getAlerts(userId: string): Alert[] {
  return getDB().alerts.filter(a => a.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
}

export function markAlertsRead(userId: string) {
  const db = getDB();
  db.alerts.forEach(a => {
    if (a.userId === userId) a.read = true;
  });
  saveDB(db);
}

export function getAuthorities(): AuthorityContact[] {
  return getDB().authorities || AUTHORITY_CONTACTS;
}
