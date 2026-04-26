"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/kit/button";
import { Input } from "@/components/kit/input";
import { Textarea } from "@/components/kit/textarea";
import { Label } from "@/components/kit/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/kit/select";
import { Plus, X } from "lucide-react";
import { NamespaceSelector } from "@/components/shared/namespace-selector";
import { createSquad } from "@/lib/api";
import type { CreateSquadRequest } from "@/lib/types";
import { MODELS, LIFECYCLES } from "@/lib/constants";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface AgentSubtab {
  id: string;
  name: string;
  instructions: string;
  model: string;
  lifecycle: string;
}

function makeEmptySubtab(): AgentSubtab {
  return { id: crypto.randomUUID(), name: "", instructions: "", model: "claude-sonnet-4-6", lifecycle: "default" };
}

export interface SquadModeFormProps {
  /** Shared fields from the parent tab bar (preloaded into first subtab) */
  sharedValues: { name: string; namespace: string; instructions: string; model: string; lifecycle: string };
  onSharedValuesChange: (v: { name: string; namespace: string; instructions: string; model: string; lifecycle: string }) => void;
  open: boolean;
  onCreated?: () => void;
  onCancel: () => void;
}

export function SquadModeForm({ sharedValues, onSharedValuesChange, open: _open, onCreated, onCancel }: SquadModeFormProps) {
  const [squadName, setSquadName] = useState("");
  const [subtabs, setSubtabs] = useState<AgentSubtab[]>([]);
  const [activeSubtab, setActiveSubtab] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtabErrors, setSubtabErrors] = useState<Record<string, string>>({});

  // Build subtabs list: first one mirrors sharedValues, rest are standalone
  // We keep subtabs as derived from sharedValues for the first entry + local extras
  // To simplify: "agents" = [sharedValues-based slot, ...subtabs]
  // The first slot IS sharedValues — we don't duplicate state.
  const allAgents: AgentSubtab[] = [
    { id: "__shared__", name: sharedValues.name, instructions: sharedValues.instructions, model: sharedValues.model, lifecycle: sharedValues.lifecycle },
    ...subtabs,
  ];

  function updateAgent(idx: number, patch: Partial<AgentSubtab>) {
    if (idx === 0) {
      onSharedValuesChange({ ...sharedValues, ...patch });
    } else {
      setSubtabs(prev => prev.map((t, i) => i === idx - 1 ? { ...t, ...patch } : t));
    }
  }

  function addSubtab() {
    setSubtabs(prev => [...prev, makeEmptySubtab()]);
    setActiveSubtab(allAgents.length); // will be the new last index
  }

  function removeSubtab(idx: number) {
    if (idx === 0) return; // can't remove first
    setSubtabs(prev => prev.filter((_, i) => i !== idx - 1));
    setActiveSubtab(Math.max(0, activeSubtab - 1));
  }

  function buildAgentSpec(agent: AgentSubtab) {
    return {
      name: agent.name.trim(),
      instructions: agent.instructions.trim(),
      model: agent.model,
      namespace: sharedValues.namespace.trim() || undefined,
      lifecycle: agent.lifecycle === "default" ? "" : agent.lifecycle,
    };
  }

  function validate(): string | null {
    if (!squadName.trim()) return "Squad name is required.";
    if (!NAME_PATTERN.test(squadName)) return "Squad name must be lowercase letters, numbers, and hyphens only.";

    const errors: Record<string, string> = {};
    const names = new Set<string>();
    for (const agent of allAgents) {
      if (!agent.name.trim()) {
        errors[agent.id] = "Name is required.";
        continue;
      }
      if (!NAME_PATTERN.test(agent.name)) {
        errors[agent.id] = "Name must be lowercase letters, numbers, and hyphens only.";
        continue;
      }
      if (!agent.instructions.trim()) {
        errors[agent.id] = "Instructions are required.";
        continue;
      }
      if (names.has(agent.name)) {
        errors[agent.id] = `Duplicate name "${agent.name}".`;
      } else {
        names.add(agent.name);
      }
    }
    if (Object.keys(errors).length > 0) {
      setSubtabErrors(errors);
      return "Fix the errors in each agent tab before submitting.";
    }
    setSubtabErrors({});
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const members: CreateSquadRequest["members"] = allAgents.map((agent) => ({
        spec: buildAgentSpec(agent),
      }));

      const req: CreateSquadRequest = {
        name: squadName.trim(),
        namespace: sharedValues.namespace.trim() || undefined,
        members,
      };

      await createSquad(req);
      onCreated?.();
      onCancel();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create squad.");
    } finally {
      setSubmitting(false);
    }
  }

  const activeAgent = allAgents[activeSubtab] ?? allAgents[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
      <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
        {/* Squad name + namespace */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="squad-name">Squad Name</Label>
            <Input
              id="squad-name"
              placeholder="my-squad"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <NamespaceSelector value={sharedValues.namespace} onChange={(v) => onSharedValuesChange({ ...sharedValues, namespace: v })} />
        </div>

        {/* Agent subtabs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 border-b border-[var(--color-border)] pb-px overflow-x-auto">
            {allAgents.map((agent, idx) => (
              <div key={agent.id} className="relative flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveSubtab(idx)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeSubtab === idx
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {agent.name.trim() || `Agent ${idx + 1}`}
                  {subtabErrors[agent.id] && (
                    <span className="ml-1 inline-block size-1.5 rounded-full bg-red-400 align-middle" />
                  )}
                  {activeSubtab === idx && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-brand-blue)] rounded-full shadow-[0_1px_4px_var(--color-brand-blue-glow)]"
                      layoutId="squad-subtab-indicator"
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                  )}
                </button>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSubtab(idx)}
                    className="ml-0.5 p-0.5 text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubtab}
              className="flex items-center gap-1 ml-1 px-2 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-dashed border-[var(--color-border)] rounded hover:border-[var(--color-border-hover)] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-3" />
              Add agent
            </button>
          </div>

          {/* Active subtab form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAgent.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col gap-3"
            >
              {subtabErrors[activeAgent.id] && (
                <p className="text-xs text-red-400">{subtabErrors[activeAgent.id]}</p>
              )}
              <div className="flex flex-col gap-1.5">
                <Label>Agent Name</Label>
                <Input
                  placeholder="my-agent"
                  value={activeAgent.name}
                  onChange={(e) => updateAgent(activeSubtab, { name: e.target.value })}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Instructions</Label>
                <Textarea
                  placeholder="Describe what this agent should do..."
                  value={activeAgent.instructions}
                  onChange={(e) => updateAgent(activeSubtab, { instructions: e.target.value })}
                  style={{ minHeight: 140 }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Model</Label>
                  <Select value={activeAgent.model} onValueChange={(v) => v && updateAgent(activeSubtab, { model: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Lifecycle</Label>
                  <Select value={activeAgent.lifecycle} onValueChange={(v) => v && updateAgent(activeSubtab, { lifecycle: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LIFECYCLES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-4 shrink-0 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : `Create Squad (${allAgents.length} agent${allAgents.length !== 1 ? "s" : ""})`}
        </Button>
      </div>
    </form>
  );
}
