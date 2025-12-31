"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { Settings, Bell, Volume2, Moon, Globe, Shield, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { resetProgress } from "@/lib/progress";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState("30");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    // Trigger a page refresh to update the UI
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      // Delete account from database
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear all local data
      resetProgress();
      localStorage.clear();

      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your Virtuoso experience
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
            <Input
              id="name"
              defaultValue={session?.user?.name || ""}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              defaultValue={session?.user?.email || ""}
              placeholder="your@email.com"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Practice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Practice Settings
          </CardTitle>
          <CardDescription>Configure your daily practice goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dailyGoal" className="text-sm font-medium">Daily Practice Goal (minutes)</label>
            <Input
              id="dailyGoal"
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              min="5"
              max="180"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Practice Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get notified when it&apos;s time to practice
              </p>
            </div>
            <button
              onClick={() => setPracticeReminders(!practiceReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                practiceReminders ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  practiceReminders ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio
          </CardTitle>
          <CardDescription>Manage sound preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-muted-foreground">
                Enable sounds for exercises and feedback
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Currently using dark theme
              </p>
            </div>
            <span className="text-sm text-muted-foreground">Always on</span>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language
          </CardTitle>
          <CardDescription>Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <select className="w-full p-2 rounded-md bg-muted border border-border">
            <option value="en">English</option>
            <option value="es" disabled>Spanish (Coming Soon)</option>
            <option value="fr" disabled>French (Coming Soon)</option>
            <option value="de" disabled>German (Coming Soon)</option>
          </select>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage your data and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            Export My Data
          </Button>
          <p className="text-xs text-muted-foreground">
            Download all your practice data and progress
          </p>
        </CardContent>
      </Card>

      {/* Reset Progress */}
      <Card className="border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <RotateCcw className="h-5 w-5" />
            Reset Progress
          </CardTitle>
          <CardDescription>Start fresh with a clean slate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showResetConfirm ? (
            <div>
              <Button
                variant="outline"
                className="text-orange-500 border-orange-500/50 hover:bg-orange-500/10"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset All Progress
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Clear all your exercise stats, streaks, and achievements
              </p>
            </div>
          ) : (
            <div className="p-4 bg-orange-500/10 rounded-lg space-y-3">
              <p className="text-sm font-medium">Are you sure you want to reset all progress?</p>
              <p className="text-xs text-muted-foreground">
                This will clear all your stats, streaks, and achievements. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleResetProgress}
                >
                  Yes, Reset Everything
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <div>
              <Button
                variant="outline"
                className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Permanently delete your account and all associated data
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 rounded-lg space-y-3">
              <p className="text-sm font-medium">Are you absolutely sure?</p>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. This will permanently delete your account,
                all your progress, and remove all associated data.
              </p>
              <div className="space-y-2">
                <label className="text-sm">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm:
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="max-w-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete My Account"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
