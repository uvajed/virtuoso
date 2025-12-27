"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import * as Tone from "tone";

interface MetronomeOptions {
  bpm?: number;
  beatsPerMeasure?: number;
  accentFirst?: boolean;
}

interface MetronomeState {
  bpm: number;
  beatsPerMeasure: number;
  currentBeat: number;
  isPlaying: boolean;
  accentFirst: boolean;
}

export function useMetronome(options: MetronomeOptions = {}) {
  const {
    bpm: initialBpm = 120,
    beatsPerMeasure: initialBeats = 4,
    accentFirst: initialAccent = true,
  } = options;

  const [state, setState] = useState<MetronomeState>({
    bpm: initialBpm,
    beatsPerMeasure: initialBeats,
    currentBeat: 0,
    isPlaying: false,
    accentFirst: initialAccent,
  });

  const synthRef = useRef<Tone.Synth | null>(null);
  const accentSynthRef = useRef<Tone.Synth | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  // Initialize synths
  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();

    accentSynthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
      accentSynthRef.current?.dispose();
      sequenceRef.current?.dispose();
    };
  }, []);

  const createSequence = useCallback(() => {
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }

    const beats = Array.from({ length: state.beatsPerMeasure }, (_, i) => i);

    sequenceRef.current = new Tone.Sequence(
      (time, beat) => {
        setState((prev) => ({ ...prev, currentBeat: beat + 1 }));

        if (beat === 0 && state.accentFirst) {
          accentSynthRef.current?.triggerAttackRelease("C6", "32n", time);
        } else {
          synthRef.current?.triggerAttackRelease("G5", "32n", time);
        }
      },
      beats,
      "4n"
    );

    sequenceRef.current.loop = true;
  }, [state.beatsPerMeasure, state.accentFirst]);

  const start = useCallback(async () => {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }

    Tone.getTransport().bpm.value = state.bpm;
    createSequence();
    sequenceRef.current?.start(0);
    Tone.getTransport().start();

    setState((prev) => ({ ...prev, isPlaying: true, currentBeat: 0 }));
  }, [state.bpm, createSequence]);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    sequenceRef.current?.stop();

    setState((prev) => ({ ...prev, isPlaying: false, currentBeat: 0 }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      stop();
    } else {
      start();
    }
  }, [state.isPlaying, start, stop]);

  const setBpm = useCallback(
    (newBpm: number) => {
      const clampedBpm = Math.max(20, Math.min(300, newBpm));
      setState((prev) => ({ ...prev, bpm: clampedBpm }));

      if (state.isPlaying) {
        Tone.getTransport().bpm.value = clampedBpm;
      }
    },
    [state.isPlaying]
  );

  const setBeatsPerMeasure = useCallback(
    (beats: number) => {
      const clampedBeats = Math.max(1, Math.min(12, beats));
      setState((prev) => ({ ...prev, beatsPerMeasure: clampedBeats }));

      if (state.isPlaying) {
        stop();
        setTimeout(() => start(), 100);
      }
    },
    [state.isPlaying, start, stop]
  );

  const setAccentFirst = useCallback(
    (accent: boolean) => {
      setState((prev) => ({ ...prev, accentFirst: accent }));

      if (state.isPlaying) {
        createSequence();
      }
    },
    [state.isPlaying, createSequence]
  );

  return {
    ...state,
    start,
    stop,
    toggle,
    setBpm,
    setBeatsPerMeasure,
    setAccentFirst,
  };
}
