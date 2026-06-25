"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AudioNodes = {
  context: AudioContext;
  gain: GainNode;
  oscillators: OscillatorNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function AmbientSound() {
  const nodesRef = useRef<AudioNodes | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const startOnGesture = () => {
      if (!nodesRef.current && enabled) {
        void createSound();
      }
    };

    window.addEventListener("pointerdown", startOnGesture, { once: true });
    window.addEventListener("keydown", startOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
      nodesRef.current?.oscillators.forEach((oscillator) => oscillator.stop());
      nodesRef.current?.lfo.stop();
      void nodesRef.current?.context.close();
    };
  }, [enabled]);

  async function createSound() {
    const audioWindow = window as AudioWindow;
    const AudioContextConstructor =
      audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    const compressor = context.createDynamicsCompressor();

    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.9;
    gain.gain.value = 0.0001;
    compressor.threshold.value = -28;
    compressor.knee.value = 22;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.18;
    compressor.release.value = 0.5;

    lfo.type = "sine";
    lfo.frequency.value = 0.045;
    lfoGain.gain.value = 48;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const oscillators = [44, 55, 82.4].map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 2 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 4 - 3;
      oscillator.connect(filter);
      oscillator.start();
      return oscillator;
    });

    filter.connect(compressor);
    compressor.connect(gain);
    gain.connect(context.destination);
    lfo.start();

    nodesRef.current = { context, gain, oscillators, lfo, lfoGain };
    gain.gain.linearRampToValueAtTime(0.045, context.currentTime + 2.4);
    await context.resume();
    setReady(true);
  }

  async function toggleSound() {
    if (!enabled) {
      setEnabled(true);
      if (!nodesRef.current) {
        await createSound();
      } else {
        await nodesRef.current.context.resume();
        nodesRef.current.gain.gain.linearRampToValueAtTime(
          0.045,
          nodesRef.current.context.currentTime + 0.7
        );
      }
      return;
    }

    setEnabled(false);
    const nodes = nodesRef.current;
    if (!nodes) return;
    nodes.gain.gain.linearRampToValueAtTime(0.0001, nodes.context.currentTime + 0.45);
  }

  return (
    <button
      aria-label={enabled ? "Disable ambient sound" : "Enable ambient sound"}
      className={cn(
        "group fixed right-4 top-4 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 text-xs font-medium uppercase tracking-[0.22em] text-white/70 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:right-6 sm:top-6",
        enabled && ready && "border-amber-200/25 text-amber-100"
      )}
      onClick={toggleSound}
      type="button"
    >
      {enabled ? (
        <Volume2 className="size-4" aria-hidden="true" />
      ) : (
        <VolumeX className="size-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">Sound</span>
    </button>
  );
}
