"use client";

import { Metronome } from "@/components/audio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MetronomePage() {
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
          <h1 className="text-2xl font-bold">Metronome</h1>
          <p className="text-muted-foreground text-sm">
            Keep perfect time while practicing
          </p>
        </div>
      </div>

      <Metronome />

      <div className="max-w-md mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Tip:</strong> Start slow and gradually increase tempo as you
          master a piece.
        </p>
        <p>
          Use the accent on the first beat to help feel the start of each
          measure.
        </p>
      </div>
    </div>
  );
}
