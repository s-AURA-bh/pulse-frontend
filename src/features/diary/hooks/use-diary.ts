"use client";

import { useEffect, useState } from "react";
import { getNotes } from "@/lib/api";
import type { Note } from "@/types";

export function useDiary() {
  const [entries, setEntries] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await getNotes();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    entries,
    loading,
    refresh,
  };
}
