"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { NoteQuiz, ScaleQuiz, ChordQuiz } from "@/components/exercises";
import { Music, FileMusic, Piano, BookOpen } from "lucide-react";

const exercises = [
  { id: "notes", name: "Note Identification", icon: Music, component: NoteQuiz },
  { id: "scales", name: "Scale Identification", icon: FileMusic, component: ScaleQuiz },
  { id: "chords", name: "Chord Identification", icon: Piano, component: ChordQuiz },
];

export default function TheoryPage() {
  const [activeExercise, setActiveExercise] = useState("notes");

  const ActiveComponent = exercises.find((e) => e.id === activeExercise)?.component || NoteQuiz;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Music Theory</h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge of notes, scales, and chords
        </p>
      </div>

      {/* Exercise selector */}
      <div className="flex flex-wrap gap-2">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <Button
              key={exercise.id}
              variant={activeExercise === exercise.id ? "default" : "outline"}
              onClick={() => setActiveExercise(exercise.id)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {exercise.name}
            </Button>
          );
        })}
      </div>

      {/* Active exercise */}
      <ActiveComponent />

      {/* Tips section */}
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5" />
          Quick Tips
        </h3>
        {activeExercise === "notes" && (
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Lines on treble clef (bottom to top): E G B D F - &quot;Every Good Boy Does Fine&quot;</li>
            <li>• Spaces on treble clef: F A C E - spells &quot;FACE&quot;</li>
            <li>• Lines on bass clef: G B D F A - &quot;Good Boys Do Fine Always&quot;</li>
            <li>• Spaces on bass clef: A C E G - &quot;All Cows Eat Grass&quot;</li>
          </ul>
        )}
        {activeExercise === "scales" && (
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Major scale pattern: W W H W W W H (W=whole step, H=half step)</li>
            <li>• Natural minor: W H W W H W W</li>
            <li>• Harmonic minor: like natural minor but raised 7th</li>
            <li>• Pentatonic scales have 5 notes and no half steps</li>
          </ul>
        )}
        {activeExercise === "chords" && (
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Major = Root + Major 3rd + Perfect 5th (happy sound)</li>
            <li>• Minor = Root + Minor 3rd + Perfect 5th (sad sound)</li>
            <li>• Diminished = Root + Minor 3rd + Diminished 5th (tense)</li>
            <li>• 7th chords add an extra note a 7th above the root</li>
          </ul>
        )}
      </div>
    </div>
  );
}
