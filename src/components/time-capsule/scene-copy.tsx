"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TimeScene } from "@/components/time-capsule/types";

const sceneCopy: Partial<Record<TimeScene, { eyebrow?: string; title: string; subtitle?: string }>> = {
  reverse: {
    eyebrow: "Reverse Time",
    title: "Some moments are too precious to lose."
  },
  crystal: {
    eyebrow: "Preserved",
    title: "So I kept one."
  },
  final: {
    title: "Out of all the moments in time,\nI kept this one for you.",
    subtitle: "Made with time."
  }
};

export function SceneCopy({ scene }: { scene: TimeScene }) {
  const copy = sceneCopy[scene];

  return (
    <AnimatePresence mode="wait">
      {copy ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-[11vh] z-30 mx-auto flex max-w-5xl flex-col items-center px-5 text-center"
          initial={{ opacity: 0, y: 28, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(14px)" }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          key={scene}
        >
          {copy.eyebrow ? (
            <p className="mb-4 text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-amber-100/70 sm:text-xs">
              {copy.eyebrow}
            </p>
          ) : null}
          <h1 className="time-capsule-copy max-w-5xl whitespace-pre-line text-balance text-[clamp(2.2rem,7vw,6.8rem)] font-semibold leading-[0.96] text-white">
            {copy.title}
          </h1>
          {copy.subtitle ? (
            <p className="mt-7 text-sm font-medium uppercase tracking-[0.32em] text-white/48 sm:text-base">
              {copy.subtitle}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
