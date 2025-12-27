import Link from "next/link";
import { Music } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
          <Music className="h-6 w-6" />
        </div>
        <span className="font-bold text-2xl">Virtuoso</span>
      </Link>
      {children}
    </div>
  );
}
