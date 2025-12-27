"use client";

import { PitchTrainer, VocalRangeTest } from "@/components/exercises";
import { Card, CardContent } from "@/components/ui";
import { Mic2, Wind, Lightbulb, AudioLines } from "lucide-react";
import Link from "next/link";

export default function VoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Voice Training</h1>
        <p className="text-muted-foreground mt-1">
          Train your pitch accuracy with real-time microphone feedback
        </p>
      </div>

      {/* Pitch Trainer */}
      <PitchTrainer />

      {/* Vocal tips */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5" />
          Vocal Training Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Before Singing</h4>
            <ul className="space-y-1">
              <li>• Warm up with gentle humming</li>
              <li>• Do lip trills and sirens</li>
              <li>• Stay hydrated (room temp water)</li>
              <li>• Relax your jaw and shoulders</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Pitch Accuracy</h4>
            <ul className="space-y-1">
              <li>• Listen before you sing</li>
              <li>• Start soft, then build volume</li>
              <li>• Feel the note in your body</li>
              <li>• Practice scales slowly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Breathing exercise */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Wind className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h3 className="font-semibold">Breathing Exercise</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Practice diaphragmatic breathing to improve your vocal support:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Inhale slowly for 4 counts, expanding your belly (not chest)</li>
                <li>Hold for 4 counts</li>
                <li>Exhale on a &quot;sss&quot; sound for 8 counts</li>
                <li>Repeat 5-10 times before singing</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vocal range info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Common Vocal Ranges</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Female Voices</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Soprano: C4 - C6</li>
                <li>• Mezzo-soprano: A3 - A5</li>
                <li>• Alto: F3 - F5</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Male Voices</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Tenor: C3 - C5</li>
                <li>• Baritone: A2 - A4</li>
                <li>• Bass: E2 - E4</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vocal Range Test */}
      <VocalRangeTest />

      {/* Link to tuner */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Want a simple tuner view?</h3>
              <p className="text-sm text-muted-foreground">
                Use the chromatic tuner for basic pitch feedback
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
