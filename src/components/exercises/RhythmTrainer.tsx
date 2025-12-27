"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, Play, Square } from "lucide-react";

interface RhythmPattern {
  name: string;
  beats: number[];
  timeSignature: string;
  difficulty: number;
}

const RHYTHM_PATTERNS: RhythmPattern[] = [
  { name: "Quarter Notes", beats: [0, 1, 2, 3], timeSignature: "4/4", difficulty: 1 },
  { name: "Half Notes", beats: [0, 2], timeSignature: "4/4", difficulty: 1 },
  { name: "Syncopation", beats: [0, 1.5, 3], timeSignature: "4/4", difficulty: 2 },
  { name: "Eighth Notes", beats: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], timeSignature: "4/4", difficulty: 2 },
  { name: "Dotted Quarter", beats: [0, 1.5, 3], timeSignature: "4/4", difficulty: 2 },
  { name: "Triplets", beats: [0, 0.33, 0.67, 1, 1.33, 1.67, 2, 2.33, 2.67, 3, 3.33, 3.67], timeSignature: "4/4", difficulty: 3 },
  { name: "Waltz", beats: [0, 1, 2], timeSignature: "3/4", difficulty: 1 },
  { name: "6/8 Feel", beats: [0, 0.5, 1, 1.5, 2, 2.5], timeSignature: "6/8", difficulty: 2 },
  { name: "Funk", beats: [0, 0.5, 1.5, 2, 3, 3.5], timeSignature: "4/4", difficulty: 3 },
  { name: "Bossa Nova", beats: [0, 1.5, 3, 3.5], timeSignature: "4/4", difficulty: 3 },
];

const TOLERANCE = 0.15; // seconds tolerance for tap timing

export function RhythmTrainer() {
  const [difficulty, setDifficulty] = useState(1);
  const [currentPattern, setCurrentPattern] = useState<RhythmPattern | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [tempo, setTempo] = useState(80);
  const [taps, setTaps] = useState<number[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [result, setResult] = useState<{ accuracy: number; feedback: string } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatIndexRef = useRef(0);

  const getFilteredPatterns = useCallback(() => {
    return RHYTHM_PATTERNS.filter(p => p.difficulty <= difficulty);
  }, [difficulty]);

  const selectRandomPattern = useCallback(() => {
    const patterns = getFilteredPatterns();
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(pattern);
    setResult(null);
    setTaps([]);
  }, [getFilteredPatterns]);

  useEffect(() => {
    selectRandomPattern();
  }, [selectRandomPattern]);

  const playClick = useCallback((accent: boolean = false) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = accent ? 1000 : 800;
    gain.gain.setValueAtTime(accent ? 0.3 : 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playPattern = useCallback(() => {
    if (!currentPattern || isPlaying) return;

    setIsPlaying(true);
    setResult(null);
    beatIndexRef.current = 0;

    const beatDuration = 60 / tempo;
    const totalBeats = currentPattern.timeSignature === "3/4" ? 3 :
                       currentPattern.timeSignature === "6/8" ? 3 : 4;

    // Play the pattern twice
    let beatCount = 0;
    const totalDuration = totalBeats * 2;

    const interval = setInterval(() => {
      const currentBeat = beatCount % totalBeats;

      if (currentPattern.beats.some(b => Math.abs(b - currentBeat) < 0.1)) {
        playClick(currentBeat === 0);
      }

      beatCount += 0.5;
      if (beatCount >= totalDuration) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, (beatDuration * 1000) / 2);

    intervalRef.current = interval;
  }, [currentPattern, isPlaying, tempo, playClick]);

  const startListening = useCallback(() => {
    if (!currentPattern) return;

    setIsListening(true);
    setTaps([]);
    setResult(null);
    startTimeRef.current = Date.now();

    // Play metronome clicks while listening
    const beatDuration = 60 / tempo;
    const totalBeats = currentPattern.timeSignature === "3/4" ? 3 :
                       currentPattern.timeSignature === "6/8" ? 3 : 4;

    let beatCount = 0;
    const interval = setInterval(() => {
      if (beatCount === 0) playClick(true);
      else playClick(false);

      beatCount++;
      if (beatCount >= totalBeats * 2) {
        clearInterval(interval);
        setIsListening(false);
        // Evaluate after listening period ends
      }
    }, beatDuration * 1000);

    intervalRef.current = interval;

    // Auto-stop after 2 bars
    setTimeout(() => {
      setIsListening(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, beatDuration * totalBeats * 2 * 1000 + 500);
  }, [currentPattern, tempo, playClick]);

  const handleTap = useCallback(() => {
    if (!isListening || !currentPattern) return;

    const tapTime = (Date.now() - startTimeRef.current) / 1000;
    setTaps(prev => [...prev, tapTime]);
    playClick();
  }, [isListening, currentPattern, playClick]);

  const evaluatePerformance = useCallback(() => {
    if (!currentPattern || taps.length === 0) return;

    const beatDuration = 60 / tempo;
    const totalBeats = currentPattern.timeSignature === "3/4" ? 3 :
                       currentPattern.timeSignature === "6/8" ? 3 : 4;

    // Expected tap times (2 bars)
    const expectedTaps: number[] = [];
    for (let bar = 0; bar < 2; bar++) {
      currentPattern.beats.forEach(beat => {
        expectedTaps.push((bar * totalBeats + beat) * beatDuration);
      });
    }

    // Calculate accuracy
    let matchedTaps = 0;
    expectedTaps.forEach(expected => {
      const closestTap = taps.reduce((closest, tap) =>
        Math.abs(tap - expected) < Math.abs(closest - expected) ? tap : closest
      , Infinity);
      if (Math.abs(closestTap - expected) <= TOLERANCE) {
        matchedTaps++;
      }
    });

    const accuracy = Math.round((matchedTaps / expectedTaps.length) * 100);

    let feedback = "";
    if (accuracy >= 90) feedback = "Perfect rhythm!";
    else if (accuracy >= 70) feedback = "Good timing!";
    else if (accuracy >= 50) feedback = "Keep practicing!";
    else feedback = "Try listening to the pattern again";

    setResult({ accuracy, feedback });
    setScore(prev => ({
      correct: prev.correct + (accuracy >= 70 ? 1 : 0),
      total: prev.total + 1
    }));
  }, [currentPattern, taps, tempo]);

  useEffect(() => {
    if (!isListening && taps.length > 0) {
      evaluatePerformance();
    }
  }, [isListening, taps.length, evaluatePerformance]);

  // Keyboard/touch handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isListening) {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening, handleTap]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rhythm Training</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty & Tempo */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Level:</span>
            {[1, 2, 3].map((d) => (
              <Button
                key={d}
                size="sm"
                variant={difficulty === d ? "primary" : "outline"}
                onClick={() => { setDifficulty(d); selectRandomPattern(); }}
              >
                {d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard"}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">BPM:</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.max(40, t - 10))}>-</Button>
            <span className="w-12 text-center font-mono">{tempo}</span>
            <Button size="sm" variant="outline" onClick={() => setTempo(t => Math.min(160, t + 10))}>+</Button>
          </div>
        </div>

        {/* Current Pattern */}
        {currentPattern && (
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">{currentPattern.name}</h3>
            <p className="text-muted-foreground mb-4">Time: {currentPattern.timeSignature}</p>

            {/* Visual rhythm display */}
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: currentPattern.timeSignature === "3/4" ? 12 : 16 }).map((_, i) => {
                const beatPos = i / 4;
                const isHit = currentPattern.beats.some(b => Math.abs(b - beatPos) < 0.1);
                const isDownbeat = i % 4 === 0;
                return (
                  <div
                    key={i}
                    className={`w-3 h-8 rounded ${
                      isHit
                        ? isDownbeat ? "bg-primary" : "bg-primary/70"
                        : "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button onClick={playPattern} disabled={isPlaying || isListening}>
            <Play className="h-4 w-4 mr-2" />
            Listen
          </Button>
          <Button onClick={startListening} disabled={isPlaying || isListening} variant="primary">
            <Square className="h-4 w-4 mr-2" />
            Tap Along
          </Button>
          <Button onClick={selectRandomPattern} variant="outline" disabled={isPlaying || isListening}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Tap area */}
        {isListening && (
          <button
            onClick={handleTap}
            className="w-full h-32 bg-primary/20 hover:bg-primary/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="text-xl font-bold">TAP HERE or press SPACE</span>
          </button>
        )}

        {/* Result */}
        {result && (
          <div className={`text-center p-4 rounded-lg ${
            result.accuracy >= 70 ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {result.accuracy >= 70 ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span className="font-medium">{result.accuracy}% accuracy</span>
            </div>
            <p className="text-sm">{result.feedback}</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Listen to the pattern, then tap along with the rhythm
        </p>
      </CardContent>
    </Card>
  );
}
