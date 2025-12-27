"use client";

import { IntervalTrainer, ChordRecognition, MelodyDictation, RhythmTrainer, ChordProgressions } from "@/components/exercises";
import { Lightbulb } from "lucide-react";

export default function EarTrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Ear Training</h1>
        <p className="text-muted-foreground mt-1">
          Develop your musical ear with intervals, chords, rhythm, and more
        </p>
      </div>

      {/* Interval Trainer */}
      <IntervalTrainer />

      {/* Chord Recognition */}
      <ChordRecognition />

      {/* Chord Progressions */}
      <ChordProgressions />

      {/* Rhythm Trainer */}
      <RhythmTrainer />

      {/* Melody Dictation */}
      <MelodyDictation />

      {/* Tips section */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5" />
          Ear Training Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Interval Song References</h4>
            <ul className="space-y-1">
              <li>• Minor 2nd: Jaws theme</li>
              <li>• Major 2nd: Happy Birthday</li>
              <li>• Minor 3rd: Greensleeves</li>
              <li>• Major 3rd: Oh When The Saints</li>
              <li>• Perfect 4th: Here Comes The Bride</li>
              <li>• Perfect 5th: Star Wars theme</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Chord Recognition Tips</h4>
            <ul className="space-y-1">
              <li>• Major: Happy, bright sound</li>
              <li>• Minor: Sad, dark feeling</li>
              <li>• Diminished: Tense, unstable</li>
              <li>• 7th chords: Jazzy extensions</li>
              <li>• 9th/11th/13th: Rich, complex</li>
              <li>• Listen for the character!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
