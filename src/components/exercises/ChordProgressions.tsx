"use client";

import { useState, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Play, RefreshCw, CheckCircle, XCircle, Volume2 } from "lucide-react";

interface Progression {
  name: string;
  numerals: string[];
  chords: number[][];
  genre: string;
  description: string;
}

const PROGRESSIONS: Progression[] = [
  {
    name: "Pop Classic",
    numerals: ["I", "V", "vi", "IV"],
    chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
    genre: "Pop/Rock",
    description: "Used in countless hit songs"
  },
  {
    name: "50s Progression",
    numerals: ["I", "vi", "IV", "V"],
    chords: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]],
    genre: "Doo-wop/Pop",
    description: "Classic 1950s sound"
  },
  {
    name: "Jazz ii-V-I",
    numerals: ["ii7", "V7", "Imaj7"],
    chords: [[2, 5, 9, 12], [7, 11, 14, 17], [0, 4, 7, 11]],
    genre: "Jazz",
    description: "Most common jazz progression"
  },
  {
    name: "Blues",
    numerals: ["I7", "I7", "IV7", "I7", "V7", "IV7", "I7", "V7"],
    chords: [[0, 4, 7, 10], [0, 4, 7, 10], [5, 9, 12, 15], [0, 4, 7, 10], [7, 11, 14, 17], [5, 9, 12, 15], [0, 4, 7, 10], [7, 11, 14, 17]],
    genre: "Blues",
    description: "12-bar blues (simplified)"
  },
  {
    name: "Andalusian Cadence",
    numerals: ["i", "VII", "VI", "V"],
    chords: [[0, 3, 7], [10, 14, 17], [8, 12, 15], [7, 11, 14]],
    genre: "Flamenco/Rock",
    description: "Spanish/Mediterranean feel"
  },
  {
    name: "Pachelbel Canon",
    numerals: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
    chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [4, 7, 11], [5, 9, 12], [0, 4, 7], [5, 9, 12], [7, 11, 14]],
    genre: "Classical/Pop",
    description: "Timeless progression"
  },
  {
    name: "Sensitive Female",
    numerals: ["vi", "IV", "I", "V"],
    chords: [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]],
    genre: "Singer-Songwriter",
    description: "Emotional, introspective"
  },
  {
    name: "Rock Power",
    numerals: ["I", "bVII", "IV"],
    chords: [[0, 4, 7], [10, 14, 17], [5, 9, 12]],
    genre: "Rock",
    description: "Powerful, driving feel"
  },
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function ChordProgressions() {
  const [currentProgression, setCurrentProgression] = useState<Progression>(PROGRESSIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [hiddenChord, setHiddenChord] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [tempo, setTempo] = useState(70);
  const [rootNote, setRootNote] = useState("C");

  const audioContextRef = useRef<AudioContext | null>(null);

  const rootIndex = NOTE_NAMES.indexOf(rootNote);

  const playChord = useCallback((intervals: number[], duration: number = 1) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const baseFreq = 261.63 * Math.pow(2, rootIndex / 12); // Adjust for root note

    intervals.forEach(interval => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    });
  }, [rootIndex]);

  const playProgression = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const beatDuration = (60 / tempo) * 2; // 2 beats per chord

    for (let i = 0; i < currentProgression.chords.length; i++) {
      setActiveChordIndex(i);
      playChord(currentProgression.chords[i], beatDuration);
      await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
    }

    setActiveChordIndex(null);
    setIsPlaying(false);
  }, [currentProgression, isPlaying, playChord, tempo]);

  const startQuiz = useCallback(() => {
    setQuizMode(true);
    const hidden = Math.floor(Math.random() * currentProgression.numerals.length);
    setHiddenChord(hidden);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentProgression]);

  const checkAnswer = useCallback((answer: string) => {
    if (hiddenChord === null) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const correct = answer === currentProgression.numerals[hiddenChord];
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  }, [currentProgression, hiddenChord]);

  const getChordName = (numeral: string, index: number) => {
    const intervals = currentProgression.chords[index];
    const chordRoot = NOTE_NAMES[(rootIndex + intervals[0]) % 12];
    const isMinor = numeral.toLowerCase() === numeral.replace(/[0-9]/g, "");
    const has7 = numeral.includes("7");

    return `${chordRoot}${isMinor && !numeral.includes("maj") ? "m" : ""}${has7 ? "7" : ""}`;
  };

  // Get unique answer options
  const answerOptions = [...new Set(currentProgression.numerals)];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chord Progressions</CardTitle>
          {quizMode && (
            <div className="text-sm text-muted-foreground">
              Score: {score.correct}/{score.total}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progression selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PROGRESSIONS.map((prog) => (
            <Button
              key={prog.name}
              size="sm"
              variant={currentProgression.name === prog.name ? "primary" : "outline"}
              onClick={() => { setCurrentProgression(prog); setQuizMode(false); }}
            >
              {prog.name}
            </Button>
          ))}
        </div>

        {/* Progression info */}
        <div className="text-center">
          <h3 className="text-xl font-bold">{currentProgression.name}</h3>
          <p className="text-muted-foreground">{currentProgression.genre} - {currentProgression.description}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Key:</span>
            <select
              value={rootNote}
              onChange={(e) => setRootNote(e.target.value)}
              className="bg-muted border border-border rounded px-2 py-1"
            >
              {NOTE_NAMES.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">BPM:</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.max(40, t - 10))}>-</Button>
            <span className="w-12 text-center font-mono">{tempo}</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.min(120, t + 10))}>+</Button>
          </div>
        </div>

        {/* Chord display */}
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="flex flex-wrap justify-center gap-4">
            {currentProgression.numerals.map((numeral, i) => {
              const isActive = activeChordIndex === i;
              const isHidden = quizMode && hiddenChord === i && !showResult;
              const isCorrect = showResult && hiddenChord === i && selectedAnswer === numeral;
              const isWrong = showResult && hiddenChord === i && selectedAnswer !== numeral;

              return (
                <button
                  key={i}
                  onClick={() => playChord(currentProgression.chords[i])}
                  className={`p-4 rounded-lg min-w-[80px] transition-all ${
                    isActive ? "bg-primary text-primary-foreground scale-110" :
                    isCorrect ? "bg-green-500 text-white" :
                    isWrong ? "bg-red-500 text-white" :
                    isHidden ? "bg-muted" :
                    "bg-card hover:bg-muted"
                  }`}
                >
                  <div className="text-lg font-bold">
                    {isHidden ? "?" : numeral}
                  </div>
                  <div className="text-xs opacity-70">
                    {isHidden ? "???" : getChordName(numeral, i)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz mode answers */}
        {quizMode && !showResult && hiddenChord !== null && (
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              What chord is missing? Listen and identify!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {answerOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => checkAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {showResult && hiddenChord !== null && (
          <div className={`text-center p-4 rounded-lg ${
            selectedAnswer === currentProgression.numerals[hiddenChord]
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }`}>
            <div className="flex items-center justify-center gap-2">
              {selectedAnswer === currentProgression.numerals[hiddenChord] ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>It was {currentProgression.numerals[hiddenChord]}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 justify-center">
          <Button onClick={playProgression} disabled={isPlaying}>
            <Volume2 className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play All"}
          </Button>
          {!quizMode ? (
            <Button variant="outline" onClick={startQuiz}>
              <Play className="h-4 w-4 mr-2" />
              Quiz Mode
            </Button>
          ) : (
            <Button variant="outline" onClick={startQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Question
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Click individual chords to hear them, or play the full progression
        </p>
      </CardContent>
    </Card>
  );
}
