import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Piano, Music, BookOpen, Keyboard } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Virtual Piano",
    description: "Play an 88-key virtual piano",
    icon: Keyboard,
    available: false,
  },
  {
    title: "Sight Reading",
    description: "Practice reading sheet music",
    icon: BookOpen,
    available: false,
  },
  {
    title: "Chord Practice",
    description: "Learn and practice piano chords",
    icon: Music,
    available: false,
  },
  {
    title: "Finger Exercises",
    description: "Hanon exercises and scales",
    icon: Piano,
    available: false,
  },
];

export default function PianoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Piano Practice</h1>
        <p className="text-muted-foreground mt-1">
          Interactive piano exercises and tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="relative overflow-hidden">
              {!feature.available && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Icon className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Piano className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Piano Features Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We&apos;re building an interactive virtual piano with exercises.
            Use the metronome to practice your timing!
          </p>
          <Link
            href="/tools/metronome"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Try the Metronome
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
