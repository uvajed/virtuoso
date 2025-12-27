"use client";

import { Tuner } from "@/components/audio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TunerPage() {
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
          <h1 className="text-2xl font-bold">Chromatic Tuner</h1>
          <p className="text-muted-foreground text-sm">
            Tune your instrument using your microphone
          </p>
        </div>
      </div>

      <Tuner />

      <div className="max-w-md mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Tip:</strong> Play one note at a time and let it ring out for
          accurate detection.
        </p>
        <p>
          When the needle is centered and green, your note is in tune.
        </p>
      </div>
    </div>
  );
}
