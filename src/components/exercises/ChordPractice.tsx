"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Volume2, RotateCcw } from "lucide-react";
import { initPiano, playPianoNote, playChord as playPianoChord, isPianoLoaded } from "@/lib/piano";

interface Chord {
  name: string;
  symbol: string;
  intervals: number[];
  description: string;
}

const CHORDS: Chord[] = [
  { name: "Major", symbol: "", intervals: [0, 4, 7], description: "Bright, happy sound" },
  { name: "Minor", symbol: "m", intervals: [0, 3, 7], description: "Sad, melancholic sound" },
  { name: "Diminished", symbol: "dim", intervals: [0, 3, 6], description: "Tense, unstable sound" },
  { name: "Augmented", symbol: "aug", intervals: [0, 4, 8], description: "Dreamy, unresolved sound" },
  { name: "Major 7th", symbol: "maj7", intervals: [0, 4, 7, 11], description: "Jazzy, sophisticated" },
  { name: "Minor 7th", symbol: "m7", intervals: [0, 3, 7, 10], description: "Smooth, mellow" },
  { name: "Dominant 7th", symbol: "7", intervals: [0, 4, 7, 10], description: "Bluesy, wants to resolve" },
  { name: "Suspended 2nd", symbol: "sus2", intervals: [0, 2, 7], description: "Open, ambiguous" },
  { name: "Suspended 4th", symbol: "sus4", intervals: [0, 5, 7], description: "Tension, wants to resolve" },
  { name: "Add 9", symbol: "add9", intervals: [0, 4, 7, 14], description: "Rich, modern sound" },
];

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type Inversion = "root" | "first" | "second" | "third";

export function ChordPractice() {
  const [currentChord, setCurrentChord] = useState<Chord>(CHORDS[0]);
  const [rootNote, setRootNote] = useState("C");
  const [inversion, setInversion] = useState<Inversion>("root");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  const rootIndex = ROOT_NOTES.indexOf(rootNote);

  // Convert semitone interval from root to note name with octave
  const intervalToNote = (semitone: number): string => {
    const totalSemitones = rootIndex + semitone;
    const octave = 4 + Math.floor(totalSemitones / 12);
    const noteIndex = totalSemitones % 12;
    return `${ROOT_NOTES[noteIndex]}${octave}`;
  };

  const getInvertedIntervals = useCallback(() => {
    const intervals = [...currentChord.intervals];
    if (inversion === "first" && intervals.length >= 3) {
      intervals[0] += 12;
      intervals.sort((a, b) => a - b);
    } else if (inversion === "second" && intervals.length >= 3) {
      intervals[0] += 12;
      intervals[1] += 12;
      intervals.sort((a, b) => a - b);
    } else if (inversion === "third" && intervals.length >= 4) {
      intervals[0] += 12;
      intervals[1] += 12;
      intervals[2] += 12;
      intervals.sort((a, b) => a - b);
    }
    return intervals;
  }, [currentChord, inversion]);

  const playChord = useCallback(async () => {
    if (isPlaying) return;

    // Initialize piano if needed
    if (!isPianoLoaded()) {
      await initPiano();
    }

    setIsPlaying(true);

    const intervals = getInvertedIntervals();
    setActiveNotes(intervals.map(i => (rootIndex + i) % 12));

    const noteNames = intervals.map(i => intervalToNote(i));
    playPianoChord(noteNames, "2n");

    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveNotes([]);
    setIsPlaying(false);
  }, [isPlaying, rootIndex, getInvertedIntervals]);

  const playArpeggio = useCallback(async () => {
    if (isPlaying) return;

    // Initialize piano if needed
    if (!isPianoLoaded()) {
      await initPiano();
    }

    setIsPlaying(true);

    const intervals = getInvertedIntervals();

    for (const semitone of intervals) {
      setActiveNotes([(rootIndex + semitone) % 12]);
      const noteName = intervalToNote(semitone);
      playPianoNote(noteName, "8n");
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setActiveNotes([]);
    setIsPlaying(false);
  }, [isPlaying, rootIndex, getInvertedIntervals]);

  const getNoteName = (semitone: number) => {
    return ROOT_NOTES[(rootIndex + semitone) % 12];
  };

  const intervals = getInvertedIntervals();
  const chordNotes = intervals.map(i => (rootIndex + i) % 12);

  // Check if a note has a black key after it
  const hasBlackKeyAfter = (noteIndex: number) => {
    return [0, 2, 5, 7, 9].includes(noteIndex);
  };

  // White keys to display (one octave)
  const whiteKeyNotes = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chord Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Root note selector */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-center">Root Note</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {ROOT_NOTES.map((note) => (
              <Button
                key={note}
                size="sm"
                variant={rootNote === note ? "primary" : "outline"}
                onClick={() => setRootNote(note)}
                className="w-10"
              >
                {note}
              </Button>
            ))}
          </div>
        </div>

        {/* Chord type selector */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-center">Chord Type</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {CHORDS.map((chord) => (
              <Button
                key={chord.name}
                size="sm"
                variant={currentChord.name === chord.name ? "primary" : "outline"}
                onClick={() => {
                  setCurrentChord(chord);
                  if (chord.intervals.length < 4 && inversion === "third") {
                    setInversion("second");
                  }
                  if (chord.intervals.length < 3 && inversion !== "root") {
                    setInversion("root");
                  }
                }}
              >
                {rootNote}{chord.symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Chord info */}
        <div className="text-center bg-muted/30 rounded-lg p-4">
          <h3 className="text-xl font-bold">{rootNote}{currentChord.symbol}</h3>
          <p className="text-muted-foreground text-sm">{currentChord.description}</p>
          <p className="text-sm mt-2">
            Notes: {intervals.map(i => getNoteName(i)).join(" - ")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Intervals: {currentChord.intervals.map((i, idx) => {
              if (i === 0) return "R";
              if (i === 2) return "M2";
              if (i === 3) return "m3";
              if (i === 4) return "M3";
              if (i === 5) return "P4";
              if (i === 6) return "d5";
              if (i === 7) return "P5";
              if (i === 8) return "A5";
              if (i === 10) return "m7";
              if (i === 11) return "M7";
              if (i === 14) return "9";
              return i;
            }).join(" - ")}
          </p>
        </div>

        {/* Inversion selector */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Inversion:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={inversion === "root" ? "primary" : "outline"}
              onClick={() => setInversion("root")}
            >
              Root
            </Button>
            <Button
              size="sm"
              variant={inversion === "first" ? "primary" : "outline"}
              onClick={() => setInversion("first")}
              disabled={currentChord.intervals.length < 3}
            >
              1st
            </Button>
            <Button
              size="sm"
              variant={inversion === "second" ? "primary" : "outline"}
              onClick={() => setInversion("second")}
              disabled={currentChord.intervals.length < 3}
            >
              2nd
            </Button>
            {currentChord.intervals.length >= 4 && (
              <Button
                size="sm"
                variant={inversion === "third" ? "primary" : "outline"}
                onClick={() => setInversion("third")}
              >
                3rd
              </Button>
            )}
          </div>
        </div>

        {/* Piano visualization */}
        <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
          <div className="flex justify-center">
            <div className="relative flex">
              {whiteKeyNotes.map((noteIndex, idx) => {
                const isInChord = chordNotes.includes(noteIndex);
                const isActive = activeNotes.includes(noteIndex);
                const blackKeyIndex = noteIndex + 1;
                const blackKeyInChord = chordNotes.includes(blackKeyIndex);
                const blackKeyActive = activeNotes.includes(blackKeyIndex);

                return (
                  <div key={idx} className="relative">
                    {/* White key */}
                    <div
                      className={`w-10 h-32 border border-gray-300 rounded-b cursor-pointer transition-colors ${
                        isActive ? "bg-primary" : isInChord ? "bg-primary/30" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium ${isActive ? "text-white" : "text-gray-600"}`}>
                        {ROOT_NOTES[noteIndex]}
                      </div>
                    </div>
                    {/* Black key (if applicable) */}
                    {hasBlackKeyAfter(noteIndex) && idx < whiteKeyNotes.length - 1 && (
                      <div
                        className={`absolute top-0 w-6 h-20 rounded-b cursor-pointer transition-colors z-10 ${
                          blackKeyActive ? "bg-primary" : blackKeyInChord ? "bg-primary/70" : "bg-gray-900 hover:bg-gray-700"
                        }`}
                        style={{ left: "27px" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Play buttons */}
        <div className="flex gap-2 justify-center">
          <Button onClick={playChord} disabled={isPlaying}>
            <Volume2 className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Chord"}
          </Button>
          <Button onClick={playArpeggio} disabled={isPlaying} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Arpeggio
          </Button>
        </div>

        {/* Chord theory tips */}
        <div className="bg-muted/20 rounded-lg p-4 text-sm">
          <h4 className="font-medium mb-2">Chord Construction</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Major = Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones)</li>
            <li>• Minor = Root + Minor 3rd (3 semitones) + Perfect 5th (7 semitones)</li>
            <li>• Inversions move the bottom note(s) up an octave</li>
            <li>• Practice all inversions to improve chord transitions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
