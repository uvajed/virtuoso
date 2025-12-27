"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import PitchFinder from "pitchfinder";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface PitchInfo {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
}

interface PitchDetectionState {
  isListening: boolean;
  pitch: PitchInfo | null;
  error: string | null;
  hasPermission: boolean | null;
}

function frequencyToNote(frequency: number): PitchInfo {
  // A4 = 440 Hz
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);

  const halfSteps = Math.round(12 * Math.log2(frequency / C0));
  const octave = Math.floor(halfSteps / 12);
  const noteIndex = halfSteps % 12;

  // Calculate cents deviation
  const exactHalfSteps = 12 * Math.log2(frequency / C0);
  const cents = Math.round((exactHalfSteps - halfSteps) * 100);

  return {
    frequency,
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

export function usePitchDetection() {
  const [state, setState] = useState<PitchDetectionState>({
    isListening: false,
    pitch: null,
    error: null,
    hasPermission: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectorRef = useRef<ReturnType<typeof PitchFinder.YIN> | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current?.state !== "closed") {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const start = useCallback(async () => {
    try {
      cleanup();

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setState((prev) => ({ ...prev, hasPermission: true, error: null }));

      // Create audio context and analyser
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Initialize pitch detector (YIN algorithm)
      detectorRef.current = PitchFinder.YIN({ sampleRate: audioContext.sampleRate });

      setState((prev) => ({ ...prev, isListening: true }));

      // Start detection loop
      const buffer = new Float32Array(analyser.fftSize);

      const detect = () => {
        if (!analyserRef.current || !detectorRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);
        const pitch = detectorRef.current(buffer);

        if (pitch && pitch > 20 && pitch < 5000) {
          const noteInfo = frequencyToNote(pitch);
          setState((prev) => ({ ...prev, pitch: noteInfo }));
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to access microphone";

      if (errorMessage.includes("Permission denied") || errorMessage.includes("NotAllowed")) {
        setState((prev) => ({
          ...prev,
          hasPermission: false,
          error: "Microphone permission denied",
        }));
      } else {
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setState((prev) => ({ ...prev, isListening: false, pitch: null }));
  }, [cleanup]);

  const toggle = useCallback(() => {
    if (state.isListening) {
      stop();
    } else {
      start();
    }
  }, [state.isListening, start, stop]);

  return {
    ...state,
    start,
    stop,
    toggle,
  };
}
