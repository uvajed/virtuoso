import * as Tone from "tone";

// Salamander Grand Piano samples - free, high-quality piano samples
// Using a subset of notes and letting Tone.js interpolate the rest
const PIANO_SAMPLES_BASE_URL =
  "https://tonejs.github.io/audio/salamander/";

// Sample mapping - we load a subset and Tone.js interpolates
const SAMPLE_NOTES: Record<string, string> = {
  A0: "A0.mp3",
  C1: "C1.mp3",
  "D#1": "Ds1.mp3",
  "F#1": "Fs1.mp3",
  A1: "A1.mp3",
  C2: "C2.mp3",
  "D#2": "Ds2.mp3",
  "F#2": "Fs2.mp3",
  A2: "A2.mp3",
  C3: "C3.mp3",
  "D#3": "Ds3.mp3",
  "F#3": "Fs3.mp3",
  A3: "A3.mp3",
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
  "D#5": "Ds5.mp3",
  "F#5": "Fs5.mp3",
  A5: "A5.mp3",
  C6: "C6.mp3",
  "D#6": "Ds6.mp3",
  "F#6": "Fs6.mp3",
  A6: "A6.mp3",
  C7: "C7.mp3",
  "D#7": "Ds7.mp3",
  "F#7": "Fs7.mp3",
  A7: "A7.mp3",
  C8: "C8.mp3",
};

let pianoSampler: Tone.Sampler | null = null;
let isLoading = false;
let isLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Convert sample notes to URLs
function getSampleUrls(): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const [note, file] of Object.entries(SAMPLE_NOTES)) {
    urls[note] = file;
  }
  return urls;
}

export async function initPiano(): Promise<void> {
  if (isLoaded && pianoSampler) {
    return;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  isLoading = true;

  loadingPromise = new Promise((resolve, reject) => {
    pianoSampler = new Tone.Sampler({
      urls: getSampleUrls(),
      baseUrl: PIANO_SAMPLES_BASE_URL,
      release: 1,
      onload: () => {
        isLoaded = true;
        isLoading = false;
        console.log("Piano samples loaded");
        resolve();
      },
      onerror: (error) => {
        isLoading = false;
        console.error("Failed to load piano samples:", error);
        reject(error);
      },
    }).toDestination();
  });

  return loadingPromise;
}

export function playPianoNote(note: string, duration?: number | string): void {
  if (!pianoSampler || !isLoaded) {
    console.warn("Piano not loaded yet");
    return;
  }

  // Start audio context if not started
  if (Tone.getContext().state !== "running") {
    Tone.start();
  }

  if (duration) {
    pianoSampler.triggerAttackRelease(note, duration);
  } else {
    pianoSampler.triggerAttack(note);
  }
}

export function stopPianoNote(note: string): void {
  if (!pianoSampler || !isLoaded) return;
  pianoSampler.triggerRelease(note);
}

export function stopAllPianoNotes(): void {
  if (!pianoSampler || !isLoaded) return;
  pianoSampler.releaseAll();
}

export function isPianoLoaded(): boolean {
  return isLoaded;
}

export function isPianoLoading(): boolean {
  return isLoading;
}

// Play a chord (multiple notes at once)
export function playChord(notes: string[], duration?: number | string): void {
  if (!pianoSampler || !isLoaded) return;

  if (Tone.getContext().state !== "running") {
    Tone.start();
  }

  if (duration) {
    pianoSampler.triggerAttackRelease(notes, duration);
  } else {
    pianoSampler.triggerAttack(notes);
  }
}

// Play a sequence of notes
export function playSequence(
  notes: string[],
  noteDuration: number = 0.5,
  tempo: number = 120
): void {
  if (!pianoSampler || !isLoaded) return;

  if (Tone.getContext().state !== "running") {
    Tone.start();
  }

  const now = Tone.now();
  const beatDuration = 60 / tempo;

  notes.forEach((note, index) => {
    const time = now + index * beatDuration;
    pianoSampler!.triggerAttackRelease(note, noteDuration, time);
  });
}
