"use client";

import { Button, Input, Switch, Table, Tag, type TableColumnsType, App, Empty } from "antd";
import { ImportIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Pdv } from "@/lib/types";
import { getPdvs } from "@/lib/mock/pdvs";
import { highlightMatch } from "@/lib/utils/highlight";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";

interface PdvPanelProps {
  unidadeId: string;
  onOpenPdv: (id: string) => void;
  onImport: () => void;
}

const TAG_COLOR_BY_TIPO: Record<Pdv["tipo"], string> = {
  Normal: "processing",
  Rápido: "warning",
  Preferencial: "magenta",
};

const styles: Record<string, CSSProperties> = {
  pdv: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    gap: 16,
    overflow: "hidden",
    padding: 16,
  },
  pdvToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
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
  totalValueActive: {
    color: "var(--ant-color-success)",
  },
  totalValueBlue: {
    color: "var(--ant-color-primary)",
  },
  totalValueGold: {
    color: "#d48806",
  },
  totalValueMagenta: {
    color: "#c41d7f",
  },
  totalDivider: {
    width: 1,
    height: 16,
    background: "var(--ant-color-border-secondary)",
  },
};

const fmtPosicao = (n: number) => String(n).padStart(2, "0");

export function PdvPanel({ unidadeId, onOpenPdv, onImport }: PdvPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const pdvs = useMemo(() => getPdvs(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pdvs;
    return pdvs.filter(
      (p) =>
        fmtPosicao(p.posicao).includes(term) ||
        p.codigoInterno.toLowerCase().includes(term) ||
        p.tipo.toLowerCase().includes(term) ||
        p.orientacao.toLowerCase().includes(term)
    );
  }, [pdvs, search]);

  const columns: TableColumnsType<Pdv> = [
    {
      title: "Posição",
      dataIndex: "posicao",
      key: "posicao",
      ellipsis: true,
      render: (value: number) => highlightMatch(fmtPosicao(value), search),
    },
    {
      title: "Código interno",
      dataIndex: "codigoInterno",
      key: "codigo",
      ellipsis: true,
      render: (codigo: string) => highlightMatch(codigo, search),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      ellipsis: true,
      render: (tipo: Pdv["tipo"]) => (
        <Tag color={TAG_COLOR_BY_TIPO[tipo]} variant="filled">
          {tipo}
        </Tag>
      ),
    },
    {
      title: "Ordem de abertura",
      dataIndex: "ordemAbertura",
      key: "ordem",
      ellipsis: true,
      render: (value: number) => `${value}º`,
    },
    {
      title: "Orientação",
      dataIndex: "orientacao",
      key: "orientacao",
      ellipsis: true,
      render: (orientacao: string) => highlightMatch(orientacao, search),
    },
    {
      title: "Escala",
      dataIndex: "ativoParaEscala",
      key: "escala",
      width: 74,
      align: "center",
      render: (value: boolean, p) => (
        <Switch
          size="small"
          checked={value}
          onChange={(checked) =>
            message.success(`PDV ${fmtPosicao(p.posicao)} ${checked ? "ativado" : "desativado"}`)
          }
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 92,
      render: (_, p) => (
        <Button type="link" style={{ height: 24, padding: 0 }} onClick={() => onOpenPdv(p.id)}>
          Gerenciar
        </Button>
      ),
    },
  ];

  const ativos = pdvs.filter((p) => p.ativoParaEscala).length;
  const porTipo = pdvs.reduce<Record<string, number>>((acc, p) => {
    acc[p.tipo] = (acc[p.tipo] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={styles.pdv}>
      <div style={styles.pdvToolbar}>
        <Input
          placeholder="Buscar"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar PDV
          </Button>
          <Button type="primary" icon={<PlusIcon />} onClick={() => onOpenPdv("")}>
            Novo PDV
          </Button>
        </div>
      </div>

      <div ref={tableScrollRef} className="gt-table-frame" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Table<Pdv>
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          pagination={false}
          scroll={{ y: scrollY }}
          size="middle"
          bordered
          rowClassName={(record) => (record.ativoParaEscala ? "" : "is-disabled")}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum PDV" />,
          }}
        />
      </div>

      <div style={styles.totals} className="gt-totals-skel">
        <span style={styles.total}>
          <span style={styles.totalLabel}>Total de PDV</span>
          <span style={styles.totalValue}>{pdvs.length}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>PDV ativos para escala</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueActive }}>{ativos}</span>
        </span>
        <span style={{ ...styles.total, ...styles.totalRight }}>
          <span style={styles.totalLabel}>Normal</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueBlue }}>{porTipo.Normal ?? 0}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>Rápido</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueGold }}>{porTipo["Rápido"] ?? 0}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>Preferencial</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueMagenta }}>
            {porTipo.Preferencial ?? 0}
          </span>
        </span>
      </div>
    </div>
  );
}
