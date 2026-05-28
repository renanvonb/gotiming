"use client";

import { Button, Input, Switch, Table, type TableColumnsType, App, Empty } from "antd";
import { ImportIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import dayjs from "dayjs";
import type { Colaborador } from "@/lib/types";
import { getColaboradores } from "@/lib/mock/colaboradores";
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

export function ColaboradoresPanel({ unidadeId, onOpenColab, onImportFolgas }: ColaboradoresPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const colaboradores = useMemo(() => getColaboradores(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return colaboradores;
    return colaboradores.filter(
      (c) =>
        c.nome.toLowerCase().includes(term) ||
        c.funcao.toLowerCase().includes(term) ||
        String(c.codigoOperador).includes(term)
    );
  }, [colaboradores, search]);

  const columns: TableColumnsType<Colaborador> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      ellipsis: true,
      render: (_, c) => (
        <span style={styles.userCell}>
          <span style={{ ...styles.userCellAvatar, background: c.avatarColor }}>
            {initialsOf(c.nome)}
          </span>
          <span style={styles.userCellName}>{highlightMatch(c.nome, search)}</span>
        </span>
      ),
    },
    {
      title: "Código operador",
      dataIndex: "codigoOperador",
      key: "codigo",
      width: 140,
      render: (value: number) => highlightMatch(String(value), search),
    },
    {
      title: "Função",
      dataIndex: "funcao",
      key: "funcao",
      ellipsis: true,
      render: (funcao: string) => highlightMatch(funcao, search),
    },
    {
      title: "Última folga semana",
      key: "folgaSemana",
      width: 170,
      render: (_, c) => fmtFolga(c.ultimaFolgaSemana),
    },
    {
      title: "Última folga domingo",
      key: "folgaDomingo",
      width: 180,
      render: (_, c) => fmtFolga(c.ultimaFolgaDomingo),
    },
    {
      title: "Escala",
      dataIndex: "ativoParaEscala",
      key: "escala",
      width: 90,
      render: (value: boolean, c) => (
        <Switch
          size="small"
          checked={value}
          onChange={(checked) =>
            message.success(`${c.nome} ${checked ? "ativado" : "desativado"}`)
          }
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
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
          rowClassName={(record) => (record.ativoParaEscala ? "" : "is-disabled")}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum colaborador" />
            ),
          }}
        />
      </div>

      <div style={styles.totals}>
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
