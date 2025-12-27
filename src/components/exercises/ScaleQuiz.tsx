"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Volume2 } from "lucide-react";

const SCALE_TYPES = [
  { name: "Major", pattern: [0, 2, 4, 5, 7, 9, 11, 12], description: "Happy, bright sound" },
  { name: "Natural Minor", pattern: [0, 2, 3, 5, 7, 8, 10, 12], description: "Sad, dark sound" },
  { name: "Harmonic Minor", pattern: [0, 2, 3, 5, 7, 8, 11, 12], description: "Exotic, tense sound" },
  { name: "Melodic Minor", pattern: [0, 2, 3, 5, 7, 9, 11, 12], description: "Jazz-like sound" },
  { name: "Pentatonic Major", pattern: [0, 2, 4, 7, 9, 12], description: "Simple, universal" },
  { name: "Pentatonic Minor", pattern: [0, 3, 5, 7, 10, 12], description: "Blues, rock sound" },
];

const ROOT_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

interface Question {
  root: string;
  scaleType: typeof SCALE_TYPES[number];
}

function generateQuestion(): Question {
  const root = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
  const scaleType = SCALE_TYPES[Math.floor(Math.random() * SCALE_TYPES.length)];
  return { root, scaleType };
}

function PianoKeyboard({ highlightedKeys, root }: { highlightedKeys: number[]; root: string }) {
  const rootIndex = ROOT_NOTES.indexOf(root);
  const startNote = rootIndex;

  const whiteKeys = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
  const blackKeys = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];
  const blackKeyPositions = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13];

  return (
    <div className="relative h-24 w-full max-w-md mx-auto">
      {/* White keys */}
      <div className="flex h-full">
        {whiteKeys.map((note, i) => {
          const isHighlighted = highlightedKeys.includes(note);
          return (
            <div
              key={i}
              className={`flex-1 border border-gray-300 rounded-b-sm ${
                isHighlighted ? "bg-primary" : "bg-white"
              }`}
            />
          );
        })}
      </div>
      {/* Black keys */}
      <div className="absolute top-0 left-0 right-0 h-14 flex">
        {blackKeyPositions.map((pos, i) => {
          const note = blackKeys[i];
          const isHighlighted = highlightedKeys.includes(note);
          const leftPercent = (pos / 15) * 100 + 3;
          return (
            <div
              key={i}
              className={`absolute w-[5%] h-full rounded-b-sm ${
                isHighlighted ? "bg-primary" : "bg-gray-900"
              }`}
              style={{ left: `${leftPercent}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ScaleQuiz() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = useCallback((scaleName: string) => {
    setSelected(scaleName);
    setShowResult(true);
    const isCorrect = scaleName === question.scaleType.name;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [question.scaleType.name]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelected(null);
    setShowResult(false);
    setShowHint(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  const isCorrect = selected === question.scaleType.name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scale Identification</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Identify this scale starting on {question.root}:
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {showHint && `Hint: ${question.scaleType.description}`}
          </p>
          <PianoKeyboard
            highlightedKeys={question.scaleType.pattern}
            root={question.root}
          />
        </div>

        {!showHint && !showResult && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              Show Hint
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SCALE_TYPES.map((scale) => {
            const isSelected = selected === scale.name;
            const isAnswer = question.scaleType.name === scale.name;

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
                key={scale.name}
                variant="outline"
                className={className}
                onClick={() => !showResult && checkAnswer(scale.name)}
                disabled={showResult}
              >
                {scale.name}
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
                <span>Correct! {question.scaleType.description}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>It was {question.scaleType.name} - {question.scaleType.description}</span>
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
