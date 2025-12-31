"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CheckCircle, XCircle, RefreshCw, TrendingUp, Sparkles } from "lucide-react";

type Difficulty = "beginner" | "intermediate" | "advanced";

const CHORD_TYPES = [
  // Beginner chords
  { name: "Major", symbol: "", intervals: [0, 4, 7], description: "Happy, stable", difficulty: "beginner" as Difficulty },
  { name: "Minor", symbol: "m", intervals: [0, 3, 7], description: "Sad, dark", difficulty: "beginner" as Difficulty },
  { name: "Diminished", symbol: "dim", intervals: [0, 3, 6], description: "Tense, unstable", difficulty: "beginner" as Difficulty },
  { name: "Augmented", symbol: "aug", intervals: [0, 4, 8], description: "Mysterious, dreamy", difficulty: "beginner" as Difficulty },
  // Intermediate chords
  { name: "Major 7th", symbol: "maj7", intervals: [0, 4, 7, 11], description: "Jazzy, smooth", difficulty: "intermediate" as Difficulty },
  { name: "Minor 7th", symbol: "m7", intervals: [0, 3, 7, 10], description: "Mellow, soulful", difficulty: "intermediate" as Difficulty },
  { name: "Dominant 7th", symbol: "7", intervals: [0, 4, 7, 10], description: "Bluesy, wants to resolve", difficulty: "intermediate" as Difficulty },
  { name: "Suspended 4th", symbol: "sus4", intervals: [0, 5, 7], description: "Open, unresolved", difficulty: "intermediate" as Difficulty },
  // Advanced chords
  { name: "Major 9th", symbol: "maj9", intervals: [0, 4, 7, 11, 14], description: "Rich, dreamy", difficulty: "advanced" as Difficulty },
  { name: "Minor 9th", symbol: "m9", intervals: [0, 3, 7, 10, 14], description: "Smooth, soulful", difficulty: "advanced" as Difficulty },
  { name: "Dominant 9th", symbol: "9", intervals: [0, 4, 7, 10, 14], description: "Funky, R&B", difficulty: "advanced" as Difficulty },
  { name: "11th", symbol: "11", intervals: [0, 4, 7, 10, 14, 17], description: "Complex, jazzy", difficulty: "advanced" as Difficulty },
  { name: "Minor 11th", symbol: "m11", intervals: [0, 3, 7, 10, 14, 17], description: "Deep, modal", difficulty: "advanced" as Difficulty },
  { name: "13th", symbol: "13", intervals: [0, 4, 7, 10, 14, 21], description: "Full, orchestral", difficulty: "advanced" as Difficulty },
  { name: "Minor 13th", symbol: "m13", intervals: [0, 3, 7, 10, 14, 21], description: "Lush, cinematic", difficulty: "advanced" as Difficulty },
];

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "bg-emerald-500", minScore: 5, minAccuracy: 0.8 },
  intermediate: { label: "Intermediate", color: "bg-blue-500", minScore: 5, minAccuracy: 0.8 },
  advanced: { label: "Advanced", color: "bg-purple-500", minScore: 5, minAccuracy: 0.8 },
};

const ROOT_NOTES = ["C", "D", "E", "F", "G", "A", "B"];

interface Question {
  root: string;
  chordType: typeof CHORD_TYPES[number];
}

function generateQuestion(difficulty: Difficulty): Question {
  const root = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
  const availableChords = CHORD_TYPES.filter(c => c.difficulty === difficulty);
  const chordType = availableChords[Math.floor(Math.random() * availableChords.length)];
  return { root, chordType };
}

function ChordDiagram({ intervals }: { intervals: number[] }) {
  const allNotes = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex justify-center gap-1">
      {allNotes.map((note) => {
        const isInChord = intervals.includes(note);
        const isRoot = note === 0;

        return (
          <div
            key={note}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              isRoot
                ? "bg-primary text-primary-foreground"
                : isInChord
                ? "bg-primary/60 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {note}
          </div>
        );
      })}
    </div>
  );
}

function PianoChord({ intervals }: { intervals: number[] }) {
  // Extended piano for 9th, 11th, 13th chords (2 octaves)
  const hasExtended = intervals.some(i => i > 12);
  const octaves = hasExtended ? 2 : 1;

  // Build white key indices for multiple octaves
  const baseWhiteKeys = [0, 2, 4, 5, 7, 9, 11];
  const whiteKeyIndices: number[] = [];
  for (let oct = 0; oct < octaves; oct++) {
    baseWhiteKeys.forEach(k => whiteKeyIndices.push(k + oct * 12));
  }
  whiteKeyIndices.push(octaves * 12); // Final C

  // Black key positions - which white key they sit after (0-indexed)
  // C#/Db after C(0), D#/Eb after D(1), F#/Gb after F(3), G#/Ab after G(4), A#/Bb after A(5)
  const blackKeyPositions = [0, 1, 3, 4, 5]; // After which white key index
  const baseBlackNotes = [1, 3, 6, 8, 10]; // Semitone values

  const blackKeyData: { note: number; whiteKeyIndex: number }[] = [];
  for (let oct = 0; oct < octaves; oct++) {
    blackKeyPositions.forEach((pos, i) => {
      blackKeyData.push({
        note: baseBlackNotes[i] + oct * 12,
        whiteKeyIndex: pos + oct * 7
      });
    });
  }

  const checkNote = (note: number) => intervals.includes(note) || intervals.includes(note % 12);
  const whiteKeyCount = whiteKeyIndices.length;
  const whiteKeyWidth = 100 / whiteKeyCount;

  return (
    <div className={`relative h-24 mx-auto ${hasExtended ? "w-full max-w-md" : "w-72"}`}>
      {/* White keys */}
      <div className="flex h-full gap-0.5">
        {whiteKeyIndices.map((note, i) => {
          const isInChord = checkNote(note);
          return (
            <div
              key={i}
              className={`flex-1 rounded-b-md transition-colors shadow-sm ${
                isInChord ? "bg-primary" : "bg-white border border-gray-200"
              }`}
            />
          );
        })}
      </div>
      {/* Black keys */}
      {blackKeyData.map(({ note, whiteKeyIndex }, i) => {
        const isInChord = checkNote(note);
        // Position black key between two white keys
        const leftPercent = ((whiteKeyIndex + 1) * whiteKeyWidth) - (whiteKeyWidth * 0.3);
        return (
          <div
            key={i}
            className={`absolute top-0 h-14 rounded-b-md transition-colors shadow-md ${
              isInChord ? "bg-primary" : "bg-gray-900"
            }`}
            style={{
              left: `${leftPercent}%`,
              width: `${whiteKeyWidth * 0.6}%`
            }}
          />
        );
      })}
    </div>
  );
}

export function ChordQuiz() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [question, setQuestion] = useState<Question>(() => generateQuestion("beginner"));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [showLevelUpSuggestion, setShowLevelUpSuggestion] = useState(false);
  const [streak, setStreak] = useState(0);

  const availableChords = useMemo(() =>
    CHORD_TYPES.filter(c => c.difficulty === difficulty),
    [difficulty]
  );

  const accuracy = score.total > 0 ? score.correct / score.total : 0;
  const nextDifficulty = difficulty === "beginner" ? "intermediate" : difficulty === "intermediate" ? "advanced" : null;

  const checkAnswer = useCallback((chordName: string) => {
    setSelected(chordName);
    setShowResult(true);
    const isCorrect = chordName === question.chordType.name;

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Check if user should level up (5 correct in a row or 80%+ accuracy with at least 5 answers)
      const newTotal = score.total + 1;
      const newCorrect = score.correct + 1;
      const newAccuracy = newCorrect / newTotal;

      if (nextDifficulty && (newStreak >= 5 || (newTotal >= 5 && newAccuracy >= 0.8))) {
        setShowLevelUpSuggestion(true);
      }
    } else {
      setStreak(0);
    }
  }, [question.chordType.name, streak, score, nextDifficulty]);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(difficulty));
    setSelected(null);
    setShowResult(false);
    setShowLevelUpSuggestion(false);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setQuestion(generateQuestion(newDifficulty));
    setSelected(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setShowLevelUpSuggestion(false);
  }, []);

  const levelUp = useCallback(() => {
    if (nextDifficulty) {
      changeDifficulty(nextDifficulty);
    }
  }, [nextDifficulty, changeDifficulty]);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setShowLevelUpSuggestion(false);
    nextQuestion();
  }, [nextQuestion]);

  const isCorrect = selected === question.chordType.name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chord Identification</CardTitle>
          <div className="text-sm text-muted-foreground">
            Score: {score.correct}/{score.total}
            {streak >= 3 && <span className="ml-2 text-primary">🔥 {streak}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty Selector */}
        <div className="flex justify-center gap-2">
          {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((level) => {
            const config = DIFFICULTY_CONFIG[level];
            const isActive = difficulty === level;
            return (
              <button
                key={level}
                onClick={() => changeDifficulty(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? `${config.color} text-white`
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            What type of chord is this?
          </p>
          <p className="text-lg font-medium text-muted-foreground mb-4">
            Root: {question.root}
          </p>
          <div className="bg-muted/50 rounded-lg p-6">
            <PianoChord intervals={question.chordType.intervals} />
            {showResult && (
              <p className="text-2xl font-bold mt-4 text-primary">
                {question.root}{question.chordType.symbol}
              </p>
            )}
          </div>
        </div>

        {/* Level Up Suggestion */}
        {showLevelUpSuggestion && nextDifficulty && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary">Great job! Ready for a challenge?</p>
                <p className="text-sm text-muted-foreground">Try {DIFFICULTY_CONFIG[nextDifficulty].label} level</p>
              </div>
            </div>
            <Button size="sm" onClick={levelUp} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Level Up
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableChords.map((chord) => {
            const isSelected = selected === chord.name;
            const isAnswer = question.chordType.name === chord.name;

            let className = "";
            if (showResult) {
              if (isAnswer) {
                className = "bg-green-500 hover:bg-green-500 text-white border-green-500";
              } else if (isSelected && !isAnswer) {
                className = "bg-red-500 hover:bg-red-500 text-white border-red-500";
              }
            }

            return (
              <Button
                key={chord.name}
                variant="outline"
                className={`h-auto py-3 ${className}`}
                onClick={() => !showResult && checkAnswer(chord.name)}
                disabled={showResult}
              >
                <div className="text-center">
                  <div className="font-medium">{chord.name}</div>
                  <div className="text-xs opacity-70">{chord.symbol || "—"}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {showResult && !showLevelUpSuggestion && (
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
            isCorrect ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Correct! {question.chordType.description}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>It was {question.chordType.name} - {question.chordType.description}</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {showResult && (
            <Button onClick={nextQuestion}>Next Question</Button>
          )}
          {score.total > 0 && (
            <Button variant="outline" onClick={resetQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
