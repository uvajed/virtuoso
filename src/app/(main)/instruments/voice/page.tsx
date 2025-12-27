import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Mic2, Music, Wind, AudioLines } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Pitch Training",
    description: "Match pitches with real-time feedback",
    icon: Music,
    available: false,
  },
  {
    title: "Vocal Range Test",
    description: "Discover your vocal range",
    icon: AudioLines,
    available: false,
  },
  {
    title: "Breathing Exercises",
    description: "Improve breath control",
    icon: Wind,
    available: false,
  },
  {
    title: "Warm-up Routines",
    description: "Daily vocal warm-ups",
    icon: Mic2,
    available: false,
  },
];

export default function VoicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Voice Training</h1>
        <p className="text-muted-foreground mt-1">
          Pitch training and vocal exercises
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
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <Icon className="h-5 w-5 text-pink-500" />
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
          <Mic2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Voice Training Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We&apos;re building pitch training with real-time microphone feedback.
            Try the tuner to practice pitch recognition!
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
