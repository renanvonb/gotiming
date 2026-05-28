"use client";

import {
  Alert,
  Button,
  Checkbox,
  InputNumber,
  Radio,
  Segmented,
  Tag,
  TimePicker,
  Tooltip,
  App,
} from "antd";
import type { CheckboxProps, RadioChangeEvent } from "antd";
import {
  CheckIcon,
  CheckCircleIcon,
  CircleChevronLeftIcon,
  DownloadIcon,
  FilePdfIcon,
  ImportIcon,
  InfoIcon,
} from "@/components/icons";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ContratoTipo, DiaSemana, Parametros } from "@/lib/types";
import { getParametros } from "@/lib/mock/parametros";
import { getPdvs } from "@/lib/mock/pdvs";
import { useHover } from "@/lib/hooks/useHover";
import { useThemeMode } from "@/components/providers/ThemeProvider";

interface ParametrosPanelProps {
  unidadeId: string;
}

const FORMAT_TIME = "HH:mm";

const DIAS_FOLGA: { dia: DiaSemana; label: string }[] = [
  { dia: "dom", label: "Domingo" },
  { dia: "seg", label: "Segunda-feira" },
  { dia: "ter", label: "Terça-feira" },
  { dia: "qua", label: "Quarta-feira" },
  { dia: "qui", label: "Quinta-feira" },
  { dia: "sex", label: "Sexta-feira" },
  { dia: "sab", label: "Sábado" },
];

const styles: Record<string, CSSProperties> = {
  params: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
    minHeight: 0,
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    flex: 1,
    minHeight: 0,
    alignItems: "stretch",
    overflowX: "auto",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: 4,
    background: "var(--ant-color-bg-container)",
    flex: "1 1 0",
    minWidth: 240,
    overflow: "hidden",
    transition:
      "flex var(--ant-motion-duration-mid) var(--ant-motion-ease-out), min-width var(--ant-motion-duration-mid) var(--ant-motion-ease-out)",
  },
  sectionCollapsed: {
    flex: "0 0 56px",
    minWidth: 56,
    cursor: "pointer",
  },
  head: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  headCollapsed: {
    flexDirection: "column-reverse",
    padding: "16px 0",
    gap: 12,
    background: "transparent",
    borderBottom: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: "none",
  },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    flex: 1,
  },
  titleCollapsed: {
    writingMode: "vertical-rl",
    textAlign: "left",
    flex: "none",
  },
  collapse: {
    width: 24,
    height: 24,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text-secondary)",
    borderRadius: 4,
    cursor: "pointer",
    transition:
      "background var(--ant-motion-duration-fast), transform var(--ant-motion-duration-mid) var(--ant-motion-ease-in-out)",
  },
  collapseCollapsed: {
    transform: "rotate(180deg)",
  },
  body: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflow: "auto",
  },
  subsection: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid var(--ant-color-border-secondary)",
  },
  subsectionFirst: {
    paddingTop: 0,
    borderTop: 0,
  },
  subtitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  info: {
    display: "inline-grid",
    placeItems: "center",
    width: 16,
    height: 16,
    color: "var(--ant-color-text-tertiary)",
    cursor: "help",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "var(--ant-color-text)",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  checks: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  contractRows: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  contractRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  contractRowLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "var(--ant-color-text)",
  },
  contractRowHint: {
    color: "var(--ant-color-text-tertiary)",
    fontSize: 12,
  },
  contractTotal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTop: "1px solid var(--ant-color-border-secondary)",
    fontSize: 13,
  },
  contractTotalLabel: {
    color: "var(--ant-color-text-secondary)",
  },
  contractTotalValue: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
  distributeRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  statgrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
  },
  statcard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: "12px 8px",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: 4,
    background: "var(--ant-color-bg-container)",
    minWidth: 0,
  },
  statcardValue: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.2,
  },
  statcardValueBlue: { color: "var(--ant-color-primary)" },
  statcardValueGold: { color: "#d48806" },
  statcardValueMagenta: { color: "#c41d7f" },
  statcardLabel: {
    fontSize: 12,
    color: "var(--ant-color-text-tertiary)",
  },
  hint: {
    margin: 0,
    fontSize: 12,
    color: "var(--ant-color-text-tertiary)",
  },
  history: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
    fontSize: 13,
    minWidth: 0,
  },
  historyItemLast: {
    borderBottom: 0,
  },
  historyIcon: {
    color: "var(--ant-color-text-tertiary)",
    flex: "0 0 16px",
  },
  historyInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  historyName: {
    color: "var(--ant-color-text)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  historyMeta: {
    color: "var(--ant-color-text-tertiary)",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  historyActions: {
    display: "flex",
    gap: 4,
    flex: "0 0 auto",
  },
};

function InfoIconTrigger({ title }: { title: string }) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title={title}>
      <span
        style={{
          ...styles.info,
          ...(hovered ? { color: "var(--ant-color-primary)" } : null),
        }}
        {...handlers}
      >
        <InfoIcon />
      </span>
    </Tooltip>
  );
}

export function ParametrosPanel({ unidadeId }: ParametrosPanelProps) {
  const { message } = App.useApp();
  const { mode } = useThemeMode();
  const dark = mode === "dark";
  const [data, setData] = useState<Parametros>(() => getParametros(unidadeId));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(getParametros(unidadeId));
  }, [unidadeId]);

  const pdvs = useMemo(() => getPdvs(unidadeId), [unidadeId]);
  const porTipo = useMemo(() => {
    const acc = { Normal: 0, Rápido: 0, Preferencial: 0 };
    for (const p of pdvs) acc[p.tipo] += 1;
    return acc;
  }, [pdvs]);

  const isCollapsed = (key: string) => collapsed[key] ?? false;
  const toggle = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const { jornada } = data;
  const totalPct = jornada.contratos
    .filter((c) => c.habilitado)
    .reduce((s, c) => s + c.pct, 0);
  const totalOk = totalPct === 100;

  const setContratoMode = (m: "unico" | "combinado") =>
    setData((d) => ({ ...d, jornada: { ...d.jornada, contratoMode: m } }));

  const toggleContrato = (tipo: ContratoTipo) =>
    setData((d) => ({
      ...d,
      jornada: {
        ...d.jornada,
        contratos: d.jornada.contratos.map((c) =>
          c.tipo === tipo ? { ...c, habilitado: !c.habilitado, pct: c.habilitado ? 0 : c.pct } : c
        ),
      },
    }));

  const setContratoPct = (tipo: ContratoTipo, pct: number) =>
    setData((d) => ({
      ...d,
      jornada: {
        ...d.jornada,
        contratos: d.jornada.contratos.map((c) => (c.tipo === tipo ? { ...c, pct } : c)),
      },
    }));

  const distribuirIgualmente = () =>
    setData((d) => {
      const enabled = d.jornada.contratos.filter((c) => c.habilitado);
      const n = enabled.length;
      if (n === 0) return d;
      const base = Math.floor(100 / n);
      const rem = 100 - base * n;
      let idx = 0;
      return {
        ...d,
        jornada: {
          ...d.jornada,
          contratos: d.jornada.contratos.map((c) => {
            if (!c.habilitado) return { ...c, pct: 0 };
            const extra = idx < rem ? 1 : 0;
            idx += 1;
            return { ...c, pct: base + extra };
          }),
        },
      };
    });

  const tornarVigente = (id: string) =>
    setData((d) => {
      const alvo = d.jornada.acordosHistorico.find((a) => a.id === id);
      if (!alvo) return d;
      const restante = d.jornada.acordosHistorico.filter((a) => a.id !== id);
      const novoHistorico = d.jornada.acordoAtual
        ? [d.jornada.acordoAtual, ...restante]
        : restante;
      return {
        ...d,
        jornada: { ...d.jornada, acordoAtual: alvo, acordosHistorico: novoHistorico },
      };
    });

  const handleDiaChange =
    (dia: DiaSemana): CheckboxProps["onChange"] =>
    (e) => {
      const checked = e.target.checked;
      setData((d) => ({
        ...d,
        folgas: {
          ...d.folgas,
          diasFolga: checked
            ? Array.from(new Set([...d.folgas.diasFolga, dia]))
            : d.folgas.diasFolga.filter((x) => x !== dia),
        },
      }));
    };

  const historico = jornada.acordosHistorico;

  return (
    <div style={{ ...styles.params, padding: 16 }}>
      <div style={styles.grid}>
        <Section
          id="jornada"
          title="Jornada de trabalho"
          collapsed={isCollapsed("jornada")}
          dark={dark}
          onToggle={() => toggle("jornada")}
        >
          <div style={{ ...styles.subsection, ...styles.subsectionFirst }}>
            <h3 style={styles.subtitle}>
              Modelo de contrato
              <InfoIconTrigger title="Define a duração da jornada diária prevista no contrato." />
            </h3>
            <Segmented
              value={jornada.contratoMode}
              onChange={(v) => setContratoMode(v as "unico" | "combinado")}
              block
              options={[
                { label: "Único", value: "unico" },
                { label: "Combinado", value: "combinado" },
              ]}
            />

            {jornada.contratoMode === "unico" ? (
              <Alert
                type="info"
                showIcon
                title={
                  <span>
                    <strong>8:48 — 44 horas semanais.</strong> Aplicado a toda a filial. Nenhum
                    outro tipo de contrato pode ser combinado.
                  </span>
                }
              />
            ) : (
              <>
                <div style={styles.contractRows}>
                  {jornada.contratos.map((c) => (
                    <div key={c.tipo} style={styles.contractRow}>
                      <Checkbox checked={c.habilitado} onChange={() => toggleContrato(c.tipo)}>
                        <span style={styles.contractRowLabel}>
                          {c.tipo}
                          <span style={styles.contractRowHint}>({c.horasSemana}h/sem)</span>
                        </span>
                      </Checkbox>
                      <InputNumber
                        min={0}
                        max={100}
                        value={c.habilitado ? c.pct : null}
                        disabled={!c.habilitado}
                        placeholder="0"
                        onChange={(v) => setContratoPct(c.tipo, v ?? 0)}
                        style={{ width: 72 }}
                      />
                    </div>
                  ))}
                </div>
                <div style={styles.contractTotal}>
                  <span style={styles.contractTotalLabel}>Total</span>
                  <span
                    style={{
                      ...styles.contractTotalValue,
                      color: totalOk ? "var(--ant-color-success)" : "var(--ant-color-error)",
                    }}
                  >
                    {totalPct}%
                    {totalOk && <CheckIcon size={14} />}
                  </span>
                </div>
                <div style={styles.distributeRow}>
                  <Button
                    type="link"
                    style={{ height: "auto", padding: 0 }}
                    onClick={distribuirIgualmente}
                  >
                    Distribuir igualmente
                  </Button>
                </div>
              </>
            )}
          </div>

          <div style={styles.subsection}>
            <h3 style={styles.subtitle}>
              Intervalos
              <InfoIconTrigger title="Minutos extras considerados antes ou depois da jornada para cálculo de produtividade." />
            </h3>
            <div style={styles.checks}>
              <Checkbox
                checked={jornada.intervaloPre}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    jornada: { ...d.jornada, intervaloPre: e.target.checked },
                  }))
                }
              >
                Considerar 20 minutos pré-jornada
              </Checkbox>
              <Checkbox
                checked={jornada.intervaloPos}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    jornada: { ...d.jornada, intervaloPos: e.target.checked },
                  }))
                }
              >
                Considerar 20 minutos pós-jornada
              </Checkbox>
            </div>
          </div>

          <div style={styles.subsection}>
            <h3 style={styles.subtitle}>
              Acordo coletivo
              <InfoIconTrigger title="Documento que define as condições negociadas com o sindicato." />
            </h3>
            <p style={styles.hint}>PDF, DOC ou DOCX — até 10MB.</p>
            <Button
              type="dashed"
              block
              icon={<ImportIcon />}
              onClick={() => fileRef.current?.click()}
            >
              Carregar documento
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => {
                if (e.target.files?.length) {
                  message.success("Documento carregado (mock)");
                  e.target.value = "";
                }
              }}
            />

            <ul style={styles.history}>
              {jornada.acordoAtual && (
                <li
                  style={{
                    ...styles.historyItem,
                    ...(historico.length === 0 ? styles.historyItemLast : null),
                  }}
                >
                  <span style={styles.historyIcon}>
                    <FilePdfIcon />
                  </span>
                  <div style={styles.historyInfo}>
                    <span style={styles.historyName}>
                      {jornada.acordoAtual.nome}
                      <Tag color="success" variant="filled">
                        Vigente
                      </Tag>
                    </span>
                    <span style={styles.historyMeta}>
                      {dayjs(jornada.acordoAtual.dataUpload).format("DD/MM/YYYY")} por{" "}
                      {jornada.acordoAtual.uploadPor}
                    </span>
                  </div>
                  <div style={styles.historyActions}>
                    <Tooltip title="Baixar">
                      <Button
                        type="text"
                        icon={<DownloadIcon />}
                        size="small"
                        aria-label="Baixar"
                        onClick={() => message.success("Baixando documento (mock)")}
                      />
                    </Tooltip>
                  </div>
                </li>
              )}
              {historico.map((a, i) => (
                <li
                  key={a.id}
                  style={{
                    ...styles.historyItem,
                    ...(i === historico.length - 1 ? styles.historyItemLast : null),
                  }}
                >
                  <span style={styles.historyIcon}>
                    <FilePdfIcon />
                  </span>
                  <div style={styles.historyInfo}>
                    <span style={styles.historyName}>{a.nome}</span>
                    <span style={styles.historyMeta}>
                      {dayjs(a.dataUpload).format("DD/MM/YYYY")} por {a.uploadPor}
                    </span>
                  </div>
                  <div style={styles.historyActions}>
                    <Tooltip title="Tornar vigente">
                      <Button
                        type="text"
                        icon={<CheckCircleIcon />}
                        size="small"
                        aria-label="Tornar vigente"
                        onClick={() => tornarVigente(a.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Baixar">
                      <Button
                        type="text"
                        icon={<DownloadIcon />}
                        size="small"
                        aria-label="Baixar"
                        onClick={() => message.success("Baixando documento (mock)")}
                      />
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="almoco"
          title="Almoço"
          collapsed={isCollapsed("almoco")}
          dark={dark}
          onToggle={() => toggle("almoco")}
        >
          <div style={{ ...styles.subsection, ...styles.subsectionFirst }}>
            <h3 style={styles.subtitle}>
              Duração
              <InfoIconTrigger title="Tempo de almoço previsto e o mínimo aceitável." />
            </h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <span style={styles.label}>Duração total</span>
                <TimePicker
                  value={dayjs().startOf("day").add(data.almoco.duracaoTotalMin, "minute")}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, duracaoTotalMin: v.hour() * 60 + v.minute() },
                    }))
                  }
                />
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Duração mínima</span>
                <TimePicker
                  value={dayjs().startOf("day").add(data.almoco.duracaoMinimaMin, "minute")}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, duracaoMinimaMin: v.hour() * 60 + v.minute() },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div style={styles.subsection}>
            <h3 style={styles.subtitle}>
              Janela para iniciar
              <InfoIconTrigger title="Faixa de horário permitida para iniciar o almoço." />
            </h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <span style={styles.label}>Tempo mínimo</span>
                <TimePicker
                  value={dayjs(data.almoco.janelaInicioMin, FORMAT_TIME)}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, janelaInicioMin: v.format(FORMAT_TIME) },
                    }))
                  }
                />
              </div>
              <div style={styles.field}>
                <span style={styles.label}>Tempo máximo</span>
                <TimePicker
                  value={dayjs(data.almoco.janelaInicioMax, FORMAT_TIME)}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, janelaInicioMax: v.format(FORMAT_TIME) },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="folgas"
          title="Folgas"
          collapsed={isCollapsed("folgas")}
          dark={dark}
          onToggle={() => toggle("folgas")}
        >
          <div style={{ ...styles.subsection, ...styles.subsectionFirst }}>
            <h3 style={styles.subtitle}>
              Dias de folga
              <InfoIconTrigger title="Dias da semana em que a unidade não opera." />
            </h3>
            <div style={styles.checks}>
              {DIAS_FOLGA.map(({ dia, label }) => (
                <Checkbox
                  key={dia}
                  checked={data.folgas.diasFolga.includes(dia)}
                  onChange={handleDiaChange(dia)}
                >
                  {label}
                </Checkbox>
              ))}
            </div>
          </div>

          <div style={styles.subsection}>
            <h3 style={styles.subtitle}>
              Aos domingos
              <InfoIconTrigger title="Frequência de folgas aos domingos para os colaboradores." />
            </h3>
            <Radio.Group
              value={data.folgas.aosDomingos}
              onChange={(e: RadioChangeEvent) =>
                setData((d) => ({ ...d, folgas: { ...d.folgas, aosDomingos: e.target.value } }))
              }
            >
              <div style={styles.stack}>
                <Radio value="todo">Todo domingo</Radio>
                <Radio value="1x1">1x1</Radio>
                <Radio value="2x1">2x1</Radio>
                <Radio value="3x1">3x1</Radio>
              </div>
            </Radio.Group>
          </div>
        </Section>

        <Section
          id="tolerancia"
          title="Tolerância de atendimento"
          collapsed={isCollapsed("tolerancia")}
          dark={dark}
          onToggle={() => toggle("tolerancia")}
        >
          <div style={{ ...styles.subsection, ...styles.subsectionFirst }}>
            <h3 style={styles.subtitle}>
              Quantidade de PDV na escala
              <InfoIconTrigger title="Quantidade de PDVs por modalidade, conforme configurado na tab PDV." />
            </h3>
            <div style={styles.statgrid}>
              <div style={styles.statcard}>
                <span style={{ ...styles.statcardValue, ...styles.statcardValueBlue }}>
                  {porTipo.Normal}
                </span>
                <span style={styles.statcardLabel}>Normal</span>
              </div>
              <div style={styles.statcard}>
                <span style={{ ...styles.statcardValue, ...styles.statcardValueGold }}>
                  {porTipo["Rápido"]}
                </span>
                <span style={styles.statcardLabel}>Rápido</span>
              </div>
              <div style={styles.statcard}>
                <span style={{ ...styles.statcardValue, ...styles.statcardValueMagenta }}>
                  {porTipo.Preferencial}
                </span>
                <span style={styles.statcardLabel}>Preferencial</span>
              </div>
              <div style={styles.statcard}>
                <span style={styles.statcardValue}>{pdvs.length}</span>
                <span style={styles.statcardLabel}>Total</span>
              </div>
            </div>
          </div>

          <div style={styles.subsection}>
            <h3 style={styles.subtitle}>
              Parâmetros de tolerância
              <InfoIconTrigger title="Limites operacionais usados para dimensionar a escala." />
            </h3>
            <div style={styles.field}>
              <span style={styles.label}>PDV Mínimo</span>
              <InputNumber
                value={data.tolerancia.pdvMinimo}
                min={0}
                max={20}
                style={{ width: "100%" }}
                onChange={(v) =>
                  setData((d) => ({ ...d, tolerancia: { ...d.tolerancia, pdvMinimo: v ?? 0 } }))
                }
              />
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Nível de serviço (%)</span>
              <InputNumber
                value={data.tolerancia.nivelServicoPct}
                min={0}
                max={100}
                style={{ width: "100%" }}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    tolerancia: { ...d.tolerancia, nivelServicoPct: v ?? 0 },
                  }))
                }
              />
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Absenteísmo (%)</span>
              <InputNumber
                value={data.tolerancia.absenteismoPct}
                min={0}
                max={100}
                style={{ width: "100%" }}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    tolerancia: { ...d.tolerancia, absenteismoPct: v ?? 0 },
                  }))
                }
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

interface SectionProps {
  id: string;
  title: string;
  collapsed: boolean;
  dark: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapseButton({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title={collapsed ? "Expandir" : "Recolher"}>
      <button
        type="button"
        style={{
          ...styles.collapse,
          ...(collapsed ? styles.collapseCollapsed : null),
          ...(hovered ? { color: "var(--ant-color-text)" } : null),
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={collapsed ? "Expandir" : "Recolher"}
        {...handlers}
      >
        <CircleChevronLeftIcon size={18} />
      </button>
    </Tooltip>
  );
}

function Section({ id, title, collapsed, dark, onToggle, children }: SectionProps) {
  const headBg = collapsed ? "transparent" : dark ? "rgba(255, 255, 255, 0.04)" : "#fafafa";

  return (
    <section
      id={`params-${id}`}
      style={{
        ...styles.section,
        ...(collapsed ? styles.sectionCollapsed : null),
      }}
      onClick={collapsed ? onToggle : undefined}
    >
      <header
        style={{
          ...styles.head,
          ...(collapsed ? styles.headCollapsed : null),
          background: headBg,
        }}
      >
        <h2
          style={{
            ...styles.title,
            ...(collapsed ? styles.titleCollapsed : null),
          }}
        >
          {title}
        </h2>
        <CollapseButton collapsed={collapsed} onToggle={onToggle} />
      </header>
      <div style={{ ...styles.body, ...(collapsed ? { display: "none" } : null) }}>{children}</div>
    </section>
  );
}
