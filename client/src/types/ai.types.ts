export interface AISummaryRequest {
  role: string;
  skills: string[];
  experience: string;
}

export interface AIBulletRequest {
  bullet: string;
  role: string;
}

export interface AISkillsRequest {
  role: string;
  existingSkills: string[];
}

export interface AISkillsSuggestion {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface AIImprovementSuggestion {
  category: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AIImproveResponse {
  overallScore: number;
  suggestions: AIImprovementSuggestion[];
}

export interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  formattingIssues: string[];
  weakBulletPoints: string[];
  missingSections: string[];
  improvements: string[];
  resumeId?: string;
}

export interface JobMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingSkills: string[];
  recommendedKeywords: string[];
  suggestions: string[];
}
