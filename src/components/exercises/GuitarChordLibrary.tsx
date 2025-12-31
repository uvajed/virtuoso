"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";

interface ChordDiagram {
  name: string;
  category: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  barFret?: number;
  startFret?: number;
}

const CHORDS: ChordDiagram[] = [
  // ========== MAJOR CHORDS ==========
  { name: "C", category: "Major", frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, 0, 1, 0] },
  { name: "D", category: "Major", frets: [null, null, 0, 2, 3, 2], fingers: [null, null, 0, 1, 3, 2] },
  { name: "E", category: "Major", frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  { name: "F", category: "Major", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barFret: 1 },
  { name: "G", category: "Major", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  { name: "A", category: "Major", frets: [null, 0, 2, 2, 2, 0], fingers: [null, 0, 1, 2, 3, 0] },
  { name: "B", category: "Major", frets: [null, 2, 4, 4, 4, 2], fingers: [null, 1, 2, 3, 4, 1], barFret: 2, startFret: 2 },

  // ========== MINOR CHORDS ==========
  { name: "Am", category: "Minor", frets: [null, 0, 2, 2, 1, 0], fingers: [null, 0, 2, 3, 1, 0] },
  { name: "Bm", category: "Minor", frets: [null, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1], barFret: 2, startFret: 2 },
  { name: "Cm", category: "Minor", frets: [null, 3, 5, 5, 4, 3], fingers: [null, 1, 3, 4, 2, 1], barFret: 3, startFret: 3 },
  { name: "Dm", category: "Minor", frets: [null, null, 0, 2, 3, 1], fingers: [null, null, 0, 2, 3, 1] },
  { name: "Em", category: "Minor", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  { name: "Fm", category: "Minor", frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barFret: 1 },
  { name: "Gm", category: "Minor", frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barFret: 3, startFret: 3 },

  // ========== DOMINANT 7TH CHORDS ==========
  { name: "C7", category: "7th", frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, 0] },
  { name: "D7", category: "7th", frets: [null, null, 0, 2, 1, 2], fingers: [null, null, 0, 2, 1, 3] },
  { name: "E7", category: "7th", frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  { name: "F7", category: "7th", frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], barFret: 1 },
  { name: "G7", category: "7th", frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  { name: "A7", category: "7th", frets: [null, 0, 2, 0, 2, 0], fingers: [null, 0, 2, 0, 3, 0] },
  { name: "B7", category: "7th", frets: [null, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, 0, 4], startFret: 1 },

  // ========== MAJOR 7TH CHORDS ==========
  { name: "Cmaj7", category: "Maj7", frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, 0, 0, 0] },
  { name: "Dmaj7", category: "Maj7", frets: [null, null, 0, 2, 2, 2], fingers: [null, null, 0, 1, 1, 1] },
  { name: "Emaj7", category: "Maj7", frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0] },
  { name: "Fmaj7", category: "Maj7", frets: [null, null, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, 0] },
  { name: "Gmaj7", category: "Maj7", frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3] },
  { name: "Amaj7", category: "Maj7", frets: [null, 0, 2, 1, 2, 0], fingers: [null, 0, 2, 1, 3, 0] },
  { name: "Bmaj7", category: "Maj7", frets: [null, 2, 4, 3, 4, 2], fingers: [null, 1, 3, 2, 4, 1], barFret: 2, startFret: 2 },

  // ========== MINOR 7TH CHORDS ==========
  { name: "Am7", category: "Min7", frets: [null, 0, 2, 0, 1, 0], fingers: [null, 0, 2, 0, 1, 0] },
  { name: "Bm7", category: "Min7", frets: [null, 2, 4, 2, 3, 2], fingers: [null, 1, 3, 1, 2, 1], barFret: 2, startFret: 2 },
  { name: "Cm7", category: "Min7", frets: [null, 3, 5, 3, 4, 3], fingers: [null, 1, 3, 1, 2, 1], barFret: 3, startFret: 3 },
  { name: "Dm7", category: "Min7", frets: [null, null, 0, 2, 1, 1], fingers: [null, null, 0, 2, 1, 1] },
  { name: "Em7", category: "Min7", frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
  { name: "Fm7", category: "Min7", frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], barFret: 1 },
  { name: "Gm7", category: "Min7", frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], barFret: 3, startFret: 3 },

  // ========== 9TH CHORDS ==========
  { name: "C9", category: "9th", frets: [null, 3, 2, 3, 3, 3], fingers: [null, 2, 1, 3, 3, 3] },
  { name: "D9", category: "9th", frets: [null, null, 0, 2, 1, 0], fingers: [null, null, 0, 2, 1, 0] },
  { name: "E9", category: "9th", frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3] },
  { name: "G9", category: "9th", frets: [3, 2, 0, 2, 0, 1], fingers: [3, 2, 0, 4, 0, 1] },
  { name: "A9", category: "9th", frets: [null, 0, 2, 4, 2, 3], fingers: [null, 0, 1, 3, 1, 2], startFret: 2 },
  { name: "Cmaj9", category: "9th", frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, 0, 0, 0] },
  { name: "Am9", category: "9th", frets: [null, 0, 2, 4, 1, 0], fingers: [null, 0, 2, 4, 1, 0] },
  { name: "Em9", category: "9th", frets: [0, 2, 0, 0, 0, 2], fingers: [0, 2, 0, 0, 0, 3] },

  // ========== 11TH CHORDS ==========
  { name: "C11", category: "11th", frets: [null, 3, 3, 3, 1, 0], fingers: [null, 2, 3, 4, 1, 0] },
  { name: "D11", category: "11th", frets: [null, null, 0, 0, 1, 0], fingers: [null, null, 0, 0, 1, 0] },
  { name: "E11", category: "11th", frets: [0, 0, 0, 1, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  { name: "G11", category: "11th", frets: [3, 3, 0, 0, 1, 1], fingers: [2, 3, 0, 0, 1, 1] },
  { name: "A11", category: "11th", frets: [null, 0, 0, 0, 0, 0], fingers: [null, 0, 0, 0, 0, 0] },
  { name: "Am11", category: "11th", frets: [null, 0, 0, 0, 1, 0], fingers: [null, 0, 0, 0, 1, 0] },
  { name: "Em11", category: "11th", frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0] },
  { name: "Dm11", category: "11th", frets: [null, null, 0, 0, 1, 1], fingers: [null, null, 0, 0, 1, 1] },

  // ========== 13TH CHORDS ==========
  { name: "C13", category: "13th", frets: [null, 3, 2, 3, 3, 5], fingers: [null, 2, 1, 3, 3, 4] },
  { name: "D13", category: "13th", frets: [null, null, 0, 2, 1, 2], fingers: [null, null, 0, 2, 1, 3] },
  { name: "E13", category: "13th", frets: [0, 2, 0, 1, 2, 0], fingers: [0, 2, 0, 1, 3, 0] },
  { name: "G13", category: "13th", frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0] },
  { name: "A13", category: "13th", frets: [null, 0, 2, 0, 2, 2], fingers: [null, 0, 1, 0, 2, 3] },
  { name: "Am13", category: "13th", frets: [null, 0, 2, 0, 1, 2], fingers: [null, 0, 2, 0, 1, 3] },
  { name: "Em13", category: "13th", frets: [0, 2, 0, 0, 2, 0], fingers: [0, 1, 0, 0, 2, 0] },

  // ========== AUGMENTED CHORDS ==========
  { name: "Caug", category: "Aug", frets: [null, 3, 2, 1, 1, 0], fingers: [null, 4, 3, 1, 2, 0] },
  { name: "Daug", category: "Aug", frets: [null, null, 0, 3, 3, 2], fingers: [null, null, 0, 2, 3, 1] },
  { name: "Eaug", category: "Aug", frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
  { name: "Faug", category: "Aug", frets: [null, null, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1] },
  { name: "Gaug", category: "Aug", frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, 0, 0, 4] },
  { name: "Aaug", category: "Aug", frets: [null, 0, 3, 2, 2, 1], fingers: [null, 0, 4, 2, 3, 1] },
  { name: "Baug", category: "Aug", frets: [null, 2, 1, 0, 0, 3], fingers: [null, 2, 1, 0, 0, 4] },

  // ========== DIMINISHED CHORDS ==========
  { name: "Cdim", category: "Dim", frets: [null, 3, 4, 2, 4, 2], fingers: [null, 2, 3, 1, 4, 1], startFret: 2 },
  { name: "Ddim", category: "Dim", frets: [null, null, 0, 1, 0, 1], fingers: [null, null, 0, 1, 0, 2] },
  { name: "Edim", category: "Dim", frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4], startFret: 2 },
  { name: "Fdim", category: "Dim", frets: [null, null, 3, 4, 3, 4], fingers: [null, null, 1, 3, 2, 4], startFret: 3 },
  { name: "Gdim", category: "Dim", frets: [null, null, 5, 6, 5, 6], fingers: [null, null, 1, 3, 2, 4], startFret: 5 },
  { name: "Adim", category: "Dim", frets: [null, 0, 1, 2, 1, null], fingers: [null, 0, 1, 3, 2, null] },
  { name: "Bdim", category: "Dim", frets: [null, 2, 3, 4, 3, null], fingers: [null, 1, 2, 4, 3, null], startFret: 2 },

  // ========== DIMINISHED 7TH CHORDS ==========
  { name: "Cdim7", category: "Dim7", frets: [null, 3, 4, 2, 4, 2], fingers: [null, 2, 3, 1, 4, 1], startFret: 2 },
  { name: "Ddim7", category: "Dim7", frets: [null, null, 0, 1, 0, 1], fingers: [null, null, 0, 1, 0, 2] },
  { name: "Edim7", category: "Dim7", frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  { name: "Fdim7", category: "Dim7", frets: [1, 2, 3, 1, 3, 1], fingers: [1, 2, 3, 1, 4, 1], barFret: 1 },
  { name: "Gdim7", category: "Dim7", frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4], startFret: 2 },
  { name: "Adim7", category: "Dim7", frets: [null, 0, 1, 2, 1, 2], fingers: [null, 0, 1, 2, 1, 3] },
  { name: "Bdim7", category: "Dim7", frets: [null, 2, 0, 1, 0, 1], fingers: [null, 2, 0, 1, 0, 1] },

  // ========== HALF-DIMINISHED (m7b5) CHORDS ==========
  { name: "Cm7b5", category: "m7b5", frets: [null, 3, 4, 3, 4, null], fingers: [null, 1, 3, 2, 4, null], startFret: 3 },
  { name: "Dm7b5", category: "m7b5", frets: [null, null, 0, 1, 1, 1], fingers: [null, null, 0, 1, 1, 1] },
  { name: "Em7b5", category: "m7b5", frets: [0, 1, 0, 0, 3, 0], fingers: [0, 1, 0, 0, 3, 0] },
  { name: "Fm7b5", category: "m7b5", frets: [1, 2, 1, 1, null, null], fingers: [1, 2, 1, 1, null, null] },
  { name: "Gm7b5", category: "m7b5", frets: [null, null, 5, 6, 6, 6], fingers: [null, null, 1, 2, 3, 4], startFret: 5 },
  { name: "Am7b5", category: "m7b5", frets: [null, 0, 1, 0, 1, 0], fingers: [null, 0, 1, 0, 2, 0] },
  { name: "Bm7b5", category: "m7b5", frets: [null, 2, 3, 2, 3, null], fingers: [null, 1, 3, 2, 4, null], startFret: 2 },

  // ========== SUS2 CHORDS ==========
  { name: "Csus2", category: "Sus", frets: [null, 3, 0, 0, 1, 3], fingers: [null, 2, 0, 0, 1, 3] },
  { name: "Dsus2", category: "Sus", frets: [null, null, 0, 2, 3, 0], fingers: [null, null, 0, 1, 2, 0] },
  { name: "Esus2", category: "Sus", frets: [0, 2, 4, 4, 0, 0], fingers: [0, 1, 3, 4, 0, 0], startFret: 2 },
  { name: "Fsus2", category: "Sus", frets: [null, null, 3, 0, 1, 1], fingers: [null, null, 3, 0, 1, 1] },
  { name: "Gsus2", category: "Sus", frets: [3, 0, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 2, 3] },
  { name: "Asus2", category: "Sus", frets: [null, 0, 2, 2, 0, 0], fingers: [null, 0, 1, 2, 0, 0] },
  { name: "Bsus2", category: "Sus", frets: [null, 2, 4, 4, 2, 2], fingers: [null, 1, 3, 4, 1, 1], barFret: 2, startFret: 2 },

  // ========== SUS4 CHORDS ==========
  { name: "Csus4", category: "Sus", frets: [null, 3, 3, 0, 1, 1], fingers: [null, 3, 4, 0, 1, 1] },
  { name: "Dsus4", category: "Sus", frets: [null, null, 0, 2, 3, 3], fingers: [null, null, 0, 1, 2, 3] },
  { name: "Esus4", category: "Sus", frets: [0, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  { name: "Fsus4", category: "Sus", frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barFret: 1 },
  { name: "Gsus4", category: "Sus", frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4] },
  { name: "Asus4", category: "Sus", frets: [null, 0, 2, 2, 3, 0], fingers: [null, 0, 1, 2, 3, 0] },
  { name: "Bsus4", category: "Sus", frets: [null, 2, 4, 4, 5, 2], fingers: [null, 1, 2, 3, 4, 1], barFret: 2, startFret: 2 },

  // ========== ADD9 CHORDS ==========
  { name: "Cadd9", category: "Add", frets: [null, 3, 2, 0, 3, 0], fingers: [null, 2, 1, 0, 3, 0] },
  { name: "Dadd9", category: "Add", frets: [null, null, 0, 2, 3, 0], fingers: [null, null, 0, 1, 2, 0] },
  { name: "Eadd9", category: "Add", frets: [0, 2, 2, 1, 0, 2], fingers: [0, 2, 3, 1, 0, 4] },
  { name: "Fadd9", category: "Add", frets: [null, null, 3, 2, 1, 3], fingers: [null, null, 3, 2, 1, 4] },
  { name: "Gadd9", category: "Add", frets: [3, 2, 0, 2, 0, 3], fingers: [2, 1, 0, 3, 0, 4] },
  { name: "Aadd9", category: "Add", frets: [null, 0, 2, 4, 2, 0], fingers: [null, 0, 1, 3, 2, 0] },

  // ========== 6TH CHORDS ==========
  { name: "C6", category: "6th", frets: [null, 3, 2, 2, 1, 0], fingers: [null, 4, 2, 3, 1, 0] },
  { name: "D6", category: "6th", frets: [null, null, 0, 2, 0, 2], fingers: [null, null, 0, 1, 0, 2] },
  { name: "E6", category: "6th", frets: [0, 2, 2, 1, 2, 0], fingers: [0, 2, 3, 1, 4, 0] },
  { name: "G6", category: "6th", frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0] },
  { name: "A6", category: "6th", frets: [null, 0, 2, 2, 2, 2], fingers: [null, 0, 1, 1, 1, 1] },
  { name: "Am6", category: "6th", frets: [null, 0, 2, 2, 1, 2], fingers: [null, 0, 2, 3, 1, 4] },
  { name: "Em6", category: "6th", frets: [0, 2, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },

  // ========== POWER CHORDS ==========
  { name: "C5", category: "Power", frets: [null, 3, 5, 5, null, null], fingers: [null, 1, 3, 4, null, null], startFret: 3 },
  { name: "D5", category: "Power", frets: [null, null, 0, 2, 3, null], fingers: [null, null, 0, 1, 2, null] },
  { name: "E5", category: "Power", frets: [0, 2, 2, null, null, null], fingers: [0, 1, 2, null, null, null] },
  { name: "F5", category: "Power", frets: [1, 3, 3, null, null, null], fingers: [1, 3, 4, null, null, null] },
  { name: "G5", category: "Power", frets: [3, 5, 5, null, null, null], fingers: [1, 3, 4, null, null, null], startFret: 3 },
  { name: "A5", category: "Power", frets: [null, 0, 2, 2, null, null], fingers: [null, 0, 1, 2, null, null] },
  { name: "B5", category: "Power", frets: [null, 2, 4, 4, null, null], fingers: [null, 1, 3, 4, null, null], startFret: 2 },
];

const CATEGORIES = [
  "All",
  "Major",
  "Minor",
  "7th",
  "Maj7",
  "Min7",
  "9th",
  "11th",
  "13th",
  "Aug",
  "Dim",
  "Dim7",
  "m7b5",
  "Sus",
  "Add",
  "6th",
  "Power",
];

function ChordDiagramSVG({ chord }: { chord: ChordDiagram }) {
  const startFret = chord.startFret || 1;
  const fretCount = 5;
  const stringCount = 6;

  const width = 120;
  const height = 150;
  const padding = 20;
  const fretSpacing = (height - padding * 2) / fretCount;
  const stringSpacing = (width - padding * 2) / (stringCount - 1);

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Nut or fret indicator */}
      {startFret === 1 ? (
        <rect x={padding} y={padding - 4} width={width - padding * 2} height={4} fill="currentColor" />
      ) : (
        <text x={padding - 12} y={padding + fretSpacing / 2} fontSize="10" className="fill-current">
          {startFret}fr
        </text>
      )}

      {/* Frets */}
      {Array.from({ length: fretCount + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding}
          y1={padding + i * fretSpacing}
          x2={width - padding}
          y2={padding + i * fretSpacing}
          stroke="currentColor"
          strokeWidth={i === 0 ? 0 : 1}
          opacity={0.3}
        />
      ))}

      {/* Strings */}
      {Array.from({ length: stringCount }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={padding + i * stringSpacing}
          y1={padding}
          x2={padding + i * stringSpacing}
          y2={height - padding}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {/* Bar if present */}
      {chord.barFret && (
        <rect
          x={padding - 3}
          y={padding + (chord.barFret - startFret + 0.3) * fretSpacing}
          width={width - padding * 2 + 6}
          height={fretSpacing * 0.4}
          rx={4}
          className="fill-primary"
        />
      )}

      {/* Finger positions */}
      {chord.frets.map((fret, stringIndex) => {
        const x = padding + stringIndex * stringSpacing;

        if (fret === null) {
          // X for muted string
          return (
            <text
              key={stringIndex}
              x={x}
              y={padding - 8}
              textAnchor="middle"
              fontSize="12"
              className="fill-current"
            >
              ×
            </text>
          );
        }

        if (fret === 0) {
          // O for open string
          return (
            <circle
              key={stringIndex}
              cx={x}
              cy={padding - 10}
              r={5}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          );
        }

        // Don't show individual dots for bar chord positions at the bar fret
        if (chord.barFret && fret === chord.barFret && stringIndex !== 0) {
          return null;
        }

        const adjustedFret = fret - startFret + 1;
        const y = padding + (adjustedFret - 0.5) * fretSpacing;

        return (
          <circle
            key={stringIndex}
            cx={x}
            cy={y}
            r={8}
            className="fill-primary"
          />
        );
      })}
    </svg>
  );
}

export function GuitarChordLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChord, setSelectedChord] = useState<ChordDiagram | null>(CHORDS[0]);

  const filteredChords = selectedCategory === "All"
    ? CHORDS
    : CHORDS.filter((c) => c.category === selectedCategory);

  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case "Major": return "Bright, happy sounding chords";
      case "Minor": return "Darker, melancholic sounding chords";
      case "7th": return "Dominant 7th - bluesy, tension-filled";
      case "Maj7": return "Major 7th - jazzy, dreamy quality";
      case "Min7": return "Minor 7th - smooth jazz and R&B";
      case "9th": return "Extended chords with rich harmonics";
      case "11th": return "Complex chords with suspended feel";
      case "13th": return "Full, orchestral jazz voicings";
      case "Aug": return "Augmented - tense, unresolved";
      case "Dim": return "Diminished - dark, mysterious";
      case "Dim7": return "Fully diminished - symmetric, eerie";
      case "m7b5": return "Half-diminished - jazz minor ii chord";
      case "Sus": return "Suspended - neither major nor minor";
      case "Add": return "Added tones for color";
      case "6th": return "Sweet, vintage jazz voicings";
      case "Power": return "Root + 5th - rock and metal";
      default: return "All chord types";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guitar Chord Library</CardTitle>
        <p className="text-sm text-muted-foreground">
          {CHORDS.length} chords across {CATEGORIES.length - 1} categories
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category filter */}
        <div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {getCategoryDescription(selectedCategory)}
          </p>
        </div>

        {/* Chord selection */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {filteredChords.map((chord) => (
            <Button
              key={chord.name}
              variant={selectedChord?.name === chord.name ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedChord(chord)}
              className="text-xs"
            >
              {chord.name}
            </Button>
          ))}
        </div>

        {/* Selected chord diagram */}
        {selectedChord && (
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedChord.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedChord.category} chord</p>
              <ChordDiagramSVG chord={selectedChord} />
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Strings: E A D G B E (low to high)</p>
                {selectedChord.barFret && (
                  <p className="text-primary">Bar chord at fret {selectedChord.barFret}</p>
                )}
                {selectedChord.startFret && selectedChord.startFret > 1 && (
                  <p className="text-primary">Starting at fret {selectedChord.startFret}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
