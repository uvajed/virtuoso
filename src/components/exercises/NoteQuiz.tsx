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

// Treble clef: Lines from bottom to top are E4, G4, B4, D5, F5
// Position 1 = bottom line (E4), position 9 = top line (F5)
const TREBLE_POSITIONS: Record<string, number> = {
  E4: 1, F4: 2, G4: 3, A4: 4, B4: 5, C5: 6, D5: 7, E5: 8, F5: 9,
};

// Bass clef: Lines from bottom to top are G2, B2, D3, F3, A3
// Position 1 = bottom line (G2), position 9 = top line (A3)
const BASS_POSITIONS: Record<string, number> = {
  G2: 1, A2: 2, B2: 3, C3: 4, D3: 5, E3: 6, F3: 7, G3: 8, A3: 9,
};

function generateQuestion(): Question {
  const clef = Math.random() > 0.5 ? "treble" : "bass";
  const positions = clef === "treble" ? TREBLE_POSITIONS : BASS_POSITIONS;
  const notes = Object.keys(positions);
  const randomNote = notes[Math.floor(Math.random() * notes.length)];

  return {
    note: randomNote[0],
    clef,
    position: positions[randomNote],
  };
}

function StaffNote({ position, clef }: { position: number; clef: "treble" | "bass" }) {
  const lineSpacing = 12;
  const staffTop = 20;
  const noteY = staffTop + (9 - position) * (lineSpacing / 2);

  // Ledger lines for notes outside the staff
  const ledgerLines = [];
  if (position < 1) {
    for (let i = 1; i >= position; i -= 2) {
      ledgerLines.push(staffTop + (9 - i) * (lineSpacing / 2));
    }
  }
  if (position > 9) {
    for (let i = 11; i <= position; i += 2) {
      ledgerLines.push(staffTop + (9 - i) * (lineSpacing / 2));
    }
  }

  return (
    <svg width="200" height="120" className="mx-auto">
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="20"
          y1={staffTop + i * lineSpacing}
          x2="180"
          y2={staffTop + i * lineSpacing}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}

      {/* Clef */}
      <text x="30" y={staffTop + 36} fontSize="48" className="select-none">
        {clef === "treble" ? "𝄞" : "𝄢"}
      </text>

      {/* Ledger lines */}
      {ledgerLines.map((y, i) => (
        <line
          key={i}
          x1="115"
          y1={y}
          x2="155"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}

      {/* Note */}
      <ellipse
        cx="135"
        cy={noteY}
        rx="8"
        ry="6"
        fill="currentColor"
        transform={`rotate(-15, 135, ${noteY})`}
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
