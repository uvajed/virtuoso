"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import * as Tone from "tone";

interface AudioContextState {
  isReady: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  initialize: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextState | null>(null);

export function AudioContextProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);

  // Check if audio is already started on mount
  useEffect(() => {
    if (Tone.getContext().state === "running") {
      setIsReady(true);
    }
  }, []);

  const initialize = useCallback(async () => {
    if (isReady || isLoading) return;

    setIsLoading(true);
    try {
      await Tone.start();
      Tone.getDestination().volume.value = Tone.gainToDb(volume);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, isLoading, volume]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (Tone.getContext().state === "running") {
      Tone.getDestination().volume.value = Tone.gainToDb(clampedVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (Tone.getContext().state === "running") {
        Tone.getDestination().mute = newMuted;
      }
      return newMuted;
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isReady,
        isLoading,
        isMuted,
        volume,
        initialize,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioContextProvider");
  }
  return context;
}
