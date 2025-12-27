import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { Timer, Gauge, Clock } from "lucide-react";

const tools = [
  {
    title: "Metronome",
    description: "Keep time with an adjustable metronome. Set BPM and time signature.",
    href: "/tools/metronome",
    icon: Timer,
    color: "bg-blue-500",
  },
  {
    title: "Tuner",
    description: "Tune your instrument with our chromatic tuner using your microphone.",
    href: "/tools/tuner",
    icon: Gauge,
    color: "bg-purple-500",
  },
  {
    title: "Practice Timer",
    description: "Track your practice sessions with stopwatch or countdown timer.",
    href: "/tools/timer",
    icon: Clock,
    color: "bg-emerald-500",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Practice Tools</h1>
        <p className="text-muted-foreground mt-1">
          Essential tools to enhance your practice sessions
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.title} href={tool.href}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${tool.color} text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description}
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
  );
}
