"use client";

import { VirtualPiano, SightReading } from "@/components/exercises";
import { Card, CardContent } from "@/components/ui";
import { Keyboard, BookOpen, Music } from "lucide-react";

export default function PianoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Piano Practice</h1>
        <p className="text-muted-foreground mt-1">
          Play and practice on the virtual piano
        </p>
      </div>

      {/* Virtual Piano */}
      <VirtualPiano />

      {/* Practice tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Keyboard className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold">Keyboard Controls</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use your computer keyboard: A-L for white keys (C4-E5), W-P for black keys.
                  You can also click or tap the piano keys directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Music className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold">Practice Tips</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Start with scales: C major (all white keys), then try G major (F#) and F major (Bb).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common chord progressions */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5" />
          Common Chord Progressions to Practice
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">I - IV - V - I (Key of C)</h4>
            <p className="text-muted-foreground">C - F - G - C</p>
            <p className="text-xs text-muted-foreground mt-1">Used in countless pop songs</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">I - V - vi - IV (Key of C)</h4>
            <p className="text-muted-foreground">C - G - Am - F</p>
            <p className="text-xs text-muted-foreground mt-1">The &quot;4 chord song&quot; progression</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">ii - V - I (Key of C)</h4>
            <p className="text-muted-foreground">Dm - G - C</p>
            <p className="text-xs text-muted-foreground mt-1">Essential jazz progression</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">I - vi - IV - V (Key of C)</h4>
            <p className="text-muted-foreground">C - Am - F - G</p>
            <p className="text-xs text-muted-foreground mt-1">Classic 50s progression</p>
          </div>
        </div>
      </div>

      {/* Sight Reading */}
      <SightReading />
    </div>
  );
}
