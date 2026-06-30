"use client";

import { useState } from "react";
import { BookOpenText } from "lucide-react";
import { FeaturePage } from "@/features/shell/feature-page";
import { DiaryModal } from "@/features/diary/components/diary-modal";
import { DiaryEntryCard } from "@/features/diary/components/diary-entry-card";
import { useDiary } from "@/features/diary/hooks/use-diary";
import { createNote, updateNote, deleteNote } from "@/lib/api";
import type { Note } from "@/types";

export default function DiaryPage() {
  const { entries, loading, refresh } = useDiary();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Note | null>(null);

  function openCreate() {
    setEditingEntry(null);
    setModalOpen(true);
  }

  function openEdit(entry: Note) {
    setEditingEntry(entry);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditingEntry(null);
  }

  async function handleSave(title: string, content: string) {
    if (editingEntry) {
      await updateNote(editingEntry.id, { title, content });
    } else {
      await createNote(title, content);
    }
    await refresh();
  }

  async function handleDelete(entry: Note) {
    const confirmed = window.confirm(
      `Delete "${entry.title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    await deleteNote(entry.id);
    await refresh();
  }

  if (loading) return null;

  return (
    <>
      <FeaturePage
        title="A quieter place to think."
        eyebrow="Personal diary"
        description="Capture the days as they feel—not just as they happened. Your private record for clarity, patterns, and the thoughts worth returning to."
        icon={BookOpenText}
        primaryAction="New entry"
        onPrimaryAction={openCreate}
        highlights={[
          {
            label: "Entries",
            value: String(entries.length),
            detail: `${entries.length} total entries`,
          },
          { label: "Current rhythm", value: "12 days", detail: "Longest: 24 days" },
          { label: "Most felt", value: "Calm", detail: "Appeared in 31 entries" },
        ]}
        futureNote="Future AI reflections can surface emotional patterns and meaningful connections while keeping the diary experience calm and private."
      >
        {entries.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            {entries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </FeaturePage>

      <DiaryModal
        open={modalOpen}
        entry={editingEntry}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
}
