"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const CHORD_TYPES = [
  { name: "Major", symbol: "", intervals: [0, 4, 7], description: "Happy, stable" },
  { name: "Minor", symbol: "m", intervals: [0, 3, 7], description: "Sad, dark" },
  { name: "Diminished", symbol: "dim", intervals: [0, 3, 6], description: "Tense, unstable" },
  { name: "Augmented", symbol: "aug", intervals: [0, 4, 8], description: "Mysterious, dreamy" },
  { name: "Major 7th", symbol: "maj7", intervals: [0, 4, 7, 11], description: "Jazzy, smooth" },
  { name: "Minor 7th", symbol: "m7", intervals: [0, 3, 7, 10], description: "Mellow, soulful" },
  { name: "Dominant 7th", symbol: "7", intervals: [0, 4, 7, 10], description: "Bluesy, wants to resolve" },
  { name: "Suspended 4th", symbol: "sus4", intervals: [0, 5, 7], description: "Open, unresolved" },
];

const ROOT_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

interface Question {
  root: string;
  chordType: typeof CHORD_TYPES[number];
}

function generateQuestion(): Question {
  const root = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
  const chordType = CHORD_TYPES[Math.floor(Math.random() * CHORD_TYPES.length)];
  return { root, chordType };
}

function ChordDiagram({ intervals }: { intervals: number[] }) {
  const allNotes = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex justify-center gap-1">
      {allNotes.map((note) => {
        const isInChord = intervals.includes(note);
        const isRoot = note === 0;

        return (
          <div
            key={note}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              isRoot
                ? "bg-primary text-primary-foreground"
                : isInChord
                ? "bg-primary/60 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {note}
          </div>
        );
      })}
    </div>
  );
}

function PianoChord({ intervals }: { intervals: number[] }) {
  const keys = Array.from({ length: 13 }, (_, i) => i);
  const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11, 12];
  const blackKeyIndices = [1, 3, 6, 8, 10];

  return (
    <div className="relative h-20 w-64 mx-auto">
      {/* White keys */}
      <div className="flex h-full">
        {whiteKeyIndices.map((note, i) => {
          const isInChord = intervals.includes(note % 12) || (note === 12 && intervals.includes(0));
          return (
            <div
              key={i}
              className={`flex-1 border border-gray-300 rounded-b-sm transition-colors ${
                isInChord ? "bg-primary" : "bg-white"
              }`}
            />
          );
        })}
      </div>
      {/* Black keys */}
      {[1, 2, 4, 5, 6].map((pos, i) => {
        const note = blackKeyIndices[i];
        const isInChord = intervals.includes(note);
        const leftPercent = (pos / 8) * 100 + 6;
        return (
          <div
            key={i}
            className={`absolute top-0 w-[10%] h-12 rounded-b-sm transition-colors ${
              isInChord ? "bg-primary" : "bg-gray-900"
            }`}
            style={{ left: `${leftPercent}%` }}
          />
        );
      })}
    </div>
  );
}

export function ChordQuiz() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);

  const checkAnswer = useCallback((chordName: string) => {
    setSelected(chordName);
    setShowResult(true);
    const isCorrect = chordName === question.chordType.name;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [question.chordType.name]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelected(null);
    setShowResult(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  const isCorrect = selected === question.chordType.name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chord Identification</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            What type of chord is {question.root}{question.chordType.symbol}?
          </p>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="text-2xl font-bold mb-4">
              {question.root}{question.chordType.symbol}
            </p>
            <PianoChord intervals={question.chordType.intervals} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CHORD_TYPES.map((chord) => {
            const isSelected = selected === chord.name;
            const isAnswer = question.chordType.name === chord.name;

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
                key={chord.name}
                variant="outline"
                className={`h-auto py-2 ${className}`}
                onClick={() => !showResult && checkAnswer(chord.name)}
                disabled={showResult}
              >
                <div className="text-center">
                  <div className="font-medium">{chord.name}</div>
                  <div className="text-xs opacity-70">{chord.symbol || "—"}</div>
                </div>
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
                <span>Correct! {question.chordType.description}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>It was {question.chordType.name} - {question.chordType.description}</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {showResult && (
            <Button onClick={nextQuestion}>Next Question</Button>
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
