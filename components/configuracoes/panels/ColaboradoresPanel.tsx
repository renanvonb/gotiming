"use client";

import { Button, Input, Switch, Table, type TableColumnsType, App, Empty } from "antd";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { Colaborador } from "@/lib/types";
import { getColaboradores } from "@/lib/mock/colaboradores";
import { initialsOf } from "@/lib/utils/format";

interface ColaboradoresPanelProps {
  unidadeId: string;
  onOpenColab: (id: string) => void;
}

export function ColaboradoresPanel({ unidadeId, onOpenColab }: ColaboradoresPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const colaboradores = useMemo(() => getColaboradores(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return colaboradores;
    return colaboradores.filter(
      (c) =>
        c.nome.toLowerCase().includes(term) ||
        c.cargo.toLowerCase().includes(term) ||
        c.matricula.toLowerCase().includes(term)
    );
  }, [colaboradores, search]);

  const columns: TableColumnsType<Colaborador> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (_, c) => (
        <span className="gt-user-cell">
          <span className="gt-user-cell__avatar" style={{ background: c.avatarColor }}>
            {initialsOf(c.nome)}
          </span>
          <span>{c.nome}</span>
        </span>
      ),
    },
    { title: "Cargo", dataIndex: "cargo", key: "cargo" },
    { title: "Matrícula", dataIndex: "matricula", key: "matricula" },
    {
      title: "Ativo para escala",
      dataIndex: "ativoParaEscala",
      key: "ativo",
      width: 160,
      render: (value: boolean, c) => (
        <Switch
          checked={value}
          onChange={(checked) =>
            message.success(`${c.nome} ${checked ? "ativado" : "desativado"}`)
          }
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, c) => (
        <Button type="link" onClick={() => onOpenColab(c.id)}>
          Gerenciar
        </Button>
      ),
    },
  ];

  const ativos = colaboradores.filter((c) => c.ativoParaEscala).length;

  return (
    <div className="cfg__colab" style={{ padding: 16 }}>
      <div className="cfg__colab-toolbar">
        <Input
          placeholder="Buscar colaborador"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusIcon />}
          onClick={() => onOpenColab("")}
        >
          Novo colaborador
        </Button>
      </div>

      <Table<Colaborador>
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        pagination={false}
        scroll={{ y: "calc(100vh - 360px)" }}
        size="middle"
        bordered
        rowClassName={(record) => (record.ativoParaEscala ? "" : "is-disabled")}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum colaborador" />
          ),
        }}
      />

      <div className="cfg__pdv-totals">
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Total:</span>
          <span className="cfg__pdv-total__value">{colaboradores.length}</span>
        </span>
        <span className="cfg__pdv-total__divider" />
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Ativos:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--active">{ativos}</span>
        </span>
      </div>
    </div>
  );
}
