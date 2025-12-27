"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Introduction</h2>
              <p className="text-muted-foreground">
                Virtuoso (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our
                music practice application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <p className="text-muted-foreground mb-2">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Account Information:</strong> Email address and password when you create an account</li>
                <li><strong>Practice Data:</strong> Your exercise scores, progress, and practice session history</li>
                <li><strong>Device Permissions:</strong> Microphone access (only when using the tuner or voice training features)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>To provide and maintain the app functionality</li>
                <li>To track your learning progress and achievements</li>
                <li>To improve our services and user experience</li>
                <li>To authenticate your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Storage</h2>
              <p className="text-muted-foreground">
                Your data is stored securely using industry-standard encryption. Practice data may be stored
                locally on your device for offline access. Account data is stored on secure servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Microphone Usage</h2>
              <p className="text-muted-foreground">
                The app requests microphone access only for the Tuner and Voice Training features. Audio is
                processed locally on your device and is not recorded, stored, or transmitted to any server.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Vercel (hosting and deployment)</li>
                <li>PostgreSQL database providers (data storage)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of optional data collection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our app is suitable for users of all ages. We do not knowingly collect personal information
                from children under 13 without parental consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through our GitHub
                repository or support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
