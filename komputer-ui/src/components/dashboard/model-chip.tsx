"use client";

import { Cpu } from "lucide-react";
import { MODELS } from "@/lib/constants";
import { ChipSelect, type ChipSelectOption } from "@/components/kit/chip-select";

export interface ModelChipProps {
  value: string;
  onChange: (model: string) => void;
}

/**
 * Pill-style model selector sharing the ChipSelect primitive with
 * ActiveAgentChip and NamespaceChip. Driven by the MODELS list in
 * `@/lib/constants`.
 */
export function ModelChip({ value, onChange }: ModelChipProps) {
  const options: ChipSelectOption[] = MODELS.map((m) => ({
    value: m.value,
    label: <span className="font-mono text-[13px]">{m.label}</span>,
    icon: <Cpu className="size-3 shrink-0 text-[var(--color-text-muted)]" />,
  }));

  const trigger = (
    <>
      <Cpu className="size-3 text-[var(--color-brand-blue)]" />
      <span className="font-mono text-[var(--color-text)]">{shortModelLabel(value)}</span>
    </>
  );

  return <ChipSelect value={value} options={options} onChange={onChange} trigger={trigger} />;
}

export function shortModelLabel(model: string): string {
  // claude-sonnet-4-6 → sonnet 4.6
  const m = model.match(/claude-(opus|sonnet|haiku)-(\d+)-(\d+)/);
  if (!m) return model;
  return `${m[1]} ${m[2]}.${m[3]}`;
}
