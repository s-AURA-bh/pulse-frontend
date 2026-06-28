"use client";

import type { Goal } from "@/types";
import { deleteGoal, updateGoal } from "@/lib/api";

type GoalCardProps = {
  goal: Goal;
  onRefresh: () => Promise<void>;
};

export function GoalCard({
  goal,
  onRefresh,
}: GoalCardProps) {
  async function handleDelete() {
    if (!confirm("Delete this goal?")) return;

    await deleteGoal(goal.id);
    await onRefresh();
  }

  async function handleToggle() {
    await updateGoal(goal.id, {
      completed: !goal.completed,
    });

    await onRefresh();
  }

  return (
    <div className="group rounded-2xl border border-zinc-800/70 bg-zinc-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5">

      <div className="flex items-start justify-between gap-6">

        <div className="flex-1">

          <h2
            className={`text-xl font-semibold transition-all ${
              goal.completed
                ? "text-zinc-500 line-through"
                : "text-white"
            }`}
          >
            {goal.title}
          </h2>

          {goal.description && (
            <p className="mt-3 text-zinc-400 leading-7">
              {goal.description}
            </p>
          )}

        </div>

        <span
          className={`rounded-full px-4 py-1 text-sm font-medium ${
            goal.completed
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
          }`}
        >
          {goal.completed ? "Completed" : "Active"}
        </span>

      </div>

      <div className="mt-6 flex items-center gap-3">

        <button
          onClick={handleToggle}
          className="rounded-xl border border-violet-500/30 px-4 py-2 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/10"
        >
          {goal.completed
            ? "↺ Mark Active"
            : "✓ Mark Complete"}
        </button>

        <button
          onClick={handleDelete}
          className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}
