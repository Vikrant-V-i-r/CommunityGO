export type IssueCategory = "POTHOLE" | "GARBAGE" | "ROAD_DAMAGE" | "DRAINAGE" | "WATER_LEAK" | "STREETLIGHT" | "TRAFFIC_SIGNAL" | "OTHER";
export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IssueStatus = "FRESH" | "WIP" | "SOLVED";
export type AuthorityDept = "BBMP" | "BWSSB" | "BESCOM" | "BTP" | "OTHER" | "FIRE" | "POLICE";

export interface User {
  id: string;
  handle: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  badges: string[];
}

export interface Issue {
  id: string;
  reporterId: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  authorityDept: AuthorityDept;
  title: string;
  description: string;
  lat: number;
  lng: number;
  photoUrl: string;
  confidence: number;
  safetyTips: string;
  estimatedImpact: string;
  createdAt: number;
  updatedAt: number;
  verifications: string[]; // array of userIds
}

export interface TimelineEntry {
  id: string;
  issueId: string;
  userId: string;
  status: IssueStatus;
  comment: string;
  timestamp: number;
  photoUrl?: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: "NEW_ISSUE" | "STATUS_CHANGE" | "VERIFICATION" | "BADGE_EARNED" | "WELCOME";
  message: string;
  issueId?: string;
  timestamp: number;
  read: boolean;
}

export interface AIAnalysisResponse {
  category: IssueCategory;
  severity: IssueSeverity;
  authorityDept: AuthorityDept;
  title: string;
  description: string;
  confidence: number;
  safetyTips: string;
  estimatedImpact: string;
}

export interface AuthorityContact {
  id: string;
  dept: AuthorityDept;
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
}
