"use client";

import { Button, Input, Switch, Table, type TableColumnsType, App, Empty, Tooltip } from "antd";
import { ImportIcon, SearchIcon } from "@/components/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import dayjs from "dayjs";
import type { Colaborador } from "@/lib/types";
import { getColaboradores, horasDoModelo } from "@/lib/mock/colaboradores";
import { initialsOf } from "@/lib/utils/format";
import { highlightMatch } from "@/lib/utils/highlight";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";

interface ColaboradoresPanelProps {
  unidadeId: string;
  onOpenColab: (id: string) => void;
  onImportFolgas: () => void;
}

const styles: Record<string, CSSProperties> = {
  colab: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    gap: 16,
    padding: 16,
  },
  colabToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  userCell: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    maxWidth: "100%",
    minWidth: 0,
  },
  userCellName: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userCellAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    flex: "none",
    fontSize: 12,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text-secondary)",
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
  totalLabel: {
    color: "var(--ant-color-text-secondary)",
  },
  totalValue: {
    fontWeight: 600,
    color: "var(--ant-color-text)",
    fontVariantNumeric: "tabular-nums",
  },
  totalValueActive: {
    color: "var(--ant-color-success)",
  },
  totalDivider: {
    width: 1,
    height: 16,
    background: "var(--ant-color-border-secondary)",
  },
};

function fmtFolga(iso: string): string {
  return dayjs(iso).format("DD/MM/YY");
}

const WEEKDAY_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// "18/05/26, Seg" — data + dia da semana abreviado.
function fmtFolgaSemana(iso: string): string {
  const d = dayjs(iso);
  return `${d.format("DD/MM/YY")}, ${WEEKDAY_ABBR[d.day()]}`;
}

// Texto com truncamento (ellipsis). O Tooltip só aparece quando o conteúdo
// está de fato abreviado (scrollWidth > clientWidth), com delay de 0.5s.
function TruncatedCell({
  title,
  children,
  style,
}: {
  title: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  return (
    <Tooltip title={truncated ? title : null} placement="topLeft" mouseEnterDelay={0.5}>
      <span
        ref={ref}
        onMouseEnter={() => {
          const el = ref.current;
          if (el) setTruncated(el.scrollWidth > el.clientWidth + 1);
        }}
        style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...style }}
      >
        {children}
      </span>
    </Tooltip>
  );
}

export function ColaboradoresPanel({ unidadeId, onOpenColab, onImportFolgas }: ColaboradoresPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(() => getColaboradores(unidadeId));
  // Loader transitório ao trocar de unidade (evita spinner infinito quando vazio).
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    setColaboradores(getColaboradores(unidadeId));
    setCarregando(true);
    const t = window.setTimeout(() => setCarregando(false), 700);
    return () => window.clearTimeout(t);
  }, [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return colaboradores;
    return colaboradores.filter(
      (c) =>
        c.nome.toLowerCase().includes(term) ||
        c.funcao.toLowerCase().includes(term) ||
        c.modeloContrato.toLowerCase().includes(term) ||
        String(c.codigoOperador).includes(term) ||
        fmtFolgaSemana(c.ultimaFolgaSemana).toLowerCase().includes(term) ||
        fmtFolga(c.ultimaFolgaDomingo).includes(term)
    );
  }, [colaboradores, search]);

  const columns: TableColumnsType<Colaborador> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      ellipsis: { showTitle: false },
      render: (_, c) => (
        <span style={styles.userCell}>
          <span style={{ ...styles.userCellAvatar, background: c.avatarColor }}>
            {initialsOf(c.nome)}
          </span>
          <TruncatedCell title={c.nome} style={{ flex: 1, minWidth: 0 }}>
            {highlightMatch(c.nome, search)}
          </TruncatedCell>
        </span>
      ),
    },
    {
      title: "Cód. operador",
      dataIndex: "codigoOperador",
      key: "codigo",
      width: 128,
      render: (value: number) => highlightMatch(String(value), search),
    },
    {
      title: "Função",
      dataIndex: "funcao",
      key: "funcao",
      width: 150,
      render: (funcao: string) => (
        <TruncatedCell title={funcao}>{highlightMatch(funcao, search)}</TruncatedCell>
      ),
    },
    {
      title: "Mod. contrato",
      dataIndex: "modeloContrato",
      key: "modeloContrato",
      width: 120,
      render: (modelo: string) => (
        <Tooltip
          placement="topLeft"
          mouseEnterDelay={0.5}
          title={
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.35 }}>
              <span style={{ fontWeight: 600 }}>{modelo}</span>
              <span>{horasDoModelo(modelo) ?? 0}h semanais</span>
            </span>
          }
        >
          <span style={{ display: "inline-block" }}>{highlightMatch(modelo, search)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Últ. folga sem.",
      key: "folgaSemana",
      width: 140,
      render: (_, c) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {highlightMatch(fmtFolgaSemana(c.ultimaFolgaSemana), search)}
        </span>
      ),
    },
    {
      title: "Últ. folga dom.",
      key: "folgaDomingo",
      width: 128,
      render: (_, c) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {highlightMatch(fmtFolga(c.ultimaFolgaDomingo), search)}
        </span>
      ),
    },
    {
      title: "Escala",
      dataIndex: "ativoParaEscala",
      key: "escala",
      width: 74,
      align: "center",
      render: (value: boolean, c) => (
        <Switch
          size="small"
          checked={value}
          onChange={(checked) => {
            setColaboradores((prev) =>
              prev.map((x) => (x.id === c.id ? { ...x, ativoParaEscala: checked } : x))
            );
            message.success(`${c.nome} ${checked ? "ativado" : "desativado"}`);
          }}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 92,
      render: (_, c) => (
        <Button type="link" style={{ height: 24, padding: 0 }} onClick={() => onOpenColab(c.id)}>
          Gerenciar
        </Button>
      ),
    },
  ];

  const ativos = colaboradores.filter((c) => c.ativoParaEscala).length;

  return (
    <div style={styles.colab}>
      <div style={styles.colabToolbar}>
        <Input
          placeholder="Buscar"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Button icon={<ImportIcon />} onClick={onImportFolgas}>
          Importar folgas
        </Button>
      </div>

      <div ref={tableScrollRef} className="gt-table-frame" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Table<Colaborador>
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          pagination={false}
          scroll={{ y: scrollY }}
          size="middle"
          bordered
          loading={carregando && colaboradores.length === 0}
          rowClassName={(record) => (record.ativoParaEscala ? "" : "is-disabled")}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum colaborador encontrado" />
            ),
          }}
        />
      </div>

      <div style={styles.totals} className="gt-totals-skel">
        <span style={styles.total}>
          <span style={styles.totalLabel}>Total de colaboradores</span>
          <span style={styles.totalValue}>{colaboradores.length}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>Colaboradores ativos para escala</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueActive }}>{ativos}</span>
        </span>
      </div>
    </div>
  );
}
