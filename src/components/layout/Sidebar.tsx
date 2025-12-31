"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  Piano,
  Guitar,
  Mic2,
  Wrench,
  Trophy,
  X,
  Music,
  Home,
  Library,
  TrendingUp,
  FileMusic,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Music Theory", href: "/theory", icon: BookOpen },
  { name: "Ear Training", href: "/ear-training", icon: Headphones },
  { name: "Reading", href: "/reading", icon: FileMusic },
  {
    name: "Instruments",
    href: "/instruments",
    icon: Library,
    children: [
      { name: "Piano", href: "/instruments/piano", icon: Piano },
      { name: "Guitar", href: "/instruments/guitar", icon: Guitar },
      { name: "Voice", href: "/instruments/voice", icon: Mic2 },
    ],
  },
  { name: "Practice Tools", href: "/tools", icon: Wrench },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Achievements", href: "/achievements", icon: Trophy },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-[280px] bg-card transition-transform duration-200 ease-in-out flex flex-col border-r border-border",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Virtuoso</span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-md text-sm font-bold transition-all group",
                    isActive
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-6 w-6 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                  )}
                </Link>

                {/* Sub-navigation */}
                {item.children && isActive && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => onClose()}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all",
                            isChildActive
                              ? "text-primary font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <ChildIcon className="h-4 w-4" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with playing indicator */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-1 bg-primary rounded-full eq-bar" style={{ height: '8px' }} />
              <div className="w-1 bg-primary rounded-full eq-bar" style={{ height: '12px' }} />
              <div className="w-1 bg-primary rounded-full eq-bar" style={{ height: '6px' }} />
            </div>
            <p className="text-xs text-muted-foreground">
              Keep practicing daily
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
