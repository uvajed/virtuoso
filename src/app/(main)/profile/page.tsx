"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Progress } from "@/components/ui";
import { User, Mail, Calendar, Trophy, Flame, Clock, Target, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgress, type ProgressData } from "@/lib/progress";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const user = session?.user;
  const memberSince = user?.email ? new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }) : "Unknown";

  // Calculate level from XP (simple formula: level = floor(sqrt(xp/100)) + 1)
  const totalXP = progress ?
    (progress.exercisesCompleted * 10) +
    (progress.theoryCorrect * 5) +
    (progress.earTrainingCorrect * 5) +
    (progress.currentStreak * 20) : 0;
  const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpProgress = ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and view your progress
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || <User className="h-12 w-12" />}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user?.email || "No email"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member since {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Level Badge */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{level}</div>
                  <div className="text-xs text-white/80">LEVEL</div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Level {level} Progress</span>
              <span className="font-medium">{totalXP} XP</span>
            </div>
            <Progress value={xpProgress} />
            <p className="text-xs text-muted-foreground mt-1">
              {xpForNextLevel - totalXP} XP to Level {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.currentStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Trophy className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalXP}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.exercisesCompleted || 0}</p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.practiceMinutes || 0}m</p>
                <p className="text-xs text-muted-foreground">Practice Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Skills Breakdown
          </CardTitle>
          <CardDescription>Your progress in different areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Music Theory</span>
              <span className="text-muted-foreground">{progress?.theoryCorrect || 0} correct</span>
            </div>
            <Progress value={Math.min((progress?.theoryCorrect || 0) / 100 * 100, 100)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Ear Training</span>
              <span className="text-muted-foreground">{progress?.earTrainingCorrect || 0} correct</span>
            </div>
            <Progress value={Math.min((progress?.earTrainingCorrect || 0) / 100 * 100, 100)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Intervals</span>
              <span className="text-muted-foreground">{progress?.intervalsCorrect || 0} correct</span>
            </div>
            <Progress value={Math.min((progress?.intervalsCorrect || 0) / 100 * 100, 100)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Chords</span>
              <span className="text-muted-foreground">{progress?.chordsCorrect || 0} correct</span>
            </div>
            <Progress value={Math.min((progress?.chordsCorrect || 0) / 100 * 100, 100)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
