import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Headphones, Music, AudioLines, FileMusic } from "lucide-react";
import Link from "next/link";

const exercises = [
  {
    title: "Interval Recognition",
    description: "Identify intervals by ear",
    icon: Music,
    href: "/ear-training/intervals",
    available: false,
  },
  {
    title: "Chord Identification",
    description: "Recognize chord types and qualities",
    icon: AudioLines,
    href: "/ear-training/chords",
    available: false,
  },
  {
    title: "Melody Dictation",
    description: "Transcribe melodies you hear",
    icon: FileMusic,
    href: "/ear-training/melody",
    available: false,
  },
  {
    title: "Rhythm Training",
    description: "Practice rhythmic patterns",
    icon: Headphones,
    href: "/ear-training/rhythm",
    available: false,
  },
];

export default function EarTrainingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Ear Training</h1>
        <p className="text-muted-foreground mt-1">
          Develop your musical ear with interactive exercises
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <Card key={exercise.title} className="relative overflow-hidden">
              {!exercise.available && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Icon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    <CardDescription>{exercise.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Ear Training Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We&apos;re building interactive ear training exercises. Use the tuner
            to practice pitch recognition in the meantime!
          </p>
          <Link
            href="/tools/tuner"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Try the Tuner
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
