"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { trackExerciseComplete } from "@/lib/progress";

const NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const ACCIDENTALS = ["", "#", "b"];

interface Question {
  note: string;
  clef: "treble" | "bass";
  position: number;
}

/*
 * MUSIC STAFF NOTE REFERENCE (verified from music theory sources)
 *
 * TREBLE CLEF (G Clef) - The curl wraps around the G line (2nd line from bottom)
 *   Lines (bottom to top): E - G - B - D - F  ("Every Good Boy Does Fine")
 *   Spaces (bottom to top): F - A - C - E     ("FACE")
 *
 * BASS CLEF (F Clef) - The two dots surround the F line (2nd line from top)
 *   Lines (bottom to top): G - B - D - F - A  ("Good Boys Do Fine Always")
 *   Spaces (bottom to top): A - C - E - G     ("All Cows Eat Grass")
 *
 * Staff has 5 lines, numbered 1-5 from bottom to top
 * Line 1 = bottom, Line 5 = top
 * Spaces are between lines: Space 1 is between Line 1 and Line 2, etc.
 */

// Treble clef: EGBDF on lines, FACE in spaces
const TREBLE_NOTES = [
  { note: "E", staffPosition: 1, isLine: true },   // Line 1 (bottom)
  { note: "F", staffPosition: 1, isLine: false },  // Space 1
  { note: "G", staffPosition: 2, isLine: true },   // Line 2 (G line - clef curls here)
  { note: "A", staffPosition: 2, isLine: false },  // Space 2
  { note: "B", staffPosition: 3, isLine: true },   // Line 3 (middle)
  { note: "C", staffPosition: 3, isLine: false },  // Space 3
  { note: "D", staffPosition: 4, isLine: true },   // Line 4
  { note: "E", staffPosition: 4, isLine: false },  // Space 4
  { note: "F", staffPosition: 5, isLine: true },   // Line 5 (top)
];

// Bass clef: GBDFA on lines, ACEG in spaces
const BASS_NOTES = [
  { note: "G", staffPosition: 1, isLine: true },   // Line 1 (bottom)
  { note: "A", staffPosition: 1, isLine: false },  // Space 1
  { note: "B", staffPosition: 2, isLine: true },   // Line 2
  { note: "C", staffPosition: 2, isLine: false },  // Space 2
  { note: "D", staffPosition: 3, isLine: true },   // Line 3 (middle)
  { note: "E", staffPosition: 3, isLine: false },  // Space 3
  { note: "F", staffPosition: 4, isLine: true },   // Line 4 (F line - clef dots here)
  { note: "G", staffPosition: 4, isLine: false },  // Space 4
  { note: "A", staffPosition: 5, isLine: true },   // Line 5 (top)
];

interface NoteData {
  note: string;
  staffPosition: number;
  isLine: boolean;
}

function generateQuestion(): Question {
  const clef = Math.random() > 0.5 ? "treble" : "bass";
  const notes = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
  const randomNote = notes[Math.floor(Math.random() * notes.length)];

  // Convert to y-position index (0-8 from bottom to top)
  // Lines are at even positions: 0, 2, 4, 6, 8
  // Spaces are at odd positions: 1, 3, 5, 7
  const positionIndex = (randomNote.staffPosition - 1) * 2 + (randomNote.isLine ? 0 : 1);

  return {
    note: randomNote.note,
    clef,
    position: positionIndex,
  };
}

function StaffNote({ position, clef }: { position: number; clef: "treble" | "bass" }) {
  // Staff dimensions
  const lineSpacing = 16;  // Space between staff lines
  const staffTop = 24;     // Y position of top line
  const staffHeight = 4 * lineSpacing;  // Total height of staff
  const staffBottom = staffTop + staffHeight;  // Y position of bottom line

  // Calculate note Y position
  // position 0 = on bottom line, position 8 = on top line
  // Each increment of 1 moves up by half a line spacing
  const noteY = staffBottom - (position * (lineSpacing / 2));

  return (
    <svg width="220" height="110" className="mx-auto">
      {/* Staff lines - 5 lines from top (y=staffTop) to bottom (y=staffBottom) */}
      {[0, 1, 2, 3, 4].map((lineIndex) => (
        <line
          key={lineIndex}
          x1="20"
          y1={staffTop + lineIndex * lineSpacing}
          x2="200"
          y2={staffTop + lineIndex * lineSpacing}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}

      {/* Clef symbol */}
      {clef === "treble" ? (
        // Treble clef - the inner curl should be on line 2 (G line)
        // Line 2 from bottom = line index 3 from top = y position staffTop + 3*lineSpacing
        <text
          x="28"
          y={staffTop + 3 * lineSpacing + 8}
          fontSize="72"
          className="select-none"
        >
          𝄞
        </text>
      ) : (
        // Bass clef - the dots should be around line 4 (F line)
        // Line 4 from bottom = line index 1 from top = y position staffTop + 1*lineSpacing
        <text
          x="28"
          y={staffTop + 2.4 * lineSpacing}
          fontSize="48"
          className="select-none"
        >
          𝄢
        </text>
      )}

      {/* Note head - oval shape rotated slightly */}
      <ellipse
        cx="150"
        cy={noteY}
        rx="10"
        ry="8"
        fill="currentColor"
        transform={`rotate(-15, 150, ${noteY})`}
      />
    </svg>
  );
}

export function NoteQuiz() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);

  const checkAnswer = useCallback((note: string) => {
    setSelected(note);
    setShowResult(true);
    const isCorrect = note === question.note;
    setScore(prev => {
      const newScore = {
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      };
      // Track progress for achievements
      trackExerciseComplete("theory", isCorrect, false);
      return newScore;
    });
  }, [question.note]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelected(null);
    setShowResult(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  const isCorrect = selected === question.note;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Note Identification</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
            {score.total > 0 && (
              <span className="ml-2">
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Identify the note on the {question.clef} clef:
          </p>
          <div className="bg-muted/50 rounded-lg p-4 inline-block">
            <StaffNote position={question.position} clef={question.clef} />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {NOTES.map((note) => {
            const isSelected = selected === note;
            const isAnswer = question.note === note;

            let variant: "primary" | "outline" | "ghost" = "outline";
            let className = "";

            if (showResult) {
              if (isAnswer) {
                className = "bg-green-500 hover:bg-green-500 text-white border-green-500";
              } else if (isSelected && !isAnswer) {
                className = "bg-red-500 hover:bg-red-500 text-white border-red-500";
              }
            }

            return (
              <Button
                key={note}
                variant={variant}
                className={className}
                onClick={() => !showResult && checkAnswer(note)}
                disabled={showResult}
              >
                {note}
              </Button>
            );
          })}
        </div>

        {showResult && (
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
            isCorrect ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>The correct answer was {question.note}</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {showResult && (
            <Button onClick={nextQuestion}>
              Next Question
            </Button>
          )}
          {score.total > 0 && (
            <Button variant="outline" onClick={resetQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
