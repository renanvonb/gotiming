import type { ReactNode } from "react";

const MATCH_STYLE = { color: "var(--ant-blue-5)" } as const;

export function highlightMatch(text: string, term: string): ReactNode {
  const needle = term.trim().toLowerCase();
  if (!needle) return text;
  const hay = text.toLowerCase();
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i <= text.length) {
    const idx = hay.indexOf(needle, i);
    if (idx === -1) {
      out.push(text.slice(i));
      break;
    }
    if (idx > i) out.push(text.slice(i, idx));
    out.push(
      <span key={k++} style={MATCH_STYLE}>
        {text.slice(idx, idx + needle.length)}
      </span>
    );
    i = idx + needle.length;
  }
  return out;
}
