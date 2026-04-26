"use client";

import { useState, useEffect } from "react";
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
import { ChevronRight } from "lucide-react";
import { NamespaceSelector } from "@/components/shared/namespace-selector";
import { listAgents, listSquads, createSquad, addSquadMember } from "@/lib/api";
import type { AgentResponse, Squad } from "@/lib/types";
import { MODELS, LIFECYCLES } from "@/lib/constants";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface TeamUpModeFormProps {
  sharedValues: { name: string; namespace: string; instructions: string; model: string; lifecycle: string };
  onSharedValuesChange: (v: { name: string; namespace: string; instructions: string; model: string; lifecycle: string }) => void;
  open: boolean;
  onCreated?: () => void;
  onCancel: () => void;
}

export function TeamUpModeForm({ sharedValues, onSharedValuesChange, open, onCreated, onCancel }: TeamUpModeFormProps) {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);

  // Team-up specific state
  const [availableAgents, setAvailableAgents] = useState<AgentResponse[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [teamUpWithAgent, setTeamUpWithAgent] = useState<string>(""); // "<namespace>/<name>"
  const [squadName, setSquadName] = useState("");
  const [squadNameReadOnly, setSquadNameReadOnly] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { name, namespace, instructions, model, lifecycle } = sharedValues;

  useEffect(() => {
    if (!open) return;
    listAgents()
      .then((res) => setAvailableAgents(res.agents ?? []))
      .catch(() => setAvailableAgents([]));
    listSquads()
      .then((res) => setSquads(res.squads ?? []))
      .catch(() => setSquads([]));
  }, [open]);

  // When the selected "team up with" agent changes, check if it's in a squad
  useEffect(() => {
    if (!teamUpWithAgent) {
      setSquadName("");
      setSquadNameReadOnly(false);
      return;
    }
    const [agentNs, agentName] = teamUpWithAgent.split("/");
    // Find any squad that contains this agent as a member
    const matchingSquad = squads.find((squad) =>
      squad.members?.some((m) => m.name === agentName) &&
      squad.namespace === agentNs
    );
    if (matchingSquad) {
      setSquadName(matchingSquad.name);
      setSquadNameReadOnly(true);
    } else {
      setSquadNameReadOnly(false);
      setSquadName((prev) => prev && !squadNameReadOnly ? prev : "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamUpWithAgent, squads]);

  function buildNewAgentSpec() {
    return {
      name: name.trim(),
      instructions: instructions.trim(),
      model,
      namespace: namespace.trim() || undefined,
      lifecycle: lifecycle === "default" ? "" : lifecycle,
      systemPrompt: systemPrompt.trim() || undefined,
    };
  }

  function validate(): string | null {
    if (!name.trim()) return "Name is required.";
    if (!NAME_PATTERN.test(name)) return "Name must be lowercase letters, numbers, and hyphens only.";
    if (!instructions.trim()) return "Instructions are required.";
    if (!teamUpWithAgent) return "Select an agent to team up with.";
    if (!squadName.trim()) return "Squad name is required.";
    if (!NAME_PATTERN.test(squadName)) return "Squad name must be lowercase letters, numbers, and hyphens only.";
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
      const [agentNs, agentName] = teamUpWithAgent.split("/");
      const newAgentSpec = buildNewAgentSpec();

      const matchingSquad = squads.find((squad) =>
        squad.members?.some((m) => m.name === agentName) &&
        squad.namespace === agentNs
      );

      if (matchingSquad) {
        // Add new agent to existing squad
        await addSquadMember(matchingSquad.name, matchingSquad.namespace, { spec: newAgentSpec });
      } else {
        // Create a new squad with both the existing agent + new agent spec
        await createSquad({
          name: squadName.trim(),
          namespace: namespace.trim() || undefined,
          members: [
            { ref: { name: agentName, namespace: agentNs } },
            { spec: newAgentSpec },
          ],
        });
      }

      onCreated?.();
      onCancel();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to team up.");
    } finally {
      setSubmitting(false);
    }
  }

  // Filter agents for dropdown
  const filteredAgents = availableAgents.filter((a) => {
    const q = agentSearch.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.namespace.toLowerCase().includes(q);
  });

  const selectedAgentDisplay = teamUpWithAgent
    ? (() => {
        const [ns, n] = teamUpWithAgent.split("/");
        const agent = availableAgents.find((a) => a.name === n && a.namespace === ns);
        return agent ? agent.name : teamUpWithAgent;
      })()
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
      <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
        {/* New agent fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="teamup-agent-name">Name</Label>
            <Input
              id="teamup-agent-name"
              placeholder="my-agent"
              value={name}
              onChange={(e) => onSharedValuesChange({ ...sharedValues, name: e.target.value })}
              autoComplete="off"
            />
          </div>
          <NamespaceSelector value={namespace} onChange={(v) => onSharedValuesChange({ ...sharedValues, namespace: v })} />
        </div>

        {/* System prompt */}
        <div className="flex flex-col">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            onClick={() => setSystemPromptOpen(!systemPromptOpen)}
          >
            <ChevronRight className={`size-3.5 transition-transform duration-150 ${systemPromptOpen ? "rotate-90" : ""}`} />
            System Prompt <span className="text-[var(--color-text-muted)] font-normal">(Optional)</span>
          </button>
          <AnimatePresence initial={false}>
            {systemPromptOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <Textarea
                    placeholder="Custom instructions that define agent behavior, persona, or constraints..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    style={{ minHeight: 100 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="teamup-instructions">Instructions</Label>
          <Textarea
            id="teamup-instructions"
            placeholder="Describe what this agent should do..."
            value={instructions}
            onChange={(e) => onSharedValuesChange({ ...sharedValues, instructions: e.target.value })}
            style={{ minHeight: 140 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Model</Label>
            <Select value={model} onValueChange={(v) => v && onSharedValuesChange({ ...sharedValues, model: v })}>
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
            <Select value={lifecycle} onValueChange={(v) => v && onSharedValuesChange({ ...sharedValues, lifecycle: v })}>
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

        {/* Team Up section */}
        <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Team Up</span>

          {/* Agent picker */}
          <div className="flex flex-col gap-1.5">
            <Label>Team Up With</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAgentDropdownOpen((v) => !v)}
                className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm transition-colors hover:border-[var(--color-border-hover)] cursor-pointer"
              >
                {selectedAgentDisplay ? (
                  <span className="text-[var(--color-text)]">{selectedAgentDisplay}</span>
                ) : (
                  <span className="text-[var(--color-text-muted)]">Select an agent...</span>
                )}
                <ChevronRight className={`size-3.5 text-[var(--color-text-secondary)] transition-transform ${agentDropdownOpen ? "rotate-90" : ""}`} />
              </button>
              {agentDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg">
                  <div className="p-1.5 border-b border-[var(--color-border)]">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search agents..."
                      value={agentSearch}
                      onChange={(e) => setAgentSearch(e.target.value)}
                      className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none px-1 py-0.5"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredAgents.length === 0 && (
                      <p className="px-3 py-2 text-xs text-[var(--color-text-muted)]">No agents found</p>
                    )}
                    {filteredAgents.map((agent) => {
                      const key = `${agent.namespace}/${agent.name}`;
                      const inSquad = squads.some(
                        (s) => s.namespace === agent.namespace && s.members?.some((m) => m.name === agent.name)
                      );
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setTeamUpWithAgent(key);
                            setAgentDropdownOpen(false);
                            setAgentSearch("");
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer ${
                            teamUpWithAgent === key ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"
                          }`}
                        >
                          <span className="flex-1">{agent.name}</span>
                          <span className="text-[9px] text-[var(--color-brand-blue-light)]">{agent.namespace}</span>
                          {inSquad && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-brand-violet)]/10 text-[var(--color-brand-violet)]">squad</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Squad name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="teamup-squad-name">
              Squad Name
              {squadNameReadOnly && (
                <span className="ml-2 text-[10px] text-[var(--color-brand-violet)] font-normal">(prefilled from existing squad)</span>
              )}
            </Label>
            <Input
              id="teamup-squad-name"
              placeholder="my-squad"
              value={squadName}
              onChange={(e) => !squadNameReadOnly && setSquadName(e.target.value)}
              readOnly={squadNameReadOnly}
              className={squadNameReadOnly ? "opacity-60 cursor-default" : ""}
              autoComplete="off"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-4 shrink-0 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Team Up"}
        </Button>
      </div>
    </form>
  );
}
