"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NATURAL_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

// Standard tuning: E A D G B E (low to high)
const STRING_NOTES = ["E", "A", "D", "G", "B", "E"];
const STRING_NAMES = ["6th (Low E)", "5th (A)", "4th (D)", "3rd (G)", "2nd (B)", "1st (High E)"];

function getNoteAtFret(stringNote: string, fret: number): string {
  const startIndex = NOTES.indexOf(stringNote);
  return NOTES[(startIndex + fret) % 12];
}

interface Question {
  string: number;
  fret: number;
  note: string;
}

function generateQuestion(): Question {
  const string = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * 12) + 1; // frets 1-12
  const note = getNoteAtFret(STRING_NOTES[string], fret);
  return { string, fret, note };
}

function Fretboard({ highlightString, highlightFret }: { highlightString: number; highlightFret: number }) {
  const frets = 12;
  const strings = 6;

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 600 120" className="w-full max-w-2xl mx-auto">
        {/* Nut */}
        <rect x="45" y="10" width="4" height="100" fill="currentColor" opacity="0.8" />

        {/* Frets */}
        {Array.from({ length: frets }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={50 + (i + 1) * 45}
            y1="10"
            x2={50 + (i + 1) * 45}
            y2="110"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}

        {/* Fret numbers */}
        {Array.from({ length: frets }).map((_, i) => (
          <text
            key={`fret-num-${i}`}
            x={50 + (i + 0.5) * 45}
            y="125"
            textAnchor="middle"
            fontSize="10"
            className="fill-muted-foreground"
          >
            {i + 1}
          </text>
        ))}

        {/* Fret markers */}
        {[3, 5, 7, 9, 12].map((fret) => (
          <circle
            key={`marker-${fret}`}
            cx={50 + (fret - 0.5) * 45}
            cy={fret === 12 ? 40 : 60}
            r="4"
            className="fill-muted-foreground"
            opacity="0.3"
          />
        ))}
        {/* Double dot at 12th fret */}
        <circle cx={50 + 11.5 * 45} cy={80} r="4" className="fill-muted-foreground" opacity="0.3" />

        {/* Strings */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1="45"
            y1={20 + i * 18}
            x2={50 + frets * 45}
            y2={20 + i * 18}
            stroke="currentColor"
            strokeWidth={1 + (5 - i) * 0.3}
            opacity="0.5"
          />
        ))}

        {/* String labels */}
        {STRING_NOTES.map((note, i) => (
          <text
            key={`string-label-${i}`}
            x="25"
            y={24 + i * 18}
            textAnchor="middle"
            fontSize="12"
            className="fill-muted-foreground font-medium"
          >
            {note}
          </text>
        ))}

        {/* Highlight */}
        <circle
          cx={50 + (highlightFret - 0.5) * 45}
          cy={20 + highlightString * 18}
          r="12"
          className="fill-primary"
        />
        <text
          x={50 + (highlightFret - 0.5) * 45}
          y={25 + highlightString * 18}
          textAnchor="middle"
          fontSize="10"
          className="fill-primary-foreground font-bold"
        >
          ?
        </text>
      </svg>
    </div>
  );
}

export function FretboardTrainer() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [useNaturalOnly, setUseNaturalOnly] = useState(false);

  const checkAnswer = useCallback((note: string) => {
    setSelected(note);
    setShowResult(true);
    const isCorrect = note === question.note;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [question.note]);

  const nextQuestion = useCallback(() => {
    let newQuestion: Question;
    do {
      newQuestion = generateQuestion();
    } while (useNaturalOnly && newQuestion.note.includes("#"));
    setQuestion(newQuestion);
    setSelected(null);
    setShowResult(false);
  }, [useNaturalOnly]);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  const toggleNaturalOnly = useCallback(() => {
    setUseNaturalOnly(prev => !prev);
    setScore({ correct: 0, total: 0 });
  }, []);

  const isCorrect = selected === question.note;
  const noteOptions = useNaturalOnly ? NATURAL_NOTES : NOTES;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fretboard Trainer</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant={useNaturalOnly ? "outline" : "primary"}
            onClick={toggleNaturalOnly}
          >
            All Notes
          </Button>
          <Button
            size="sm"
            variant={useNaturalOnly ? "primary" : "outline"}
            onClick={toggleNaturalOnly}
          >
            Natural Only
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            What note is at fret {question.fret} on the {STRING_NAMES[question.string]}?
          </p>
        </div>

        <Fretboard highlightString={question.string} highlightFret={question.fret} />

        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {noteOptions.map((note) => {
            const isSelected = selected === note;
            const isAnswer = question.note === note;

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
                variant="outline"
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
                <span>The note is {question.note}</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {showResult && <Button onClick={nextQuestion}>Next Question</Button>}
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
