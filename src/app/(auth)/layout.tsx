import Link from "next/link";
import { Music } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
      <Link
        href="/"
        className="flex items-center gap-3 mb-10"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
          <Music className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-3xl">Virtuoso</span>
      </Link>
      {children}
    </div>
  );
}
