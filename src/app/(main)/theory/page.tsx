import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { BookOpen, Music, FileMusic, Piano } from "lucide-react";
import Link from "next/link";

const topics = [
  {
    title: "Notes & Staff",
    description: "Learn to read notes on the treble and bass clef",
    icon: Music,
    href: "/theory/notes",
    available: false,
  },
  {
    title: "Scales",
    description: "Major, minor, and modal scales",
    icon: FileMusic,
    href: "/theory/scales",
    available: false,
  },
  {
    title: "Chords",
    description: "Triads, seventh chords, and extensions",
    icon: Piano,
    href: "/theory/chords",
    available: false,
  },
  {
    title: "Key Signatures",
    description: "Understanding keys and the circle of fifths",
    icon: BookOpen,
    href: "/theory/keys",
    available: false,
  },
];

export default function TheoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Music Theory</h1>
        <p className="text-muted-foreground mt-1">
          Build a solid foundation in music theory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.title} className="relative overflow-hidden">
              {!topic.available && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Theory Lessons Coming Soon</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We&apos;re building interactive lessons to help you master music theory.
            Check back soon!
          </p>
          <Link
            href="/tools"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Try the practice tools while you wait
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
