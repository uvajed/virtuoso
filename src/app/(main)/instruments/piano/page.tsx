"use client";

import { useState } from "react";
import { VirtualPiano, ScalePractice, ChordPractice, FingerExercises } from "@/components/exercises";
import { Button, Card, CardContent } from "@/components/ui";
import { Keyboard, BookOpen, Music, Piano, Dumbbell } from "lucide-react";

type ExerciseTab = "piano" | "scales" | "chords" | "exercises";

export default function PianoPage() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("piano");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Piano Practice</h1>
        <p className="text-muted-foreground mt-1">
          Play and practice on the virtual piano
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === "piano" ? "primary" : "outline"}
          onClick={() => setActiveTab("piano")}
          className="gap-2"
        >
          <Piano className="h-4 w-4" />
          Free Play
        </Button>
        <Button
          variant={activeTab === "scales" ? "primary" : "outline"}
          onClick={() => setActiveTab("scales")}
          className="gap-2"
        >
          <Music className="h-4 w-4" />
          Scales
        </Button>
        <Button
          variant={activeTab === "chords" ? "primary" : "outline"}
          onClick={() => setActiveTab("chords")}
          className="gap-2"
        >
          <Keyboard className="h-4 w-4" />
          Chords
        </Button>
        <Button
          variant={activeTab === "exercises" ? "primary" : "outline"}
          onClick={() => setActiveTab("exercises")}
          className="gap-2"
        >
          <Dumbbell className="h-4 w-4" />
          Exercises
        </Button>
      </div>

      {/* Free Play Tab */}
      {activeTab === "piano" && (
        <>
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
        </>
      )}

      {/* Scales Tab */}
      {activeTab === "scales" && <ScalePractice />}

      {/* Chords Tab */}
      {activeTab === "chords" && <ChordPractice />}

      {/* Exercises Tab */}
      {activeTab === "exercises" && <FingerExercises />}
    </div>
  );
}
