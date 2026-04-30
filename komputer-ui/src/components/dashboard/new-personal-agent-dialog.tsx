"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/kit/dialog";
import { Button } from "@/components/kit/button";
import { NamespaceSelector } from "@/components/shared/namespace-selector";

export interface NewPersonalAgentDialogProps {
  open: boolean;
  defaultNamespace: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (namespace: string) => void;
}

export function NewPersonalAgentDialog({ open, defaultNamespace, onOpenChange, onConfirm }: NewPersonalAgentDialogProps) {
  const [namespace, setNamespace] = useState(defaultNamespace);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New personal agent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-[var(--color-text-secondary)]">
            A new Sonnet manager agent will be created with the personal-agent label.
            It uses default settings; you can adjust later in agent settings.
          </p>
          <NamespaceSelector value={namespace} onChange={setNamespace} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onConfirm(namespace)}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
