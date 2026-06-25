"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PulseLogo } from "@/components/pulse-logo";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface SidebarProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function Sidebar({ onNavigate, mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full w-[252px] flex-col border-r border-white/[.055] bg-[#0b0b0f]/95 px-3.5 py-4",
        !mobile && "fixed inset-y-0 left-0 z-30 hidden lg:flex"
      )}
    >
     <div className="flex h-12 items-center px-2">
       <button
         type="button"
         onClick={() => setOpen(!open)}
         className="cursor-pointer"
        >
         <PulseLogo />
        </button>
     </div>

      <Button
        variant="secondary"
        className="mt-3 h-10 w-full justify-start border-white/[.075] bg-white/[.035] px-3 text-zinc-300"
        asChild
      >
        <Link href="/diary" onClick={onNavigate}>
          <Plus className="h-4 w-4 text-zinc-500" />
          Quick capture
          <span className="ml-auto text-[10px] font-normal text-zinc-600">⌘ N</span>
        </Link>
      </Button>

      <nav className="mt-6 flex-1 space-y-1" aria-label="Primary navigation">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Workspace
        </p>
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors",
                isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={mobile ? "mobile-active-nav" : "desktop-active-nav"}
                  className="absolute inset-0 rounded-xl border border-white/[.055] bg-white/[.055] shadow-[0_1px_0_rgba(255,255,255,.035)_inset]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-[17px] w-[17px] transition-colors",
                  isActive
                    ? "text-[#9b94ff]"
                    : "text-zinc-600 group-hover:text-zinc-400"
                )}
                strokeWidth={1.7}
              />
              <span className="relative">{item.name}</span>
              {item.name === "Memory Vault" && (
                <span className="relative ml-auto rounded-md bg-[#8178ff]/10 px-1.5 py-0.5 text-[9px] text-[#9f99ff]">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mb-3 rounded-2xl border border-white/[.06] bg-white/[.025] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Life archive</span>
          <span className="text-[10px] text-zinc-600">68%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.06]">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#6f67ee] to-[#9b94ff]" />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
          2,487 moments connected across your journey.
        </p>
        </div>

 <div className="rounded-xl border border-white/[.06] bg-white/[.02] p-2">
  <button
    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/[.04]"
    type="button"
    onClick={() => setOpen(!open)}
  >
    <PulseLogo />

    <span className="min-w-0 flex-1">
      <span className="block truncate text-xs font-medium text-zinc-300">
        {user?.full_name || user?.username || "User"}
      </span>

      <span className="block truncate text-[10px] text-zinc-600">
        Personal workspace
      </span>
    </span>

    <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />
  </button>
   
  {open && (
  <div className="mt-2 border-t border-white/[.06] pt-2 space-y-1">
    <Link
      href="/login"
      className="block rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-white/[.04]"
    >
      Login
    </Link>

    <Link
      href="/register"
      className="block rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-white/[.04]"
    >
      Register
    </Link>

    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }}
      className="block w-full rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-white/[.04]"
    >
      Logout
    </button>
  </div>
)}
       </div>
  </aside>
);
}
