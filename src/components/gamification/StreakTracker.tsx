"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Flame, Calendar, TrendingUp, Award } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalDays: number;
  weeklyActivity: boolean[];
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  totalDays: 0,
  weeklyActivity: [false, false, false, false, false, false, false],
};

export function StreakTracker() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    // Load streak data
    const saved = localStorage.getItem("streakData");
    const today = new Date().toDateString();

    if (saved) {
      const data: StreakData = JSON.parse(saved);

      // Check if streak is still valid
      if (data.lastPracticeDate) {
        const lastDate = new Date(data.lastPracticeDate);
        const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / 86400000);

        if (daysDiff > 1) {
          // Streak broken
          data.currentStreak = 0;
        } else if (daysDiff === 0) {
          setTodayCompleted(true);
        }
      }

      // Update weekly activity
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekActivity = data.weeklyActivity || DEFAULT_STREAK.weeklyActivity;

      setStreak({ ...data, weeklyActivity: weekActivity });
    }
  }, []);

  const recordPractice = () => {
    const today = new Date().toDateString();

    if (streak.lastPracticeDate === today) {
      return; // Already practiced today
    }

    const lastDate = streak.lastPracticeDate ? new Date(streak.lastPracticeDate) : null;
    const isConsecutive = lastDate &&
      Math.floor((new Date().getTime() - lastDate.getTime()) / 86400000) === 1;

    const newStreak: StreakData = {
      currentStreak: isConsecutive || !lastDate ? streak.currentStreak + 1 : 1,
      longestStreak: Math.max(
        streak.longestStreak,
        isConsecutive || !lastDate ? streak.currentStreak + 1 : 1
      ),
      lastPracticeDate: today,
      totalDays: streak.totalDays + 1,
      weeklyActivity: [...streak.weeklyActivity],
    };

    // Update weekly activity
    const dayOfWeek = new Date().getDay();
    newStreak.weeklyActivity[dayOfWeek] = true;

    setStreak(newStreak);
    setTodayCompleted(true);
    localStorage.setItem("streakData", JSON.stringify(newStreak));
  };

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return "Start your streak today!";
    if (streak.currentStreak < 3) return "You're getting started!";
    if (streak.currentStreak < 7) return "Building momentum!";
    if (streak.currentStreak < 30) return "You're on fire!";
    if (streak.currentStreak < 100) return "Incredible dedication!";
    return "You're a legend!";
  };

  const getFlameColor = () => {
    if (streak.currentStreak >= 100) return "text-purple-500";
    if (streak.currentStreak >= 30) return "text-orange-500";
    if (streak.currentStreak >= 7) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className={`h-5 w-5 ${getFlameColor()}`} />
          Practice Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main streak display */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className={`text-6xl font-bold ${streak.currentStreak > 0 ? "text-primary" : "text-muted-foreground"}`}>
              {streak.currentStreak}
            </div>
            {streak.currentStreak >= 7 && (
              <Flame className={`absolute -top-2 -right-6 h-8 w-8 ${getFlameColor()} animate-pulse`} />
            )}
          </div>
          <p className="text-lg text-muted-foreground mt-1">day streak</p>
          <p className="text-sm text-muted-foreground mt-2">{getStreakMessage()}</p>
        </div>

        {/* Weekly activity */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3 text-center">This Week</h4>
          <div className="flex justify-center gap-2">
            {dayNames.map((day, i) => {
              const isToday = new Date().getDay() === i;
              const isActive = streak.weeklyActivity[i];

              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{day}</div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isToday
                        ? "bg-muted border-2 border-primary"
                        : "bg-muted"
                    }`}
                  >
                    {isActive && <Flame className="h-4 w-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-bold">{streak.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-bold">{streak.totalDays}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-bold">
              {streak.weeklyActivity.filter(Boolean).length}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>

        {/* Practice button */}
        {!todayCompleted ? (
          <button
            onClick={recordPractice}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Record Today&apos;s Practice
          </button>
        ) : (
          <div className="text-center p-3 bg-green-500/10 rounded-lg text-green-600">
            <Flame className="h-5 w-5 mx-auto mb-1" />
            <p className="font-medium">Today&apos;s practice recorded!</p>
          </div>
        )}

        {/* Milestone indicators */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={streak.currentStreak >= 7 ? "text-primary" : ""}>7 days</span>
          <span className={streak.currentStreak >= 30 ? "text-primary" : ""}>30 days</span>
          <span className={streak.currentStreak >= 100 ? "text-primary" : ""}>100 days</span>
          <span className={streak.currentStreak >= 365 ? "text-primary" : ""}>365 days</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-purple-500 transition-all"
            style={{ width: `${Math.min((streak.currentStreak / 365) * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
