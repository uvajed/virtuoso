"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Trophy, Star, Flame, Music, Target, Headphones, Piano, Clock, Award, Zap } from "lucide-react";
import { getProgress, type ProgressData } from "@/lib/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  category: "practice" | "skill" | "streak" | "milestone";
  requirement: number;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const ACHIEVEMENTS: Achievement[] = [
  // Practice achievements
  { id: "first_note", title: "First Note", description: "Complete your first exercise", icon: Music, category: "practice", requirement: 1, xpReward: 10, rarity: "common" },
  { id: "warm_up", title: "Warmed Up", description: "Complete 10 exercises", icon: Zap, category: "practice", requirement: 10, xpReward: 25, rarity: "common" },
  { id: "dedicated", title: "Dedicated", description: "Complete 50 exercises", icon: Target, category: "practice", requirement: 50, xpReward: 50, rarity: "rare" },
  { id: "master", title: "Practice Master", description: "Complete 200 exercises", icon: Award, category: "practice", requirement: 200, xpReward: 150, rarity: "epic" },
  { id: "legend", title: "Living Legend", description: "Complete 1000 exercises", icon: Trophy, category: "practice", requirement: 1000, xpReward: 500, rarity: "legendary" },

  // Skill achievements
  { id: "perfect_10", title: "Perfect 10", description: "Get 100% on 10 exercises", icon: Star, category: "skill", requirement: 10, xpReward: 40, rarity: "common" },
  { id: "interval_pro", title: "Interval Pro", description: "Identify 100 intervals correctly", icon: Headphones, category: "skill", requirement: 100, xpReward: 75, rarity: "rare" },
  { id: "chord_wizard", title: "Chord Wizard", description: "Identify 100 chords correctly", icon: Piano, category: "skill", requirement: 100, xpReward: 75, rarity: "rare" },
  { id: "ear_master", title: "Golden Ear", description: "500 correct ear training answers", icon: Headphones, category: "skill", requirement: 500, xpReward: 200, rarity: "epic" },

  // Streak achievements
  { id: "streak_3", title: "Getting Started", description: "3 day practice streak", icon: Flame, category: "streak", requirement: 3, xpReward: 20, rarity: "common" },
  { id: "streak_7", title: "One Week Wonder", description: "7 day practice streak", icon: Flame, category: "streak", requirement: 7, xpReward: 50, rarity: "common" },
  { id: "streak_30", title: "Monthly Master", description: "30 day practice streak", icon: Flame, category: "streak", requirement: 30, xpReward: 150, rarity: "rare" },
  { id: "streak_100", title: "Unstoppable", description: "100 day practice streak", icon: Flame, category: "streak", requirement: 100, xpReward: 500, rarity: "epic" },
  { id: "streak_365", title: "Year of Music", description: "365 day practice streak", icon: Trophy, category: "streak", requirement: 365, xpReward: 2000, rarity: "legendary" },

  // Time milestones
  { id: "hour_1", title: "First Hour", description: "Practice for 1 hour total", icon: Clock, category: "milestone", requirement: 60, xpReward: 30, rarity: "common" },
  { id: "hour_10", title: "Getting Serious", description: "Practice for 10 hours total", icon: Clock, category: "milestone", requirement: 600, xpReward: 100, rarity: "rare" },
  { id: "hour_100", title: "Century Club", description: "Practice for 100 hours total", icon: Clock, category: "milestone", requirement: 6000, xpReward: 500, rarity: "epic" },
];

const RARITY_COLORS = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
};

const RARITY_BORDERS = {
  common: "border-gray-500/30",
  rare: "border-blue-500/30",
  epic: "border-purple-500/30",
  legendary: "border-yellow-500/30 shadow-yellow-500/20 shadow-lg",
};

export function Achievements() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Load progress and listen for updates
  const loadProgress = useCallback(() => {
    const data = getProgress();
    setProgress(data);
  }, []);

  useEffect(() => {
    loadProgress();

    // Load unlocked achievements
    const saved = localStorage.getItem("virtuoso_unlocked_achievements");
    if (saved) {
      setUnlockedIds(new Set(JSON.parse(saved)));
    }

    // Listen for progress updates from exercises
    const handleProgressUpdate = () => loadProgress();
    window.addEventListener("virtuoso-progress-update", handleProgressUpdate);

    return () => {
      window.removeEventListener("virtuoso-progress-update", handleProgressUpdate);
    };
  }, [loadProgress]);

  // Check and unlock achievements when progress changes
  useEffect(() => {
    if (!progress) return;

    const newUnlocked = new Set(unlockedIds);
    let changed = false;

    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedIds.has(achievement.id)) return;

      let currentProgress = 0;
      switch (achievement.id) {
        case "first_note":
        case "warm_up":
        case "dedicated":
        case "master":
        case "legend":
          currentProgress = progress.exercisesCompleted;
          break;
        case "perfect_10":
          currentProgress = progress.perfectScores;
          break;
        case "interval_pro":
          currentProgress = progress.intervalsCorrect;
          break;
        case "ear_master":
          currentProgress = progress.earTrainingCorrect;
          break;
        case "chord_wizard":
          currentProgress = progress.chordsCorrect;
          break;
        case "streak_3":
        case "streak_7":
        case "streak_30":
        case "streak_100":
        case "streak_365":
          currentProgress = progress.currentStreak;
          break;
        case "hour_1":
        case "hour_10":
        case "hour_100":
          currentProgress = progress.practiceMinutes;
          break;
      }

      if (currentProgress >= achievement.requirement) {
        newUnlocked.add(achievement.id);
        changed = true;
      }
    });

    if (changed) {
      setUnlockedIds(newUnlocked);
      localStorage.setItem("virtuoso_unlocked_achievements", JSON.stringify(Array.from(newUnlocked)));
    }
  }, [progress, unlockedIds]);

  const filteredAchievements = selectedCategory === "all"
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const totalXP = ACHIEVEMENTS
    .filter(a => unlockedIds.has(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);

  const getAchievementProgress = (achievement: Achievement): number => {
    if (!progress) return 0;
    switch (achievement.category) {
      case "practice":
        return progress.exercisesCompleted;
      case "skill":
        if (achievement.id.includes("interval")) return progress.intervalsCorrect;
        if (achievement.id.includes("chord")) return progress.chordsCorrect;
        if (achievement.id.includes("ear")) return progress.earTrainingCorrect;
        return progress.perfectScores;
      case "streak":
        return progress.currentStreak;
      case "milestone":
        return progress.practiceMinutes;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <div className="text-sm">
            <span className="text-muted-foreground">Unlocked: </span>
            <span className="font-bold">{unlockedIds.size}/{ACHIEVEMENTS.length}</span>
            <span className="text-muted-foreground ml-3">Total XP: </span>
            <span className="font-bold text-primary">{totalXP}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "practice", "skill", "streak", "milestone"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const achievementProgress = getAchievementProgress(achievement);
            const percent = Math.min((achievementProgress / achievement.requirement) * 100, 100);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? `${RARITY_BORDERS[achievement.rarity]} bg-gradient-to-br from-card to-muted/50`
                    : "border-border bg-card opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isUnlocked ? RARITY_COLORS[achievement.rarity] : "bg-muted"}`}>
                    <Icon className={`h-5 w-5 ${isUnlocked ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <Badge
                        variant="secondary"
                        className={isUnlocked ? RARITY_COLORS[achievement.rarity] + " text-white" : ""}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    {!isUnlocked && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {achievementProgress}/{achievement.requirement}
                        </span>
                      </div>
                    )}
                    {isUnlocked && (
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Star className="h-4 w-4" />
                        +{achievement.xpReward} XP earned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        {progress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold">{progress.exercisesCompleted}</p>
              <p className="text-xs text-muted-foreground">Exercises</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{progress.theoryCorrect + progress.earTrainingCorrect}</p>
              <p className="text-xs text-muted-foreground">Correct Answers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{progress.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{progress.practiceMinutes}m</p>
              <p className="text-xs text-muted-foreground">Practice Time</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
