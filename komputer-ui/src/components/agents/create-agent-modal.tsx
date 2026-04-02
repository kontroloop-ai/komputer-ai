"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/kit/dialog";
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
import { Plus, Trash2, ChevronRight, Check } from "lucide-react";
import { NamespaceSelector } from "@/components/shared/namespace-selector";
import { createAgent, listTemplates, listMemories, listSkills } from "@/lib/api";
import type { CreateAgentRequest, TemplateResponse } from "@/lib/types";
import type { AgentTemplate } from "@/lib/create-agent-modal-context";

type SecretEntry = { key: string; value: string };

type CreateAgentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  initialValues?: AgentTemplate | null;
};

import { MODELS, LIFECYCLES } from "@/lib/constants";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function CreateAgentModal({ open, onOpenChange, onCreated, initialValues }: CreateAgentModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [namespace, setNamespace] = useState("default");
  const [instructions, setInstructions] = useState("");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [lifecycle, setLifecycle] = useState("default");
  const [role, setRole] = useState<"manager" | "worker" | undefined>(undefined);
  const [templateRef, setTemplateRef] = useState("default");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [availableMemories, setAvailableMemories] = useState<{ name: string; namespace: string; ref: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<{ name: string; namespace: string; ref: string }[]>([]);
  const [secrets, setSecrets] = useState<SecretEntry[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setNamespace("default");
    setInstructions("");
    setModel("claude-sonnet-4-6");
    setLifecycle("default");
    setTemplateRef("default");
    setRole(undefined);
    setSecrets([]);
    setSelectedMemories([]);
    setSelectedSkills([]);
    setAdvancedOpen(false);
    setError(null);
  }

  // Fetch templates when modal opens or namespace changes
  useEffect(() => {
    if (!open) return;
    listTemplates(namespace || undefined)
      .then((res) => setTemplates(res.templates ?? []))
      .catch(() => setTemplates([]));
    listMemories()
      .then((res) => setAvailableMemories((res.memories ?? []).map((m) => ({
        name: m.name,
        namespace: m.namespace,
        ref: m.namespace === (namespace || "default") ? m.name : `${m.namespace}/${m.name}`,
      }))))
      .catch(() => setAvailableMemories([]));
    listSkills()
      .then((res) => setAvailableSkills((res.skills ?? []).map((s) => ({
        name: s.name,
        namespace: s.namespace,
        ref: s.namespace === (namespace || "default") ? s.name : `${s.namespace}/${s.name}`,
      }))))
      .catch(() => setAvailableSkills([]));
  }, [open, namespace]);

  useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name);
      setInstructions(initialValues.instructions);
      setModel(initialValues.model);
      setLifecycle(initialValues.lifecycle);
      setRole(initialValues.role);
      if (initialValues.templateRef) setTemplateRef(initialValues.templateRef);
      if (initialValues.secrets) {
        setSecrets(
          Object.entries(initialValues.secrets).map(([key, value]) => ({ key, value }))
        );
      } else {
        setSecrets([]);
      }
      setError(null);
    }
  }, [open, initialValues]);

  function validate(): string | null {
    if (!name.trim()) return "Name is required.";
    if (!NAME_PATTERN.test(name))
      return "Name must be lowercase letters, numbers, and hyphens only.";
    if (!instructions.trim()) return "Instructions are required.";
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
      const secretsMap: Record<string, string> = {};
      for (const s of secrets) {
        const k = s.key.trim();
        const v = s.value.trim();
        if (k && v) secretsMap[k] = v;
      }

      const req: CreateAgentRequest = {
        name: name.trim(),
        instructions: instructions.trim(),
        model,
        namespace: namespace.trim() || undefined,
        lifecycle: lifecycle === "default" ? "" : (lifecycle as "" | "Sleep" | "AutoDelete"),
        role: role || undefined,
        templateRef: templateRef !== "default" ? templateRef : undefined,
        secrets: Object.keys(secretsMap).length > 0 ? secretsMap : undefined,
        memories: selectedMemories.length > 0 ? selectedMemories : undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      };
      await createAgent(req);
      const agentName = name.trim();
      const agentNs = namespace.trim() || undefined;
      const agentInstructions = instructions.trim();
      resetForm();
      onOpenChange(false);
      onCreated?.();
      const params = new URLSearchParams();
      if (agentNs) params.set("namespace", agentNs);
      params.set("pending", agentInstructions);
      router.push(`/agents/${agentName}?${params.toString()}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create agent.");
    } finally {
      setSubmitting(false);
    }
  }

  const addSecret = useCallback(() => {
    setSecrets((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const removeSecret = useCallback((index: number) => {
    setSecrets((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateSecret = useCallback(
    (index: number, field: "key" | "value", val: string) => {
      setSecrets((prev) =>
        prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
      );
    },
    []
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Agent</DialogTitle>
            <DialogDescription>
              Deploy a new Claude agent to your cluster.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-name">Name</Label>
              <Input
                id="agent-name"
                placeholder="my-agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <NamespaceSelector value={namespace} onChange={setNamespace} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-instructions">Instructions</Label>
              <Textarea
                id="agent-instructions"
                placeholder="Describe what this agent should do..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={{ minHeight: 200 }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Model</Label>
              <Select value={model} onValueChange={(v) => v && setModel(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Lifecycle</Label>
              <Select value={lifecycle} onValueChange={(v) => v && setLifecycle(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFECYCLES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Secrets</Label>
              <div className="flex flex-col gap-2">
                {secrets.map((secret, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="KEY"
                      value={secret.key}
                      onChange={(e) => updateSecret(index, "key", e.target.value)}
                      autoComplete="off"
                      className="flex-1"
                    />
                    <Input
                      type="password"
                      placeholder="value"
                      value={secret.value}
                      onChange={(e) => updateSecret(index, "value", e.target.value)}
                      autoComplete="off"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSecret(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addSecret}
                  className="w-fit"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Secret
                </Button>
              </div>
            </div>

            {/* Advanced section */}
            <div className="rounded-md border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ChevronRight
                  className={`size-3.5 shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200 ${advancedOpen ? "rotate-90" : ""}`}
                />
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Advanced</span>
              </button>
              <AnimatePresence initial={false}>
                {advancedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{ height: "auto", opacity: 1, overflow: "visible", transitionEnd: { overflow: "visible" } }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="border-t border-[var(--color-border)] px-3 py-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Template</Label>
                        <Select value={templateRef} onValueChange={(v) => v && setTemplateRef(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((t) => (
                              <SelectItem key={`${t.scope}-${t.name}`} value={t.name}>
                                <span className="flex items-center gap-2">
                                  {t.name}
                                  <span className={`text-[10px] tracking-wider px-1.5 py-0.5 rounded ${t.scope === "cluster" ? "bg-[var(--color-brand-violet)]/10 text-[var(--color-brand-violet)]" : "bg-emerald-500/10 text-emerald-400"}`}>
                                    {t.scope === "cluster" ? "cluster" : t.namespace}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Memories */}
                      <div className="flex flex-col gap-1.5">
                        <Label>Memories</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {availableMemories.map((m) => {
                            const selected = selectedMemories.includes(m.ref);
                            const isCrossNs = m.ref.includes("/");
                            return (
                              <button
                                key={m.ref}
                                type="button"
                                onClick={() => setSelectedMemories(prev =>
                                  selected ? prev.filter(n => n !== m.ref) : [...prev, m.ref]
                                )}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                                  selected
                                    ? "border-[var(--color-text)] bg-white/10 text-[var(--color-text)]"
                                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                                }`}
                              >
                                {selected && <Check className="inline size-2.5 mr-1" />}
                                {m.name}
                                {isCrossNs && <span className="ml-1 text-[9px] text-[var(--color-brand-blue-light)]">{m.namespace}</span>}
                              </button>
                            );
                          })}
                          {availableMemories.length === 0 && (
                            <p className="text-xs text-[var(--color-text-muted)]">No memories available</p>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-col gap-1.5">
                        <Label>Skills</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSkills.map((s) => {
                            const selected = selectedSkills.includes(s.ref);
                            const isCrossNs = s.ref.includes("/");
                            return (
                              <button
                                key={s.ref}
                                type="button"
                                onClick={() => setSelectedSkills(prev =>
                                  selected ? prev.filter(n => n !== s.ref) : [...prev, s.ref]
                                )}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                                  selected
                                    ? "border-[var(--color-text)] bg-white/10 text-[var(--color-text)]"
                                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                                }`}
                              >
                                {selected && <Check className="inline size-2.5 mr-1" />}
                                {s.name}
                                {isCrossNs && <span className="ml-1 text-[9px] text-[var(--color-brand-blue-light)]">{s.namespace}</span>}
                              </button>
                            );
                          })}
                          {availableSkills.length === 0 && (
                            <p className="text-xs text-[var(--color-text-muted)]">No skills available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
