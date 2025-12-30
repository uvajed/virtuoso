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
  Play,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Music Theory",
    description:
      "Learn notes, scales, chords, and keys with interactive lessons and quizzes.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Headphones,
    title: "Ear Training",
    description:
      "Train your ear with interval recognition, chord identification, and melody dictation.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Piano,
    title: "Piano Practice",
    description:
      "Interactive virtual piano with sight-reading exercises and finger exercises.",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Guitar,
    title: "Guitar Learning",
    description:
      "Chord diagrams, tab reading, strumming patterns, and fretboard visualization.",
    color: "from-orange-500 to-orange-700",
  },
  {
    icon: Mic2,
    title: "Voice Training",
    description:
      "Pitch matching exercises, breathing techniques, and vocal range tests.",
    color: "from-pink-500 to-pink-700",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description:
      "Earn XP, unlock achievements, and maintain streaks to stay motivated.",
    color: "from-yellow-500 to-yellow-700",
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Virtuoso</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/register">
              <span className="text-muted-foreground hover:text-foreground font-bold text-sm transition-colors hidden sm:block">
                Sign up
              </span>
            </Link>
            <Link href="/login">
              <Button size="sm" className="px-8">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-muted/50 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm font-medium mb-8">
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '6px' }} />
              <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '10px', animationDelay: '0.2s' }} />
              <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '4px', animationDelay: '0.4s' }} />
            </div>
            <span className="text-muted-foreground">Start your musical journey today</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Music is for
            <span className="block text-primary">everyone.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-8 max-w-2xl mx-auto">
            Master music theory, train your ear, and practice instruments with
            interactive exercises. All in one place. All free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base px-10">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to learn music</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              From theory fundamentals to advanced ear training
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card rounded-lg p-6 hover:bg-card-hover transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Play className="h-5 w-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Practice smarter,
                <span className="text-primary"> not harder</span>
              </h2>
              <p className="text-muted-foreground mt-6 text-lg">
                Our interactive platform adapts to your skill level and helps
                you focus on what matters most for your musical development.
              </p>
              <ul className="mt-10 space-y-5">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-muted to-card rounded-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">7-Day Streak</p>
                    <p className="text-sm text-muted-foreground">
                      Keep practicing daily!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Achievement Unlocked</p>
                    <p className="text-sm text-muted-foreground">
                      Perfect Score Master
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold">Ear Training Complete</p>
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
      <section className="py-24 bg-gradient-to-t from-muted/50 to-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black">
            Ready to become a better musician?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
            Join musicians who are improving their skills with
            Virtuoso. It&apos;s completely free to get started.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-10 px-12 text-base"
            >
              Sign up free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <Music className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Virtuoso</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
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
