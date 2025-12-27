"use client";

import { GuitarChordLibrary, FretboardTrainer } from "@/components/exercises";
import { Card, CardContent } from "@/components/ui";
import { Guitar, BookOpen, Music, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function GuitarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Guitar Practice</h1>
        <p className="text-muted-foreground mt-1">
          Learn chords and practice with interactive diagrams
        </p>
      </div>

      {/* Chord Library */}
      <GuitarChordLibrary />

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5" />
          Guitar Practice Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Beginner Chords to Master</h4>
            <ul className="space-y-1">
              <li>• Start with Em and Am (easiest)</li>
              <li>• Then learn C, G, and D</li>
              <li>• Practice chord transitions slowly</li>
              <li>• Use a metronome for timing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Proper Technique</h4>
            <ul className="space-y-1">
              <li>• Press strings with fingertips</li>
              <li>• Keep thumb behind the neck</li>
              <li>• Fingers curved, not flat</li>
              <li>• Check each string rings clearly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common progressions */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Essential Chord Progressions</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">G - C - D</h4>
              <p className="text-muted-foreground text-xs">Basic 3-chord progression for many songs</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">G - Em - C - D</h4>
              <p className="text-muted-foreground text-xs">Popular 4-chord progression</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">Am - F - C - G</h4>
              <p className="text-muted-foreground text-xs">Minor key progression</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-1">E - A - B7</h4>
              <p className="text-muted-foreground text-xs">Blues progression in E</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fretboard Trainer */}
      <FretboardTrainer />

      {/* Link to tuner */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Need to tune your guitar?</h3>
              <p className="text-sm text-muted-foreground">
                Standard tuning: E A D G B E
              </p>
            </div>
            <Link
              href="/tools/tuner"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Open Tuner
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
