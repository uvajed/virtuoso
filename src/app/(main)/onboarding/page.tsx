"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { OnboardingFlow } from "@/components/onboarding";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      // Check if user has completed onboarding
      const hasOnboarded = localStorage.getItem("virtuoso_onboarding_complete");
      if (hasOnboarded) {
        router.push("/dashboard");
        return;
      }
      setIsChecking(false);
    }
  }, [status, router]);

  const handleComplete = (data: {
    experience: "beginner" | "intermediate" | "advanced" | null;
    instruments: string[];
    goals: string[];
    practiceTime: "15" | "30" | "60" | null;
  }) => {
    // Save onboarding data to localStorage (in production, save to database)
    localStorage.setItem("virtuoso_onboarding_complete", "true");
    localStorage.setItem("virtuoso_user_preferences", JSON.stringify(data));

    // Redirect to dashboard
    router.push("/dashboard");
  };

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      userName={session?.user?.name?.split(" ")[0]}
    />
  );
}
