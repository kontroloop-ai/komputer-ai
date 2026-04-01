"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Brain, Users } from "lucide-react";

import { Button } from "@/components/kit/button";
import { Badge } from "@/components/kit/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RelativeTime } from "@/components/shared/relative-time";
import { useDelayedLoading } from "@/hooks/use-delayed-loading";
import { getMemory, deleteMemory } from "@/lib/api";
import type { MemoryResponse } from "@/lib/types";

export default function MemoryDetailPage() {
  const params = useParams<{ name: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const memoryName = params.name;
  const memoryNs = searchParams.get("namespace") || undefined;

  const [memory, setMemory] = useState<MemoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const showLoading = useDelayedLoading(loading);
  const [error, setError] = useState<string | null>(null);

  const fetchMemory = useCallback(async () => {
    if (!memoryName) return;
    try {
      const data = await getMemory(memoryName, memoryNs);
      setMemory(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [memoryName, memoryNs]);

  useEffect(() => {
    fetchMemory();
  }, [fetchMemory]);

  const handleDelete = async () => {
    if (!memoryName) return;
    try {
      await deleteMemory(memoryName, memoryNs);
      router.push("/memories");
    } catch {}
  };

  if (showLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-secondary)]">
          Loading memory...
        </div>
      </div>
    );
  }

  if (loading) return null;

  if (error || !memory) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-6 text-center">
            <p className="text-sm text-red-400">{error ?? "Memory not found"}</p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push("/memories")}>
              Back to memories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full flex-col"
    >
      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-3">
        <Brain className="size-4 text-[var(--color-brand-violet)]" />
        <span className="text-sm text-[var(--color-text-muted)]">Namespace:</span>
        <Badge variant="outline" className="text-xs font-mono">{memory.namespace}</Badge>
        {memory.description && (
          <>
            <span className="text-sm text-[var(--color-text-muted)]">Description:</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{memory.description}</span>
          </>
        )}
        <span className="text-sm text-[var(--color-text-muted)]">Agents:</span>
        <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
          <Users className="size-3" /> {memory.attachedAgents}
        </span>

        <div className="ml-auto flex items-center gap-3">
          <RelativeTime timestamp={memory.createdAt} />
          <ConfirmDialog
            title="Delete Memory"
            description={`Are you sure you want to delete "${memory.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 className="size-3" data-icon="inline-start" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Attached agents */}
          {memory.agentNames && memory.agentNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3"
            >
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Attached Agents</h3>
              <div className="flex flex-wrap gap-2">
                {memory.agentNames.map((name) => (
                  <Link key={name} href={`/agents/${name}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-[var(--color-surface-hover)]">
                      {name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Memory content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3"
          >
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Content</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {memory.content}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
