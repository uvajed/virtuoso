"use client";

import { DailyChallenge, StreakTracker } from "@/components/gamification";

export function DashboardGamification() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StreakTracker />
      <DailyChallenge />
    </div>
  );
}
