"use client";

import type { Note } from "@/types";
import { Trash2, Pencil } from "lucide-react";

type DiaryEntryCardProps = {
  entry: Note;
  onEdit: (entry: Note) => void;
  onDelete: (entry: Note) => void;
};

export function DiaryEntryCard({
  entry,
  onEdit,
  onDelete,
}: DiaryEntryCardProps) {
  return (
    <div className="group rounded-2xl border border-white/[.06] bg-[#111116] p-6 transition-all hover:border-[#8178ff]/30">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-medium tracking-[-0.03em] text-zinc-100">
            {entry.title}
          </h3>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
            {entry.content}
          </p>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(entry)}
            className="rounded-xl border border-white/[.06] p-2 text-zinc-400 transition hover:border-[#8178ff]/40 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(entry)}
            className="rounded-xl border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
