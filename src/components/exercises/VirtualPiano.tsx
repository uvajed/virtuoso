"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const NOTE_FREQUENCIES: Record<string, number> = {
  C3: 130.81, "C#3": 138.59, D3: 146.83, "D#3": 155.56, E3: 164.81, F3: 174.61, "F#3": 185.00, G3: 196.00, "G#3": 207.65, A3: 220.00, "A#3": 233.08, B3: 246.94,
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.00, "G#4": 415.30, A4: 440.00, "A#4": 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, D5: 587.33, "D#5": 622.25, E5: 659.25, F5: 698.46, "F#5": 739.99, G5: 783.99, "G#5": 830.61, A5: 880.00, "A#5": 932.33, B5: 987.77,
  C6: 1046.50,
};

const KEYBOARD_MAP: Record<string, string> = {
  a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4", t: "F#4",
  g: "G4", y: "G#4", h: "A4", u: "A#4", j: "B4", k: "C5", o: "C#5",
  l: "D5", p: "D#5", ";": "E5",
};

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  isActive: boolean;
  onPress: (note: string) => void;
  onRelease: (note: string) => void;
  keyboardKey?: string;
}

function PianoKey({ note, isBlack, isActive, onPress, onRelease, keyboardKey }: PianoKeyProps) {
  const baseClasses = isBlack
    ? "absolute w-8 h-24 -ml-4 z-10 rounded-b-md transition-all"
    : "relative w-12 h-40 rounded-b-md border border-gray-300 transition-all";

  const colorClasses = isBlack
    ? isActive ? "bg-primary shadow-inner" : "bg-gray-900 hover:bg-gray-800"
    : isActive ? "bg-primary shadow-inner" : "bg-white hover:bg-gray-50";

  return (
    <button
      className={`${baseClasses} ${colorClasses}`}
      onMouseDown={() => onPress(note)}
      onMouseUp={() => onRelease(note)}
      onMouseLeave={() => onRelease(note)}
      onTouchStart={(e) => { e.preventDefault(); onPress(note); }}
      onTouchEnd={() => onRelease(note)}
    >
      {keyboardKey && (
        <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono ${
          isBlack ? "text-white/50" : "text-gray-400"
        }`}>
          {keyboardKey.toUpperCase()}
        </span>
      )}
      {!isBlack && (
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500">
          {note.replace(/[0-9]/g, "")}
        </span>
      )}
    </button>
  );
}

export function VirtualPiano() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  const playNote = useCallback((note: string) => {
    if (!NOTE_FREQUENCIES[note]) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    if (oscillatorsRef.current.has(note)) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = NOTE_FREQUENCIES[note];

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();

    oscillatorsRef.current.set(note, oscillator);
    gainNodesRef.current.set(note, gainNode);

    setActiveNotes((prev) => new Set([...prev, note]));
  }, []);

  const stopNote = useCallback((note: string) => {
    const oscillator = oscillatorsRef.current.get(note);
    const gainNode = gainNodesRef.current.get(note);

    if (oscillator && gainNode && audioContextRef.current) {
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
      setTimeout(() => {
        oscillator.stop();
        oscillatorsRef.current.delete(note);
        gainNodesRef.current.delete(note);
      }, 100);
    }

    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) playNote(note);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) stopNote(note);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playNote, stopNote]);

  const octaves = [3, 4, 5];
  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes = ["C#", "D#", null, "F#", "G#", "A#", null];

  const getKeyboardKey = (note: string) => {
    const entry = Object.entries(KEYBOARD_MAP).find(([, n]) => n === note);
    return entry?.[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Piano</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click keys or use your keyboard (A-L for white keys, W-P for black keys)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="flex justify-center min-w-max">
            {octaves.map((octave) => (
              <div key={octave} className="flex relative">
                {whiteNotes.map((note, i) => {
                  const fullNote = `${note}${octave}`;
                  const blackNote = blackNotes[i] ? `${blackNotes[i]}${octave}` : null;

                  return (
                    <div key={fullNote} className="relative">
                      <PianoKey
                        note={fullNote}
                        isBlack={false}
                        isActive={activeNotes.has(fullNote)}
                        onPress={playNote}
                        onRelease={stopNote}
                        keyboardKey={getKeyboardKey(fullNote)}
                      />
                      {blackNote && (
                        <PianoKey
                          note={blackNote}
                          isBlack={true}
                          isActive={activeNotes.has(blackNote)}
                          onPress={playNote}
                          onRelease={stopNote}
                          keyboardKey={getKeyboardKey(blackNote)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* C6 */}
            <PianoKey
              note="C6"
              isBlack={false}
              isActive={activeNotes.has("C6")}
              onPress={playNote}
              onRelease={stopNote}
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Currently Playing:</p>
          <div className="flex flex-wrap gap-2">
            {activeNotes.size === 0 ? (
              <span className="text-muted-foreground text-sm">No notes</span>
            ) : (
              Array.from(activeNotes).map((note) => (
                <span
                  key={note}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
                >
                  {note}
                </span>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
