"use client";

import {
  Button,
  Calendar,
  DatePicker,
  InputNumber,
  Popconfirm,
  Radio,
  Table,
  type TableColumnsType,
  Tooltip,
  App,
  Empty,
} from "antd";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EraserIcon,
  ImportIcon,
  WandIcon,
} from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PrevisaoDia } from "@/lib/types";
import { getPrevisoes } from "@/lib/mock/previsoes";
import { formatCurrency } from "@/lib/utils/format";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";

interface PrevisoesPanelProps {
  unidadeId: string;
  onImport: () => void;
}

type ViewMode = "calendario" | "tabela";

const styles: Record<string, CSSProperties> = {
  forecast: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    position: "relative",
    gap: 16,
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 8,
  },
  toolbarLeft: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "start",
  },
  toolbarRight: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "end",
  },
  month: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "center",
  },
  monthLabel: {
    minWidth: 150,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ant-color-text)",
  },
  monthPickerAnchor: {
    position: "relative",
    display: "inline-flex",
  },
  hiddenPicker: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
    border: 0,
    opacity: 0,
    pointerEvents: "none",
  },
  body: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  calCell: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    height: "100%",
    padding: "8px 12px",
    overflow: "hidden",
    position: "relative",
    userSelect: "none",
    transition: "background var(--ant-motion-duration-fast)",
  },
  calCellDim: {
    backgroundColor: "var(--ant-color-fill-quaternary)",
    backgroundImage:
      "repeating-linear-gradient(135deg, transparent 0, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 6px)",
    cursor: "default",
  },
  calDay: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
  },
  calDayDim: {
    color: "var(--ant-color-text-quaternary)",
  },
  calDayToday: {
    color: "var(--ant-color-primary)",
  },
  calValue: {
    marginTop: "auto",
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: 13,
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
  },
  calValuePlaceholder: {
    color: "var(--ant-color-text-quaternary)",
  },
  // Edição inline: input sem moldura, idêntico ao texto do valor, ancorado na
  // base esquerda — não abre caixa nem altera o tamanho do quadrado.
  calInputEl: {
    marginTop: "auto",
    width: "100%",
    textAlign: "left",
    border: 0,
    outline: "none",
    background: "transparent",
    padding: 0,
    fontSize: 13,
    fontFamily: "inherit",
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
    caretColor: "var(--ant-color-primary)",
  },
  totals: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 0,
    margin: 0,
    fontSize: 13,
    color: "var(--ant-color-text-secondary)",
  },
  total: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  totalRight: {
    marginLeft: "auto",
  },
  totalLabel: {
    color: "var(--ant-color-text-secondary)",
  },
  totalValue: {
    fontWeight: 600,
    color: "var(--ant-color-text)",
    fontVariantNumeric: "tabular-nums",
  },
  totalValueBlue: {
    color: "var(--ant-color-primary)",
  },
  totalDivider: {
    width: 1,
    height: 16,
    background: "var(--ant-color-border-secondary)",
  },
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Aceita valores em pt-BR ("1.234,56" / "1234,56") ou com ponto decimal ("1234.56").
function parseValor(s: string): number | null {
  let str = s.trim().replace(/[^0-9.,]/g, "");
  if (!str) return null;
  if (str.includes(",")) str = str.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(str);
  return Number.isNaN(n) ? null : n;
}

export function PrevisoesPanel({ unidadeId, onImport }: PrevisoesPanelProps) {
  const { message } = App.useApp();
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const [mes, setMes] = useState<Dayjs>(() => dayjs());
  const [mode, setMode] = useState<ViewMode>("calendario");
  const [previsoes, setPrevisoes] = useState<PrevisaoDia[]>([]);
  const [editing, setEditing] = useState(false);
  const [selection, setSelection] = useState<Set<string>>(() => new Set());
  const [origin, setOrigin] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const draggingRef = useRef(false);
  const originRef = useRef<string | null>(null);
  const editRawRef = useRef<string | null>(null);

  useEffect(() => {
    const list = getPrevisoes(unidadeId, mes.year(), mes.month());
    setPrevisoes(list);
  }, [unidadeId, mes]);

  const byDate = useMemo(() => {
    const map = new Map<string, PrevisaoDia>();
    for (const p of previsoes) map.set(p.data, p);
    return map;
  }, [previsoes]);

  const total = useMemo(
    () => previsoes.reduce((sum, p) => sum + p.valorPrevistoCentavos, 0),
    [previsoes]
  );
  const media = previsoes.length > 0 ? Math.round(total / previsoes.length) : 0;
  const semPrevisao = previsoes.filter((p) => p.valorPrevistoCentavos === 0).length;

  const today = dayjs();

  const rangeKeys = (aKey: string, bKey: string): string[] => {
    let a = dayjs(aKey);
    let b = dayjs(bKey);
    if (a.isAfter(b)) [a, b] = [b, a];
    const keys: string[] = [];
    for (let cur = a; !cur.isAfter(b, "day"); cur = cur.add(1, "day")) {
      keys.push(cur.format("YYYY-MM-DD"));
    }
    return keys;
  };

  const beginSelect = (key: string, shift: boolean) => {
    editRawRef.current = null;
    if (shift && originRef.current) {
      setSelection(new Set(rangeKeys(originRef.current, key)));
      setEditing(true);
    } else {
      originRef.current = key;
      setOrigin(key);
      setSelection(new Set([key]));
      setEditing(false);
      draggingRef.current = true;
    }
  };

  const extendSelect = (key: string) => {
    if (draggingRef.current && originRef.current) {
      setSelection(new Set(rangeKeys(originRef.current, key)));
    }
  };

  const clearSelection = () => {
    originRef.current = null;
    setSelection(new Set());
    setOrigin(null);
    setEditing(false);
    editRawRef.current = null;
  };

  // Confirma o valor digitado em todos os dias selecionados. Mantém a seleção
  // (só fecha o input) para que Shift possa estender a partir da origem; a
  // seleção é zerada só no Esc ou clique fora.
  const commitBatch = () => {
    const raw = editRawRef.current;
    // raw === null → não houve digitação (mantém os valores). String vazia →
    // o usuário apagou o valor → vira 0 (placeholder "R$ 0,00").
    if (raw !== null && selection.size > 0) {
      const trimmed = raw.trim();
      const n = trimmed === "" ? 0 : parseValor(trimmed);
      if (n != null) {
        const cents = Math.round(n * 100);
        setPrevisoes((prev) =>
          prev.map((p) => (selection.has(p.data) ? { ...p, valorPrevistoCentavos: cents } : p))
        );
      }
    }
    setEditing(false);
    editRawRef.current = null;
  };

  // Encerra o arrasto ao soltar o mouse (em qualquer lugar) e abre a edição na origem.
  useEffect(() => {
    const onUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        setEditing(true);
      }
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  // Clicar fora do calendário limpa a seleção.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest(".gt-cal-fill")) clearSelection();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const renderCell = (date: Dayjs) => {
    const inMonth = date.month() === mes.month() && date.year() === mes.year();
    const key = date.format("YYYY-MM-DD");
    const isToday = date.isSame(today, "day");
    const p = byDate.get(key);
    const cents = p?.valorPrevistoCentavos ?? 0;
    const empty = cents === 0;
    const selected = selection.has(key);
    const isOrigin = origin === key;
    const showInput = editing && isOrigin;

    const shadows: string[] = [];
    if (showInput) shadows.push("inset 0 -2px 0 0 var(--ant-color-primary)");
    else if (isOrigin && selection.size > 1) shadows.push("inset 0 0 0 2px var(--ant-color-primary)");
    if (isToday && inMonth && !selected) shadows.push("inset 0 2px 0 0 var(--ant-color-primary)");

    return (
      <div
        className="gt-cal-cell"
        style={{
          ...styles.calCell,
          ...(inMonth ? null : styles.calCellDim),
          cursor: inMonth ? "pointer" : "default",
          background: selected ? "var(--ant-color-primary-bg)" : undefined,
          boxShadow: shadows.length ? shadows.join(", ") : undefined,
          zIndex: selected || isOrigin ? 1 : undefined,
        }}
        onMouseDown={
          inMonth
            ? (e) => {
                if ((e.target as HTMLElement).closest(".gt-cal-input")) return;
                e.preventDefault();
                beginSelect(key, e.shiftKey);
              }
            : (e) => {
                // Dias de outro mês não são clicáveis e não trocam o mês.
                e.preventDefault();
                e.stopPropagation();
              }
        }
        onMouseEnter={inMonth ? () => extendSelect(key) : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          style={{
            ...styles.calDay,
            ...(inMonth ? null : styles.calDayDim),
            ...(isToday && inMonth ? styles.calDayToday : null),
          }}
        >
          {date.date()}
        </span>
        {inMonth &&
          (showInput ? (
            <input
              className="gt-cal-input"
              autoFocus
              defaultValue={empty ? "" : (cents / 100).toFixed(2).replace(".", ",")}
              inputMode="decimal"
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                editRawRef.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitBatch();
                else if (e.key === "Escape") clearSelection();
              }}
              onBlur={commitBatch}
              style={styles.calInputEl}
            />
          ) : (
            <span style={{ ...styles.calValue, ...(empty ? styles.calValuePlaceholder : null) }}>
              {formatCurrency(cents)}
            </span>
          ))}
      </div>
    );
  };

  const columns: TableColumnsType<PrevisaoDia> = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 120,
      render: (d: string) => dayjs(d).format("DD/MM/YY"),
    },
    {
      title: "Dia da semana",
      dataIndex: "data",
      key: "diaSemana",
      width: 180,
      render: (d: string) => capitalize(dayjs(d).format("dddd")),
    },
    {
      title: "Previsão de venda",
      dataIndex: "valorPrevistoCentavos",
      key: "valor",
      render: (v: number, p) => (
        <InputNumber
          value={v / 100}
          min={0}
          decimalSeparator=","
          prefix="R$"
          controls={false}
          placeholder="0,00"
          onChange={(next) =>
            setPrevisoes((prev) =>
              prev.map((row) =>
                row.data === p.data
                  ? { ...row, valorPrevistoCentavos: Math.round((next ?? 0) * 100) }
                  : row
              )
            )
          }
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const handleClear = () => {
    setPrevisoes((prev) => prev.map((p) => ({ ...p, valorPrevistoCentavos: 0 })));
    message.success("Previsões do mês limpas");
  };

  const monthLabel = capitalize(mes.format("MMMM [de] YYYY"));

  return (
    <div style={{ ...styles.forecast, padding: 16 }}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value as ViewMode)}
            optionType="button"
            options={[
              { label: "Calendário", value: "calendario" },
              { label: "Tabela", value: "tabela" },
            ]}
          />
          <span style={styles.monthPickerAnchor}>
            <Tooltip title="Selecionar mês e ano">
              <Button
                icon={<CalendarIcon />}
                aria-label="Selecionar mês e ano"
                onClick={() => setPickerOpen(true)}
              />
            </Tooltip>
            <DatePicker
              picker="month"
              value={mes}
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              onChange={(d) => {
                if (d) setMes(d);
                setPickerOpen(false);
              }}
              allowClear={false}
              inputReadOnly
              style={styles.hiddenPicker}
            />
          </span>
        </div>
        <div style={styles.month}>
          <Button
            type="text"
            icon={<ChevronLeftIcon />}
            aria-label="Mês anterior"
            onClick={() => setMes((m) => m.subtract(1, "month"))}
          />
          <span style={styles.monthLabel}>{monthLabel}</span>
          <Button
            type="text"
            icon={<ChevronRightIcon />}
            aria-label="Próximo mês"
            onClick={() => setMes((m) => m.add(1, "month"))}
          />
        </div>
        <div style={styles.toolbarRight}>
          <Tooltip title="Preenchimento inteligente">
            <Button
              icon={<WandIcon />}
              aria-label="Preenchimento inteligente"
              onClick={() => message.info("Preenchimento inteligente em breve")}
            />
          </Tooltip>
          <Popconfirm
            title="Limpar previsões do mês"
            description="Essa ação zera todos os valores previstos deste mês."
            okText="Limpar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={handleClear}
          >
            <Tooltip title="Limpar previsões do mês">
              <Button icon={<EraserIcon />} aria-label="Limpar previsões do mês" />
            </Tooltip>
          </Popconfirm>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar previsões
          </Button>
        </div>
      </div>

      <div style={styles.body}>
        {mode === "calendario" ? (
          <div className="gt-cal-frame">
            <div className="gt-cal-weekhead" aria-hidden>
              {WEEKDAYS.map((d) => (
                <div key={d} className="gt-cal-weekhead__cell">
                  {d}
                </div>
              ))}
            </div>
            <Calendar
              className="gt-cal-fill"
              value={mes}
              fullscreen
              fullCellRender={(date, info) =>
                info.type === "date" ? renderCell(date as Dayjs) : info.originNode
              }
              headerRender={() => null}
            />
          </div>
        ) : (
          <div ref={tableScrollRef} className="gt-table-frame" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Table<PrevisaoDia>
              rowKey="data"
              dataSource={previsoes}
              columns={columns}
              pagination={false}
              size="middle"
              bordered
              scroll={{ y: scrollY }}
              locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem previsões" />,
              }}
            />
          </div>
        )}
      </div>

      <div style={styles.totals}>
        <span style={styles.total}>
          <span style={styles.totalLabel}>Valor total previsto no mês</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueBlue }}>{formatCurrency(total)}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>Valor médio diário no mês</span>
          <span style={styles.totalValue}>{formatCurrency(media)}</span>
        </span>
        {semPrevisao > 0 && (
          <span style={{ ...styles.total, ...styles.totalRight }}>
            <span style={styles.totalLabel}>
              {semPrevisao === 1 ? "Existe " : "Existem "}
              <span style={styles.totalValue}>{semPrevisao}</span>
              {semPrevisao === 1
                ? " dia sem previsão informada neste mês"
                : " dias sem previsão informada neste mês"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
