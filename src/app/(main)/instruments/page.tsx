import { Card, CardContent } from "@/components/ui";
import { Piano, Guitar, Mic2, ArrowRight } from "lucide-react";
import Link from "next/link";

const instruments = [
  {
    name: "Piano",
    description: "Virtual piano with keyboard controls and chord progressions",
    icon: Piano,
    href: "/instruments/piano",
    color: "bg-emerald-500",
  },
  {
    name: "Guitar",
    description: "Chord library with interactive fingering diagrams",
    icon: Guitar,
    href: "/instruments/guitar",
    color: "bg-orange-500",
  },
  {
    name: "Voice",
    description: "Pitch training with real-time microphone feedback",
    icon: Mic2,
    href: "/instruments/voice",
    color: "bg-pink-500",
  },
];

export default function InstrumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Instruments</h1>
        <p className="text-muted-foreground mt-1">
          Choose an instrument to start practicing
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {instruments.map((instrument) => {
          const Icon = instrument.icon;
          return (
            <Link key={instrument.name} href={instrument.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-2xl ${instrument.color} text-white flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{instrument.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {instrument.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Start practicing
                    <ArrowRight className="h-4 w-4 ml-1" />
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
