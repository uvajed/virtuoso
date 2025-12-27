"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Loader2 } from "lucide-react";
import {
  initPiano,
  playPianoNote,
  stopPianoNote,
  isPianoLoaded,
  isPianoLoading,
} from "@/lib/piano";

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize piano samples on mount
  useEffect(() => {
    const loadPiano = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        await initPiano();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load piano:", error);
        setLoadError("Failed to load piano sounds. Please refresh the page.");
        setIsLoading(false);
      }
    };

    if (!isPianoLoaded() && !isPianoLoading()) {
      loadPiano();
    } else if (isPianoLoaded()) {
      setIsLoading(false);
    }
  }, []);

  const playNote = useCallback((note: string) => {
    if (!isPianoLoaded()) return;

    playPianoNote(note);
    setActiveNotes((prev) => new Set([...prev, note]));
  }, []);

  const stopNote = useCallback((note: string) => {
    stopPianoNote(note);
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
          {isLoading
            ? "Loading piano sounds..."
            : "Click keys or use your keyboard (A-L for white keys, W-P for black keys)"}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Loading Salamander Grand Piano samples...</span>
          </div>
        )}
        {loadError && (
          <div className="flex items-center justify-center py-8 text-red-500">
            {loadError}
          </div>
        )}
        {!isLoading && !loadError && (
        <>
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
        </>
        )}
      </CardContent>
    </Card>
  );
}
