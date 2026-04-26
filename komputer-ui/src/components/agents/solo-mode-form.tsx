"use client";

import { useState, useEffect, useRef } from "react";
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
import { ChevronRight, Check, Plus } from "lucide-react";
import { CreateSecretModal } from "@/components/secrets/create-secret-modal";
import { NamespaceSelector } from "@/components/shared/namespace-selector";
import { listTemplates, listMemories, listSkills, listSecrets, listConnectors } from "@/lib/api";
import type { TemplateResponse } from "@/lib/types";
import { MODELS, LIFECYCLES } from "@/lib/constants";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface SoloFormValues {
  name: string;
  namespace: string;
  instructions: string;
  systemPrompt: string;
  model: string;
  lifecycle: string;
  role: "manager" | "worker" | undefined;
  templateRef: string;
  selectedMemories: string[];
  selectedSkills: string[];
  selectedConnectors: string[];
  selectedSecretRefs: string[];
  priority: number;
  cpu: string;
  memoryLimit: string;
  storageSize: string;
  image: string;
}

export interface SoloModeFormProps {
  /** Values shared from parent (name, namespace, instructions, model, lifecycle) */
  sharedValues: Pick<SoloFormValues, "name" | "namespace" | "instructions" | "model" | "lifecycle">;
  onSharedValuesChange: (values: Pick<SoloFormValues, "name" | "namespace" | "instructions" | "model" | "lifecycle">) => void;
  open: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: SoloFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function SoloModeForm({
  sharedValues,
  onSharedValuesChange,
  open,
  submitting,
  error,
  onSubmit,
  onCancel,
  submitLabel = "Create Agent",
}: SoloModeFormProps) {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);
  const [role, setRole] = useState<"manager" | "worker" | undefined>(undefined);
  const [templateRef, setTemplateRef] = useState("default");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [availableMemories, setAvailableMemories] = useState<{ name: string; namespace: string; ref: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<{ name: string; namespace: string; ref: string }[]>([]);
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([]);
  const [availableConnectors, setAvailableConnectors] = useState<{ name: string; namespace: string; ref: string }[]>([]);
  const [selectedSecretRefs, setSelectedSecretRefs] = useState<string[]>([]);
  const [availableSecrets, setAvailableSecrets] = useState<{ name: string; namespace: string }[]>([]);
  const [showAllSecrets, setShowAllSecrets] = useState(false);
  const [createSecretOpen, setCreateSecretOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [priority, setPriority] = useState(0);
  const [cpu, setCpu] = useState("");
  const [memoryLimit, setMemoryLimit] = useState("");
  const [storageSize, setStorageSize] = useState("");
  const [image, setImage] = useState("");
  const advancedRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { name, namespace, instructions, model, lifecycle } = sharedValues;

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
    listSecrets(namespace || undefined, showAllSecrets)
      .then((res) => setAvailableSecrets((res.secrets ?? []).map((s) => ({ name: s.name, namespace: s.namespace }))))
      .catch(() => setAvailableSecrets([]));
    listConnectors()
      .then((res) => setAvailableConnectors((res.connectors ?? []).map((c) => ({
        name: c.name,
        namespace: c.namespace,
        ref: c.namespace === (namespace || "default") ? c.name : `${c.namespace}/${c.name}`,
      }))))
      .catch(() => setAvailableConnectors([]));
  }, [open, namespace, showAllSecrets]);

  function validate(): string | null {
    if (!name.trim()) return "Name is required.";
    if (!NAME_PATTERN.test(name))
      return "Name must be lowercase letters, numbers, and hyphens only.";
    if (!instructions.trim()) return "Instructions are required.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      onSubmit({ name, namespace, instructions, systemPrompt, model, lifecycle, role, templateRef, selectedMemories, selectedSkills, selectedConnectors, selectedSecretRefs, priority, cpu, memoryLimit, storageSize, image });
      return;
    }
    onSubmit({ name, namespace, instructions, systemPrompt, model, lifecycle, role, templateRef, selectedMemories, selectedSkills, selectedConnectors, selectedSecretRefs, priority, cpu, memoryLimit, storageSize, image });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
      <div ref={scrollRef} className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              placeholder="my-agent"
              value={name}
              onChange={(e) => onSharedValuesChange({ ...sharedValues, name: e.target.value })}
              autoComplete="off"
            />
          </div>
          <NamespaceSelector value={namespace} onChange={(v) => onSharedValuesChange({ ...sharedValues, namespace: v })} />
        </div>

        {/* Collapsible system prompt */}
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
                    id="agent-system-prompt"
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
          <Label htmlFor="agent-instructions">Instructions</Label>
          <Textarea
            id="agent-instructions"
            placeholder="Describe what this agent should do..."
            value={instructions}
            onChange={(e) => onSharedValuesChange({ ...sharedValues, instructions: e.target.value })}
            style={{ minHeight: 200 }}
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
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
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
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Secrets</Label>
            <button
              type="button"
              onClick={() => setShowAllSecrets((v) => !v)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                showAllSecrets
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
              }`}
            >
              Show all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableSecrets.map((s) => {
              const selected = selectedSecretRefs.includes(s.name);
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedSecretRefs(prev =>
                    selected ? prev.filter(n => n !== s.name) : [...prev, s.name]
                  )}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    selected
                      ? "border-[var(--color-text)] bg-white/10 text-[var(--color-text)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                  }`}
                >
                  {selected && <Check className="inline size-2.5 mr-1" />}
                  {s.name}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCreateSecretOpen(true)}
              className="text-xs px-2.5 py-1 rounded-full border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
            >
              <Plus className="inline size-2.5 mr-1" />
              New Secret
            </button>
          </div>
        </div>
        <CreateSecretModal
          open={createSecretOpen}
          onOpenChange={setCreateSecretOpen}
          onCreated={() => {
            listSecrets(namespace || undefined, showAllSecrets)
              .then((res) => setAvailableSecrets((res.secrets ?? []).map((s) => ({ name: s.name, namespace: s.namespace }))))
              .catch(() => {});
          }}
        />

        {/* Advanced section */}
        <div ref={advancedRef} className="rounded-md border border-[var(--color-border)]">
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
                onAnimationComplete={() => {
                  if (advancedOpen) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
                }}
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

                  {/* Connectors */}
                  <div className="flex flex-col gap-1.5">
                    <Label>Connectors</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableConnectors.map((c) => {
                        const selected = selectedConnectors.includes(c.ref);
                        const isCrossNs = c.ref.includes("/");
                        return (
                          <button
                            key={c.ref}
                            type="button"
                            onClick={() => setSelectedConnectors(prev =>
                              selected ? prev.filter(n => n !== c.ref) : [...prev, c.ref]
                            )}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                              selected
                                ? "border-[var(--color-text)] bg-white/10 text-[var(--color-text)]"
                                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                            }`}
                          >
                            {selected && <Check className="inline size-2.5 mr-1" />}
                            {c.name}
                            {isCrossNs && <span className="ml-1 text-[9px] text-[var(--color-brand-blue-light)]">{c.namespace}</span>}
                          </button>
                        );
                      })}
                      {availableConnectors.length === 0 && (
                        <p className="text-xs text-[var(--color-text-muted)]">No connectors available</p>
                      )}
                    </div>
                  </div>

                  {/* Resource overrides */}
                  <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                      Template Overrides
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-cpu">CPU</Label>
                        <Input
                          id="agent-cpu"
                          placeholder="e.g. 2 or 500m"
                          value={cpu}
                          onChange={(e) => setCpu(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-memory">Memory</Label>
                        <Input
                          id="agent-memory"
                          placeholder="e.g. 4Gi"
                          value={memoryLimit}
                          onChange={(e) => setMemoryLimit(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-storage">Storage</Label>
                        <Input
                          id="agent-storage"
                          placeholder="e.g. 20Gi"
                          value={storageSize}
                          onChange={(e) => setStorageSize(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-image">Container Image</Label>
                        <Input
                          id="agent-image"
                          placeholder="e.g. custom:latest"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="priority-input">Priority</Label>
                      <input
                        id="priority-input"
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                        placeholder="0"
                        className="flex h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-brand-blue)]"
                      />
                      <p className="text-xs text-[var(--color-text-secondary)]">Higher priority agents are admitted first when the template capacity limit is reached. Default: 0.</p>
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

      <div className="mt-4 shrink-0 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
