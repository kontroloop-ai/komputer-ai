"use client";

import { useState, useEffect, useCallback } from "react";
import { listMemories } from "@/lib/api";
import type { MemoryResponse } from "@/lib/types";

export function useMemories() {
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await listMemories();
      setMemories(data.memories || []);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { memories, loading, error, refresh };
}
