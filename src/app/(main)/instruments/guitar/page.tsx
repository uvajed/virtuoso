import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Guitar, Music, FileMusic, Hand } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Chord Library",
    description: "Interactive chord diagrams",
    icon: Music,
    available: false,
  },
  {
    title: "Fretboard Trainer",
    description: "Learn notes on the fretboard",
    icon: Guitar,
    available: false,
  },
  {
    title: "Tab Reader",
    description: "Read and play guitar tabs",
    icon: FileMusic,
    available: false,
  },
  {
    title: "Strumming Patterns",
    description: "Practice common strumming patterns",
    icon: Hand,
    available: false,
  },
];

export default function GuitarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Guitar Practice</h1>
        <p className="text-muted-foreground mt-1">
          Chords, tabs, and fretboard exercises
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
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Icon className="h-5 w-5 text-orange-500" />
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
          <Guitar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Guitar Features Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We&apos;re building chord diagrams and fretboard tools.
            Use the tuner to tune your guitar!
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
