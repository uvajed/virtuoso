"use client";

import { useMetronome } from "@/hooks/useMetronome";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SIGNATURES = [
  { label: "2/4", beats: 2 },
  { label: "3/4", beats: 3 },
  { label: "4/4", beats: 4 },
  { label: "5/4", beats: 5 },
  { label: "6/8", beats: 6 },
];

const TEMPO_PRESETS = [
  { label: "Largo", bpm: 50 },
  { label: "Adagio", bpm: 70 },
  { label: "Andante", bpm: 90 },
  { label: "Moderato", bpm: 110 },
  { label: "Allegro", bpm: 130 },
  { label: "Vivace", bpm: 160 },
  { label: "Presto", bpm: 180 },
];

export function Metronome() {
  const {
    bpm,
    beatsPerMeasure,
    currentBeat,
    isPlaying,
    accentFirst,
    toggle,
    setBpm,
    setBeatsPerMeasure,
    setAccentFirst,
  } = useMetronome();

  const handleBpmChange = (delta: number) => {
    setBpm(bpm + delta);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Metronome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Beat Visualization */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-100",
                currentBeat === i + 1
                  ? i === 0 && accentFirst
                    ? "bg-secondary scale-125"
                    : "bg-primary scale-125"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* BPM Display */}
        <div className="text-center">
          <div className="text-6xl font-bold tabular-nums">{bpm}</div>
          <div className="text-muted-foreground text-sm mt-1">BPM</div>
        </div>

        {/* BPM Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleBpmChange(-5)}
            disabled={bpm <= 20}
          >
            <Minus className="h-5 w-5" />
          </Button>

          <input
            type="range"
            min="20"
            max="300"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-40 accent-primary"
          />

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleBpmChange(5)}
            disabled={bpm >= 300}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Tempo Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          {TEMPO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setBpm(preset.bpm)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                bpm >= preset.bpm - 10 && bpm <= preset.bpm + 10
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Time Signature */}
        <div>
          <div className="text-sm font-medium mb-2 text-center">
            Time Signature
          </div>
          <div className="flex justify-center gap-2">
            {TIME_SIGNATURES.map((sig) => (
              <button
                key={sig.label}
                onClick={() => setBeatsPerMeasure(sig.beats)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  beatsPerMeasure === sig.beats
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {sig.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Toggle */}
        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="accent"
            checked={accentFirst}
            onChange={(e) => setAccentFirst(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="accent" className="text-sm">
            Accent first beat
          </label>
        </div>

        {/* Play/Pause Button */}
        <Button
          size="lg"
          className="w-full h-14 text-lg"
          onClick={toggle}
        >
          {isPlaying ? (
            <>
              <Pause className="h-6 w-6 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-6 w-6 mr-2" />
              Start
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
