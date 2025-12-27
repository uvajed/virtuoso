import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Progress,
  Badge,
} from "@/components/ui";
import {
  BookOpen,
  Headphones,
  Piano,
  Guitar,
  Mic2,
  Wrench,
  Flame,
  Trophy,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { DashboardGamification } from "@/components/dashboard/DashboardGamification";

const quickActions = [
  {
    title: "Music Theory",
    description: "Learn notes, scales, and chords",
    href: "/theory",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    title: "Ear Training",
    description: "Train your musical ear",
    href: "/ear-training",
    icon: Headphones,
    color: "bg-purple-500",
  },
  {
    title: "Piano",
    description: "Virtual piano & exercises",
    href: "/instruments/piano",
    icon: Piano,
    color: "bg-emerald-500",
  },
  {
    title: "Guitar",
    description: "Chords, tabs & strumming",
    href: "/instruments/guitar",
    icon: Guitar,
    color: "bg-orange-500",
  },
  {
    title: "Voice",
    description: "Pitch training & exercises",
    href: "/instruments/voice",
    icon: Mic2,
    color: "bg-pink-500",
  },
  {
    title: "Practice Tools",
    description: "Metronome, tuner & more",
    href: "/tools",
    icon: Wrench,
    color: "bg-slate-500",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userName = session.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to continue your musical journey?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
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
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0m</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Weekly Goal</CardTitle>
              <CardDescription>
                Practice 2 hours this week to stay on track
              </CardDescription>
            </div>
            <Badge variant="default">0 / 120 min</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={0} max={120} size="lg" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Start Practicing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${action.color} text-white`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gamification Section */}
      <DashboardGamification />

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>
            Your practice sessions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-1">
              Start practicing to see your progress!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
