"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Mic, MicOff, RefreshCw, Music } from "lucide-react";

const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const NOTE_FREQUENCIES: Record<string, number> = {};
for (let octave = 1; octave <= 7; octave++) {
  ALL_NOTES.forEach((note, i) => {
    const noteWithOctave = `${note}${octave}`;
    // A4 = 440Hz, calculate from there
    const semitonesFromA4 = (octave - 4) * 12 + i - 9;
    NOTE_FREQUENCIES[noteWithOctave] = 440 * Math.pow(2, semitonesFromA4 / 12);
  });
}

function frequencyToNote(freq: number): { note: string; octave: number; cents: number } | null {
  if (freq < 50 || freq > 2000) return null;

  const semitones = 12 * Math.log2(freq / 440) + 9;
  const octave = Math.floor(semitones / 12) + 4;
  const noteIndex = Math.round(semitones) % 12;
  const actualNoteIndex = ((noteIndex % 12) + 12) % 12;
  const cents = Math.round((semitones - Math.round(semitones)) * 100);

  return {
    note: ALL_NOTES[actualNoteIndex],
    octave,
    cents,
  };
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  if (rms < 0.01) return -1;

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;

  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  const buf2 = buffer.slice(r1, r2);
  const c = new Array(buf2.length).fill(0);

  for (let i = 0; i < buf2.length; i++) {
    for (let j = 0; j < buf2.length - i; j++) {
      c[i] = c[i] + buf2[j] * buf2[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < buf2.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;

  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

const VOICE_TYPES = [
  { name: "Bass", range: "E2-E4", lowNote: "E2", highNote: "E4", color: "bg-indigo-500" },
  { name: "Baritone", range: "A2-A4", lowNote: "A2", highNote: "A4", color: "bg-blue-500" },
  { name: "Tenor", range: "C3-C5", lowNote: "C3", highNote: "C5", color: "bg-cyan-500" },
  { name: "Alto", range: "F3-F5", lowNote: "F3", highNote: "F5", color: "bg-teal-500" },
  { name: "Mezzo-Soprano", range: "A3-A5", lowNote: "A3", highNote: "A5", color: "bg-emerald-500" },
  { name: "Soprano", range: "C4-C6", lowNote: "C4", highNote: "C6", color: "bg-green-500" },
];

export function VocalRangeTest() {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<{ note: string; octave: number; cents: number } | null>(null);
  const [lowestNote, setLowestNote] = useState<{ note: string; octave: number; freq: number } | null>(null);
  const [highestNote, setHighestNote] = useState<{ note: string; octave: number; freq: number } | null>(null);
  const [testPhase, setTestPhase] = useState<"idle" | "low" | "high" | "complete">("idle");
  const [countdown, setCountdown] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContextRef.current!.sampleRate);

    if (frequency > 0) {
      const noteInfo = frequencyToNote(frequency);
      if (noteInfo) {
        setCurrentNote(noteInfo);

        // Update lowest/highest based on test phase
        if (testPhase === "low") {
          if (!lowestNote || frequency < lowestNote.freq) {
            setLowestNote({ note: noteInfo.note, octave: noteInfo.octave, freq: frequency });
          }
        } else if (testPhase === "high") {
          if (!highestNote || frequency > highestNote.freq) {
            setHighestNote({ note: noteInfo.note, octave: noteInfo.octave, freq: frequency });
          }
        }
      }
    } else {
      setCurrentNote(null);
    }

    animationRef.current = requestAnimationFrame(detectPitch);
  }, [testPhase, lowestNote, highestNote]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setCurrentNote(null);
  }, []);

  const startTest = useCallback(async () => {
    if (!isListening) {
      await startListening();
    }
    setLowestNote(null);
    setHighestNote(null);
    setTestPhase("low");
    setCountdown(10);
  }, [isListening, startListening]);

  // Handle countdown and phase transitions
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && testPhase === "low") {
      setTestPhase("high");
      setCountdown(10);
    } else if (countdown === 0 && testPhase === "high") {
      setTestPhase("complete");
      stopListening();
    }
  }, [countdown, testPhase, stopListening]);

  // Start pitch detection when listening
  useEffect(() => {
    if (isListening && (testPhase === "low" || testPhase === "high")) {
      detectPitch();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, testPhase, detectPitch]);

  const reset = useCallback(() => {
    stopListening();
    setTestPhase("idle");
    setLowestNote(null);
    setHighestNote(null);
    setCountdown(0);
  }, [stopListening]);

  const getVoiceType = useCallback(() => {
    if (!lowestNote || !highestNote) return null;

    const lowFreq = lowestNote.freq;
    const highFreq = highestNote.freq;

    // Find best matching voice type based on range overlap
    let bestMatch = VOICE_TYPES[0];
    let bestScore = -Infinity;

    for (const vt of VOICE_TYPES) {
      const vtLowFreq = NOTE_FREQUENCIES[vt.lowNote];
      const vtHighFreq = NOTE_FREQUENCIES[vt.highNote];

      // Score based on how well the detected range matches the voice type
      const lowDiff = Math.abs(lowFreq - vtLowFreq);
      const highDiff = Math.abs(highFreq - vtHighFreq);
      const score = -(lowDiff + highDiff);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = vt;
      }
    }

    return bestMatch;
  }, [lowestNote, highestNote]);

  const voiceType = getVoiceType();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Vocal Range Test</CardTitle>
          {testPhase !== "idle" && testPhase !== "complete" && (
            <div className="text-sm text-muted-foreground">
              {countdown}s remaining
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {testPhase === "idle" && (
          <>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                This test will measure your vocal range by having you sing your lowest and highest comfortable notes.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Click "Start Test" and allow microphone access</li>
                  <li>Sing your <strong>lowest comfortable note</strong> for 10 seconds</li>
                  <li>Then sing your <strong>highest comfortable note</strong> for 10 seconds</li>
                  <li>Get your vocal range and voice type!</li>
                </ol>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startTest} size="lg">
                <Mic className="h-5 w-5 mr-2" />
                Start Test
              </Button>
            </div>
          </>
        )}

        {(testPhase === "low" || testPhase === "high") && (
          <>
            <div className={`text-center p-6 rounded-lg ${
              testPhase === "low" ? "bg-blue-500/10" : "bg-orange-500/10"
            }`}>
              <div className="text-lg font-medium mb-2">
                {testPhase === "low"
                  ? "Sing your LOWEST comfortable note"
                  : "Sing your HIGHEST comfortable note"}
              </div>
              <div className="text-4xl font-bold mb-2">
                {countdown}
              </div>
              <div className="text-sm text-muted-foreground">
                seconds remaining
              </div>
            </div>

            {/* Current note display */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Current Note:</div>
              <div className="text-5xl font-bold">
                {currentNote ? (
                  <>
                    {currentNote.note}
                    <span className="text-2xl">{currentNote.octave}</span>
                    <span className="text-lg text-muted-foreground ml-2">
                      {currentNote.cents > 0 ? "+" : ""}{currentNote.cents}¢
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Lowest Detected</div>
                <div className="text-xl font-medium">
                  {lowestNote ? `${lowestNote.note}${lowestNote.octave}` : "--"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Highest Detected</div>
                <div className="text-xl font-medium">
                  {highestNote ? `${highestNote.note}${highestNote.octave}` : "--"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {isListening ? (
                <>
                  <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4" />
                  <span>Microphone off</span>
                </>
              )}
            </div>
          </>
        )}

        {testPhase === "complete" && (
          <>
            <div className="text-center space-y-4">
              <Music className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Your Vocal Range</h3>
            </div>

            {/* Results */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Lowest Note</div>
                  <div className="text-2xl font-bold">
                    {lowestNote ? `${lowestNote.note}${lowestNote.octave}` : "--"}
                  </div>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="text-center flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Highest Note</div>
                  <div className="text-2xl font-bold">
                    {highestNote ? `${highestNote.note}${highestNote.octave}` : "--"}
                  </div>
                </div>
              </div>

              {voiceType && (
                <div className={`${voiceType.color} text-white rounded-lg p-4 text-center`}>
                  <div className="text-sm opacity-80">Your Voice Type</div>
                  <div className="text-2xl font-bold">{voiceType.name}</div>
                  <div className="text-sm opacity-80">Typical range: {voiceType.range}</div>
                </div>
              )}
            </div>

            {/* Voice type reference */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Voice Type Reference:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {VOICE_TYPES.map((vt) => (
                  <div
                    key={vt.name}
                    className={`${vt.color} text-white rounded px-3 py-2 text-center text-sm ${
                      voiceType?.name === vt.name ? "ring-2 ring-offset-2 ring-primary" : "opacity-60"
                    }`}
                  >
                    <div className="font-medium">{vt.name}</div>
                    <div className="text-xs opacity-80">{vt.range}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={startTest}>
                Test Again
              </Button>
              <Button variant="outline" onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
