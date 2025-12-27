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
  // Major chords
  { name: "C", category: "Major", frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, 0, 1, 0] },
  { name: "D", category: "Major", frets: [null, null, 0, 2, 3, 2], fingers: [null, null, 0, 1, 3, 2] },
  { name: "E", category: "Major", frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  { name: "F", category: "Major", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barFret: 1 },
  { name: "G", category: "Major", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  { name: "A", category: "Major", frets: [null, 0, 2, 2, 2, 0], fingers: [null, 0, 1, 2, 3, 0] },
  { name: "B", category: "Major", frets: [null, 2, 4, 4, 4, 2], fingers: [null, 1, 2, 3, 4, 1], barFret: 2, startFret: 2 },

  // Minor chords
  { name: "Am", category: "Minor", frets: [null, 0, 2, 2, 1, 0], fingers: [null, 0, 2, 3, 1, 0] },
  { name: "Bm", category: "Minor", frets: [null, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1], barFret: 2, startFret: 2 },
  { name: "Cm", category: "Minor", frets: [null, 3, 5, 5, 4, 3], fingers: [null, 1, 3, 4, 2, 1], barFret: 3, startFret: 3 },
  { name: "Dm", category: "Minor", frets: [null, null, 0, 2, 3, 1], fingers: [null, null, 0, 2, 3, 1] },
  { name: "Em", category: "Minor", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  { name: "Fm", category: "Minor", frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barFret: 1 },
  { name: "Gm", category: "Minor", frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barFret: 3, startFret: 3 },

  // 7th chords
  { name: "C7", category: "7th", frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, 0] },
  { name: "D7", category: "7th", frets: [null, null, 0, 2, 1, 2], fingers: [null, null, 0, 2, 1, 3] },
  { name: "E7", category: "7th", frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  { name: "G7", category: "7th", frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  { name: "A7", category: "7th", frets: [null, 0, 2, 0, 2, 0], fingers: [null, 0, 2, 0, 3, 0] },
  { name: "B7", category: "7th", frets: [null, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, 0, 4], startFret: 1 },
];

const CATEGORIES = ["All", "Major", "Minor", "7th"];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guitar Chord Library</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a chord to see the fingering diagram
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category filter */}
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

        {/* Chord selection */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {filteredChords.map((chord) => (
            <Button
              key={chord.name}
              variant={selectedChord?.name === chord.name ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedChord(chord)}
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
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
