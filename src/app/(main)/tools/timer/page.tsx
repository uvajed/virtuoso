"use client";

import { PracticeTimer } from "@/components/audio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TimerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/tools"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Practice Timer</h1>
          <p className="text-muted-foreground text-sm">
            Track and time your practice sessions
          </p>
        </div>
      </div>

      <PracticeTimer />

      <div className="max-w-md mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Tip:</strong> Consistent daily practice is more effective than
          long occasional sessions.
        </p>
        <p>
          Try the Pomodoro technique: 25 minutes of focused practice, then a
          5-minute break.
        </p>
      </div>
    </div>
  );
}
