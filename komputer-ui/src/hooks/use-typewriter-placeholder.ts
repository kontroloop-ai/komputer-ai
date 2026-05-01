"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  prompts: string[];
  /** ms per character while typing. Default 40. */
  typeMs?: number;
  /** ms per character while erasing. Default 25. */
  eraseMs?: number;
  /** ms to pause when fully typed. Default 1500. */
  fullPauseMs?: number;
  /** ms to pause when blank. Default 300. */
  blankPauseMs?: number;
  /** When true, the animation pauses (e.g. input has focus or value). */
  paused?: boolean;
}

/**
 * Animates a placeholder string by typing the next prompt, pausing, then
 * erasing it, then advancing to the next prompt. Cycles indefinitely.
 *
 * Pauses cleanly when `paused` is true: stays on whatever is currently
 * shown until paused flips back to false.
 */
export function useTypewriterPlaceholder({
  prompts,
  typeMs = 40,
  eraseMs = 25,
  fullPauseMs = 1500,
  blankPauseMs = 300,
  paused = false,
}: Options): string {
  const [text, setText] = useState("");
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef<"typing" | "fullPause" | "erasing" | "blankPause">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused || prompts.length === 0) {
      return;
    }
    function tick() {
      const target = prompts[indexRef.current];
      switch (phaseRef.current) {
        case "typing": {
          if (charRef.current < target.length) {
            charRef.current += 1;
            setText(target.slice(0, charRef.current));
            timerRef.current = setTimeout(tick, typeMs);
          } else {
            phaseRef.current = "fullPause";
            timerRef.current = setTimeout(tick, fullPauseMs);
          }
          break;
        }
        case "fullPause": {
          phaseRef.current = "erasing";
          timerRef.current = setTimeout(tick, eraseMs);
          break;
        }
        case "erasing": {
          if (charRef.current > 0) {
            charRef.current -= 1;
            setText(target.slice(0, charRef.current));
            timerRef.current = setTimeout(tick, eraseMs);
          } else {
            phaseRef.current = "blankPause";
            timerRef.current = setTimeout(tick, blankPauseMs);
          }
          break;
        }
        case "blankPause": {
          indexRef.current = (indexRef.current + 1) % prompts.length;
          phaseRef.current = "typing";
          timerRef.current = setTimeout(tick, typeMs);
          break;
        }
      }
    }
    timerRef.current = setTimeout(tick, typeMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prompts, typeMs, eraseMs, fullPauseMs, blankPauseMs, paused]);

  return text;
}
