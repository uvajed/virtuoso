"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Trophy, Clock, Zap, Target, CheckCircle } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "ear" | "theory" | "practice" | "streak";
  target: number;
  xpReward: number;
  icon: typeof Trophy;
}

const DAILY_CHALLENGES: Challenge[] = [
  { id: "intervals", title: "Interval Master", description: "Identify 10 intervals correctly", type: "ear", target: 10, xpReward: 50, icon: Target },
  { id: "chords", title: "Chord Detective", description: "Identify 8 chords correctly", type: "ear", target: 8, xpReward: 40, icon: Target },
  { id: "scales", title: "Scale Runner", description: "Practice 5 different scales", type: "practice", target: 5, xpReward: 30, icon: Zap },
  { id: "rhythm", title: "Rhythm King", description: "Complete 5 rhythm exercises", type: "practice", target: 5, xpReward: 35, icon: Clock },
  { id: "sight", title: "Sight Reader", description: "Read 20 notes correctly", type: "theory", target: 20, xpReward: 45, icon: Target },
  { id: "perfect", title: "Perfectionist", description: "Get 100% on any exercise", type: "practice", target: 1, xpReward: 60, icon: Trophy },
  { id: "time", title: "Dedicated", description: "Practice for 15 minutes", type: "streak", target: 15, xpReward: 40, icon: Clock },
  { id: "variety", title: "Explorer", description: "Try 4 different exercise types", type: "practice", target: 4, xpReward: 35, icon: Zap },
];

// Deterministic daily challenge based on date
function getDailyChallenges(date: Date): Challenge[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const shuffled = [...DAILY_CHALLENGES].sort((a, b) => {
    const hashA = (dayOfYear * 31 + a.id.charCodeAt(0)) % 100;
    const hashB = (dayOfYear * 31 + b.id.charCodeAt(0)) % 100;
    return hashA - hashB;
  });
  return shuffled.slice(0, 3);
}

export function DailyChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    // Load today's challenges
    const today = new Date();
    setChallenges(getDailyChallenges(today));

    // Load progress from localStorage
    const savedProgress = localStorage.getItem("dailyProgress");
    const savedDate = localStorage.getItem("dailyProgressDate");
    const todayStr = today.toDateString();

    if (savedDate === todayStr && savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed.progress || {});
      setCompleted(new Set(parsed.completed || []));
    } else {
      // New day, reset progress
      localStorage.setItem("dailyProgressDate", todayStr);
      localStorage.setItem("dailyProgress", JSON.stringify({ progress: {}, completed: [] }));
    }

    // Update countdown
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate progress (in real app, this would come from actual exercise completion)
  const simulateProgress = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || completed.has(challengeId)) return;

    const newProgress = { ...progress };
    newProgress[challengeId] = Math.min((newProgress[challengeId] || 0) + 1, challenge.target);

    const newCompleted = new Set(completed);
    if (newProgress[challengeId] >= challenge.target) {
      newCompleted.add(challengeId);
    }

    setProgress(newProgress);
    setCompleted(newCompleted);

    // Save to localStorage
    localStorage.setItem("dailyProgress", JSON.stringify({
      progress: newProgress,
      completed: Array.from(newCompleted)
    }));
  };

  const totalXP = challenges
    .filter(c => completed.has(c.id))
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Daily Challenges
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Resets in {timeUntilReset}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress summary */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Completed</span>
            <p className="text-xl font-bold">{completed.size}/{challenges.length}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">XP Earned</span>
            <p className="text-xl font-bold text-primary">{totalXP} XP</p>
          </div>
        </div>

        {/* Challenges */}
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const current = progress[challenge.id] || 0;
            const isComplete = completed.has(challenge.id);
            const percent = Math.min((current / challenge.target) * 100, 100);
            const Icon = challenge.icon;

            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isComplete ? "bg-green-500/10 border-green-500/30" : "bg-card border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isComplete ? "bg-green-500/20" : "bg-muted"}`}>
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <Badge variant={isComplete ? "default" : "secondary"}>
                        +{challenge.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${isComplete ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {current}/{challenge.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Demo button - remove in production */}
                {!isComplete && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => simulateProgress(challenge.id)}
                  >
                    +1 Progress (Demo)
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {completed.size === challenges.length && (
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="font-bold text-green-600">All challenges completed!</p>
            <p className="text-sm text-muted-foreground">Come back tomorrow for new challenges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
