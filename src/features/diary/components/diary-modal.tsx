"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/types";

type DiaryModalProps = {
  open: boolean;
  entry?: Note | null;
  onClose: () => void;
  onSave: (title: string, content: string) => Promise<void>;
};

export function DiaryModal({
  open,
  entry,
  onClose,
  onSave,
}: DiaryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [entry, open]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) return;

    setSaving(true);

    try {
      await onSave(title, content);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/[.07] bg-[#111116] p-7">

        <h2 className="text-2xl font-medium text-zinc-100">
          {entry ? "Edit Entry" : "New Entry"}
        </h2>

        <input
          className="mt-6 w-full rounded-xl border border-white/[.06] bg-[#18181f] px-4 py-3 outline-none"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows={10}
          className="mt-4 w-full resize-none rounded-xl border border-white/[.06] bg-[#18181f] px-4 py-3 outline-none"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/[.08] px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-[#8178ff] px-5 py-2 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
}
