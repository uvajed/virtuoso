"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Volume2, Play } from "lucide-react";

const INTERVALS = [
  { name: "Minor 2nd", semitones: 1, description: "Jaws theme" },
  { name: "Major 2nd", semitones: 2, description: "Happy Birthday (1st 2 notes)" },
  { name: "Minor 3rd", semitones: 3, description: "Greensleeves" },
  { name: "Major 3rd", semitones: 4, description: "Oh When The Saints" },
  { name: "Perfect 4th", semitones: 5, description: "Here Comes The Bride" },
  { name: "Tritone", semitones: 6, description: "The Simpsons" },
  { name: "Perfect 5th", semitones: 7, description: "Star Wars" },
  { name: "Minor 6th", semitones: 8, description: "The Entertainer" },
  { name: "Major 6th", semitones: 9, description: "NBC theme" },
  { name: "Minor 7th", semitones: 10, description: "Star Trek theme" },
  { name: "Major 7th", semitones: 11, description: "Take On Me" },
  { name: "Octave", semitones: 12, description: "Somewhere Over The Rainbow" },
];

const BASE_FREQUENCIES: Record<string, number> = {
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13,
  E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.00,
  "G#4": 415.30, A4: 440.00, "A#4": 466.16, B4: 493.88,
};

interface Question {
  interval: typeof INTERVALS[number];
  baseNote: string;
  direction: "ascending" | "descending";
}

function generateQuestion(): Question {
  const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
  const notes = Object.keys(BASE_FREQUENCIES);
  const baseNote = notes[Math.floor(Math.random() * notes.length)];
  const direction = Math.random() > 0.5 ? "ascending" : "descending";
  return { interval, baseNote, direction };
}

export function IntervalTrainer() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playInterval = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const baseFreq = BASE_FREQUENCIES[question.baseNote];
    const ratio = Math.pow(2, question.interval.semitones / 12);
    const secondFreq = question.direction === "ascending"
      ? baseFreq * ratio
      : baseFreq / ratio;

    const playNote = (freq: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(baseFreq, now, 0.8);
    playNote(secondFreq, now + 0.9, 0.8);

    setTimeout(() => setIsPlaying(false), 1800);
  }, [question, isPlaying]);

  const playTogether = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const baseFreq = BASE_FREQUENCIES[question.baseNote];
    const ratio = Math.pow(2, question.interval.semitones / 12);
    const secondFreq = question.direction === "ascending"
      ? baseFreq * ratio
      : baseFreq / ratio;

    const playNote = (freq: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(baseFreq, now, 1.2);
    playNote(secondFreq, now, 1.2);

    setTimeout(() => setIsPlaying(false), 1200);
  }, [question, isPlaying]);

  const checkAnswer = useCallback((intervalName: string) => {
    setSelected(intervalName);
    setShowResult(true);
    const isCorrect = intervalName === question.interval.name;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [question.interval.name]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelected(null);
    setShowResult(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  const isCorrect = selected === question.interval.name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interval Recognition</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Listen to the interval and identify it:
          </p>

          <div className="flex gap-2 justify-center">
            <Button
              onClick={playInterval}
              disabled={isPlaying}
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Play Melodic
            </Button>
            <Button
              onClick={playTogether}
              disabled={isPlaying}
              variant="outline"
              size="lg"
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Play Harmonic
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Direction: {question.direction}
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {INTERVALS.map((interval) => {
            const isSelected = selected === interval.name;
            const isAnswer = question.interval.name === interval.name;

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
                key={interval.name}
                variant="outline"
                className={`h-auto py-2 text-sm ${className}`}
                onClick={() => !showResult && checkAnswer(interval.name)}
                disabled={showResult}
              >
                {interval.name}
              </Button>
            );
          })}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg ${
            isCorrect ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
          }`}>
            <div className="flex items-center justify-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>It was {question.interval.name}</span>
                </>
              )}
            </div>
            <p className="text-center text-sm mt-2 opacity-80">
              Remember: {question.interval.description}
            </p>
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
