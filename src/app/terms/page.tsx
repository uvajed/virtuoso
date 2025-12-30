"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Music, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              <CardTitle className="text-2xl">Terms of Service</CardTitle>
              <p className="text-muted-foreground">Last updated: December 30, 2024</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using Virtuoso (&quot;the app&quot;, &quot;the service&quot;), you agree to be bound by these
                  Terms of Service. If you do not agree to these terms, please do not use the app.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  Virtuoso is a music practice and education application that provides:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Interactive music theory lessons and exercises</li>
                  <li>Ear training exercises (intervals, chords, melodies)</li>
                  <li>Virtual instruments (piano, guitar)</li>
                  <li>Voice training with pitch detection</li>
                  <li>Practice tools (metronome, tuner, timer)</li>
                  <li>Progress tracking and achievements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
                <p className="text-muted-foreground">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
                <p className="text-muted-foreground">You agree not to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use the app for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to any part of the service</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Use automated systems to access the service without permission</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The app, including its design, features, content, and code, is owned by Virtuoso and protected
                  by intellectual property laws. You may not copy, modify, distribute, or create derivative works
                  without our written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. User Content</h2>
                <p className="text-muted-foreground">
                  You retain ownership of any content you create while using the app (such as practice data and
                  progress records). By using the service, you grant us a limited license to store and process
                  this content solely to provide the service to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">7. Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of the app is also governed by our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
                  which explains how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Service Availability</h2>
                <p className="text-muted-foreground">
                  We strive to keep the app available at all times, but we do not guarantee uninterrupted access.
                  The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond
                  our control.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  The app is provided &quot;as is&quot; without warranties of any kind, either express or implied.
                  We do not warrant that the app will be error-free or that it will meet your specific requirements.
                  Music education through this app is supplementary and should not replace professional instruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">10. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, Virtuoso shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages resulting from your use of or inability to use the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">11. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account if you violate these terms. You may also
                  delete your account at any time. Upon termination, your right to use the service will immediately
                  cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may modify these terms at any time. We will notify you of significant changes by posting the
                  updated terms and changing the &quot;Last updated&quot; date. Your continued use of the app after
                  changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with applicable laws, without regard
                  to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> support@virtuoso-app.com<br />
                  <strong>GitHub:</strong>{" "}
                  <a href="https://github.com/virtuoso-app/virtuoso" className="text-primary hover:underline">
                    github.com/virtuoso-app/virtuoso
                  </a>
                </p>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  By using Virtuoso, you acknowledge that you have read and understood these Terms of Service.
                  Please also review our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
