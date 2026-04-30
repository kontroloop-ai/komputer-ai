"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import type { AgentResponse } from "@/lib/types";
import { listAgents, createAgent } from "@/lib/api";
import { useTypewriterPlaceholder } from "@/hooks/use-typewriter-placeholder";
import { ActiveAgentChip } from "./active-agent-chip";
import { NewPersonalAgentDialog } from "./new-personal-agent-dialog";

const PERSONAL_AGENT_LABEL = "komputer.ai/personal-agent";
const EXAMPLE_PROMPTS = [
  "Review the open PRs in <my repo> and summarize what needs my attention.",
  "Investigate why the staging deploy is failing and propose a fix.",
  "Scan my recent emails and extract action items I owe people.",
  "Run a security review on the auth changes in this repo.",
  "Generate a status report for last week's work and post it to Slack.",
  "Find all agents in failed state, group by root cause, and report back.",
];
const PILL_PROMPTS = [
  { label: "Review PRs", prompt: EXAMPLE_PROMPTS[0] },
  { label: "Debug deploy", prompt: EXAMPLE_PROMPTS[1] },
  { label: "Scan emails", prompt: EXAMPLE_PROMPTS[2] },
  { label: "Security review", prompt: EXAMPLE_PROMPTS[3] },
  { label: "Status report", prompt: EXAMPLE_PROMPTS[4] },
];

export function PersonalAgentPrompt() {
  const router = useRouter();
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [active, setActive] = useState<AgentResponse | null>(null);
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const placeholder = useTypewriterPlaceholder({
    prompts: EXAMPLE_PROMPTS,
    paused: prompt.length > 0,
  });

  // Sort agents by completionTime desc, createdAt desc fallback.
  const sorted = useMemo(() => {
    const ts = (a: AgentResponse) => {
      const c = a.completionTime ? new Date(a.completionTime).getTime() : 0;
      const cr = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return c || cr;
    };
    return [...agents].sort((a, b) => ts(b) - ts(a));
  }, [agents]);

  useEffect(() => {
    if (sorted.length > 0 && !active) {
      setActive(sorted[0]);
    }
  }, [sorted, active]);

  // Initial load.
  useEffect(() => {
    listAgents(undefined, { labelSelectors: [`${PERSONAL_AGENT_LABEL}=true`] })
      .then((res) => setAgents(res.agents ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load personal agents"));
  }, []);

  function nextManagerName(existing: AgentResponse[]): string {
    let max = 0;
    for (const a of existing) {
      const m = a.name.match(/^platform-manager-(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > max) max = n;
      }
    }
    return `platform-manager-${max + 1}`;
  }

  async function send(target: { name: string; namespace: string }) {
    setSubmitting(true);
    setError(null);
    try {
      await createAgent({
        name: target.name,
        namespace: target.namespace,
        instructions: prompt,
      });
      router.push(`/agents/${target.name}?namespace=${target.namespace}&pending=${encodeURIComponent(prompt)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to send prompt");
      setSubmitting(false);
    }
  }

  async function createAndSend(namespace: string) {
    const name = nextManagerName(agents);
    setSubmitting(true);
    setError(null);
    try {
      await createAgent({
        name,
        namespace,
        instructions: prompt,
        model: "claude-sonnet-4-6",
        role: "manager",
        lifecycle: "Sleep",
        labels: { [PERSONAL_AGENT_LABEL]: "true" },
      });
      router.push(`/agents/${name}?namespace=${namespace}&pending=${encodeURIComponent(prompt)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to create personal agent");
      setSubmitting(false);
    }
  }

  function handleGo() {
    if (!prompt.trim()) return;
    if (active) {
      send({ name: active.name, namespace: active.namespace });
    } else {
      // First-time: use default namespace.
      createAndSend("default");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="flex items-stretch gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleGo();
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-blue)] focus:outline-none"
          disabled={submitting}
        />
        <button
          type="button"
          onClick={handleGo}
          disabled={!prompt.trim() || submitting}
          className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-light)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <>Go <ArrowRight className="size-3.5" /></>}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {PILL_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPrompt(p.prompt)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <ActiveAgentChip
          active={active}
          agents={sorted}
          onSelect={setActive}
          onNew={() => setDialogOpen(true)}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <NewPersonalAgentDialog
        open={dialogOpen}
        defaultNamespace={active?.namespace ?? "default"}
        onOpenChange={setDialogOpen}
        onConfirm={(ns) => {
          setDialogOpen(false);
          createAndSend(ns);
        }}
      />
    </motion.div>
  );
}
