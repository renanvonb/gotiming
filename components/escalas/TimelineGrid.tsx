"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, RefObject } from "react";
import type { LinhaTimeline } from "@/lib/types";
import { useThemeMode } from "@/components/providers/ThemeProvider";

interface TimelineGridProps {
  linhas: LinhaTimeline[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  bodyRef?: RefObject<HTMLDivElement>;
}

const HOUR_W = 80;
const RANGE = 24;
const INNER_W = HOUR_W * RANGE;
const TOTAL_SLOTS = RANGE * 2;
const HOURS = Array.from({ length: RANGE }, (_, h) => h); // 00..23
const GRID_HOURS = Array.from({ length: RANGE + 1 }, (_, h) => h); // 00..24

const pct = (h: number) => (h / RANGE) * 100;
const pctMin = (min: number) => (min / (RANGE * 60)) * 100;

function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

interface HoverInfo {
  mouseX: number;
  mouseY: number;
  hour: number;
  time: string;
  working: number;
}

const styles: Record<string, CSSProperties> = {
  shadowWrap: {
    position: "relative",
    flex: 1,
    display: "flex",
    minHeight: 0,
  },
  scrollX: {
    flex: 1,
    overflowX: "auto",
    overflowY: "hidden",
    display: "flex",
    minHeight: 0,
  },
  inner: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    minWidth: INNER_W,
  },
  gridlines: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "calc(var(--gt-top-h) - 52px)",
    bottom: "var(--gt-footer-h)",
    pointerEvents: "none",
    zIndex: 0,
  },
  gridline: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0,
    borderLeft: "1px dashed var(--ant-color-border-secondary)",
  },
  gridlineHover: {
    borderLeftColor: "var(--ant-color-text-tertiary)",
    zIndex: 1,
  },
  ruler: {
    flexShrink: 0,
    height: "calc(var(--gt-top-h) - 52px)",
    background: "#fafafa",
    borderTop: "1px solid var(--ant-color-border-secondary)",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  rulerTrack: {
    display: "flex",
    position: "relative",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  rulerCell: {
    position: "relative",
    height: "100%",
    flexShrink: 0,
    width: `${100 / RANGE}%`,
  },
  rulerLabel: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 12,
    color: "var(--ant-color-text-secondary)",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  rulerTick: {
    position: "absolute",
    bottom: 0,
    height: 8,
    width: 1,
    background: "var(--ant-color-border)",
  },
  nowDot: {
    position: "absolute",
    top: "calc(var(--gt-top-h) - 52px)",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#cf1322",
    transform: "translate(-50%, -100%)",
    pointerEvents: "none",
    zIndex: 10,
  },
  body: {
    flex: 1,
    position: "relative",
    padding: 0,
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
    zIndex: 1,
  },
  rows: {
    position: "relative",
  },
  row: {
    position: "relative",
    height: "var(--gt-row-h)",
    borderBottom: "1px dashed var(--ant-color-border-secondary)",
    transition: "background var(--ant-motion-duration-fast)",
  },
  rowHovered: {
    background: "var(--ant-color-fill-quaternary)",
  },
  bar: {
    position: "absolute",
    top: 2,
    bottom: 2,
    borderRadius: 4,
    padding: "4px 8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
    lineHeight: 1.3,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "background var(--ant-motion-duration-fast)",
  },
  barStrong: {
    fontWeight: 600,
  },
  now: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    background: "#cf1322",
    pointerEvents: "none",
    zIndex: 10,
  },
  totals: {
    flexShrink: 0,
    borderTop: "1px solid var(--ant-color-border-secondary)",
    display: "flex",
    alignItems: "center",
    height: "var(--gt-footer-h)",
    boxSizing: "border-box",
    padding: 0,
    background: "var(--ant-color-bg-container)",
  },
  totalsTrack: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  totalsTick: {
    position: "absolute",
    top: 0,
    height: 8,
    width: 1,
    background: "var(--ant-color-border)",
  },
  totalsCell: {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text-secondary)",
    whiteSpace: "nowrap",
  },
  tooltip: {
    position: "fixed",
    background: "var(--ant-color-bg-spotlight)",
    color: "var(--ant-color-white)",
    fontSize: 12,
    lineHeight: 1.5,
    padding: "8px 10px",
    borderRadius: "var(--ant-border-radius)",
    boxShadow: "var(--ant-box-shadow)",
    pointerEvents: "none",
    zIndex: 2000,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  },
  tooltipTime: {
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 4,
  },
};

export function TimelineGrid({ linhas, hoveredId, setHoveredId, bodyRef }: TimelineGridProps) {
  const { mode } = useThemeMode();
  const dark = mode === "dark";
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const d = new Date();
    const hour = d.getHours() + d.getMinutes() / 60;
    el.scrollLeft = Math.max(0, hour * HOUR_W - el.clientWidth / 2);
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setScrolled(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolled(false), 600);
    };
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const totais = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      const start = i * 30;
      const end = start + 30;
      let count = 0;
      for (const linha of linhas) {
        for (const bloco of linha.blocos) {
          if (bloco.tipo === "trabalha" && bloco.inicioMin < end && bloco.fimMin > start) {
            count += 1;
          }
        }
      }
      return count;
    });
  }, [linhas]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const inner = innerRef.current;
    if (!inner) return;
    const r = inner.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < 0 || x > r.width) {
      if (hover) setHover(null);
      return;
    }
    const hour = Math.round((x / r.width) * RANGE);
    let working = 0;
    for (const linha of linhas) {
      for (const bloco of linha.blocos) {
        if (bloco.tipo === "trabalha" && hour * 60 >= bloco.inicioMin && hour * 60 < bloco.fimMin) {
          working += 1;
        }
      }
    }
    setHover({ mouseX: e.clientX, mouseY: e.clientY, hour, time: fmt(hour * 60), working });
  };

  const showNow = now >= 0 && now <= RANGE * 60;

  return (
    <div
      className={"tl-scroll-shadow" + (scrolled ? " is-scrolled-x" : "")}
      style={styles.shadowWrap}
    >
      <div ref={scrollRef} className="gt-no-scrollbar" style={styles.scrollX}>
        <div
          ref={innerRef}
          style={styles.inner}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          <div style={styles.gridlines}>
            {GRID_HOURS.map((h) => (
              <span key={h} style={{ ...styles.gridline, left: `${pct(h)}%` }} />
            ))}
            {hover && (
              <span
                style={{ ...styles.gridline, ...styles.gridlineHover, left: `${pct(hover.hour)}%` }}
              />
            )}
          </div>

          <div
            style={{
              ...styles.ruler,
              ...(dark ? { background: "rgba(255, 255, 255, 0.04)" } : null),
            }}
          >
            <div style={styles.rulerTrack}>
              {HOURS.map((h) => (
                <div key={h} style={styles.rulerCell}>
                  <span style={styles.rulerLabel}>{fmt(h * 60)}</span>
                  <span style={{ ...styles.rulerTick, left: 0 }} />
                  <span style={{ ...styles.rulerTick, left: "50%" }} />
                </div>
              ))}
            </div>
          </div>

          {showNow && <div style={{ ...styles.nowDot, left: `${pctMin(now)}%` }} />}

          <div ref={bodyRef} className="gt-no-scrollbar" style={styles.body}>
            {showNow && <div style={{ ...styles.now, left: `${pctMin(now)}%` }} />}
            <div style={styles.rows}>
              {linhas.map((linha) => {
                const rowHovered = hoveredId === linha.id;
                return (
                  <div
                    key={linha.id}
                    style={{ ...styles.row, ...(rowHovered ? styles.rowHovered : null) }}
                    onMouseEnter={() => setHoveredId(linha.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {linha.blocos.map((bloco) => {
                      const isTrabalha = bloco.tipo === "trabalha";
                      const barColors: CSSProperties = isTrabalha
                        ? {
                            background: rowHovered
                              ? "var(--gt-trabalha-bg-hover)"
                              : "var(--gt-trabalha-bg)",
                            color: "var(--gt-trabalha-fg)",
                          }
                        : {
                            background: rowHovered
                              ? "var(--gt-intervalo-bg-hover)"
                              : "var(--gt-intervalo-bg)",
                            color: "var(--gt-intervalo-fg)",
                          };
                      return (
                        <div
                          key={bloco.id}
                          style={{
                            ...styles.bar,
                            ...barColors,
                            left: `${pctMin(bloco.inicioMin)}%`,
                            width: `${pctMin(bloco.fimMin) - pctMin(bloco.inicioMin)}%`,
                          }}
                        >
                          <strong style={styles.barStrong}>
                            {isTrabalha ? "Trabalha" : "Intervalo"}
                          </strong>
                          <span>
                            {fmt(bloco.inicioMin)} às {fmt(bloco.fimMin)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.totals}>
            <div style={styles.totalsTrack}>
              {HOURS.map((h) => (
                <span key={"th" + h}>
                  <span style={{ ...styles.totalsTick, left: `${pct(h)}%` }} />
                  <span style={{ ...styles.totalsTick, left: `${pct(h + 0.5)}%` }} />
                </span>
              ))}
              {totais.map((n, i) => (
                <span key={i} style={{ ...styles.totalsCell, left: `${pct(i * 0.5)}%` }}>
                  {String(n).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hover &&
        createPortal(
          <div style={{ ...styles.tooltip, left: hover.mouseX + 14, top: hover.mouseY + 18 }}>
            <div style={styles.tooltipTime}>{hover.time}</div>
            <div>
              {hover.working} {hover.working === 1 ? "colaborador" : "colaboradores"}
            </div>
            <div>
              {hover.working} {hover.working === 1 ? "PDV aberto" : "PDVs abertos"}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
