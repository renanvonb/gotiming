"use client";

import { Button, DatePicker, Empty, Input, Table, Tag, type TableColumnsType } from "antd";
import { PlusIcon, SearchIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import {
  escalas,
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/lib/mock/escalas";
import type { Escala } from "@/lib/types";

const { RangePicker } = DatePicker;

export function ListaEscalasContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [favorited, setFavorited] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return escalas.filter((e) => {
      if (term) {
        const haystack = `${e.nome} ${e.unidadeNome} ${e.setor} ${e.modificadoPor}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (range) {
        const [start, end] = range;
        const ini = dayjs(e.inicio);
        const fim = dayjs(e.fim);
        if (fim.isBefore(start, "day") || ini.isAfter(end, "day")) return false;
      }
      return true;
    });
  }, [search, range]);

  const columns: TableColumnsType<Escala> = [
    {
      title: "Nome da escala",
      dataIndex: "nome",
      key: "nome",
      render: (nome: string, e) => (
        <a
          href={`/escalas/${e.id}`}
          onClick={(ev) => ev.stopPropagation()}
          style={{ color: "var(--ant-color-primary)" }}
        >
          {nome}
        </a>
      ),
    },
    { title: "Unidade", dataIndex: "unidadeNome", key: "unidade", width: 200 },
    {
      title: "Período",
      key: "periodo",
      width: 200,
      render: (_, e) =>
        `${dayjs(e.inicio).format("DD/MM/YYYY")} – ${dayjs(e.fim).format("DD/MM/YYYY")}`,
    },
    { title: "Setor", dataIndex: "setor", key: "setor", width: 130 },
    {
      title: "Últ. modificação",
      key: "mod",
      render: (_, e) => {
        const d = dayjs(e.modificadoEm);
        return `Em ${d.format("DD/MM/YY")} às ${d.format("HH:mm")} por ${e.modificadoPor}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: Escala["status"]) => (
        <Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, e) => (
        <Button
          type="link"
          onClick={(ev) => {
            ev.stopPropagation();
            router.push(`/escalas/${e.id}`);
          }}
        >
          Gerenciar
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <Header
        title="Lista de escalas"
        favorited={favorited}
        onToggleFavorite={() => setFavorited((v) => !v)}
        actions={
          <>
            <Input
              placeholder="Buscar"
              prefix={<SearchIcon />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ width: 240 }}
            />
            <RangePicker
              format="DD/MM/YY"
              value={range}
              onChange={(v) => setRange(v as [Dayjs, Dayjs] | null)}
              allowClear
            />
            <Button type="primary" icon={<PlusIcon />}>
              Nova escala
            </Button>
          </>
        }
      />
      <div className="gt-content">
        <div className="gt-blocks gt-blocks--A">
          <section className="gt-block" style={{ padding: 0 }}>
            <Table<Escala>
              rowKey="id"
              dataSource={filtered}
              columns={columns}
              pagination={false}
              size="middle"
              bordered={false}
              scroll={{ y: "calc(100vh - 200px)" }}
              onRow={(record) => ({
                onClick: () => router.push(`/escalas/${record.id}`),
                style: { cursor: "pointer" },
              })}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <>
                        <h4
                          style={{
                            margin: "8px 0 4px",
                            fontWeight: 600,
                            color: "var(--ant-color-text)",
                          }}
                        >
                          Nenhuma escala gerada
                        </h4>
                        <span style={{ color: "var(--ant-color-text-tertiary)" }}>
                          Todas as escalas geradas serão listadas aqui.
                        </span>
                      </>
                    }
                  />
                ),
              }}
            />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
