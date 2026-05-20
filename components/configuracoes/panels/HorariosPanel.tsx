"use client";

import { Button, Segmented, Select, Switch, TimePicker, App } from "antd";
import { DeleteIcon, PlusIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import type { DiaSemana, HorarioDia, HorarioRange } from "@/lib/types";
import { diasLabels, getHorarios } from "@/lib/mock/horarios";

interface HorariosPanelProps {
  unidadeId: string;
}

type Modo = "linhas" | "colunas";

const FORMAT = "HH:mm";

function rangeToPickers(r: HorarioRange): [Dayjs, Dayjs] {
  return [dayjs(r.inicio, FORMAT), dayjs(r.fim, FORMAT)];
}

export function HorariosPanel({ unidadeId }: HorariosPanelProps) {
  const { message } = App.useApp();
  const [horarios, setHorarios] = useState<HorarioDia[]>(() => getHorarios(unidadeId));
  const [modo, setModo] = useState<Modo>("linhas");
  const [tz, setTz] = useState("America/Sao_Paulo");

  useEffect(() => {
    setHorarios(getHorarios(unidadeId));
  }, [unidadeId]);

  const toggleDay = (dia: DiaSemana, value: boolean) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia
          ? {
              ...d,
              fechado: !value,
              ranges: value && d.ranges.length === 0 ? [{ inicio: "08:00", fim: "18:00" }] : d.ranges,
            }
          : d
      )
    );
  };

  const updateRange = (dia: DiaSemana, idx: number, key: "inicio" | "fim", val: Dayjs | null) => {
    if (!val) return;
    setHorarios((prev) =>
      prev.map((d) => {
        if (d.dia !== dia) return d;
        const ranges = d.ranges.map((r, i) => (i === idx ? { ...r, [key]: val.format(FORMAT) } : r));
        return { ...d, ranges };
      })
    );
  };

  const addRange = (dia: DiaSemana) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia ? { ...d, ranges: [...d.ranges, { inicio: "08:00", fim: "12:00" }] } : d
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
    <div className="cfg__horarios" style={{ padding: 16 }}>
      <div className="cfg__horarios-tz">
        <span className="cfg__horarios-tz__label">Fuso horário:</span>
        <Select
          value={tz}
          onChange={setTz}
          style={{ width: 240 }}
          options={[
            { value: "America/Sao_Paulo", label: "America/Sao_Paulo (GMT-3)" },
            { value: "America/Manaus", label: "America/Manaus (GMT-4)" },
            { value: "America/Belem", label: "America/Belem (GMT-3)" },
            { value: "America/Cuiaba", label: "America/Cuiaba (GMT-4)" },
          ]}
        />
      </div>

      <div className="cfg__horarios-modes">
        <Segmented
          value={modo}
          onChange={(v) => setModo(v as Modo)}
          options={[
            { label: "Em linhas", value: "linhas" },
            { label: "Em colunas", value: "colunas" },
          ]}
        />
      </div>

      {modo === "linhas" ? (
        <div className="cfg__horarios-list">
          {horarios.map((d) => (
            <DayRowLine
              key={d.dia}
              dia={d}
              onToggle={(v) => toggleDay(d.dia, v)}
              onChange={(idx, key, val) => updateRange(d.dia, idx, key, val)}
              onAdd={() => addRange(d.dia)}
              onRemove={(idx) => removeRange(d.dia, idx)}
            />
          ))}
        </div>
      ) : (
        <DaysColumns
          horarios={horarios}
          onToggle={toggleDay}
          onChange={updateRange}
          onAdd={addRange}
          onRemove={removeRange}
        />
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Button type="primary" onClick={() => message.success("Horários salvos")}>
          Salvar
        </Button>
      </div>
    </div>
  );
}

interface DayRowProps {
  dia: HorarioDia;
  onToggle: (value: boolean) => void;
  onChange: (idx: number, key: "inicio" | "fim", val: Dayjs | null) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

function DayRowLine({ dia, onToggle, onChange, onAdd, onRemove }: DayRowProps) {
  return (
    <div className={`gt-day-row${dia.fechado ? " is-off" : ""}`}>
      <div className="gt-day-row__name">{diasLabels[dia.dia]}</div>
      <div className="gt-day-row__switch">
        <Switch checked={!dia.fechado} onChange={onToggle} />
      </div>
      <div className="gt-day-row__ranges">
        {dia.fechado ? (
          <span style={{ color: "var(--ant-color-text-quaternary)" }}>Fechado</span>
        ) : (
          <>
            {dia.ranges.map((r, idx) => (
              <span key={idx} className="gt-day-row__range">
                <TimePicker
                  value={dayjs(r.inicio, FORMAT)}
                  format={FORMAT}
                  onChange={(v) => onChange(idx, "inicio", v)}
                  size="small"
                  allowClear={false}
                />
                <span style={{ color: "var(--ant-color-text-tertiary)" }}>às</span>
                <TimePicker
                  value={dayjs(r.fim, FORMAT)}
                  format={FORMAT}
                  onChange={(v) => onChange(idx, "fim", v)}
                  size="small"
                  allowClear={false}
                />
                <Button
                  type="text"
                  icon={<DeleteIcon />}
                  size="small"
                  onClick={() => onRemove(idx)}
                  aria-label="Remover intervalo"
                />
              </span>
            ))}
            <Button type="dashed" icon={<PlusIcon />} size="small" onClick={onAdd}>
              Adicionar intervalo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function DaysColumns({
  horarios,
  onToggle,
  onChange,
  onAdd,
  onRemove,
}: {
  horarios: HorarioDia[];
  onToggle: (d: DiaSemana, v: boolean) => void;
  onChange: (d: DiaSemana, idx: number, k: "inicio" | "fim", v: Dayjs | null) => void;
  onAdd: (d: DiaSemana) => void;
  onRemove: (d: DiaSemana, idx: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 8,
        border: "1px solid var(--ant-color-border-secondary)",
        borderRadius: 6,
        padding: 12,
      }}
    >
      {horarios.map((d) => (
        <div key={d.dia} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontWeight: 600, color: d.fechado ? "var(--ant-color-text-quaternary)" : undefined }}>
            {diasLabels[d.dia]}
          </div>
          <Switch checked={!d.fechado} onChange={(v) => onToggle(d.dia, v)} />
          {!d.fechado &&
            d.ranges.map((r, idx) => {
              const value = rangeToPickers(r);
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <TimePicker
                    value={value[0]}
                    format={FORMAT}
                    size="small"
                    allowClear={false}
                    onChange={(v) => onChange(d.dia, idx, "inicio", v)}
                  />
                  <TimePicker
                    value={value[1]}
                    format={FORMAT}
                    size="small"
                    allowClear={false}
                    onChange={(v) => onChange(d.dia, idx, "fim", v)}
                  />
                  <Button
                    type="text"
                    icon={<DeleteIcon />}
                    size="small"
                    onClick={() => onRemove(d.dia, idx)}
                  />
                </div>
              );
            })}
          {!d.fechado && (
            <Button type="dashed" size="small" icon={<PlusIcon />} onClick={() => onAdd(d.dia)}>
              Intervalo
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
