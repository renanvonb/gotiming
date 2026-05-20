"use client";

import { Button, Input, Popconfirm, Table, Tag, type TableColumnsType, App, Empty } from "antd";
import { ImportIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Feriado } from "@/lib/types";
import { getFeriados } from "@/lib/mock/feriados";

interface FeriadosPanelProps {
  unidadeId: string;
  onOpenFeriado: (id: string) => void;
  onImport: () => void;
}

const TAG_COLOR_BY_TIPO: Record<Feriado["tipo"], string> = {
  nacional: "red",
  estadual: "geekblue",
  municipal: "cyan",
  personalizado: "purple",
};

const LABEL_BY_TIPO: Record<Feriado["tipo"], string> = {
  nacional: "Nacional",
  estadual: "Estadual",
  municipal: "Municipal",
  personalizado: "Personalizado",
};

export function FeriadosPanel({ unidadeId, onOpenFeriado, onImport }: FeriadosPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const feriados = useMemo(() => getFeriados(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return feriados;
    return feriados.filter((f) => f.nome.toLowerCase().includes(term));
  }, [feriados, search]);

  const columns: TableColumnsType<Feriado> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 160,
      render: (d: string) => dayjs(d).format("DD/MM/YYYY"),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      width: 160,
      render: (t: Feriado["tipo"]) => <Tag color={TAG_COLOR_BY_TIPO[t]}>{LABEL_BY_TIPO[t]}</Tag>,
    },
    {
      title: "Funcionamento",
      key: "func",
      render: (_, f) => {
        if (!f.abertura || f.abertura.length === 0) return "Fechado";
        return f.abertura.map((r) => `${r.inicio}–${r.fim}`).join(", ");
      },
    },
    {
      title: "",
      key: "actions",
      width: 160,
      align: "right",
      render: (_, f) => (
        <div className="cfg__feriado-actions">
          <Button type="link" onClick={() => onOpenFeriado(f.id)}>
            Editar
          </Button>
          <Popconfirm
            title="Excluir feriado"
            description={`Remover "${f.nome}"?`}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => message.success(`"${f.nome}" excluído`)}
          >
            <Button type="link" danger>
              Excluir
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      <div className="cfg__pdv-toolbar">
        <Input
          placeholder="Buscar feriado"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar feriados nacionais
          </Button>
          <Button type="primary" icon={<PlusIcon />} onClick={() => onOpenFeriado("")}>
            Novo feriado
          </Button>
        </div>
      </div>

      <Table<Feriado>
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        pagination={false}
        size="middle"
        bordered
        scroll={{ y: "calc(100vh - 360px)" }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum feriado" />,
        }}
      />
    </div>
  );
}
