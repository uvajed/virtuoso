"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { Music, ArrowLeft, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission - in production, this would send to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Virtuoso</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          {!submitted ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl">Delete Account</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  Request deletion of your Virtuoso account and all associated data.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-500 mb-1">Warning: This action is irreversible</p>
                      <p className="text-muted-foreground">
                        Deleting your account will permanently remove all your data, including:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Your profile and account information</li>
                        <li>All practice progress and history</li>
                        <li>Achievements and XP earned</li>
                        <li>Streak records</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your account email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2">
                      Reason for leaving (optional)
                    </label>
                    <textarea
                      id="reason"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                      placeholder="Help us improve by sharing why you're leaving..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-red-500 hover:bg-red-600"
                      disabled={loading || !email}
                    >
                      {loading ? "Submitting..." : "Request Account Deletion"}
                    </Button>
                  </div>
                </form>

                <div className="text-sm text-muted-foreground border-t border-border pt-4">
                  <p>
                    <strong>What happens next:</strong>
                  </p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>We&apos;ll verify your email address</li>
                    <li>You&apos;ll receive a confirmation email</li>
                    <li>Your data will be deleted within 30 days</li>
                    <li>You&apos;ll receive a final confirmation when complete</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ve received your account deletion request for <strong>{email}</strong>.
                </p>
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg text-left">
                  <p className="font-medium mb-2">Next steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your email for a verification link</li>
                    <li>Click the link to confirm deletion</li>
                    <li>Your data will be removed within 30 days</li>
                  </ul>
                </div>
                <Link href="/" className="inline-block mt-6">
                  <Button variant="outline">Return to Home</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Changed your mind?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>{" "}
            to continue using Virtuoso.
          </p>
        </div>
      </div>
    </div>
  );
}
