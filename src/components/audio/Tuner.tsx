"use client";

import { usePitchDetection } from "@/hooks/usePitchDetection";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TUNING_PRESETS = {
  standard: {
    name: "Standard Guitar",
    notes: ["E2", "A2", "D3", "G3", "B3", "E4"],
  },
  dropD: {
    name: "Drop D",
    notes: ["D2", "A2", "D3", "G3", "B3", "E4"],
  },
  bass: {
    name: "Bass Guitar",
    notes: ["E1", "A1", "D2", "G2"],
  },
  ukulele: {
    name: "Ukulele",
    notes: ["G4", "C4", "E4", "A4"],
  },
};

export function Tuner() {
  const { isListening, pitch, error, hasPermission, toggle } =
    usePitchDetection();

  // Calculate needle position based on cents (-50 to +50)
  const needlePosition = pitch ? Math.max(-50, Math.min(50, pitch.cents)) : 0;
  const isInTune = pitch && Math.abs(pitch.cents) < 5;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Chromatic Tuner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Permission Denied Message */}
        {hasPermission === false && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please allow microphone access to use the tuner.
            </p>
          </div>
        )}

        {/* Tuner Display */}
        <div className="relative">
          {/* Cents Scale */}
          <div className="flex justify-between text-xs text-muted-foreground mb-2 px-4">
            <span>-50</span>
            <span>-25</span>
            <span className="font-medium text-foreground">0</span>
            <span>+25</span>
            <span>+50</span>
          </div>

          {/* Tuning Bar */}
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            {/* Center indicator */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-success -translate-x-1/2 z-10" />

            {/* Needle */}
            <div
              className={cn(
                "absolute top-1 bottom-1 w-3 rounded-full transition-all duration-100",
                isInTune ? "bg-success" : "bg-primary"
              )}
              style={{
                left: `calc(50% + ${needlePosition}% - 6px)`,
              }}
            />

            {/* Grid lines */}
            <div className="absolute inset-0 flex justify-between px-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-px h-full bg-border"
                  style={{ opacity: i === 4 ? 0 : 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Note Display */}
        <div className="text-center">
          {pitch ? (
            <>
              <div
                className={cn(
                  "text-7xl font-bold transition-colors",
                  isInTune ? "text-success" : "text-foreground"
                )}
              >
                {pitch.note}
                <span className="text-3xl text-muted-foreground">
                  {pitch.octave}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-lg font-medium">
                  {pitch.cents > 0 ? "+" : ""}
                  {pitch.cents} cents
                </div>
                <div className="text-sm text-muted-foreground">
                  {pitch.frequency.toFixed(1)} Hz
                </div>
              </div>
              {isInTune && (
                <div className="mt-3 text-success font-medium">In Tune!</div>
              )}
            </>
          ) : (
            <div className="text-5xl font-bold text-muted-foreground">--</div>
          )}
        </div>

        {/* Quick Reference */}
        {!isListening && (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TUNING_PRESETS).map(([key, preset]) => (
              <div
                key={key}
                className="p-3 bg-muted rounded-lg text-center"
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {preset.name}
                </div>
                <div className="text-xs font-mono">
                  {preset.notes.join(" ")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start/Stop Button */}
        <Button
          size="lg"
          className="w-full h-14 text-lg"
          onClick={toggle}
          variant={isListening ? "secondary" : "primary"}
        >
          {isListening ? (
            <>
              <MicOff className="h-6 w-6 mr-2" />
              Stop Tuner
            </>
          ) : (
            <>
              <Mic className="h-6 w-6 mr-2" />
              Start Tuner
            </>
          )}
        </Button>

        {isListening && (
          <p className="text-xs text-center text-muted-foreground">
            Play a note and the tuner will detect it
          </p>
        )}
      </CardContent>
    </Card>
  );
}
