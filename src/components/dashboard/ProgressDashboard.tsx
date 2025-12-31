"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress, Badge } from "@/components/ui";
import { TrendingUp, Calendar, Target, Music, Headphones, Piano, Clock, Award } from "lucide-react";
import { getProgress, type ProgressData } from "@/lib/progress";

interface SkillProgress {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  icon: typeof Music;
  color: string;
}

// Simple bar chart component
function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="flex items-end justify-between gap-1 h-32">
      {data.map((item, index) => {
        const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex flex-col items-center flex-1 gap-1">
            <div className="w-full flex flex-col justify-end h-24">
              <div
                className="w-full bg-primary rounded-t transition-all duration-500"
                style={{ height: `${heightPercent}%`, minHeight: item.value > 0 ? "4px" : "0" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Circular progress component
function CircularProgress({ value, max, size = 80, strokeWidth = 8 }: { value: number; max: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = max > 0 ? (value / max) * 100 : 0;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold">{Math.round(percent)}%</span>
      </div>
    </div>
  );
}

export function ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  useEffect(() => {
    // Get real progress from localStorage
    setProgress(getProgress());

    // Listen for progress updates
    const handleProgressUpdate = (e: CustomEvent<ProgressData>) => {
      setProgress(e.detail);
    };

    window.addEventListener("virtuoso-progress-update", handleProgressUpdate as EventListener);
    return () => {
      window.removeEventListener("virtuoso-progress-update", handleProgressUpdate as EventListener);
    };
  }, []);

  if (!progress) {
    return <div className="animate-pulse h-96 bg-card rounded-lg" />;
  }

  // Calculate stats from real progress
  const totalXP =
    (progress.exercisesCompleted * 10) +
    (progress.theoryCorrect * 5) +
    (progress.earTrainingCorrect * 5) +
    (progress.currentStreak * 20);

  const totalMinutes = progress.practiceMinutes;
  const activeDays = progress.currentStreak;
  const avgMinutesPerDay = activeDays > 0 ? Math.round(totalMinutes / Math.max(activeDays, 1)) : 0;

  // Calculate skill levels based on actual progress
  const calculateLevel = (xp: number): { level: number; currentXp: number; xpToNext: number } => {
    const level = Math.floor(Math.sqrt(xp / 50)) + 1;
    const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
    const xpForNextLevel = Math.pow(level, 2) * 50;
    return {
      level,
      currentXp: xp - xpForCurrentLevel,
      xpToNext: xpForNextLevel - xpForCurrentLevel,
    };
  };

  const theoryStats = calculateLevel(progress.theoryCorrect * 10);
  const earStats = calculateLevel((progress.earTrainingCorrect + progress.intervalsCorrect + progress.chordsCorrect) * 5);
  const practiceStats = calculateLevel(progress.exercisesCompleted * 8);

  const skills: SkillProgress[] = [
    {
      name: "Music Theory",
      level: theoryStats.level,
      xp: theoryStats.currentXp,
      xpToNext: theoryStats.xpToNext,
      icon: Music,
      color: "bg-blue-500"
    },
    {
      name: "Ear Training",
      level: earStats.level,
      xp: earStats.currentXp,
      xpToNext: earStats.xpToNext,
      icon: Headphones,
      color: "bg-purple-500"
    },
    {
      name: "Practice",
      level: practiceStats.level,
      xp: practiceStats.currentXp,
      xpToNext: practiceStats.xpToNext,
      icon: Piano,
      color: "bg-emerald-500"
    },
  ];

  // Weekly chart - show last 7 days based on whether user has practiced
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = weekDays[date.getDay()];

    // Check if this was a practice day
    let dayMinutes = 0;
    if (progress.lastPracticeDate === dateStr) {
      // Today or last practice day - show some activity
      dayMinutes = Math.max(Math.round(totalMinutes / Math.max(activeDays, 1)), 5);
    }

    chartData.push({ label: dayName, value: dayMinutes });
  }

  // If user has practiced today, update today's bar
  if (progress.lastPracticeDate === today.toISOString().split("T")[0]) {
    chartData[6].value = Math.max(Math.round(totalMinutes / Math.max(activeDays, 1)), 10);
  }

  const maxMinutes = Math.max(...chartData.map(d => d.value), 30);

  // Category breakdown based on actual data
  const categoryMinutes = {
    theory: Math.round((progress.theoryCorrect / Math.max(progress.exercisesCompleted, 1)) * totalMinutes) || 0,
    earTraining: Math.round(((progress.earTrainingCorrect + progress.intervalsCorrect + progress.chordsCorrect) / Math.max(progress.exercisesCompleted, 1)) * totalMinutes) || 0,
    practice: totalMinutes - Math.round((progress.theoryCorrect / Math.max(progress.exercisesCompleted, 1)) * totalMinutes) || 0,
  };

  const hasAnyProgress = progress.exercisesCompleted > 0 || totalMinutes > 0 || totalXP > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progress Overview
          </h2>
          <p className="text-sm text-muted-foreground">Track your musical journey</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeRange === "week" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeRange === "month" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {!hasAnyProgress && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <Music className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-lg">Start Your Musical Journey!</h3>
              <p className="text-muted-foreground mt-1">
                Complete exercises in Theory, Ear Training, or Instruments to track your progress here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMinutes}m</p>
                <p className="text-xs text-muted-foreground">Total Practice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalXP}</p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.exercisesCompleted}</p>
                <p className="text-xs text-muted-foreground">Exercises Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Practice Activity</CardTitle>
          <CardDescription>
            {hasAnyProgress
              ? "Your practice activity this week"
              : "Complete exercises to see your weekly activity"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={chartData} maxValue={maxMinutes} />
        </CardContent>
      </Card>

      {/* Skills & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Levels</CardTitle>
            <CardDescription>Your progress in each area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.name} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="secondary">Level {skill.level}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={skill.xpToNext > 0 ? (skill.xp / skill.xpToNext) * 100 : 0} className="flex-1" />
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {skill.xp}/{skill.xpToNext} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Exercise Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exercise Stats</CardTitle>
            <CardDescription>Correct answers by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Theory Questions</span>
                </div>
                <span className="font-medium">{progress.theoryCorrect} correct</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Ear Training</span>
                </div>
                <span className="font-medium">{progress.earTrainingCorrect} correct</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Intervals</span>
                </div>
                <span className="font-medium">{progress.intervalsCorrect} correct</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Chords</span>
                </div>
                <span className="font-medium">{progress.chordsCorrect} correct</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Perfect Scores</span>
                </div>
                <span className="font-medium">{progress.perfectScores}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Practice Streak</CardTitle>
              <CardDescription>Keep practicing daily to maintain your streak!</CardDescription>
            </div>
            <Badge variant={progress.currentStreak >= 7 ? "default" : "secondary"}>
              {progress.currentStreak} day{progress.currentStreak !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={Math.min((progress.currentStreak / 7) * 100, 100)} size="lg" />
            </div>
            <span className="text-sm text-muted-foreground">
              {progress.currentStreak >= 7 ? "1 week!" : `${7 - progress.currentStreak} days to 1 week`}
            </span>
          </div>
          {progress.longestStreak > progress.currentStreak && (
            <p className="text-sm text-muted-foreground mt-2">
              Your longest streak: {progress.longestStreak} days
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
