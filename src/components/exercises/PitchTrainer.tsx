"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui";
import { Mic, MicOff, Volume2, Target } from "lucide-react";

const NOTE_FREQUENCIES: Record<string, number> = {
  C3: 130.81, "C#3": 138.59, D3: 146.83, "D#3": 155.56, E3: 164.81, F3: 174.61,
  "F#3": 185.00, G3: 196.00, "G#3": 207.65, A3: 220.00, "A#3": 233.08, B3: 246.94,
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63, F4: 349.23,
  "F#4": 369.99, G4: 392.00, "G#4": 415.30, A4: 440.00, "A#4": 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, D5: 587.33, "D#5": 622.25, E5: 659.25,
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function frequencyToNote(frequency: number): { note: string; cents: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);

  const halfSteps = 12 * Math.log2(frequency / C0);
  const roundedHalfSteps = Math.round(halfSteps);
  const octave = Math.floor(roundedHalfSteps / 12);
  const noteIndex = ((roundedHalfSteps % 12) + 12) % 12;

  const cents = Math.round((halfSteps - roundedHalfSteps) * 100);

  return {
    note: `${NOTE_NAMES[noteIndex]}${octave}`,
    cents,
  };
}

export function PitchTrainer() {
  const [isListening, setIsListening] = useState(false);
  const [targetNote, setTargetNote] = useState("A4");
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [detectedCents, setDetectedCents] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const playTargetNote = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = NOTE_FREQUENCIES[targetNote];

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 1);
  }, [targetNote]);

  const generateNewTarget = useCallback(() => {
    const notes = Object.keys(NOTE_FREQUENCIES);
    const newNote = notes[Math.floor(Math.random() * notes.length)];
    setTargetNote(newNote);
    setDetectedNote(null);
  }, []);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });

      streamRef.current = stream;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);

      const buffer = new Float32Array(analyser.fftSize);

      const detect = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);

        // Simple autocorrelation pitch detection
        let maxCorrelation = 0;
        let bestPeriod = 0;

        for (let period = 20; period < buffer.length / 2; period++) {
          let correlation = 0;
          for (let i = 0; i < buffer.length / 2; i++) {
            correlation += buffer[i] * buffer[i + period];
          }
          if (correlation > maxCorrelation) {
            maxCorrelation = correlation;
            bestPeriod = period;
          }
        }

        if (maxCorrelation > 0.1 && bestPeriod > 0) {
          const frequency = ctx.sampleRate / bestPeriod;
          if (frequency > 80 && frequency < 1000) {
            const { note, cents } = frequencyToNote(frequency);
            setDetectedNote(note);
            setDetectedCents(cents);

            // Check if matched
            if (note === targetNote && Math.abs(cents) < 20) {
              setScore((s) => s + 10);
              setStreak((s) => s + 1);
              generateNewTarget();
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  }, [targetNote, generateNewTarget]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const isMatch = detectedNote === targetNote;
  const centsDisplay = detectedCents > 0 ? `+${detectedCents}` : detectedCents;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pitch Training</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score} | Streak: {streak}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target note display */}
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Match this note:</p>
          <div className="text-6xl font-bold text-primary mb-4">{targetNote}</div>
          <Button onClick={playTargetNote} variant="outline" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            Play Target
          </Button>
        </div>

        {/* Pitch meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Flat</span>
            <span>In Tune</span>
            <span>Sharp</span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-500 -translate-x-1/2" />
            {detectedNote && (
              <div
                className={`absolute top-1 bottom-1 w-4 rounded-full transition-all ${
                  Math.abs(detectedCents) < 10 ? "bg-green-500" : "bg-primary"
                }`}
                style={{
                  left: `calc(50% + ${detectedCents}% - 8px)`,
                }}
              />
            )}
          </div>
          {detectedNote && (
            <p className="text-center text-sm">
              {detectedNote} ({centsDisplay} cents)
            </p>
          )}
        </div>

        {/* Status indicator */}
        {isListening && detectedNote && (
          <div
            className={`text-center p-4 rounded-lg ${
              isMatch && Math.abs(detectedCents) < 20
                ? "bg-green-500/20 text-green-600"
                : "bg-muted"
            }`}
          >
            {isMatch && Math.abs(detectedCents) < 20 ? (
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5" />
                <span className="font-medium">Perfect match!</span>
              </div>
            ) : (
              <span>
                Detected: {detectedNote} - {isMatch ? "Adjust tuning" : "Try again"}
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Listening
              </>
            )}
          </Button>
          <Button onClick={generateNewTarget} variant="outline" size="lg">
            New Note
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sing or play the target note. The meter shows how close you are to the correct pitch.
        </p>
      </CardContent>
    </Card>
  );
}
