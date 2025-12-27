"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  targetSeconds: number | null;
  mode: "stopwatch" | "countdown";
}

export function usePracticeTimer() {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    targetSeconds: null,
    mode: "stopwatch",
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const start = useCallback(() => {
    if (state.isRunning && !state.isPaused) return;

    const now = Date.now();

    if (state.isPaused) {
      // Resume from pause
      startTimeRef.current = now - pausedTimeRef.current * 1000;
    } else {
      // Fresh start
      startTimeRef.current = now;
      pausedTimeRef.current = 0;
    }

    setState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setState((prev) => {
        // Check if countdown is complete
        if (prev.mode === "countdown" && prev.targetSeconds !== null) {
          const remaining = prev.targetSeconds - elapsed;
          if (remaining <= 0) {
            clearTimer();
            return {
              ...prev,
              elapsedSeconds: prev.targetSeconds,
              isRunning: false,
              isPaused: false,
            };
          }
        }

        return { ...prev, elapsedSeconds: elapsed };
      });
    }, 100);
  }, [state.isRunning, state.isPaused, clearTimer]);

  const pause = useCallback(() => {
    if (!state.isRunning || state.isPaused) return;

    clearTimer();
    pausedTimeRef.current = state.elapsedSeconds;

    setState((prev) => ({
      ...prev,
      isPaused: true,
    }));
  }, [state.isRunning, state.isPaused, state.elapsedSeconds, clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    setState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
    }));
  }, [clearTimer]);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  const toggle = useCallback(() => {
    if (state.isRunning && !state.isPaused) {
      pause();
    } else {
      start();
    }
  }, [state.isRunning, state.isPaused, start, pause]);

  const setMode = useCallback(
    (mode: "stopwatch" | "countdown") => {
      if (state.isRunning) return;
      setState((prev) => ({ ...prev, mode, elapsedSeconds: 0 }));
    },
    [state.isRunning]
  );

  const setTargetTime = useCallback(
    (seconds: number) => {
      if (state.isRunning) return;
      setState((prev) => ({
        ...prev,
        targetSeconds: seconds,
        mode: "countdown",
      }));
    },
    [state.isRunning]
  );

  // Calculate display values
  const displaySeconds =
    state.mode === "countdown" && state.targetSeconds !== null
      ? Math.max(0, state.targetSeconds - state.elapsedSeconds)
      : state.elapsedSeconds;

  const isComplete =
    state.mode === "countdown" &&
    state.targetSeconds !== null &&
    state.elapsedSeconds >= state.targetSeconds;

  const progress =
    state.mode === "countdown" && state.targetSeconds
      ? (state.elapsedSeconds / state.targetSeconds) * 100
      : 0;

  return {
    ...state,
    displaySeconds,
    isComplete,
    progress,
    start,
    pause,
    stop,
    reset,
    toggle,
    setMode,
    setTargetTime,
  };
}

// Helper function to format seconds as MM:SS or HH:MM:SS
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
