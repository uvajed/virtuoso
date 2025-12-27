import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MainLayout } from "@/components/layout";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <MainLayout>{children}</MainLayout>;
}
