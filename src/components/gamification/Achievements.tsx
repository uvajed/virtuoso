"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Trophy, Star, Flame, Music, Target, Headphones, Piano, Clock, Award, Zap } from "lucide-react";

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
  const [stats, setStats] = useState({
    exercisesCompleted: 0,
    perfectScores: 0,
    intervalsCorrect: 0,
    chordsCorrect: 0,
    currentStreak: 0,
    totalMinutes: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("achievements");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUnlockedIds(new Set(parsed.unlocked || []));
      setStats(parsed.stats || stats);
    }
  }, []);

  // Check and unlock achievements
  useEffect(() => {
    const newUnlocked = new Set(unlockedIds);
    let changed = false;

    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedIds.has(achievement.id)) return;

      let progress = 0;
      switch (achievement.id) {
        case "first_note":
        case "warm_up":
        case "dedicated":
        case "master":
        case "legend":
          progress = stats.exercisesCompleted;
          break;
        case "perfect_10":
          progress = stats.perfectScores;
          break;
        case "interval_pro":
        case "ear_master":
          progress = stats.intervalsCorrect;
          break;
        case "chord_wizard":
          progress = stats.chordsCorrect;
          break;
        case "streak_3":
        case "streak_7":
        case "streak_30":
        case "streak_100":
        case "streak_365":
          progress = stats.currentStreak;
          break;
        case "hour_1":
        case "hour_10":
        case "hour_100":
          progress = stats.totalMinutes;
          break;
      }

      if (progress >= achievement.requirement) {
        newUnlocked.add(achievement.id);
        changed = true;
      }
    });

    if (changed) {
      setUnlockedIds(newUnlocked);
      localStorage.setItem("achievements", JSON.stringify({
        unlocked: Array.from(newUnlocked),
        stats
      }));
    }
  }, [stats, unlockedIds]);

  const filteredAchievements = selectedCategory === "all"
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const totalXP = ACHIEVEMENTS
    .filter(a => unlockedIds.has(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);

  const getProgress = (achievement: Achievement): number => {
    switch (achievement.category) {
      case "practice":
        return stats.exercisesCompleted;
      case "skill":
        if (achievement.id.includes("interval")) return stats.intervalsCorrect;
        if (achievement.id.includes("chord")) return stats.chordsCorrect;
        return stats.perfectScores;
      case "streak":
        return stats.currentStreak;
      case "milestone":
        return stats.totalMinutes;
      default:
        return 0;
    }
  };

  // Demo: simulate progress
  const addProgress = () => {
    setStats(prev => ({
      ...prev,
      exercisesCompleted: prev.exercisesCompleted + 1,
      intervalsCorrect: prev.intervalsCorrect + 1,
      currentStreak: prev.currentStreak + 1,
      totalMinutes: prev.totalMinutes + 5,
    }));
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
            const progress = getProgress(achievement);
            const percent = Math.min((progress / achievement.requirement) * 100, 100);
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
                          {progress}/{achievement.requirement}
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

        {/* Demo button */}
        <button
          onClick={addProgress}
          className="w-full p-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          Simulate Progress (Demo)
        </button>
      </CardContent>
    </Card>
  );
}
