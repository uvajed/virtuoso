"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Music, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Privacy Policy</CardTitle>
              <p className="text-muted-foreground">Last updated: December 30, 2024</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                <p className="text-muted-foreground">
                  Virtuoso (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, and safeguard your information when you use our
                  music practice application available on web and Android platforms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
                <p className="text-muted-foreground mb-2">We collect the following types of information:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Account Information:</strong> Email address and password when you create an account</li>
                  <li><strong>Practice Data:</strong> Your exercise scores, progress, achievements, streaks, and practice session history</li>
                  <li><strong>Device Permissions:</strong> Microphone access (only when using the tuner or voice training features, with your explicit consent)</li>
                  <li><strong>Usage Data:</strong> Basic app usage statistics to improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>To provide and maintain the app functionality</li>
                  <li>To track your learning progress and achievements</li>
                  <li>To improve our services and user experience</li>
                  <li>To authenticate your account and maintain security</li>
                  <li>To communicate important updates about the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Data Storage and Security</h2>
                <p className="text-muted-foreground">
                  Your data is stored securely using industry-standard encryption (TLS/SSL). Practice data may be stored
                  locally on your device for offline access. Account data is stored on secure servers hosted by
                  trusted cloud providers. We implement appropriate technical and organizational measures to protect
                  your personal data against unauthorized access, alteration, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Microphone Usage</h2>
                <p className="text-muted-foreground">
                  The app requests microphone access only for the Tuner and Voice Training features. This permission
                  is requested only when you attempt to use these specific features. Audio is processed locally on
                  your device in real-time and is <strong>not recorded, stored, or transmitted</strong> to any server.
                  You can revoke microphone permission at any time through your device settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. We may share data only:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>With service providers who assist in operating our app (hosting, database)</li>
                  <li>If required by law or to protect our legal rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
                <p className="text-muted-foreground">
                  We use the following third-party services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Vercel (hosting and deployment)</li>
                  <li>PostgreSQL database providers (secure data storage)</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  These services have their own privacy policies and we encourage you to review them.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your account and all associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent for optional data processing</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal data for as long as your account is active or as needed to provide you services.
                  If you request account deletion, we will delete your personal data within 30 days, except where we are
                  required to retain it for legal purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Children&apos;s Privacy</h2>
                <p className="text-muted-foreground">
                  Our app is designed to be suitable for users of all ages interested in learning music. We do not
                  knowingly collect personal information from children under 13 without verifiable parental consent.
                  If you are a parent or guardian and believe your child has provided us with personal information
                  without your consent, please contact us and we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate
                  safeguards are in place to protect your data in accordance with this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page, updating the &quot;Last updated&quot; date, and where appropriate,
                  notifying you via email or in-app notification. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, want to exercise your data rights, or have
                  concerns about your privacy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> privacy@virtuoso-app.com<br />
                  <strong>GitHub:</strong>{" "}
                  <a href="https://github.com/virtuoso-app/virtuoso" className="text-primary hover:underline">
                    github.com/virtuoso-app/virtuoso
                  </a>
                </p>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  By using Virtuoso, you agree to this Privacy Policy. Please also review our{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
