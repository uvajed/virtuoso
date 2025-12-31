"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Play, RefreshCw, Volume2 } from "lucide-react";

interface Scale {
  name: string;
  intervals: number[];
  description: string;
  fingering: { left: number[]; right: number[] };
}

const SCALES: Scale[] = [
  {
    name: "C Major",
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    description: "No sharps or flats",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "G Major",
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    description: "One sharp (F#)",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "D Major",
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    description: "Two sharps (F#, C#)",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "A Minor (Natural)",
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    description: "Relative minor of C Major",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "A Minor (Harmonic)",
    intervals: [0, 2, 3, 5, 7, 8, 11, 12],
    description: "Raised 7th degree",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "A Minor (Melodic)",
    intervals: [0, 2, 3, 5, 7, 9, 11, 12],
    description: "Raised 6th and 7th ascending",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
  {
    name: "C Pentatonic Major",
    intervals: [0, 2, 4, 7, 9, 12],
    description: "5-note scale, great for improv",
    fingering: { left: [5, 4, 3, 2, 1, 1], right: [1, 2, 3, 1, 2, 3] }
  },
  {
    name: "A Pentatonic Minor",
    intervals: [0, 3, 5, 7, 10, 12],
    description: "Blues/rock foundation",
    fingering: { left: [5, 3, 2, 1, 3, 1], right: [1, 2, 3, 1, 2, 3] }
  },
  {
    name: "C Blues",
    intervals: [0, 3, 5, 6, 7, 10, 12],
    description: "Minor pentatonic + blue note",
    fingering: { left: [5, 3, 2, 2, 1, 3, 1], right: [1, 2, 3, 4, 1, 2, 3] }
  },
  {
    name: "D Dorian",
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    description: "Minor scale with raised 6th",
    fingering: { left: [5, 4, 3, 2, 1, 3, 2, 1], right: [1, 2, 3, 1, 2, 3, 4, 5] }
  },
];

const ROOT_FREQUENCIES: Record<string, number> = {
  "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13,
  "E": 329.63, "F": 349.23, "F#": 369.99, "G": 392.00,
  "G#": 415.30, "A": 440.00, "A#": 466.16, "B": 493.88,
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function ScalePractice() {
  const [currentScale, setCurrentScale] = useState<Scale>(SCALES[0]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFingering, setShowFingering] = useState(true);
  const [hand, setHand] = useState<"right" | "left">("right");
  const [tempo, setTempo] = useState(80);
  const audioContextRef = useRef<AudioContext | null>(null);

  const rootNote = currentScale.name.split(" ")[0];
  const rootIndex = NOTE_NAMES.indexOf(rootNote.replace("#", "#"));

  const playNote = useCallback((semitone: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const rootFreq = ROOT_FREQUENCIES[rootNote] || 261.63;
    const freq = rootFreq * Math.pow(2, semitone / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, [rootNote]);

  const playScale = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const beatDuration = 60 / tempo;

    for (let i = 0; i < currentScale.intervals.length; i++) {
      setActiveNote(i);
      playNote(currentScale.intervals[i]);
      await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
    }

    // Play descending
    for (let i = currentScale.intervals.length - 2; i >= 0; i--) {
      setActiveNote(i);
      playNote(currentScale.intervals[i]);
      await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
    }

    setActiveNote(null);
    setIsPlaying(false);
  }, [currentScale, isPlaying, playNote, tempo]);

  const getNoteName = (semitone: number) => {
    return NOTE_NAMES[(rootIndex + semitone) % 12];
  };

  // Check if a note has a black key after it
  const hasBlackKeyAfter = (noteIndex: number) => {
    // Black keys come after C, D, F, G, A (indices 0, 2, 5, 7, 9)
    return [0, 2, 5, 7, 9].includes(noteIndex);
  };

  // Get white keys to display (C through B, one octave)
  const whiteKeyNotes = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
  const scaleNotes = currentScale.intervals.map(i => (rootIndex + i) % 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scale Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scale selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {SCALES.map((scale) => (
            <Button
              key={scale.name}
              size="sm"
              variant={currentScale.name === scale.name ? "primary" : "outline"}
              onClick={() => setCurrentScale(scale)}
            >
              {scale.name}
            </Button>
          ))}
        </div>

        {/* Scale info */}
        <div className="text-center">
          <h3 className="text-xl font-bold">{currentScale.name}</h3>
          <p className="text-muted-foreground">{currentScale.description}</p>
          <p className="text-sm mt-2">
            Notes: {currentScale.intervals.map(i => getNoteName(i)).join(" - ")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hand:</span>
            <Button
              size="sm"
              variant={hand === "left" ? "primary" : "outline"}
              onClick={() => setHand("left")}
            >
              Left
            </Button>
            <Button
              size="sm"
              variant={hand === "right" ? "primary" : "outline"}
              onClick={() => setHand("right")}
            >
              Right
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">BPM:</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.max(40, t - 10))}>-</Button>
            <span className="w-12 text-center font-mono">{tempo}</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.min(160, t + 10))}>+</Button>
          </div>
          <Button
            size="sm"
            variant={showFingering ? "primary" : "outline"}
            onClick={() => setShowFingering(!showFingering)}
          >
            Fingering
          </Button>
        </div>

        {/* Piano */}
        <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
          <div className="flex justify-center">
            <div className="relative flex">
              {whiteKeyNotes.map((noteIndex, idx) => {
                const isInScale = scaleNotes.includes(noteIndex);
                const scalePosition = scaleNotes.indexOf(noteIndex);
                const isActive = activeNote !== null && scaleNotes[activeNote % scaleNotes.length] === noteIndex;
                const blackKeyIndex = noteIndex + 1;
                const blackKeyInScale = scaleNotes.includes(blackKeyIndex);
                const blackKeyActive = activeNote !== null && scaleNotes[activeNote % scaleNotes.length] === blackKeyIndex;
                const blackScalePosition = scaleNotes.indexOf(blackKeyIndex);

                return (
                  <div key={idx} className="relative">
                    {/* White key */}
                    <div
                      onClick={() => playNote(noteIndex)}
                      className={`w-10 h-32 border border-gray-300 rounded-b cursor-pointer transition-colors ${
                        isActive ? "bg-primary" : isInScale ? "bg-primary/30" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {isInScale && showFingering && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                          {hand === "right"
                            ? currentScale.fingering.right[scalePosition]
                            : currentScale.fingering.left[scalePosition]
                          }
                        </div>
                      )}
                      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs ${isActive ? "text-white" : "text-gray-600"}`}>
                        {NOTE_NAMES[noteIndex]}
                      </div>
                    </div>
                    {/* Black key (if applicable) */}
                    {hasBlackKeyAfter(noteIndex) && idx < whiteKeyNotes.length - 1 && (
                      <div
                        onClick={() => playNote(blackKeyIndex)}
                        className={`absolute top-0 w-6 h-20 rounded-b cursor-pointer transition-colors z-10 ${
                          blackKeyActive ? "bg-primary" : blackKeyInScale ? "bg-primary/70" : "bg-gray-900 hover:bg-gray-700"
                        }`}
                        style={{ left: "27px" }}
                      >
                        {blackKeyInScale && showFingering && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                            {hand === "right"
                              ? currentScale.fingering.right[blackScalePosition]
                              : currentScale.fingering.left[blackScalePosition]
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fingering guide */}
        {showFingering && (
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">{hand === "right" ? "Right" : "Left"} Hand Fingering:</h4>
            <div className="flex justify-center gap-4 text-sm">
              {currentScale.intervals.map((_, i) => (
                <div key={i} className="text-center">
                  <div className="font-bold text-primary">
                    {hand === "right" ? currentScale.fingering.right[i] : currentScale.fingering.left[i]}
                  </div>
                  <div className="text-muted-foreground">{getNoteName(currentScale.intervals[i])}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              1 = Thumb, 2 = Index, 3 = Middle, 4 = Ring, 5 = Pinky
            </p>
          </div>
        )}

        {/* Play button */}
        <div className="flex gap-2 justify-center">
          <Button onClick={playScale} disabled={isPlaying}>
            <Volume2 className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Scale"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
