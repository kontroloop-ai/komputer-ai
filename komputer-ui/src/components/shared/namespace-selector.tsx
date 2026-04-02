"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { Label } from "@/components/kit/label";
import { listNamespaces } from "@/lib/api";

type NamespaceSelectorProps = {
  value: string;
  onChange: (ns: string) => void;
  label?: string;
};

export function NamespaceSelector({ value, onChange, label = "Namespace" }: NamespaceSelectorProps) {
  const [namespaces, setNamespaces] = useState<string[]>(["default"]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "default");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listNamespaces()
      .then((res) => {
        const sorted = [...new Set(["default", ...(res.namespaces || [])])].sort();
        setNamespaces(sorted);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setInputValue(value || "default");
  }, [value]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSelect = useCallback((ns: string) => {
    onChange(ns);
    setInputValue(ns);
    setOpen(false);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setInputValue("");
    setOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Restore displayed value if input was cleared without selecting
    setTimeout(() => {
      setInputValue(value || "default");
      setOpen(false);
    }, 150);
  }, [value]);

  const filtered = inputValue
    ? namespaces.filter((ns) => ns.toLowerCase().includes(inputValue.toLowerCase()))
    : namespaces;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex h-8 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 pr-8 text-[13px] font-[family-name:var(--font-mono)] text-[var(--color-text)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)]/60 focus:outline-none focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_0_0_2px_var(--color-brand-blue-glow)]"
          />
          <ChevronRight
            className={`absolute right-2 h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 pointer-events-none ${open ? "rotate-90" : ""}`}
          />
        </div>
        <AnimatePresence>
          {open && filtered.length > 0 && (
            <motion.div
              className="absolute z-50 w-full mt-1 py-1 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2)] overflow-y-auto max-h-60"
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              {filtered.map((ns) => (
                <div
                  key={ns}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] ${value === ns ? "text-[var(--color-brand-blue)]" : "text-[var(--color-text)]"}`}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(ns); }}
                >
                  <span className="truncate font-[family-name:var(--font-mono)] text-[13px]">{ns}</span>
                  {value === ns && <Check className="h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
