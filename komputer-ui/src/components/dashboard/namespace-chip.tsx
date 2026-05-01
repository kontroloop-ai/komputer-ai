"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FolderOpen, Plus, X } from "lucide-react";
import { listNamespaces } from "@/lib/api";
import { ChipSelect, type ChipSelectOption } from "@/components/kit/chip-select";

export interface NamespaceChipProps {
  value: string;
  onChange: (ns: string) => void;
}

/**
 * Pill-style namespace selector with inline "Add namespace" support, sharing
 * the ChipSelect primitive with ActiveAgentChip.
 */
export function NamespaceChip({ value, onChange }: NamespaceChipProps) {
  const [namespaces, setNamespaces] = useState<string[]>(["default"]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listNamespaces()
      .then((res) => {
        const sorted = [...new Set(["default", ...(res.namespaces || [])])].sort();
        setNamespaces(sorted);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (adding) addInputRef.current?.focus();
  }, [adding]);

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed) {
      if (!namespaces.includes(trimmed)) {
        setNamespaces((prev) => [...prev, trimmed].sort());
      }
      onChange(trimmed);
    }
    setAdding(false);
    setDraft("");
  }

  const options: ChipSelectOption[] = namespaces.map((ns) => ({
    value: ns,
    label: <span className="font-mono text-[13px]">{ns}</span>,
    icon: <FolderOpen className="size-3 shrink-0 text-[var(--color-text-muted)]" />,
  }));

  const trigger = (
    <>
      <FolderOpen className="size-3 text-[var(--color-brand-blue)]" />
      <span className="font-mono text-[var(--color-text)]">{value || "default"}</span>
    </>
  );

  const footer = adding ? (
    <div
      className="flex items-center gap-1 px-2 py-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={addInputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitDraft();
          } else if (e.key === "Escape") {
            e.preventDefault();
            setAdding(false);
            setDraft("");
          }
        }}
        placeholder="namespace name"
        className="flex-1 h-6 rounded px-2 text-[12px] font-mono bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-blue)]/60"
      />
      <button
        type="button"
        onClick={commitDraft}
        className="flex h-6 w-6 items-center justify-center rounded text-green-400 hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <Check className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          setAdding(false);
          setDraft("");
        }}
        className="flex h-6 w-6 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        setAdding(true);
        setDraft("");
      }}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer"
    >
      <Plus className="size-3" />
      Add namespace
    </button>
  );

  return (
    <ChipSelect
      value={value || "default"}
      options={options}
      onChange={onChange}
      trigger={trigger}
      footer={footer}
    />
  );
}
