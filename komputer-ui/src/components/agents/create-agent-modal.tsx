"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/kit/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/kit/tabs";
import { createAgent } from "@/lib/api";
import type { CreateAgentRequest } from "@/lib/types";
import type { AgentTemplate } from "@/lib/create-agent-modal-context";
import { SoloModeForm, type SoloFormValues } from "./solo-mode-form";
import { SquadModeForm } from "./squad-mode-form";
import { TeamUpModeForm } from "./team-up-mode-form";

type CreateAgentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  initialValues?: AgentTemplate | null;
};

type Mode = "solo" | "squad" | "team-up";

// Shared fields that are preserved when switching tabs
interface SharedFields {
  name: string;
  namespace: string;
  instructions: string;
  model: string;
  lifecycle: string;
}

const DEFAULT_SHARED: SharedFields = {
  name: "",
  namespace: "default",
  instructions: "",
  model: "claude-sonnet-4-6",
  lifecycle: "default",
};

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function CreateAgentModal({ open, onOpenChange, onCreated, initialValues }: CreateAgentModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("solo");
  const [shared, setShared] = useState<SharedFields>(DEFAULT_SHARED);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetAll() {
    setMode("solo");
    setShared(DEFAULT_SHARED);
    setSubmitting(false);
    setError(null);
  }

  // Apply initialValues when modal opens
  useEffect(() => {
    if (open && initialValues) {
      setShared({
        name: initialValues.name,
        namespace: "default",
        instructions: initialValues.instructions,
        model: initialValues.model,
        lifecycle: initialValues.lifecycle,
      });
      setError(null);
    }
  }, [open, initialValues]);

  // When closed: reset
  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) resetAll();
  }

  // Switch tabs: drop tab-specific state, keep shared fields
  function handleModeChange(nextMode: string) {
    setMode(nextMode as Mode);
    setError(null);
  }

  // ---- Solo submit ----
  async function handleSoloSubmit(values: SoloFormValues) {
    // Validate inline
    if (!values.name.trim()) { setError("Name is required."); return; }
    if (!NAME_PATTERN.test(values.name)) { setError("Name must be lowercase letters, numbers, and hyphens only."); return; }
    if (!values.instructions.trim()) { setError("Instructions are required."); return; }

    setSubmitting(true);
    setError(null);

    try {
      let podSpecOverride: Record<string, unknown> | undefined;
      if (values.cpu.trim() || values.memoryLimit.trim() || values.image.trim()) {
        const container: Record<string, unknown> = { name: "agent" };
        if (values.image.trim()) container.image = values.image.trim();
        if (values.cpu.trim() || values.memoryLimit.trim()) {
          const rl: Record<string, string> = {};
          if (values.cpu.trim()) rl.cpu = values.cpu.trim();
          if (values.memoryLimit.trim()) rl.memory = values.memoryLimit.trim();
          container.resources = { requests: rl, limits: rl };
        }
        podSpecOverride = { containers: [container] };
      }

      const req: CreateAgentRequest = {
        name: values.name.trim(),
        instructions: values.instructions.trim(),
        model: values.model,
        namespace: values.namespace.trim() || undefined,
        lifecycle: values.lifecycle === "default" ? "" : (values.lifecycle as "" | "Sleep" | "AutoDelete"),
        role: values.role || undefined,
        templateRef: values.templateRef !== "default" ? values.templateRef : undefined,
        secretRefs: values.selectedSecretRefs.length > 0 ? values.selectedSecretRefs : undefined,
        memories: values.selectedMemories.length > 0 ? values.selectedMemories : undefined,
        skills: values.selectedSkills.length > 0 ? values.selectedSkills : undefined,
        connectors: values.selectedConnectors.length > 0 ? values.selectedConnectors : undefined,
        systemPrompt: values.systemPrompt.trim() || undefined,
        priority: values.priority !== 0 ? values.priority : undefined,
        podSpec: podSpecOverride,
        storage: values.storageSize.trim() ? { size: values.storageSize.trim() } : undefined,
      };

      await createAgent(req);
      const agentName = values.name.trim();
      const agentNs = values.namespace.trim() || undefined;
      const agentInstructions = values.instructions.trim();
      resetAll();
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Agent</DialogTitle>
          <DialogDescription>
            Deploy a new Claude agent to your cluster.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="solo" value={mode} onValueChange={handleModeChange} className="mt-2 flex flex-col min-h-0 flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="solo">Solo</TabsTrigger>
            <TabsTrigger value="squad">Squad</TabsTrigger>
            <TabsTrigger value="team-up">Team Up</TabsTrigger>
          </TabsList>

          <TabsContent value="solo">
            <SoloModeForm
              sharedValues={shared}
              onSharedValuesChange={setShared}
              open={open && mode === "solo"}
              submitting={submitting}
              error={error}
              onSubmit={handleSoloSubmit}
              onCancel={() => handleOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="squad">
            <SquadModeForm
              sharedValues={shared}
              onSharedValuesChange={setShared}
              open={open && mode === "squad"}
              onCreated={() => {
                resetAll();
                onCreated?.();
              }}
              onCancel={() => handleOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="team-up">
            <TeamUpModeForm
              sharedValues={shared}
              onSharedValuesChange={setShared}
              open={open && mode === "team-up"}
              onCreated={() => {
                resetAll();
                onCreated?.();
              }}
              onCancel={() => handleOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
