"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Check, Plus } from "lucide-react";
import { Input } from "@/components/kit/input";
import { Button } from "@/components/kit/button";
import { Label } from "@/components/kit/label";
import { listAgents } from "@/lib/api";

type NamespaceSelectorProps = {
  value: string;
  onChange: (ns: string) => void;
  label?: string;
};

export function NamespaceSelector({ value, onChange, label = "Namespace" }: NamespaceSelectorProps) {
  const [knownNamespaces, setKnownNamespaces] = useState<string[]>(["default"]);
  const [adding, setAdding] = useState(false);
  const [newNs, setNewNs] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch known namespaces from agents
  useEffect(() => {
    listAgents()
      .then((res) => {
        const nss = new Set(["default", ...(res.agents || []).map((a) => a.namespace)]);
        setKnownNamespaces([...nss].sort());
      })
      .catch(() => {});
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
        setNewNs("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus input when adding
  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  const handleSelect = useCallback((ns: string) => {
    onChange(ns);
    setOpen(false);
    setAdding(false);
    setNewNs("");
  }, [onChange]);

  const handleAddSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNs.trim();
    if (trimmed) {
      if (!knownNamespaces.includes(trimmed)) {
        setKnownNamespaces((prev) => [...prev, trimmed].sort());
      }
      onChange(trimmed);
    }
    setAdding(false);
    setNewNs("");
    setOpen(false);
  }, [newNs, knownNamespaces, onChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="flex items-center justify-between w-full h-8 px-3 rounded-[var(--radius-sm)] text-[13px] font-[family-name:var(--font-mono)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 cursor-pointer hover:border-[var(--color-border-hover)] focus:outline-none focus:border-[var(--color-brand-blue)]/60 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_0_0_2px_var(--color-brand-blue-glow)]"
          onClick={() => setOpen(!open)}
        >
          <span className="truncate">{value || "default"}</span>
          <ChevronRight className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute z-50 w-full mt-1 py-1 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2)] overflow-y-auto max-h-60"
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              {knownNamespaces.map((ns) => (
                <div
                  key={ns}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] ${value === ns ? "text-[var(--color-brand-blue)]" : "text-[var(--color-text)]"}`}
                  onClick={() => handleSelect(ns)}
                >
                  <span className="truncate">{ns}</span>
                  {value === ns && <Check className="h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />}
                </div>
              ))}

              <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                {adding ? (
                  <form className="flex items-center gap-2 px-3 py-2" onSubmit={handleAddSubmit}>
                    <Input
                      ref={inputRef}
                      placeholder="namespace-name"
                      value={newNs}
                      onChange={(e) => setNewNs(e.target.value)}
                      autoComplete="off"
                      className="flex-1 h-7 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setAdding(false);
                          setNewNs("");
                        }
                      }}
                    />
                    <Button type="submit" size="sm" variant="secondary" className="h-7 text-xs px-2">
                      Add
                    </Button>
                  </form>
                ) : (
                  <div
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                    onClick={() => setAdding(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add namespace</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
