"use client";

import { Button, Input, Switch, Table, Tag, type TableColumnsType, App, Empty } from "antd";
import { ImportIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { Pdv } from "@/lib/types";
import { getPdvs } from "@/lib/mock/pdvs";

interface PdvPanelProps {
  unidadeId: string;
  onOpenPdv: (id: string) => void;
  onImport: () => void;
}

const TAG_COLOR_BY_TIPO: Record<Pdv["tipo"], string> = {
  Normal: "blue",
  Rápido: "gold",
  Preferencial: "magenta",
};

export function PdvPanel({ unidadeId, onOpenPdv, onImport }: PdvPanelProps) {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const pdvs = useMemo(() => getPdvs(unidadeId), [unidadeId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pdvs;
    return pdvs.filter(
      (p) => p.nome.toLowerCase().includes(term) || p.tipo.toLowerCase().includes(term)
    );
  }, [pdvs, search]);

  const columns: TableColumnsType<Pdv> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      width: 160,
      render: (tipo: Pdv["tipo"]) => <Tag color={TAG_COLOR_BY_TIPO[tipo]}>{tipo}</Tag>,
    },
    {
      title: "Ativo para escala",
      dataIndex: "ativoParaEscala",
      key: "ativo",
      width: 160,
      render: (value: boolean, p) => (
        <Switch
          checked={value}
          onChange={(checked) => message.success(`${p.nome} ${checked ? "ativado" : "desativado"}`)}
        />
      ),
    },
    {
      title: "Preferencial",
      dataIndex: "preferencial",
      key: "preferencial",
      width: 140,
      render: (value: boolean, p) => (
        <Switch
          checked={value}
          disabled={p.tipo !== "Preferencial"}
          onChange={(checked) => message.success(`${p.nome} preferencial: ${checked}`)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, p) => (
        <Button type="link" onClick={() => onOpenPdv(p.id)}>
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
    <div className="cfg__pdv" style={{ padding: 16 }}>
      <div className="cfg__pdv-toolbar">
        <Input
          placeholder="Buscar PDV"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar PDVs
          </Button>
          <Button type="primary" icon={<PlusIcon />} onClick={() => onOpenPdv("")}>
            Novo PDV
          </Button>
        </div>
      </div>

      <Table<Pdv>
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        pagination={false}
        scroll={{ y: "calc(100vh - 360px)" }}
        size="middle"
        bordered
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum PDV" />,
        }}
      />

      <div className="cfg__pdv-totals">
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Total:</span>
          <span className="cfg__pdv-total__value">{pdvs.length}</span>
        </span>
        <span className="cfg__pdv-total__divider" />
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Ativos:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--active">{ativos}</span>
        </span>
        <span className="cfg__pdv-total__divider" />
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Normal:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--blue">{porTipo.Normal ?? 0}</span>
        </span>
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Rápido:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--gold">{porTipo["Rápido"] ?? 0}</span>
        </span>
        <span className="cfg__pdv-total">
          <span className="cfg__pdv-total__label">Preferencial:</span>
          <span className="cfg__pdv-total__value cfg__pdv-total__value--magenta">
            {porTipo.Preferencial ?? 0}
          </span>
        </span>
      </div>
    </div>
  );
}
