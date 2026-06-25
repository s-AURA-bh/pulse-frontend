"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/lib/auth";

export function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
