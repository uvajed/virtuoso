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

// Staff line positions (0 = bottom line, 4 = top line)
// Treble clef lines from bottom to top: E4, G4, B4, D5, F5
// Treble clef spaces from bottom to top: F4, A4, C5, E5
const TREBLE_NOTES: { note: string; line: number }[] = [
  { note: "E", line: 0 },   // Bottom line
  { note: "F", line: 0.5 }, // First space
  { note: "G", line: 1 },   // Second line
  { note: "A", line: 1.5 }, // Second space
  { note: "B", line: 2 },   // Middle line
  { note: "C", line: 2.5 }, // Third space
  { note: "D", line: 3 },   // Fourth line
  { note: "E", line: 3.5 }, // Fourth space
  { note: "F", line: 4 },   // Top line
];

// Bass clef lines from bottom to top: G2, B2, D3, F3, A3
// Bass clef spaces from bottom to top: A2, C3, E3, G3
const BASS_NOTES: { note: string; line: number }[] = [
  { note: "G", line: 0 },   // Bottom line
  { note: "A", line: 0.5 }, // First space
  { note: "B", line: 1 },   // Second line
  { note: "C", line: 1.5 }, // Second space
  { note: "D", line: 2 },   // Middle line
  { note: "E", line: 2.5 }, // Third space
  { note: "F", line: 3 },   // Fourth line
  { note: "G", line: 3.5 }, // Fourth space
  { note: "A", line: 4 },   // Top line
];

function generateQuestion(): Question {
  const clef = Math.random() > 0.5 ? "treble" : "bass";
  const notes = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
  const randomNote = notes[Math.floor(Math.random() * notes.length)];

  return {
    note: randomNote.note,
    clef,
    position: randomNote.line,
  };
}

function StaffNote({ position, clef }: { position: number; clef: "treble" | "bass" }) {
  const lineSpacing = 14;
  const staffTop = 30;
  const staffBottom = staffTop + 4 * lineSpacing; // Bottom line Y position

  // Calculate note Y: position 0 = bottom line, position 4 = top line
  // Each whole number is a line, half numbers are spaces
  const noteY = staffBottom - (position * lineSpacing);

  // Ledger lines for notes below the staff (position < 0) or above (position > 4)
  const ledgerLines: number[] = [];
  if (position < 0) {
    // Notes below the staff need ledger lines at positions 0, -1, -2, etc (lines only)
    for (let i = -1; i >= Math.floor(position); i--) {
      if (i % 1 === 0) { // Only whole numbers (lines)
        ledgerLines.push(staffBottom - (i * lineSpacing));
      }
    }
  }
  if (position > 4) {
    // Notes above the staff
    for (let i = 5; i <= Math.ceil(position); i++) {
      if (i % 1 === 0) {
        ledgerLines.push(staffBottom - (i * lineSpacing));
      }
    }
  }

  return (
    <svg width="200" height="120" className="mx-auto">
      {/* Staff lines - drawn from top to bottom */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="20"
          y1={staffTop + i * lineSpacing}
          x2="180"
          y2={staffTop + i * lineSpacing}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}

      {/* Clef symbol */}
      {clef === "treble" ? (
        // Treble clef - positioned so the curl wraps around the G line (2nd from bottom = index 3)
        <text
          x="25"
          y={staffTop + 3.35 * lineSpacing}
          fontSize="56"
          className="select-none"
          style={{ fontFamily: 'serif' }}
        >
          𝄞
        </text>
      ) : (
        // Bass clef - positioned so the dots are around the F line (2nd from top = index 1)
        <text
          x="25"
          y={staffTop + 1.5 * lineSpacing}
          fontSize="40"
          className="select-none"
          style={{ fontFamily: 'serif' }}
        >
          𝄢
        </text>
      )}

      {/* Ledger lines */}
      {ledgerLines.map((y, i) => (
        <line
          key={i}
          x1="118"
          y1={y}
          x2="158"
          y2={y}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}

      {/* Note head */}
      <ellipse
        cx="138"
        cy={noteY}
        rx="9"
        ry="7"
        fill="currentColor"
        transform={`rotate(-20, 138, ${noteY})`}
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
