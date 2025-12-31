"use client";

import { SightReading } from "@/components/exercises";
import { Card, CardContent } from "@/components/ui";
import { BookOpen, Eye, Music } from "lucide-react";

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Music Reading</h1>
        <p className="text-muted-foreground mt-1">
          Practice reading musical notation on the staff
        </p>
      </div>

      {/* Sight Reading Exercise */}
      <SightReading />

      {/* Tips section */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Sight Reading Tips</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Look ahead while playing. Train your eyes to stay 1-2 notes ahead
                  of what you&apos;re currently playing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Music className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn to recognize intervals visually. Steps (2nds) are close together,
                  skips (3rds) skip a line or space.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff reference */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5" />
          Staff Note Reference
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Treble Clef Lines (bottom to top)</h4>
            <p className="text-muted-foreground">E - G - B - D - F</p>
            <p className="text-xs text-muted-foreground mt-1">&quot;Every Good Boy Does Fine&quot;</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Treble Clef Spaces (bottom to top)</h4>
            <p className="text-muted-foreground">F - A - C - E</p>
            <p className="text-xs text-muted-foreground mt-1">Spells &quot;FACE&quot;</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ledger Lines Below</h4>
            <p className="text-muted-foreground">Middle C is one ledger line below the staff</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ledger Lines Above</h4>
            <p className="text-muted-foreground">Notes above G5 use ledger lines above the staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
