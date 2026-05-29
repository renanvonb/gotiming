"use client";

import { App, Button, Checkbox, Popconfirm, Popover, Radio, Select, Switch, TimePicker, Tooltip, type GetRef } from "antd";
import { ClockIcon, ClockXIcon, CopyIcon, DeleteIcon, PlusIcon, ResetIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { DiaSemana, HorarioDia, HorarioRange } from "@/lib/types";
import { diasLabels, getHorarios } from "@/lib/mock/horarios";

const { RangePicker } = TimePicker;

interface HorariosPanelProps {
  unidadeId: string;
}

type LayoutVersion = "v1" | "v2";

const FORMAT = "HH:mm";

const DIAS: DiaSemana[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

const diasAbrev: Record<DiaSemana, string> = {
  dom: "Dom",
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
};

const TZ_OPTIONS = [
  { value: "America/Noronha", label: "UTC−02:00 - Noronha" },
  { value: "America/Sao_Paulo", label: "UTC−03:00 - Brasília" },
  { value: "America/Cuiaba", label: "UTC−04:00 - Cuiabá" },
  { value: "America/Manaus", label: "UTC−04:00 - Manaus" },
  { value: "America/Rio_Branco", label: "UTC−05:00 - Rio Branco" },
];

const styles: Record<string, CSSProperties> = {
  horarios: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    gap: 16,
    padding: 16,
    overflow: "hidden",
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

  // ---- v1: linhas empilhadas (layout original) ----
  v1List: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "auto",
  },
  v1Row: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  v1Switch: {
    flex: "none",
  },
  v1Name: {
    width: 90,
    fontWeight: 500,
    color: "var(--ant-color-text)",
    flex: "none",
  },
  v1Ranges: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  v1Off: {
    opacity: 0.45,
  },
  v1Chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },

  // ---- v2: blocos lado a lado ----
  daysRow: {
    display: "flex",
    gap: 12,
    flex: 1,
    minHeight: 0,
  },
  dayBlock: {
    flex: "1 1 0",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: "var(--ant-border-radius)",
    background: "var(--ant-color-bg-container)",
    overflow: "hidden",
  },
  dayBlockClosed: {
    background: "var(--ant-color-fill-quaternary)",
  },
  dayNameClosed: {
    color: "var(--ant-color-text-tertiary)",
  },
  dayHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  dayName: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dayHeadActions: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  dayBody: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  rangeItem: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingBottom: 12,
    borderBottom: "1px dashed var(--ant-color-border-secondary)",
  },
  rangeRemoveWrap: {
    alignSelf: "flex-end",
  },
  closed: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "var(--ant-color-text-quaternary)",
    fontSize: 13,
    padding: 12,
  },
  dayFoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 12px",
    borderTop: "1px solid var(--ant-color-border-secondary)",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--ant-color-text-secondary)",
  },
};

function rangeValue(inicio: string, fim: string): [Dayjs, Dayjs] | undefined {
  if (!inicio || !fim) return undefined;
  return [dayjs(inicio, FORMAT), dayjs(fim, FORMAT)];
}

/* Máscara HH:mm ao vivo: aceita 4 dígitos ("0815") ou com ":" ("8:15"),
   insere o ":" após 2 dígitos e limita horas a 23 e minutos a 59. */
function maskTime(raw: string): string {
  if (raw.includes(":")) {
    let [h, m] = raw.split(":");
    h = h.replace(/\D/g, "").slice(0, 2);
    m = (m ?? "").replace(/\D/g, "").slice(0, 2);
    if (h.length === 2 && +h > 23) h = "23";
    if (m.length === 2 && +m > 59) m = "59";
    return `${h}:${m}`;
  }
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (!d) return "";
  let h = d.slice(0, 2);
  let m = d.slice(2, 4);
  if (h.length === 2 && +h > 23) h = "23";
  if (m.length === 2 && +m > 59) m = "59";
  return d.length > 2 ? `${h}:${m}` : h;
}

interface TimeMaskInputProps {
  value: string;
  placeholder: string;
  onCommit: (value: string) => void;
}

/* TimePicker do AntD (mantém o painel de seleção ao focar + Enter para salvar),
   com máscara HH:mm aplicada ao digitar interceptando o <input> interno. */
function TimeMaskInput({ value, placeholder, onCommit }: TimeMaskInputProps) {
  const ref = useRef<GetRef<typeof TimePicker>>(null);

  useEffect(() => {
    const input = ref.current?.nativeElement?.querySelector("input");
    if (!input) return;
    const setNativeValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;
    const handler = () => {
      const masked = maskTime(input.value);
      if (setNativeValue && masked !== input.value) {
        setNativeValue.call(input, masked);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
    input.addEventListener("input", handler);
    return () => input.removeEventListener("input", handler);
  }, []);

  return (
    <TimePicker
      ref={ref}
      value={value ? dayjs(value, FORMAT) : null}
      format={FORMAT}
      placeholder={placeholder}
      needConfirm={false}
      onChange={(v) => onCommit(v ? v.format(FORMAT) : "")}
      style={{ width: "100%" }}
    />
  );
}

interface ReplicarPopoverProps {
  dia: DiaSemana;
  disabled?: boolean;
  onReplicate: (dias: DiaSemana[]) => void;
}

function ReplicarPopover({ dia, disabled, onReplicate }: ReplicarPopoverProps) {
  const [open, setOpen] = useState(false);
  // O próprio dia entra selecionado e desabilitado (não pode ser desmarcado).
  const [sel, setSel] = useState<DiaSemana[]>([dia]);

  const destinos = sel.filter((d) => d !== dia);

  const confirm = () => {
    if (destinos.length) onReplicate(destinos);
    setOpen(false);
    setSel([dia]);
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 150 }}>
      <Checkbox.Group
        value={sel}
        onChange={(v) => setSel(v as DiaSemana[])}
        options={DIAS.map((d) => ({ label: diasLabels[d], value: d, disabled: d === dia }))}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      />
      <Button type="primary" block disabled={!destinos.length} onClick={confirm}>
        Replicar
      </Button>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Replicar para outros dias"
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={(v) => {
        if (disabled) return;
        setOpen(v);
        if (!v) setSel([dia]);
      }}
    >
      <Tooltip title="Replicar para outros dias">
        <Button
          type="text"
          size="small"
          className="gt-replicar-btn"
          disabled={disabled}
          icon={<CopyIcon />}
          aria-label="Replicar para outros dias"
        />
      </Tooltip>
    </Popover>
  );
}

function totalHoras(ranges: HorarioRange[]): string {
  let mins = 0;
  for (const r of ranges) {
    if (!r.inicio || !r.fim) continue;
    const diff = dayjs(r.fim, FORMAT).diff(dayjs(r.inicio, FORMAT), "minute");
    if (diff > 0) mins += diff;
  }
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm} horas`;
}

export function HorariosPanel({ unidadeId }: HorariosPanelProps) {
  const { message } = App.useApp();
  const [horarios, setHorarios] = useState<HorarioDia[]>(() => getHorarios(unidadeId));
  const [tz, setTz] = useState("America/Sao_Paulo");
  const [version, setVersion] = useState<LayoutVersion>("v2");

  useEffect(() => {
    setHorarios(getHorarios(unidadeId));
  }, [unidadeId]);

  const toggleDay = (dia: DiaSemana, value: boolean) => {
    setHorarios((prev) => prev.map((d) => (d.dia === dia ? { ...d, fechado: !value } : d)));
  };

  // v1: edição via RangePicker (par início–fim)
  const updateRange = (dia: DiaSemana, idx: number, value: [Dayjs | null, Dayjs | null] | null) => {
    setHorarios((prev) =>
      prev.map((d) => {
        if (d.dia !== dia) return d;
        const ranges = d.ranges.map((r, i) =>
          i === idx
            ? { inicio: value?.[0]?.format(FORMAT) ?? "", fim: value?.[1]?.format(FORMAT) ?? "" }
            : r
        );
        return { ...d, ranges };
      })
    );
  };

  // v2: edição por campo (início ou fim separados), valor já em "HH:mm"
  const setRangeField = (dia: DiaSemana, idx: number, field: "inicio" | "fim", value: string) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia
          ? {
              ...d,
              ranges: d.ranges.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
            }
          : d
      )
    );
  };

  const addRange = (dia: DiaSemana) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia ? { ...d, ranges: [...d.ranges, { inicio: "", fim: "" }] } : d
      )
    );
    message.success("Faixa de horários adicionada com sucesso!");
  };

  const removeRange = (dia: DiaSemana, idx: number) => {
    setHorarios((prev) =>
      prev.map((d) =>
        d.dia === dia ? { ...d, ranges: d.ranges.filter((_, i) => i !== idx) } : d
      )
    );
    message.success("Faixa de horários excluída com sucesso!");
  };

  // Redefine os horários da unidade para o padrão (desfaz as edições).
  const redefinir = () => {
    setHorarios(getHorarios(unidadeId));
    message.success("Horários redefinidos com sucesso!");
  };

  // Replica o estado (aberto + intervalos) de um dia para os dias selecionados
  const replicarPara = (origem: DiaSemana, destinos: DiaSemana[]) => {
    setHorarios((prev) => {
      const src = prev.find((d) => d.dia === origem);
      if (!src) return prev;
      return prev.map((d) =>
        destinos.includes(d.dia)
          ? { ...d, fechado: src.fechado, ranges: src.ranges.map((r) => ({ ...r })) }
          : d
      );
    });
    message.success("Horários replicados com sucesso!");
  };

  return (
    <div style={styles.horarios}>
      <div style={styles.tz}>
        <h3 style={styles.tzTitle}>Configure os dias e horários</h3>
        <span style={styles.tzLabel}>Fuso horário</span>
        <Select
          value={tz}
          onChange={(v) => {
            setTz(v);
            message.success("Fuso horário alterado com sucesso!");
          }}
          style={{ width: 210 }}
          options={TZ_OPTIONS}
        />
        <Popconfirm
          title="Redefinir horários"
          description="Esta ação restaura os horários padrão de todos os dias."
          okText="Redefinir"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
          placement="bottomRight"
          onConfirm={redefinir}
        >
          <Tooltip title="Redefinir horários">
            <Button icon={<ResetIcon />} aria-label="Redefinir horários" />
          </Tooltip>
        </Popconfirm>
        <Radio.Group
          value={version}
          onChange={(e) => setVersion(e.target.value as LayoutVersion)}
          optionType="button"
          options={[
            { label: "v1", value: "v1" },
            { label: "v2", value: "v2" },
          ]}
        />
      </div>

      {version === "v1" ? (
        <div style={styles.v1List}>
          {horarios.map((d, i) => {
            const dimmed = d.fechado ? styles.v1Off : null;
            const single = d.ranges.length <= 1;
            return (
              <div
                key={d.dia}
                style={{ ...styles.v1Row, ...(i === horarios.length - 1 ? { borderBottom: 0 } : null) }}
              >
                <div style={styles.v1Switch}>
                  <Switch size="small" checked={!d.fechado} onChange={(v) => toggleDay(d.dia, v)} />
                </div>
                <div className="gt-skel-text" style={{ ...styles.v1Name, ...dimmed }}>
                  {diasLabels[d.dia]}
                </div>
                <div className="gt-skel-btn" style={{ ...styles.v1Ranges, ...dimmed }}>
                  {d.ranges.map((r, idx) => (
                    <span key={idx} style={styles.v1Chip}>
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
      ) : (
        <div style={styles.daysRow}>
          {horarios.map((d) => {
            const single = d.ranges.length <= 1;
            const preenchido = d.ranges.some((r) => r.inicio || r.fim);
            return (
              <section
                key={d.dia}
                className="gt-day-block"
                style={{ ...styles.dayBlock, ...(d.fechado ? styles.dayBlockClosed : null) }}
              >
                <header style={styles.dayHead}>
                  <span
                    className="gt-skel-text"
                    style={{ ...styles.dayName, ...(d.fechado ? styles.dayNameClosed : null) }}
                  >
                    {diasAbrev[d.dia]}
                  </span>
                  <span style={styles.dayHeadActions}>
                    <ReplicarPopover
                      dia={d.dia}
                      disabled={d.fechado || !preenchido}
                      onReplicate={(dias) => replicarPara(d.dia, dias)}
                    />
                    <Switch size="small" checked={!d.fechado} onChange={(v) => toggleDay(d.dia, v)} />
                  </span>
                </header>

                {d.fechado ? (
                  <div style={styles.closed}>
                    <ClockXIcon size={28} strokeWidth={1.5} />
                    <span>Fechado</span>
                  </div>
                ) : (
                  <>
                  <div style={styles.dayBody}>
                    {d.ranges.map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          ...styles.rangeItem,
                          ...(idx === d.ranges.length - 1 ? { borderBottom: 0, paddingBottom: 0 } : null),
                        }}
                      >
                        <TimeMaskInput
                          value={r.inicio}
                          placeholder="Início"
                          onCommit={(v) => setRangeField(d.dia, idx, "inicio", v)}
                        />
                        <TimeMaskInput
                          value={r.fim}
                          placeholder="Fim"
                          onCommit={(v) => setRangeField(d.dia, idx, "fim", v)}
                        />
                        {!single && (
                          <Button
                            type="text"
                            danger
                            block
                            aria-label="Remover intervalo"
                            onClick={() => removeRange(d.dia, idx)}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusIcon />}
                      block
                      style={{ flexShrink: 0 }}
                      onClick={() => addRange(d.dia)}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <footer style={styles.dayFoot}>
                    <ClockIcon size={14} />
                    <span>{totalHoras(d.ranges)}</span>
                  </footer>
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
