"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { Bell, Menu, Search, X } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/command-menu";
import { PulseLogo } from "@/components/pulse-logo";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen((value) => !value), []);
  useKeyboardShortcut("k", toggleSearch, { meta: true });
  useKeyboardShortcut("Escape", closeSearch);

  const currentPage =
    navigation.find((item) =>
      item.href === "/"
        ? pathname === "/" || pathname === "/dashboard"
        : pathname.startsWith(item.href)
    )?.name ?? "Pulse";

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />

        <AnimatePresence>
          {mobileOpen && (
            <>
              <m.button
                type="button"
                aria-label="Close navigation"
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <m.div
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 360, damping: 34 }}
              >
                <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-4"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </m.div>
            </>
          )}
        </AnimatePresence>

        <div className="lg:pl-[252px]">
          <header className="sticky top-0 z-20 flex h-16 items-center border-b border-white/[.05] bg-[#09090c]/82 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="mr-auto lg:hidden">
              <PulseLogo compact />
            </div>
            <div className="mr-auto hidden items-center gap-2 text-xs lg:flex">
              <span className="text-zinc-700">Pulse</span>
              <span className="text-zinc-700">/</span>
              <span className="font-medium text-zinc-400">{currentPage}</span>
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="mr-2 hidden h-9 w-[220px] items-center gap-2 rounded-xl border border-white/[.065] bg-white/[.025] px-3 text-xs text-zinc-600 transition-colors hover:border-white/[.1] hover:bg-white/[.04] sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search anything</span>
              <kbd className="ml-auto rounded-md border border-white/[.06] bg-white/[.035] px-1.5 py-0.5 font-sans text-[9px] text-zinc-600">
                ⌘ K
              </kbd>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#8b83ff] ring-2 ring-[#09090c]" />
            </Button>
          </header>

          <main className="min-h-[calc(100vh-4rem)] overflow-hidden">
            <AnimatePresence mode="wait">
              <m.div
                key={pathname}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </m.div>
            </AnimatePresence>
          </main>
        </div>

        <CommandMenu open={searchOpen} onClose={closeSearch} />
      </div>
    </LazyMotion>
  );
}
