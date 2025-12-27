import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui";
import {
  Music,
  BookOpen,
  Headphones,
  Piano,
  Guitar,
  Mic2,
  Trophy,
  Flame,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Music Theory",
    description:
      "Learn notes, scales, chords, and keys with interactive lessons and quizzes.",
  },
  {
    icon: Headphones,
    title: "Ear Training",
    description:
      "Train your ear with interval recognition, chord identification, and melody dictation.",
  },
  {
    icon: Piano,
    title: "Piano Practice",
    description:
      "Interactive virtual piano with sight-reading exercises and finger exercises.",
  },
  {
    icon: Guitar,
    title: "Guitar Learning",
    description:
      "Chord diagrams, tab reading, strumming patterns, and fretboard visualization.",
  },
  {
    icon: Mic2,
    title: "Voice Training",
    description:
      "Pitch matching exercises, breathing techniques, and vocal range tests.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description:
      "Earn XP, unlock achievements, and maintain streaks to stay motivated.",
  },
];

const benefits = [
  "Interactive exercises for all skill levels",
  "Real-time pitch detection for voice and instrument tuning",
  "Metronome and practice timer tools",
  "Progress tracking with XP and achievements",
  "Works on desktop and mobile",
];

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Music className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">Virtuoso</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Flame className="h-4 w-4" />
            Start your musical journey today
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Master Music Theory & Train Your Ear
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            A comprehensive platform for learning music theory, ear training,
            and instrument practice with interactive exercises and progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to learn music</h2>
            <p className="text-muted-foreground mt-2">
              From theory fundamentals to advanced ear training
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Practice smarter, not harder
              </h2>
              <p className="text-muted-foreground mt-4">
                Our interactive platform adapts to your skill level and helps
                you focus on what matters most for your musical development.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg">Start practicing now</Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">7-Day Streak</p>
                    <p className="text-sm text-muted-foreground">
                      Keep practicing daily!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Achievement Unlocked</p>
                    <p className="text-sm text-muted-foreground">
                      Perfect Score Master
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Ear Training Complete</p>
                    <p className="text-sm text-muted-foreground">
                      +50 XP earned
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to become a better musician?
          </h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">
            Join thousands of musicians who are improving their skills with
            Virtuoso. It&apos;s completely free to get started.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Music className="h-4 w-4" />
              </div>
              <span className="font-semibold">Virtuoso</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Virtuoso. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
