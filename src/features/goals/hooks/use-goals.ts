"use client";

import { useEffect, useState } from "react";
import { getGoals } from "@/lib/api";
import type { Goal } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await getGoals();
      setGoals(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    goals,
    loading,
    refresh,
  };
}
