"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Music, User, LogOut, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          {session && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Navigation arrows - Spotify style */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-black/70 hover:bg-black transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.forward()}
              className="p-2 rounded-full bg-black/70 hover:bg-black transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Logo - only show on mobile or when not logged in */}
          {!session && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <Music className="h-5 w-5 text-black" />
              </div>
              <span className="font-bold text-xl hidden sm:block">
                Virtuoso
              </span>
            </Link>
          )}
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 py-1 px-1 pr-3 rounded-full bg-black/70 hover:bg-black/90 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#535353] text-white flex items-center justify-center text-sm font-bold">
                  {session.user?.name?.[0]?.toUpperCase() || (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-bold">
                  {session.user?.name || "User"}
                </span>
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-md bg-[#282828] shadow-xl z-50 py-1 border border-white/10">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profile
                    </Link>
                    <Link
                      href="/profile/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/register">
                <span className="text-muted-foreground hover:text-white font-bold text-sm transition-colors">
                  Sign up
                </span>
              </Link>
              <Link href="/login">
                <Button size="sm" className="px-8">
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
