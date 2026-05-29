"use client";

import { Button, Input, Table, type TableColumnsType, Empty } from "antd";
import { CalendarSearchIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import dayjs from "dayjs";
import type { Feriado } from "@/lib/types";
import { getFeriados } from "@/lib/mock/feriados";
import { highlightMatch } from "@/lib/utils/highlight";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";

interface FeriadosPanelProps {
  unidadeId: string;
  onOpenFeriado: (id: string) => void;
  onImport: () => void;
}

const styles: Record<string, CSSProperties> = {
  feriados: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    gap: 16,
    overflow: "hidden",
    padding: 16,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  actions: {
    display: "flex",
    gap: 8,
  },
};

function fmtHorario(f: Feriado): string {
  if (!f.abertura || f.abertura.length === 0) return "Fechado";
  return f.abertura.map((r) => `${r.inicio} — ${r.fim}`).join(", ");
}

export function FeriadosPanel({ unidadeId, onOpenFeriado, onImport }: FeriadosPanelProps) {
  const [search, setSearch] = useState("");
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const feriados = useMemo(() => getFeriados(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return feriados;
    return feriados.filter((f) => f.nome.toLowerCase().includes(term));
  }, [feriados, search]);

  const columns: TableColumnsType<Feriado> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      ellipsis: true,
      render: (nome: string) => highlightMatch(nome, search),
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      ellipsis: true,
      render: (d: string) => dayjs(d).format("DD/MM/YY"),
    },
    {
      title: "Horário",
      key: "horario",
      ellipsis: true,
      render: (_, f) => fmtHorario(f),
    },
    {
      title: "Ações",
      key: "actions",
      width: 92,
      render: (_, f) => (
        <Button type="link" style={{ height: 24, padding: 0 }} onClick={() => onOpenFeriado(f.id)}>
          Gerenciar
        </Button>
      ),
    },
  ];

  return (
    <div style={styles.feriados}>
      <div style={styles.toolbar}>
        <Input
          placeholder="Buscar"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <div style={styles.actions}>
          <Button icon={<CalendarSearchIcon />} onClick={onImport}>
            Feriados nacionais
          </Button>
          <Button type="primary" icon={<PlusIcon />} onClick={() => onOpenFeriado("")}>
            Adicionar
          </Button>
        </div>
      </div>

      <div ref={tableScrollRef} className="gt-table-frame" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Table<Feriado>
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          pagination={false}
          size="middle"
          bordered
          scroll={{ y: scrollY }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Nenhum feriado ou data especial encontrado"
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
