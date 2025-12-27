// Progress tracking service - stores in localStorage, syncs to achievements

export interface ProgressData {
  exercisesCompleted: number;
  perfectScores: number;
  intervalsCorrect: number;
  chordsCorrect: number;
  earTrainingCorrect: number;
  theoryCorrect: number;
  practiceMinutes: number;
  lastPracticeDate: string | null;
  currentStreak: number;
  longestStreak: number;
}

const PROGRESS_KEY = "virtuoso_progress";

const defaultProgress: ProgressData = {
  exercisesCompleted: 0,
  perfectScores: 0,
  intervalsCorrect: 0,
  chordsCorrect: 0,
  earTrainingCorrect: 0,
  theoryCorrect: 0,
  practiceMinutes: 0,
  lastPracticeDate: null,
  currentStreak: 0,
  longestStreak: 0,
};

export function getProgress(): ProgressData {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return defaultProgress;
}

export function saveProgress(progress: ProgressData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("virtuoso-progress-update", { detail: progress }));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function updateProgress(updates: Partial<ProgressData>): ProgressData {
  const current = getProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

// Track a completed exercise
export function trackExerciseComplete(type: "theory" | "ear-training" | "interval" | "chord", correct: boolean, isPerfect: boolean = false): void {
  const progress = getProgress();

  progress.exercisesCompleted += 1;

  if (isPerfect) {
    progress.perfectScores += 1;
  }

  if (correct) {
    switch (type) {
      case "theory":
        progress.theoryCorrect += 1;
        break;
      case "ear-training":
        progress.earTrainingCorrect += 1;
        break;
      case "interval":
        progress.intervalsCorrect += 1;
        progress.earTrainingCorrect += 1;
        break;
      case "chord":
        progress.chordsCorrect += 1;
        progress.earTrainingCorrect += 1;
        break;
    }
  }

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastPracticeDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (progress.lastPracticeDate === yesterdayStr) {
      // Continue streak
      progress.currentStreak += 1;
    } else if (progress.lastPracticeDate !== today) {
      // Reset streak (missed a day)
      progress.currentStreak = 1;
    }

    progress.lastPracticeDate = today;
    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
  }

  saveProgress(progress);
}

// Track practice time (in minutes)
export function trackPracticeTime(minutes: number): void {
  const progress = getProgress();
  progress.practiceMinutes += minutes;
  saveProgress(progress);
}

// Reset all progress (for testing)
export function resetProgress(): void {
  saveProgress(defaultProgress);
}
