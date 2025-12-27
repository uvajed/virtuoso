import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Achievements } from "@/components/gamification/Achievements";
import { StreakTracker } from "@/components/gamification/StreakTracker";
import { DailyChallenge } from "@/components/gamification/DailyChallenge";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Track your milestones and daily challenges
        </p>
      </div>

      {/* Streak and Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakTracker />
        <DailyChallenge />
      </div>

      {/* All Achievements */}
      <Achievements />
    </div>
  );
}
