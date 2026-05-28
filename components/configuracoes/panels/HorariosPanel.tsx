"use client";

import { Button, Select, Switch, TimePicker, Tooltip } from "antd";
import { DeleteIcon, PlusIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { DiaSemana, HorarioDia } from "@/lib/types";
import { diasLabels, getHorarios } from "@/lib/mock/horarios";

const { RangePicker } = TimePicker;

interface HorariosPanelProps {
  unidadeId: string;
}

const FORMAT = "HH:mm";

const TZ_OPTIONS = [
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo (UTC-3)" },
  { value: "America/Manaus", label: "America/Manaus (UTC-4)" },
  { value: "America/Belem", label: "America/Belem (UTC-3)" },
  { value: "America/Cuiaba", label: "America/Cuiaba (UTC-4)" },
  { value: "America/Rio_Branco", label: "America/Rio_Branco (UTC-5)" },
];

const styles: Record<string, CSSProperties> = {
  horarios: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    gap: 16,
    padding: 16,
    overflow: "auto",
  },
  tz: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  tzTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "24px",
    color: "var(--ant-color-text)",
    flex: 1,
  },
  tzLabel: {
    fontSize: 13,
    color: "var(--ant-color-text-secondary)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  dayRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  daySwitch: {
    flex: "none",
  },
  dayName: {
    width: 90,
    fontWeight: 500,
    color: "var(--ant-color-text)",
    flex: "none",
  },
  dayRanges: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  off: {
    opacity: 0.45,
  },
  rangeChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
};

function rangeValue(inicio: string, fim: string): [Dayjs, Dayjs] | undefined {
  if (!inicio || !fim) return undefined;
  return [dayjs(inicio, FORMAT), dayjs(fim, FORMAT)];
}

export function HorariosPanel({ unidadeId }: HorariosPanelProps) {
  const [horarios, setHorarios] = useState<HorarioDia[]>(() => getHorarios(unidadeId));
  const [tz, setTz] = useState("America/Sao_Paulo");

  useEffect(() => {
    setHorarios(getHorarios(unidadeId));
  }, [unidadeId]);

  const toggleDay = (dia: DiaSemana, value: boolean) => {
    setHorarios((prev) => prev.map((d) => (d.dia === dia ? { ...d, fechado: !value } : d)));
  };

  const updateRange = (dia: DiaSemana, idx: number, value: [Dayjs | null, Dayjs | null] | null) => {
    setHorarios((prev) =>
      prev.map((d) => {
        if (d.dia !== dia) return d;
        const ranges = d.ranges.map((r, i) =>
          i === idx
            ? {
                inicio: value?.[0]?.format(FORMAT) ?? "",
                fim: value?.[1]?.format(FORMAT) ?? "",
              }
            : r
        );
        return { ...d, ranges };
      })
    );
  };

  const addRange = (dia: DiaSemana) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia ? { ...d, ranges: [...d.ranges, { inicio: "", fim: "" }] } : d
      )
    );
  };

  const removeRange = (dia: DiaSemana, idx: number) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia ? { ...d, ranges: d.ranges.filter((_, i) => i !== idx) } : d
      )
    );
  };

  return (
    <div style={styles.horarios}>
      <div style={styles.tz}>
        <h3 style={styles.tzTitle}>Configure os horários</h3>
        <span style={styles.tzLabel}>Fuso horário</span>
        <Select value={tz} onChange={setTz} style={{ minWidth: 280 }} options={TZ_OPTIONS} />
      </div>

      <div style={styles.list}>
        {horarios.map((d, i) => {
          const dimmed = d.fechado ? styles.off : null;
          const single = d.ranges.length <= 1;
          return (
            <div
              key={d.dia}
              style={{ ...styles.dayRow, ...(i === horarios.length - 1 ? { borderBottom: 0 } : null) }}
            >
              <div style={styles.daySwitch}>
                <Switch size="small" checked={!d.fechado} onChange={(v) => toggleDay(d.dia, v)} />
              </div>
              <div style={{ ...styles.dayName, ...dimmed }}>{diasLabels[d.dia]}</div>
              <div style={{ ...styles.dayRanges, ...dimmed }}>
                {d.ranges.map((r, idx) => (
                  <span key={idx} style={styles.rangeChip}>
                    <RangePicker
                      value={rangeValue(r.inicio, r.fim)}
                      format={FORMAT}
                      size="small"
                      placeholder={["Inicial", "Final"]}
                      order={false}
                      onChange={(v) => updateRange(d.dia, idx, v)}
                    />
                    <Tooltip title="Remover">
                      <Button
                        type="text"
                        icon={<DeleteIcon />}
                        size="small"
                        disabled={single}
                        aria-label="Remover intervalo"
                        onClick={() => removeRange(d.dia, idx)}
                      />
                    </Tooltip>
                  </span>
                ))}
                <Tooltip title="Adicionar">
                  <Button
                    type="text"
                    icon={<PlusIcon />}
                    size="small"
                    aria-label="Adicionar intervalo"
                    onClick={() => addRange(d.dia)}
                  />
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
