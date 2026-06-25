"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface DashboardHeroProps {
  user: any;
}

export function DashboardHero({ user }: DashboardHeroProps) {
const name =
  user?.name ||
  user?.full_name ||
  user?.username ||
  "User";
const joinedDays = user?.created_at
  ? Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    )
  : 0;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hero-surface relative min-h-[286px] overflow-hidden rounded-[24px] border border-white/[.075] bg-[#111116] p-6 shadow-card sm:p-8 lg:p-10"
    >
      <div className="absolute inset-0 bg-hero-grid bg-[size:44px_44px] opacity-50 [mask-image:linear-gradient(to_right,black,transparent_80%)]" />
      <motion.div
        className="absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full bg-[#756cff]/[.09] blur-[80px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-140px] left-[35%] h-[280px] w-[280px] rounded-full bg-[#4263eb]/[.055] blur-[90px]"
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid min-h-[206px] gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b83ff] shadow-[0_0_12px_#8b83ff]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-[30px] font-medium tracking-[-0.04em] text-zinc-100 sm:text-[38px] lg:text-[42px]">
           Welcome back, {name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-500 sm:text-base">
            You&apos;ve been building your future for{" "}
          <span className="font-medium text-zinc-300">{joinedDays} days.</span> 
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Keep the rhythm. The small things are beginning to compound.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/diary">
                <PenLine className="h-4 w-4" />
                Write today&apos;s entry
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/timeline">
                View your journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative grid h-[190px] w-[190px] place-items-center rounded-full border border-white/[.06] bg-black/[.13]">
            <div className="absolute inset-[11px] rounded-full border border-dashed border-white/[.075]" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 180deg, transparent 0 16%, rgba(139,131,255,.8) 16% 50%, rgba(139,131,255,.12) 50% 100%)",
                maskImage: "radial-gradient(transparent 65%, black 66%)"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            <div className="text-center">
              <Sparkles className="mx-auto mb-2 h-4 w-4 text-[#918aff]" />
              <span className="block text-[34px] font-medium tracking-[-0.05em] text-zinc-100">
                127
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                days in motion
              </span>
            </div>
            <div className="absolute -right-4 top-7 rounded-xl border border-white/[.07] bg-[#17171e] px-3 py-2 shadow-xl">
              <p className="text-[10px] text-zinc-600">This week</p>
              <p className="mt-0.5 text-xs font-medium text-zinc-300">+12% clarity</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
