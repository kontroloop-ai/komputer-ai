"use client";

import { Sparkles, Bot } from "lucide-react";
import type { AgentResponse } from "@/lib/types";
import { RelativeTime } from "@/components/shared/relative-time";
import { ChipSelect, type ChipSelectOption } from "@/components/kit/chip-select";

const NEW_VALUE = "__new__";

export interface ActiveAgentChipProps {
  /** Currently selected existing agent, or null when in "new" mode. */
  active: AgentResponse | null;
  /** True when the user has chosen the virtual "new agent" entry. */
  isNew: boolean;
  agents: AgentResponse[];
  /** Pick an existing agent. */
  onSelect: (agent: AgentResponse) => void;
  /** Switch to "new agent" mode — does not create anything yet. */
  onSelectNew: () => void;
}

export function ActiveAgentChip({ active, isNew, agents, onSelect, onSelectNew }: ActiveAgentChipProps) {
  const trigger = isNew || !active ? (
    <>
      <Sparkles className="size-3 text-amber-400" />
      <span className="font-medium text-[var(--color-text)]">New personal agent</span>
    </>
  ) : (
    <>
      <Bot className="size-3 text-emerald-400" />
      <span className="font-medium text-[var(--color-text)]">{active.name}</span>
    </>
  );

  const options: ChipSelectOption[] = agents.map((a) => ({
    value: agentValue(a),
    label: a.name,
    icon: <Bot className="size-3 shrink-0 text-[var(--color-text-muted)]" />,
    meta: a.completionTime ? (
      <span className="text-[10px] text-[var(--color-text-muted)]">
        <RelativeTime timestamp={a.completionTime} />
      </span>
    ) : null,
  }));
  options.push({
    value: NEW_VALUE,
    label: "New personal agent",
    icon: <Sparkles className="size-3 shrink-0 text-amber-400" />,
    className: "text-[var(--color-text-secondary)]",
  });

  const value = isNew || !active ? NEW_VALUE : agentValue(active);

  function handleChange(next: string) {
    if (next === NEW_VALUE) {
      onSelectNew();
      return;
    }
    const found = agents.find((a) => agentValue(a) === next);
    if (found) onSelect(found);
  }

  return <ChipSelect value={value} options={options} onChange={handleChange} trigger={trigger} />;
}

function agentValue(a: AgentResponse): string {
  return `${a.namespace}/${a.name}`;
}
