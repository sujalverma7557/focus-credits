export interface UserStats {
    totalFocusMinutes: number;
    totalCreditsEarned: number;
    totalCreditsSpent: number;
    currentStreak: number;
  }
  
  export interface CreditConfig {
    focusMinutes: number;
    rewardMinutes: number;
  }
  
  export interface FocusSession {
    startTime: number;
    durationMinutes: number;
    isRunning: boolean;
  }