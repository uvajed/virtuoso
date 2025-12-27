"use client";

import { useState } from "react";
import { usePracticeTimer, formatTime } from "@/hooks/usePracticeTimer";
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui";
import { Play, Pause, RotateCcw, Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_TIMES = [
  { label: "5 min", seconds: 5 * 60 },
  { label: "10 min", seconds: 10 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "20 min", seconds: 20 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "45 min", seconds: 45 * 60 },
  { label: "60 min", seconds: 60 * 60 },
];

export function PracticeTimer() {
  const {
    isRunning,
    isPaused,
    displaySeconds,
    isComplete,
    progress,
    mode,
    targetSeconds,
    toggle,
    reset,
    setMode,
    setTargetTime,
  } = usePracticeTimer();

  const [customMinutes, setCustomMinutes] = useState(15);

  const handleSetCustomTime = () => {
    setTargetTime(customMinutes * 60);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Practice Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode("stopwatch")}
            disabled={isRunning}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "stopwatch"
                ? "bg-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
            Stopwatch
          </button>
          <button
            onClick={() => setMode("countdown")}
            disabled={isRunning}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "countdown"
                ? "bg-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Timer className="h-4 w-4" />
            Countdown
          </button>
        </div>

        {/* Timer Display */}
        <div
          className={cn(
            "text-center py-8 rounded-2xl transition-colors",
            isComplete
              ? "bg-success/10"
              : isRunning
              ? "bg-primary/5"
              : "bg-muted/50"
          )}
        >
          <div
            className={cn(
              "text-6xl md:text-7xl font-bold font-mono tabular-nums",
              isComplete && "text-success"
            )}
          >
            {formatTime(displaySeconds)}
          </div>
          {mode === "countdown" && targetSeconds && (
            <div className="text-sm text-muted-foreground mt-2">
              {isComplete ? "Time's up!" : `of ${formatTime(targetSeconds)}`}
            </div>
          )}
        </div>

        {/* Progress Bar (Countdown mode only) */}
        {mode === "countdown" && targetSeconds && (
          <Progress
            value={progress}
            max={100}
            size="md"
            variant={isComplete ? "success" : "default"}
          />
        )}

        {/* Preset Times (Countdown mode only, when not running) */}
        {mode === "countdown" && !isRunning && (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-center gap-2">
              {PRESET_TIMES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTargetTime(preset.seconds)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                    targetSeconds === preset.seconds
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time */}
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                className="w-20 h-10 px-3 rounded-lg border border-input bg-background text-center"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetCustomTime}
              >
                Set
              </Button>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-14"
            onClick={toggle}
            disabled={mode === "countdown" && !targetSeconds && !isRunning}
          >
            {isRunning && !isPaused ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                {isPaused ? "Resume" : "Start"}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14"
            onClick={reset}
            disabled={!isRunning && displaySeconds === 0}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Tips */}
        {!isRunning && (
          <div className="text-xs text-center text-muted-foreground">
            {mode === "stopwatch"
              ? "Track your practice session length"
              : "Set a goal and focus on practicing"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
