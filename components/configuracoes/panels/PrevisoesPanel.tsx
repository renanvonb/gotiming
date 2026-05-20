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
  App,
  Empty,
} from "antd";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImportIcon,
  ThunderIcon,
} from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PrevisaoDia } from "@/lib/types";
import { getPrevisoes } from "@/lib/mock/previsoes";
import { formatCurrency } from "@/lib/utils/format";

interface PrevisoesPanelProps {
  unidadeId: string;
  onImport: () => void;
}

type ViewMode = "calendario" | "tabela";

export function PrevisoesPanel({ unidadeId, onImport }: PrevisoesPanelProps) {
  const { message, modal } = App.useApp();
  const [mes, setMes] = useState<Dayjs>(() => dayjs());
  const [mode, setMode] = useState<ViewMode>("calendario");
  const [previsoes, setPrevisoes] = useState<PrevisaoDia[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
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
        <div className="cfg__forecast-cell" onClick={(e) => e.stopPropagation()}>
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

    return (
      <div
        className="cfg__forecast-cell"
        onClick={() => {
          editValueRef.current = null;
          setEditing(key);
        }}
      >
        <span className={`cfg__forecast-cell__value${p ? "" : " is-placeholder"}`}>
          {p ? formatCurrency(p.valorPrevistoCentavos) : "—"}
        </span>
      </div>
    );
  };

  const columns: TableColumnsType<PrevisaoDia> = [
    {
      title: "Dia",
      dataIndex: "data",
      key: "dia",
      width: 90,
      render: (d: string) => dayjs(d).format("DD/MM"),
    },
    {
      title: "Dia da semana",
      dataIndex: "data",
      key: "diaSemana",
      width: 160,
      render: (d: string) => dayjs(d).format("dddd"),
    },
    {
      title: "Valor previsto",
      dataIndex: "valorPrevistoCentavos",
      key: "valor",
      render: (v: number, p) => (
        <InputNumber
          value={v / 100}
          min={0}
          decimalSeparator=","
          prefix="R$"
          controls={false}
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
    message.success("Previsões zeradas");
  };

  return (
    <div className="cfg__forecast" style={{ padding: 16 }}>
      <div className="cfg__forecast-toolbar">
        <div className="cfg__forecast-toolbar__left">
          <Segmented
            value={mode}
            onChange={(v) => setMode(v as ViewMode)}
            options={[
              { label: "Calendário", value: "calendario" },
              { label: "Tabela", value: "tabela" },
            ]}
          />
        </div>
        <div className="cfg__forecast-month">
          <Button icon={<ChevronLeftIcon />} onClick={() => setMes((m) => m.subtract(1, "month"))} />
          <DatePicker
            picker="month"
            value={mes}
            onChange={(d) => d && setMes(d)}
            format="MMMM [de] YYYY"
            allowClear={false}
          />
          <Button icon={<ChevronRightIcon />} onClick={() => setMes((m) => m.add(1, "month"))} />
        </div>
        <div className="cfg__forecast-toolbar__right">
          <Button icon={<ThunderIcon />} onClick={() => message.info("Geração com IA em breve")}>
            Gerar com IA
          </Button>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar
          </Button>
          <Popconfirm
            title="Limpar previsões do mês"
            description="Essa ação zera todos os valores previstos deste mês."
            okText="Limpar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={handleClear}
          >
            <Button danger>Limpar</Button>
          </Popconfirm>
        </div>
      </div>

      <div className="cfg__forecast-body">
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
          <Table<PrevisaoDia>
            rowKey="data"
            dataSource={previsoes}
            columns={columns}
            pagination={false}
            size="middle"
            bordered
            scroll={{ y: "calc(100vh - 360px)" }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem previsões" />,
            }}
          />
        )}
      </div>

      <div className="cfg__pdv-totals">
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Total do mês:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--blue">{formatCurrency(total)}</span>
        </span>
        <span className="cfg__pdv-total__divider" />
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Dias:</span>
          <span className="cfg__pdv-total__value">{previsoes.length}</span>
        </span>
        <span className="cfg__pdv-total--right">
          <Button
            type="primary"
            onClick={() => {
              modal.success({ title: "Previsões salvas", content: "As alterações foram aplicadas." });
            }}
          >
            Salvar
          </Button>
        </span>
      </div>
    </div>
  );
}
