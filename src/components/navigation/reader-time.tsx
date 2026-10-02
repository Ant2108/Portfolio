"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

function getTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** The visitor's own local time — rendered only on the client. */
export function ReaderTime() {
  const time = useSyncExternalStore(subscribe, getTime, () => "--:--");
  return (
    <p className="label whitespace-nowrap text-ink-faint">
      Reader&rsquo;s time <time className="ml-1.5 tabular-nums text-ink">{time}</time>
    </p>
  );
}
