"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, Progress } from "@/components/ui";
import {
  Music,
  Piano,
  Guitar,
  Mic2,
  Headphones,
  BookOpen,
  Target,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Rocket,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingData {
  experience: "beginner" | "intermediate" | "advanced" | null;
  instruments: string[];
  goals: string[];
  practiceTime: "15" | "30" | "60" | null;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  userName?: string;
}

const experienceLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description: "I'm just starting my musical journey",
    icon: Sparkles,
    color: "bg-emerald-500",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "I know the basics and want to improve",
    icon: GraduationCap,
    color: "bg-blue-500",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "I'm experienced and want to master skills",
    icon: Rocket,
    color: "bg-purple-500",
  },
];

const instruments = [
  { id: "piano", label: "Piano/Keyboard", icon: Piano, color: "bg-emerald-500" },
  { id: "guitar", label: "Guitar", icon: Guitar, color: "bg-orange-500" },
  { id: "voice", label: "Voice/Singing", icon: Mic2, color: "bg-pink-500" },
  { id: "theory", label: "Music Theory", icon: BookOpen, color: "bg-blue-500" },
  { id: "ear-training", label: "Ear Training", icon: Headphones, color: "bg-purple-500" },
];

const goals = [
  { id: "read-music", label: "Read sheet music fluently" },
  { id: "play-songs", label: "Play my favorite songs" },
  { id: "compose", label: "Write my own music" },
  { id: "improve-ear", label: "Develop perfect pitch" },
  { id: "theory", label: "Understand music theory deeply" },
  { id: "improvise", label: "Improvise and jam" },
];

const practiceTimes = [
  { id: "15", label: "15 min", description: "Quick daily sessions" },
  { id: "30", label: "30 min", description: "Balanced practice" },
  { id: "60", label: "60 min", description: "Deep focused practice" },
];

export function OnboardingFlow({ onComplete, userName }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    experience: null,
    instruments: [],
    goals: [],
    practiceTime: null,
  });

  const totalSteps = 4;

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return data.experience !== null;
      case 1:
        return data.instruments.length > 0;
      case 2:
        return data.goals.length > 0;
      case 3:
        return data.practiceTime !== null;
      default:
        return false;
    }
  }, [step, data]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleInstrument = (id: string) => {
    setData(prev => ({
      ...prev,
      instruments: prev.instruments.includes(id)
        ? prev.instruments.filter(i => i !== id)
        : [...prev.instruments, id],
    }));
  };

  const toggleGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter(g => g !== id)
        : [...prev.goals, id],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step + 1} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} />
        </div>

        <Card className="border-0 shadow-xl bg-card">
          <CardContent className="p-8">
            {/* Step 0: Welcome & Experience */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                    <Music className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome{userName ? `, ${userName}` : ""}!
                  </h1>
                  <p className="text-muted-foreground">
                    Let's personalize your musical journey. What's your experience level?
                  </p>
                </div>

                <div className="grid gap-3">
                  {experienceLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = data.experience === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => setData(prev => ({ ...prev, experience: level.id as OnboardingData["experience"] }))}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("p-3 rounded-xl", level.color)}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Instruments */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">What do you want to learn?</h2>
                  <p className="text-muted-foreground">
                    Select all that interest you (you can change this later)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {instruments.map((instrument) => {
                    const Icon = instrument.icon;
                    const isSelected = data.instruments.includes(instrument.id);
                    return (
                      <button
                        key={instrument.id}
                        onClick={() => toggleInstrument(instrument.id)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("p-3 rounded-xl", instrument.color)}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-center">{instrument.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
                  <p className="text-muted-foreground">
                    Select your musical aspirations
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((goal) => {
                    const isSelected = data.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span className="font-medium">{goal.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Practice Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Daily practice goal</h2>
                  <p className="text-muted-foreground">
                    How much time can you dedicate each day?
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {practiceTimes.map((time) => {
                    const isSelected = data.practiceTime === time.id;
                    return (
                      <button
                        key={time.id}
                        onClick={() => setData(prev => ({ ...prev, practiceTime: time.id as OnboardingData["practiceTime"] }))}
                        className={cn(
                          "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <span className="text-2xl font-bold">{time.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{time.description}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  You can always adjust this in your settings
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                {step === totalSteps - 1 ? "Get Started" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
