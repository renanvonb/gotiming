"use client";

import { Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { LinhaTimeline } from "@/lib/types";

interface TimelineGridProps {
  linhas: LinhaTimeline[];
  hourWidth?: number;
}

const HOURS = Array.from({ length: 25 }, (_, h) => h);

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function TimelineGrid({ linhas, hourWidth = 80 }: TimelineGridProps) {
  const totalWidth = hourWidth * 24;
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  const totaisPorMeiaHora = useMemo(() => {
    const slots = 48;
    const counts = new Array(slots).fill(0) as number[];
    for (const linha of linhas) {
      for (const bloco of linha.blocos) {
        if (bloco.tipo !== "trabalha") continue;
        const startSlot = Math.floor(bloco.inicioMin / 30);
        const endSlot = Math.ceil(bloco.fimMin / 30);
        for (let s = startSlot; s < endSlot && s < slots; s++) {
          counts[s] = (counts[s] ?? 0) + 1;
        }
      }
    }
    return counts;
  }, [linhas]);

  return (
    <div className="tl__scroll-x">
      <div className="tl__inner" style={{ width: totalWidth, minWidth: totalWidth }}>
        <div className="tl__ruler">
          <div className="tl__ruler-track">
            {HOURS.map((h) => (
              <div
                key={h}
                className="tl__ruler-cell"
                style={{ width: h === 24 ? 0 : hourWidth }}
              >
                <span className="tl__ruler-label">{String(h).padStart(2, "0")}:00</span>
                {h < 24 && <span className="tl__ruler-tick tl__ruler-tick--hour" />}
                {h < 24 && <span className="tl__ruler-tick tl__ruler-tick--half" />}
              </div>
            ))}
            {now != null && (
              <span
                className="tl__now-dot"
                style={{ left: (now / (60 * 24)) * totalWidth }}
              />
            )}
          </div>
        </div>

        <div className="tl__body">
          <div className="tl__rows">
            {linhas.map((linha) => (
              <div
                key={linha.id}
                className={`tl__row${hoveredRow === linha.id ? " is-hovered" : ""}`}
                onMouseEnter={() => setHoveredRow(linha.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {linha.blocos.map((bloco) => {
                  const left = (bloco.inicioMin / (60 * 24)) * totalWidth;
                  const width = ((bloco.fimMin - bloco.inicioMin) / (60 * 24)) * totalWidth;
                  return (
                    <Tooltip
                      key={bloco.id}
                      title={`${bloco.tipo === "trabalha" ? "Trabalha" : "Intervalo"}  ${minutesToTime(bloco.inicioMin)}–${minutesToTime(bloco.fimMin)}`}
                    >
                      <div
                        className={`tl__bar tl__bar--${bloco.tipo}`}
                        style={{ left, width }}
                      >
                        <strong>{bloco.tipo === "trabalha" ? "Trabalha" : "Intervalo"}</strong>
                        <span>{minutesToTime(bloco.inicioMin)} – {minutesToTime(bloco.fimMin)}</span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
            {now != null && (
              <div
                className="tl__now"
                style={{ left: (now / (60 * 24)) * totalWidth }}
              />
            )}
          </div>
        </div>

        <div className="tl__totals">
          <div className="tl__totals-track">
            {totaisPorMeiaHora.map((count, slot) => {
              if (slot % 2 !== 0) return null;
              const min = slot * 30;
              return (
                <span
                  key={slot}
                  className="tl__totals-cell"
                  style={{ left: (min / (60 * 24)) * totalWidth + hourWidth / 2 }}
                >
                  {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
