"use client";

import Link from "next/link";
import { useState } from "react";

export const NAV_LINKS = [
  { href: "#what-is-vhd", label: "The Condition" },
  { href: "#risks", label: "Risks" },
  { href: "#symptoms", label: "Symptoms" },
  { href: "#detection", label: "Early Detection" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-accent">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            VHD Detection<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/demo"
            className="rounded-[6px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Open analyzer
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-hairline text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-bg md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-hairline py-3 text-sm font-medium text-ink-dim hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-[6px] bg-accent px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Open analyzer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
