"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { AmbientSound } from "@/components/time-capsule/ambient-sound";
import { SceneCopy } from "@/components/time-capsule/scene-copy";
import type { TimeScene } from "@/components/time-capsule/types";

const TimeCapsuleScene = dynamic(
  () =>
    import("@/components/time-capsule/time-capsule-scene").then(
      (module) => module.TimeCapsuleScene
    ),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#030304]" />
  }
);

function getLocalTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());
}

export function TimeCapsuleExperience() {
  const progressRef = useRef(0);
  const [scene, setScene] = useState<TimeScene>("frozen");
  const [localTime, setLocalTime] = useState("--:--:--");
  const [frozenTime, setFrozenTime] = useState("--:--:--");
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const sceneMarkers = useMemo(
    () => [
      { time: 0, scene: "frozen" as TimeScene },
      { time: 2, scene: "reverse" as TimeScene },
      { time: 10.6, scene: "dissolve" as TimeScene },
      { time: 17.6, scene: "crystal" as TimeScene },
      { time: 25.2, scene: "reveal" as TimeScene },
      { time: 32.4, scene: "final" as TimeScene }
    ],
    []
  );

  useEffect(() => {
    const initialTime = getLocalTime();
    setLocalTime(initialTime);
    setFrozenTime(initialTime);

    const timer = window.setInterval(() => setLocalTime(getLocalTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    progressRef.current = 0;
    setScene("frozen");

    const proxy = { progress: 0 };
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: () => {
        progressRef.current = proxy.progress;
      }
    });

    timeline.to(proxy, {
      progress: 1,
      duration: 38,
      ease: "power1.inOut"
    });

    sceneMarkers.forEach((marker) => {
      timeline.call(() => setScene(marker.scene), [], marker.time);
    });

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [sceneMarkers]);

  function replay() {
    timelineRef.current?.restart();
    setScene("frozen");
  }

  return (
    <main className="time-capsule-shell relative h-[100svh] min-h-[640px] overflow-hidden bg-[#030304] text-white">
      <div className="absolute inset-0">
        <TimeCapsuleScene
          localTime={frozenTime}
          progressRef={progressRef}
          scene={scene}
        />
      </div>

      <div className="pointer-events-none fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <motion.div
          className="rounded-full border border-white/10 bg-black/35 px-4 py-3 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/42">
            Digital Time Capsule
          </p>
          <p className="mt-1 font-mono text-sm text-white/80">{localTime}</p>
        </motion.div>
      </div>

      <SceneCopy scene={scene} />
      <AmbientSound />

      <motion.button
        className="fixed bottom-4 right-4 z-40 rounded-full border border-white/10 bg-white/[0.045] px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/58 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:bottom-6 sm:right-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: scene === "final" ? 1 : 0, y: scene === "final" ? 0 : 18 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        onClick={replay}
        type="button"
      >
        Replay
      </motion.button>
    </main>
  );
}
