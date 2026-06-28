"use client";

import { useState } from "react";
import { createGoal } from "@/lib/api";
import { useGoals } from "../hooks/use-goals";
import { GoalCard } from "./goal-card";

export function GoalsPage() {
  const {
    goals,
    loading,
    refresh,
  } = useGoals();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate() {
    if (!title.trim()) return;

    await createGoal(title, description);

    setTitle("");
    setDescription("");

    await refresh();
  }

  if (loading) {
    return (
      <div className="text-zinc-400">
        Loading goals...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="space-y-2 px-1">
        <h1 className="text-5xl font-bold tracking-tight">
          Goals
        </h1>

        <p className="text-zinc-400 leading-7 max-w-xl">
          Track your goals and measure your progress.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-800/70 bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 p-6 space-y-4 backdrop-blur-xl">

        <input
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="rounded-xl bg-violet-600 px-6 py-3 font-medium transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-95"
        >
          + Create Goal
        </button>

      </div>

      {goals.length === 0 ? (

        <div className="rounded-3xl border border-zinc-800/70 bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 p-10 text-center backdrop-blur-xl">

          <div className="text-6xl">
            🎯
          </div>

          <h3 className="mt-5 text-2xl font-semibold">
            No goals yet
          </h3>

          <p className="mt-3 text-zinc-400">
            Create your first goal and start building momentum.
          </p>

        </div>

      ) : (

        <div className="space-y-5">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onRefresh={refresh}
            />
          ))}
        </div>

      )}

    </div>
  );
}
