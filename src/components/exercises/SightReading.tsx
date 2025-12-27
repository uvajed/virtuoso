"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Play } from "lucide-react";

const NATURAL_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Treble clef note positions (0 = bottom line E4, each step = half line spacing)
// Lines (bottom to top): E4, G4, B4, D5, F5
// Spaces: F4, A4, C5, E5
// Sharps/flats share position with their natural note
const NOTE_POSITIONS: Record<string, number> = {
  // Octave 4
  C4: -2, "C#4": -2, "Db4": -2,
  D4: -1, "D#4": -1, "Eb4": -1,
  E4: 0,
  F4: 1, "F#4": 1, "Gb4": 1,
  G4: 2, "G#4": 2, "Ab4": 2,
  A4: 3, "A#4": 3, "Bb4": 3,
  B4: 4,
  // Octave 5
  C5: 5, "C#5": 5, "Db5": 5,
  D5: 6, "D#5": 6, "Eb5": 6,
  E5: 7,
  F5: 8, "F#5": 8, "Gb5": 8,
  G5: 9, "G#5": 9, "Ab5": 9,
};

const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 4
  C4: 261.63, "C#4": 277.18, "Db4": 277.18,
  D4: 293.66, "D#4": 311.13, "Eb4": 311.13,
  E4: 329.63,
  F4: 349.23, "F#4": 369.99, "Gb4": 369.99,
  G4: 392.00, "G#4": 415.30, "Ab4": 415.30,
  A4: 440.00, "A#4": 466.16, "Bb4": 466.16,
  B4: 493.88,
  // Octave 5
  C5: 523.25, "C#5": 554.37, "Db5": 554.37,
  D5: 587.33, "D#5": 622.25, "Eb5": 622.25,
  E5: 659.25,
  F5: 698.46, "F#5": 739.99, "Gb5": 739.99,
  G5: 783.99, "G#5": 830.61, "Ab5": 830.61,
};

// Mapping keyboard keys to notes (naturals with shift for sharps)
const KEYBOARD_MAP: Record<string, string> = {
  a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4", j: "B4",
  k: "C5", l: "D5", ";": "E5",
  // Shifted keys for sharps
  A: "C#4", S: "D#4", F: "F#4", G: "G#4", H: "A#4",
  K: "C#5", L: "D#5",
};

// Helper to get accidental symbol
function getAccidental(note: string): string | null {
  if (note.includes("#")) return "♯";
  if (note.includes("b")) return "♭";
  return null;
}

// Helper to get the base note name without octave
function getNoteName(note: string): string {
  return note.replace(/[0-9]/g, "");
}

// Notes available for each mode
const NATURAL_NOTE_LIST = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5"];
const CHROMATIC_NOTE_LIST = [
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5"
];

function generateSequence(length: number, includeAccidentals: boolean = false): string[] {
  const noteList = includeAccidentals ? CHROMATIC_NOTE_LIST : NATURAL_NOTE_LIST;
  const sequence: string[] = [];

  for (let i = 0; i < length; i++) {
    if (sequence.length > 0 && Math.random() > 0.3) {
      // Prefer stepwise motion
      const lastIndex = noteList.indexOf(sequence[sequence.length - 1]);
      if (lastIndex !== -1) {
        const step = Math.random() > 0.5 ? 1 : -1;
        const newIndex = Math.max(0, Math.min(noteList.length - 1, lastIndex + step));
        sequence.push(noteList[newIndex]);
      } else {
        sequence.push(noteList[Math.floor(Math.random() * noteList.length)]);
      }
    } else {
      sequence.push(noteList[Math.floor(Math.random() * noteList.length)]);
    }
  }

  return sequence;
}

function StaffWithNotes({ notes, currentIndex, results }: {
  notes: string[];
  currentIndex: number;
  results: (boolean | null)[];
}) {
  const lineSpacing = 10;
  const noteSpacing = 50;
  const staffTop = 30;

  return (
    <svg viewBox={`0 0 ${Math.max(300, notes.length * noteSpacing + 80)} 100`} className="w-full max-w-2xl mx-auto">
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="20"
          y1={staffTop + i * lineSpacing}
          x2={notes.length * noteSpacing + 60}
          y2={staffTop + i * lineSpacing}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}

      {/* Treble clef */}
      <text x="30" y={staffTop + 32} fontSize="40" className="select-none fill-current">
        𝄞
      </text>

      {/* Notes */}
      {notes.map((note, i) => {
        const pos = NOTE_POSITIONS[note];
        // E4 is on the first ledger line below, F4 is in the first space, etc.
        const y = staffTop + 40 - (pos * lineSpacing / 2);

        const isActive = i === currentIndex;
        const result = results[i];

        let fillColor = "currentColor";
        if (result === true) fillColor = "#22c55e";
        else if (result === false) fillColor = "#ef4444";
        else if (isActive) fillColor = "hsl(var(--primary))";

        // Ledger lines for notes below staff (C4 at pos -2)
        const ledgerLines = [];
        if (pos <= -2) {
          // C4 needs ledger line at position -2
          for (let l = -2; l >= pos; l -= 2) {
            ledgerLines.push(staffTop + 40 - (l * lineSpacing / 2));
          }
        }
        // Ledger lines for notes above staff (G5 at pos 9, etc.)
        if (pos >= 10) {
          for (let l = 10; l <= pos; l += 2) {
            ledgerLines.push(staffTop + 40 - (l * lineSpacing / 2));
          }
        }

        return (
          <g key={i}>
            {/* Ledger lines */}
            {ledgerLines.map((ly, li) => (
              <line
                key={li}
                x1={65 + i * noteSpacing - 12}
                y1={ly}
                x2={65 + i * noteSpacing + 12}
                y2={ly}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            {/* Accidental */}
            {getAccidental(note) && (
              <text
                x={65 + i * noteSpacing - 16}
                y={y + 4}
                fontSize="14"
                fill={fillColor}
                className="select-none"
              >
                {getAccidental(note)}
              </text>
            )}
            {/* Note */}
            <ellipse
              cx={65 + i * noteSpacing}
              cy={y}
              rx="7"
              ry="5"
              fill={fillColor}
              transform={`rotate(-15, ${65 + i * noteSpacing}, ${y})`}
            />
            {isActive && (
              <circle
                cx={65 + i * noteSpacing}
                cy={y + 20}
                r="3"
                fill="hsl(var(--primary))"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SightReading() {
  const [difficulty, setDifficulty] = useState<4 | 6 | 8>(4);
  const [includeAccidentals, setIncludeAccidentals] = useState(false);
  const [notes, setNotes] = useState<string[]>(() => generateSequence(4, false));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNote = useCallback((note: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  }, []);

  const handleNoteInput = useCallback((inputNote: string) => {
    if (isComplete) return;

    const expectedNote = notes[currentIndex];
    const noteName = inputNote.replace(/[0-9]/g, "");
    const expectedName = expectedNote.replace(/[0-9]/g, "");

    const isCorrect = noteName === expectedName;

    playNote(inputNote);

    setResults(prev => {
      const newResults = [...prev];
      newResults[currentIndex] = isCorrect;
      return newResults;
    });

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }

    if (currentIndex === notes.length - 1) {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, notes, isComplete, playNote]);

  const nextSequence = useCallback(() => {
    setNotes(generateSequence(difficulty, includeAccidentals));
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
  }, [difficulty, includeAccidentals]);

  const changeDifficulty = useCallback((newDiff: 4 | 6 | 8) => {
    setDifficulty(newDiff);
    setNotes(generateSequence(newDiff, includeAccidentals));
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
    setScore({ correct: 0, total: 0 });
  }, [includeAccidentals]);

  const toggleAccidentals = useCallback((enabled: boolean) => {
    setIncludeAccidentals(enabled);
    setNotes(generateSequence(difficulty, enabled));
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
    setScore({ correct: 0, total: 0 });
  }, [difficulty]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for shifted key first (for sharps), then lowercase
      const note = KEYBOARD_MAP[e.key] || KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) {
        e.preventDefault();
        handleNoteInput(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNoteInput]);

  const correctCount = results.filter(r => r === true).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sight Reading</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total > 0 ? score.total * difficulty : difficulty}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty & Mode */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notes:</span>
            {([4, 6, 8] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={difficulty === d ? "primary" : "outline"}
                onClick={() => changeDifficulty(d)}
              >
                {d}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Accidentals:</span>
            <Button
              size="sm"
              variant={!includeAccidentals ? "primary" : "outline"}
              onClick={() => toggleAccidentals(false)}
            >
              Off
            </Button>
            <Button
              size="sm"
              variant={includeAccidentals ? "primary" : "outline"}
              onClick={() => toggleAccidentals(true)}
            >
              ♯/♭
            </Button>
          </div>
        </div>

        {/* Staff */}
        <div className="bg-muted/30 rounded-lg p-4">
          <StaffWithNotes notes={notes} currentIndex={currentIndex} results={results} />
        </div>

        {/* Instructions */}
        {!isComplete && (
          <p className="text-center text-sm text-muted-foreground">
            Play note {currentIndex + 1} of {notes.length} using keyboard (A-L{includeAccidentals ? ", Shift+key for ♯" : ""}) or buttons below
          </p>
        )}

        {/* Note buttons */}
        {!isComplete && (
          <div className="space-y-2">
            {/* Natural notes */}
            <div className="grid grid-cols-7 gap-2">
              {NATURAL_NOTES.map((note) => (
                <Button
                  key={note}
                  variant="outline"
                  onClick={() => handleNoteInput(note + "4")}
                  className="text-lg font-medium"
                >
                  {note}
                </Button>
              ))}
            </div>
            {/* Sharp notes - only show when accidentals enabled */}
            {includeAccidentals && (
              <div className="grid grid-cols-7 gap-2">
                {["C#", "D#", "", "F#", "G#", "A#", ""].map((note, i) => (
                  note ? (
                    <Button
                      key={note}
                      variant="outline"
                      onClick={() => handleNoteInput(note + "4")}
                      className="text-base font-medium"
                    >
                      {note.replace("#", "♯")}
                    </Button>
                  ) : (
                    <div key={`empty-${i}`} />
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {isComplete && (
          <>
            <div className={`text-center p-4 rounded-lg ${
              correctCount === notes.length
                ? "bg-green-500/10 text-green-600"
                : correctCount >= notes.length / 2
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-red-500/10 text-red-600"
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {correctCount === notes.length ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {correctCount}/{notes.length} correct
                </span>
              </div>
              <p className="text-sm">
                {correctCount === notes.length
                  ? "Perfect!"
                  : `Correct notes: ${notes.filter((_, i) => results[i]).join(", ") || "None"}`}
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={nextSequence}>
                Next Sequence
              </Button>
              <Button variant="outline" onClick={() => {
                setScore({ correct: 0, total: 0 });
                nextSequence();
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
