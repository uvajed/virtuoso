"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Play, RotateCcw, Trash2 } from "lucide-react";

const NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const NOTE_FREQUENCIES: Record<string, number> = {
  C: 261.63, D: 293.66, E: 329.63, F: 349.23,
  G: 392.00, A: 440.00, B: 493.88, C5: 523.25,
};

function generateMelody(length: number): string[] {
  const melody: string[] = [];
  const notes = [...NOTES, "C5"];

  for (let i = 0; i < length; i++) {
    // Prefer stepwise motion
    if (melody.length > 0 && Math.random() > 0.3) {
      const lastIndex = notes.indexOf(melody[melody.length - 1]);
      const step = Math.random() > 0.5 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(notes.length - 1, lastIndex + step));
      melody.push(notes[newIndex]);
    } else {
      melody.push(notes[Math.floor(Math.random() * notes.length)]);
    }
  }

  return melody;
}

export function MelodyDictation() {
  const [difficulty, setDifficulty] = useState<3 | 4 | 5 | 6>(4);
  const [melody, setMelody] = useState<string[]>(() => generateMelody(4));
  const [userMelody, setUserMelody] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playMelody = useCallback(async (notesToPlay: string[]) => {
    if (isPlaying) return;
    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    notesToPlay.forEach((note, i) => {
      const freq = NOTE_FREQUENCIES[note];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.5;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.45);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });

    setTimeout(() => setIsPlaying(false), notesToPlay.length * 500 + 100);
  }, [isPlaying]);

  const playNote = useCallback((note: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const freq = NOTE_FREQUENCIES[note];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  }, []);

  const addNote = useCallback((note: string) => {
    if (showResult || userMelody.length >= melody.length) return;
    playNote(note);
    setUserMelody(prev => [...prev, note]);
  }, [showResult, userMelody.length, melody.length, playNote]);

  const removeLastNote = useCallback(() => {
    setUserMelody(prev => prev.slice(0, -1));
  }, []);

  const clearNotes = useCallback(() => {
    setUserMelody([]);
  }, []);

  const checkAnswer = useCallback(() => {
    setShowResult(true);
    const correct = melody.every((note, i) => note === userMelody[i]);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [melody, userMelody]);

  const nextQuestion = useCallback(() => {
    setMelody(generateMelody(difficulty));
    setUserMelody([]);
    setShowResult(false);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDiff: 3 | 4 | 5 | 6) => {
    setDifficulty(newDiff);
    setMelody(generateMelody(newDiff));
    setUserMelody([]);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
  }, []);

  const isCorrect = melody.every((note, i) => note === userMelody[i]);
  const allNotes = [...NOTES, "C5"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Melody Dictation</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Notes:</span>
          {([3, 4, 5, 6] as const).map((d) => (
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

        {/* Play button */}
        <div className="text-center">
          <Button onClick={() => playMelody(melody)} disabled={isPlaying} size="lg">
            <Play className="h-5 w-5 mr-2" />
            {isPlaying ? "Playing..." : "Play Melody"}
          </Button>
        </div>

        {/* User's answer display */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Your answer ({userMelody.length}/{melody.length}):</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={removeLastNote} disabled={userMelody.length === 0}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={clearNotes} disabled={userMelody.length === 0}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 min-h-[40px] flex-wrap">
            {userMelody.map((note, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded font-medium ${
                  showResult
                    ? note === melody[i]
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {note}
              </div>
            ))}
            {!showResult && userMelody.length < melody.length && (
              <div className="px-3 py-2 rounded border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
                ?
              </div>
            )}
          </div>
        </div>

        {/* Note input buttons */}
        {!showResult && (
          <div className="grid grid-cols-4 gap-2">
            {allNotes.map((note) => (
              <Button
                key={note}
                variant="outline"
                onClick={() => addNote(note)}
                disabled={userMelody.length >= melody.length}
                className="text-lg font-medium"
              >
                {note === "C5" ? "C (high)" : note}
              </Button>
            ))}
          </div>
        )}

        {/* Check / Result */}
        {!showResult && userMelody.length === melody.length && (
          <div className="text-center">
            <Button onClick={checkAnswer} size="lg">
              Check Answer
            </Button>
          </div>
        )}

        {showResult && (
          <>
            <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
              isCorrect ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Perfect!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>Correct melody: {melody.join(" - ")}</span>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={() => playMelody(melody)} disabled={isPlaying} variant="outline">
                Replay Correct
              </Button>
              <Button onClick={nextQuestion}>Next Melody</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
