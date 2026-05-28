"use client";

import {
  Button,
  Calendar,
  DatePicker,
  InputNumber,
  Popconfirm,
  Segmented,
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
  cell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    width: "100%",
    height: "100%",
    padding: "4px 0 0",
  },
  cellValue: {
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
    fontWeight: 500,
  },
  cellValuePlaceholder: {
    color: "var(--ant-color-text-quaternary)",
    fontWeight: 400,
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

export function PrevisoesPanel({ unidadeId, onImport }: PrevisoesPanelProps) {
  const { message } = App.useApp();
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const [mes, setMes] = useState<Dayjs>(() => dayjs());
  const [mode, setMode] = useState<ViewMode>("calendario");
  const [previsoes, setPrevisoes] = useState<PrevisaoDia[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const editValueRef = useRef<number | null>(null);

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

  const commitEdit = (key: string, nextValue: number | null) => {
    if (nextValue == null) {
      setEditing(null);
      return;
    }
    setPrevisoes((prev) =>
      prev.map((p) => (p.data === key ? { ...p, valorPrevistoCentavos: Math.round(nextValue * 100) } : p))
    );
    setEditing(null);
    editValueRef.current = null;
  };

  const cellRender = (date: Dayjs) => {
    if (date.month() !== mes.month()) return null;
    const key = date.format("YYYY-MM-DD");
    const p = byDate.get(key);
    const isEditing = editing === key;

    if (isEditing) {
      const initial = (p?.valorPrevistoCentavos ?? 0) / 100;
      return (
        <div style={styles.cell} onClick={(e) => e.stopPropagation()}>
          <InputNumber
            autoFocus
            defaultValue={initial}
            size="small"
            prefix="R$"
            min={0}
            controls={false}
            decimalSeparator=","
            onChange={(v) => {
              editValueRef.current = typeof v === "number" ? v : null;
            }}
            onPressEnter={() => commitEdit(key, editValueRef.current)}
            onBlur={() => commitEdit(key, editValueRef.current)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditing(null);
                editValueRef.current = null;
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      );
    }

    const empty = !p || p.valorPrevistoCentavos === 0;
    return (
      <div
        style={styles.cell}
        onClick={() => {
          editValueRef.current = null;
          setEditing(key);
        }}
      >
        <span
          style={{
            ...styles.cellValue,
            ...(empty ? styles.cellValuePlaceholder : null),
          }}
        >
          {formatCurrency(p?.valorPrevistoCentavos ?? 0)}
        </span>
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
          <Segmented
            value={mode}
            onChange={(v) => setMode(v as ViewMode)}
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
          <Calendar
            value={mes}
            fullscreen
            onPanelChange={(d) => setMes(d)}
            cellRender={(date, info) => {
              if (info.type !== "date") return info.originNode;
              return cellRender(date as Dayjs);
            }}
            headerRender={() => null}
          />
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
