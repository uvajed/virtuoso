import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";
import { Achievements } from "@/components/gamification/Achievements";

export default async function ProgressPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your musical journey and achievements
        </p>
      </div>

      <ProgressDashboard />

      <Achievements />
    </div>
  );
}
