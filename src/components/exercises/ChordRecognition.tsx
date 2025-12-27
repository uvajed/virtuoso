"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Play, Volume2 } from "lucide-react";

const CHORD_TYPES = [
  { name: "Major", intervals: [0, 4, 7], description: "Happy, bright" },
  { name: "Minor", intervals: [0, 3, 7], description: "Sad, dark" },
  { name: "Diminished", intervals: [0, 3, 6], description: "Tense, unstable" },
  { name: "Augmented", intervals: [0, 4, 8], description: "Mysterious" },
  { name: "Major 7th", intervals: [0, 4, 7, 11], description: "Jazzy, smooth" },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], description: "Mellow" },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10], description: "Bluesy" },
  { name: "Sus4", intervals: [0, 5, 7], description: "Open, unresolved" },
];

const ROOT_FREQUENCIES: Record<string, number> = {
  C: 261.63, D: 293.66, E: 329.63, F: 349.23,
  G: 392.00, A: 440.00, B: 493.88,
};

const ROOTS = Object.keys(ROOT_FREQUENCIES);

interface Question {
  root: string;
  chordType: typeof CHORD_TYPES[number];
}

function generateQuestion(): Question {
  const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
  const chordType = CHORD_TYPES[Math.floor(Math.random() * CHORD_TYPES.length)];
  return { root, chordType };
}

export function ChordRecognition() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChord = useCallback(async (arpeggiate: boolean = false) => {
    if (isPlaying) return;
    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const rootFreq = ROOT_FREQUENCIES[question.root];

    const playNote = (freq: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    const duration = arpeggiate ? 0.4 : 1.5;

    question.chordType.intervals.forEach((interval, i) => {
      const freq = rootFreq * Math.pow(2, interval / 12);
      const startTime = arpeggiate ? now + i * 0.3 : now;
      playNote(freq, startTime, duration);
    });

    const totalDuration = arpeggiate
      ? 300 * question.chordType.intervals.length + 400
      : 1500;

    setTimeout(() => setIsPlaying(false), totalDuration);
  }, [question, isPlaying]);

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
          <CardTitle>Chord Recognition</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Listen to the chord and identify its type:
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => playChord(false)} disabled={isPlaying} size="lg">
              <Volume2 className="h-5 w-5 mr-2" />
              Play Together
            </Button>
            <Button onClick={() => playChord(true)} disabled={isPlaying} variant="outline" size="lg">
              <Play className="h-5 w-5 mr-2" />
              Play Arpeggiated
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Root note: {question.root}</p>
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
                className={`h-auto py-3 ${className}`}
                onClick={() => !showResult && checkAnswer(chord.name)}
                disabled={showResult}
              >
                <div className="text-center">
                  <div className="font-medium">{chord.name}</div>
                  <div className="text-xs opacity-70">{chord.description}</div>
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
