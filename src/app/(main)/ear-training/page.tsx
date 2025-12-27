"use client";

import { IntervalTrainer, ChordRecognition, MelodyDictation } from "@/components/exercises";
import { Lightbulb } from "lucide-react";

export default function EarTrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Ear Training</h1>
        <p className="text-muted-foreground mt-1">
          Develop your musical ear with interval recognition
        </p>
      </div>

      {/* Interval Trainer */}
      <IntervalTrainer />

      {/* Tips section */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5" />
          Interval Recognition Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Song References</h4>
            <ul className="space-y-1">
              <li>• Minor 2nd: Jaws theme</li>
              <li>• Major 2nd: Happy Birthday (1st 2 notes)</li>
              <li>• Minor 3rd: Greensleeves</li>
              <li>• Major 3rd: Oh When The Saints</li>
              <li>• Perfect 4th: Here Comes The Bride</li>
              <li>• Tritone: The Simpsons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">More References</h4>
            <ul className="space-y-1">
              <li>• Perfect 5th: Star Wars theme</li>
              <li>• Minor 6th: The Entertainer</li>
              <li>• Major 6th: NBC theme</li>
              <li>• Minor 7th: Star Trek theme</li>
              <li>• Major 7th: Take On Me</li>
              <li>• Octave: Somewhere Over The Rainbow</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chord Recognition */}
      <ChordRecognition />

      {/* Melody Dictation */}
      <MelodyDictation />
    </div>
  );
}
