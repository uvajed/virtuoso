"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress, Badge } from "@/components/ui";
import { TrendingUp, Calendar, Target, Music, Headphones, Piano, Clock, Award } from "lucide-react";

interface PracticeSession {
  date: string;
  minutes: number;
  xp: number;
  category: "theory" | "ear-training" | "instrument";
}

interface SkillProgress {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  icon: typeof Music;
  color: string;
}

// Generate mock data based on localStorage or defaults
const generateMockData = (): { sessions: PracticeSession[]; skills: SkillProgress[] } => {
  const today = new Date();
  const sessions: PracticeSession[] = [];

  // Generate last 7 days of practice data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Random practice time (0-60 mins per day, some days might be 0)
    const practiced = Math.random() > 0.3;
    if (practiced) {
      const categories: ("theory" | "ear-training" | "instrument")[] = ["theory", "ear-training", "instrument"];
      const randomCategories = categories.filter(() => Math.random() > 0.5);

      randomCategories.forEach(category => {
        sessions.push({
          date: dateStr,
          minutes: Math.floor(Math.random() * 30) + 5,
          xp: Math.floor(Math.random() * 50) + 10,
          category,
        });
      });
    }
  }

  const skills: SkillProgress[] = [
    { name: "Music Theory", level: 3, xp: 450, xpToNext: 500, icon: Music, color: "bg-blue-500" },
    { name: "Ear Training", level: 2, xp: 280, xpToNext: 400, icon: Headphones, color: "bg-purple-500" },
    { name: "Instruments", level: 2, xp: 180, xpToNext: 400, icon: Piano, color: "bg-emerald-500" },
  ];

  return { sessions, skills };
};

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
  const [data, setData] = useState<{ sessions: PracticeSession[]; skills: SkillProgress[] } | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  useEffect(() => {
    // In a real app, this would fetch from the API
    setData(generateMockData());
  }, []);

  if (!data) {
    return <div className="animate-pulse h-96 bg-card rounded-lg" />;
  }

  const { sessions, skills } = data;

  // Calculate weekly stats
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = weekDays[date.getDay()];

    const dayMinutes = sessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.minutes, 0);

    chartData.push({ label: dayName, value: dayMinutes });
  }

  const maxMinutes = Math.max(...chartData.map(d => d.value), 60);
  const totalMinutes = chartData.reduce((sum, d) => sum + d.value, 0);
  const totalXP = sessions.reduce((sum, s) => sum + s.xp, 0);
  const activeDays = new Set(sessions.map(s => s.date)).size;
  const avgMinutesPerDay = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

  // Category breakdown
  const categoryMinutes = {
    theory: sessions.filter(s => s.category === "theory").reduce((sum, s) => sum + s.minutes, 0),
    "ear-training": sessions.filter(s => s.category === "ear-training").reduce((sum, s) => sum + s.minutes, 0),
    instrument: sessions.filter(s => s.category === "instrument").reduce((sum, s) => sum + s.minutes, 0),
  };

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
                <p className="text-2xl font-bold">{activeDays}</p>
                <p className="text-xs text-muted-foreground">Active Days</p>
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
                <p className="text-2xl font-bold">{avgMinutesPerDay}m</p>
                <p className="text-xs text-muted-foreground">Avg/Day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Practice Time</CardTitle>
          <CardDescription>Minutes practiced each day this week</CardDescription>
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
                      <Progress value={(skill.xp / skill.xpToNext) * 100} className="flex-1" />
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

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Practice Breakdown</CardTitle>
            <CardDescription>Time spent in each category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              {totalMinutes > 0 ? (
                <>
                  <CircularProgress
                    value={totalMinutes}
                    max={120}
                    size={100}
                    strokeWidth={10}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Theory: {categoryMinutes.theory}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-sm">Ear Training: {categoryMinutes["ear-training"]}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm">Instruments: {categoryMinutes.instrument}m</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No practice data yet</p>
                  <p className="text-sm mt-1">Start practicing to see your breakdown!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Weekly Goal</CardTitle>
              <CardDescription>Practice 2 hours this week to stay on track</CardDescription>
            </div>
            <Badge variant={totalMinutes >= 120 ? "default" : "secondary"}>
              {totalMinutes} / 120 min
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(totalMinutes / 120) * 100} size="lg" />
          {totalMinutes >= 120 && (
            <p className="text-sm text-primary mt-2 font-medium">
              Goal achieved! Great work this week!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
