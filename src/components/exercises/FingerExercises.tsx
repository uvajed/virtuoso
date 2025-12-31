"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Volume2 } from "lucide-react";
import { initPiano, playPianoNote, isPianoLoaded } from "@/lib/piano";

interface Exercise {
  name: string;
  description: string;
  pattern: number[];
  fingering: { right: number[]; left: number[] };
}

const EXERCISES: Exercise[] = [
  {
    name: "Hanon #1",
    description: "Basic five-finger independence exercise",
    pattern: [0, 2, 3, 4, 5, 4, 3, 2],
    fingering: { right: [1, 2, 3, 4, 5, 4, 3, 2], left: [5, 4, 3, 2, 1, 2, 3, 4] }
  },
  {
    name: "Hanon #2",
    description: "Developing finger strength with skip pattern",
    pattern: [0, 2, 4, 3, 5, 4, 3, 2],
    fingering: { right: [1, 2, 4, 3, 5, 4, 3, 2], left: [5, 4, 2, 3, 1, 2, 3, 4] }
  },
  {
    name: "Five Finger Pattern",
    description: "Simple ascending and descending pattern",
    pattern: [0, 1, 2, 3, 4, 3, 2, 1],
    fingering: { right: [1, 2, 3, 4, 5, 4, 3, 2], left: [5, 4, 3, 2, 1, 2, 3, 4] }
  },
  {
    name: "Trill Exercise",
    description: "Rapid alternation between adjacent fingers",
    pattern: [0, 1, 0, 1, 0, 1, 0, 1],
    fingering: { right: [1, 2, 1, 2, 1, 2, 1, 2], left: [2, 1, 2, 1, 2, 1, 2, 1] }
  },
  {
    name: "Thirds Pattern",
    description: "Playing notes a third apart",
    pattern: [0, 2, 1, 3, 2, 4, 3, 5],
    fingering: { right: [1, 3, 2, 4, 3, 5, 4, 5], left: [5, 3, 4, 2, 3, 1, 2, 1] }
  },
  {
    name: "Chromatic",
    description: "Half-step movement for finger agility",
    pattern: [0, 1, 2, 3, 4, 5, 6, 7],
    fingering: { right: [1, 2, 3, 1, 2, 3, 1, 2], left: [1, 3, 2, 1, 3, 2, 1, 3] }
  },
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function FingerExercises() {
  const [currentExercise, setCurrentExercise] = useState<Exercise>(EXERCISES[0]);
  const [tempo, setTempo] = useState(60);
  const [hand, setHand] = useState<"right" | "left">("right");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [repetitions, setRepetitions] = useState(2);
  const stopRef = useRef(false);

  // Convert semitone to note name with octave (starting from C4)
  const semitoneToNote = (semitone: number): string => {
    const octave = 4 + Math.floor(semitone / 12);
    const noteIndex = semitone % 12;
    return `${NOTE_NAMES[noteIndex]}${octave}`;
  };

  const playNote = useCallback(async (semitone: number) => {
    if (!isPianoLoaded()) {
      await initPiano();
    }
    const noteName = semitoneToNote(semitone);
    playPianoNote(noteName, "8n");
  }, []);

  const playExercise = useCallback(async () => {
    if (isPlaying) {
      stopRef.current = true;
      return;
    }

    // Initialize piano if needed
    if (!isPianoLoaded()) {
      await initPiano();
    }

    stopRef.current = false;
    setIsPlaying(true);
    const beatDuration = 60 / tempo;

    for (let rep = 0; rep < repetitions; rep++) {
      // Play ascending
      for (let i = 0; i < currentExercise.pattern.length; i++) {
        if (stopRef.current) break;
        const semitone = currentExercise.pattern[i];
        setActiveNote(i);
        playNote(semitone);
        await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
      }

      if (stopRef.current) break;

      // Play descending
      for (let i = currentExercise.pattern.length - 2; i >= 0; i--) {
        if (stopRef.current) break;
        const semitone = currentExercise.pattern[i];
        setActiveNote(i);
        playNote(semitone);
        await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
      }
    }

    setActiveNote(null);
    setIsPlaying(false);
  }, [currentExercise, isPlaying, playNote, tempo, repetitions]);

  const getNoteName = (semitone: number) => {
    return NOTE_NAMES[semitone % 12];
  };

  // Get unique notes in pattern for piano display
  const maxNote = Math.max(...currentExercise.pattern);

  // Build piano keys data - only white keys from C to the max note needed
  const getWhiteKeyData = () => {
    const whiteNoteIndices = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    const keys = [];

    // We need enough white keys to cover the pattern
    const numWhiteKeys = Math.ceil((maxNote + 3) / 12) * 7;

    for (let i = 0; i < Math.min(numWhiteKeys, 8); i++) {
      const semitone = whiteNoteIndices[i % 7] + Math.floor(i / 7) * 12;
      keys.push(semitone);
    }
    return keys;
  };

  const whiteKeys = getWhiteKeyData();

  // Check if a semitone has a black key after it
  const hasBlackKeyAfter = (semitone: number) => {
    const noteInOctave = semitone % 12;
    // Black keys come after C, D, F, G, A (indices 0, 2, 5, 7, 9)
    return [0, 2, 5, 7, 9].includes(noteInOctave);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finger Exercises</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {EXERCISES.map((exercise) => (
            <Button
              key={exercise.name}
              size="sm"
              variant={currentExercise.name === exercise.name ? "primary" : "outline"}
              onClick={() => setCurrentExercise(exercise)}
            >
              {exercise.name}
            </Button>
          ))}
        </div>

        {/* Exercise info */}
        <div className="text-center">
          <h3 className="text-xl font-bold">{currentExercise.name}</h3>
          <p className="text-muted-foreground">{currentExercise.description}</p>
          <p className="text-sm mt-2">
            Pattern: {currentExercise.pattern.map(n => getNoteName(n)).join(" - ")}
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reps:</span>
            <Button size="sm" variant="outline" onClick={() => setRepetitions(r => Math.max(1, r - 1))}>-</Button>
            <span className="w-8 text-center font-mono">{repetitions}</span>
            <Button size="sm" variant="outline" onClick={() => setRepetitions(r => Math.min(8, r + 1))}>+</Button>
          </div>
        </div>

        {/* Piano visualization */}
        <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
          <div className="flex justify-center">
            <div className="relative flex">
              {whiteKeys.map((semitone, idx) => {
                const isInPattern = currentExercise.pattern.includes(semitone);
                const isActive = activeNote !== null && currentExercise.pattern[activeNote] === semitone;
                const blackKeySemitone = semitone + 1;
                const blackKeyInPattern = currentExercise.pattern.includes(blackKeySemitone);
                const blackKeyActive = activeNote !== null && currentExercise.pattern[activeNote] === blackKeySemitone;

                return (
                  <div key={idx} className="relative">
                    {/* White key */}
                    <div
                      onClick={() => playNote(semitone)}
                      className={`w-10 h-32 border border-gray-300 rounded-b cursor-pointer transition-colors ${
                        isActive ? "bg-primary" : isInPattern ? "bg-primary/30" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {isInPattern && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                          {hand === "right"
                            ? currentExercise.fingering.right[currentExercise.pattern.indexOf(semitone)]
                            : currentExercise.fingering.left[currentExercise.pattern.indexOf(semitone)]
                          }
                        </div>
                      )}
                      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs ${isActive ? "text-white" : "text-gray-600"}`}>
                        {NOTE_NAMES[semitone % 12]}
                      </div>
                    </div>
                    {/* Black key (if applicable) */}
                    {hasBlackKeyAfter(semitone) && idx < whiteKeys.length - 1 && (
                      <div
                        onClick={() => playNote(blackKeySemitone)}
                        className={`absolute top-0 w-6 h-20 rounded-b cursor-pointer transition-colors z-10 ${
                          blackKeyActive ? "bg-primary" : blackKeyInPattern ? "bg-primary/70" : "bg-gray-900 hover:bg-gray-700"
                        }`}
                        style={{ left: "27px" }}
                      >
                        {blackKeyInPattern && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                            {hand === "right"
                              ? currentExercise.fingering.right[currentExercise.pattern.indexOf(blackKeySemitone)]
                              : currentExercise.fingering.left[currentExercise.pattern.indexOf(blackKeySemitone)]
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

        {/* Fingering display */}
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium mb-2 text-center">{hand === "right" ? "Right" : "Left"} Hand Fingering</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {currentExercise.pattern.map((note, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  activeNote === i ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {hand === "right" ? currentExercise.fingering.right[i] : currentExercise.fingering.left[i]}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            1 = Thumb, 2 = Index, 3 = Middle, 4 = Ring, 5 = Pinky
          </p>
        </div>

        {/* Play button */}
        <div className="flex gap-2 justify-center">
          <Button onClick={playExercise}>
            {isPlaying ? (
              <>Stop</>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Play Exercise
              </>
            )}
          </Button>
        </div>

        {/* Practice tips */}
        <div className="bg-muted/20 rounded-lg p-4 text-sm">
          <h4 className="font-medium mb-2">Practice Tips</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Start slowly and focus on even finger pressure</li>
            <li>• Keep your wrist relaxed and fingers curved</li>
            <li>• Increase tempo only after mastering the pattern</li>
            <li>• Practice each hand separately before combining</li>
            <li>• Aim for consistent tone and rhythm</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
