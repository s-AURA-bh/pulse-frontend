"use client";

import { motion } from "framer-motion";
import { dashboardMetrics } from "@/features/dashboard/data";
import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { TodaysFocus } from "@/features/dashboard/components/todays-focus";
import { DiaryPreview } from "@/features/dashboard/components/diary-preview";
import { WeeklyReflection } from "@/features/dashboard/components/weekly-reflection";
import { LearningActivity } from "@/features/dashboard/components/learning-activity";
import { TimelineSnapshot } from "@/features/dashboard/components/timeline-snapshot";
import { useAuth } from "@/lib/auth";

export function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
      <DashboardHero user={user} />

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="mt-4 grid gap-4 xl:grid-cols-[0.84fr_1.16fr_0.9fr]"
      >
        <TodaysFocus />
        <DiaryPreview />
        <WeeklyReflection />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.36 }}
        className="mt-4 grid gap-4 xl:grid-cols-[0.88fr_1.12fr]"
      >
        <LearningActivity />
        <TimelineSnapshot />
      </motion.section>

      <footer className="flex items-center justify-between px-1 pb-3 pt-8 text-[10px] text-zinc-700">
        <p>Pulse is your private space to become.</p>
        <p>All changes saved locally</p>
      </footer>
    </div>
  );
}
