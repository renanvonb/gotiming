"use client";

import {
  App,
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  type TableColumnsType,
} from "antd";
import { PlusIcon, SearchIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { escalas as escalasSeed, STATUS_COLOR, STATUS_LABEL } from "@/lib/mock/escalas";
import type { Escala, EscalaSetor } from "@/lib/types";
import { useHover } from "@/lib/hooks/useHover";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";
import { slugify } from "@/lib/utils/format";
import { highlightMatch } from "@/lib/utils/highlight";

const { RangePicker } = DatePicker;

const SETORES: EscalaSetor[] = ["Caixa", "Atendimento", "Estoque", "Cozinha"];
const UNIDADES = [
  "Goapice",
  "Goapice · Unidade Sul",
  "Goapice · Unidade Norte",
  "Goapice · Unidade Centro",
];

interface NewEscalaForm {
  nome: string;
  periodo: [Dayjs, Dayjs];
  setor: EscalaSetor;
  unidade: string;
}

const styles: Record<string, CSSProperties> = {
  content: {
    flex: 1,
    padding:
      "var(--content-pad-top) var(--content-pad-right) var(--content-pad-bottom) var(--content-pad-left)",
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    overflow: "hidden",
  },
  blocksA: {
    display: "grid",
    gap: "var(--block-gap)",
    height: "100%",
    minHeight: 0,
    gridTemplateColumns: "1fr",
  },
  block: {
    background: "var(--ant-color-bg-container)",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: "var(--ant-border-radius)",
    padding: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
};

function NomeLink({ children, onActivate }: { children: ReactNode; onActivate: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <a
      onClick={(ev) => {
        ev.stopPropagation();
        onActivate();
      }}
      style={{
        color: hovered ? "var(--ant-color-primary)" : "var(--ant-color-text)",
        fontWeight: 500,
        textDecoration: "none",
        cursor: "pointer",
        transition: "color var(--ant-motion-duration-fast)",
      }}
      {...handlers}
    >
      {children}
    </a>
  );
}

export function ListaEscalasContent() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const [form] = Form.useForm<NewEscalaForm>();

  const [data, setData] = useState<Escala[]>(escalasSeed);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((e) => {
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
  }, [data, search, range]);

  const columns: TableColumnsType<Escala> = [
    {
      title: "Nome da escala",
      dataIndex: "nome",
      key: "nome",
      ellipsis: true,
      render: (nome: string, e) => (
        <NomeLink onActivate={() => navigate(`/escalas/${e.id}`)}>
          {highlightMatch(nome, search)}
        </NomeLink>
      ),
    },
    {
      title: "Unidade",
      dataIndex: "unidadeNome",
      key: "unidade",
      width: 180,
      ellipsis: true,
      render: (unidade: string) => highlightMatch(unidade, search),
    },
    {
      title: "Período",
      key: "periodo",
      width: 200,
      render: (_, e) =>
        `${dayjs(e.inicio).format("DD/MM/YYYY")} – ${dayjs(e.fim).format("DD/MM/YYYY")}`,
    },
    {
      title: "Setor",
      dataIndex: "setor",
      key: "setor",
      width: 120,
      render: (setor: string) => highlightMatch(setor, search),
    },
    {
      title: "Últ. modificação",
      key: "mod",
      ellipsis: true,
      render: (_, e) => {
        const d = dayjs(e.modificadoEm);
        return (
          <>
            {`Em ${d.format("DD/MM/YY")} às ${d.format("HH:mm")} por `}
            {highlightMatch(e.modificadoPor, search)}
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: Escala["status"]) => (
        <Tag color={STATUS_COLOR[status]} variant="filled">
          {STATUS_LABEL[status]}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 110,
      render: (_, e) => (
        <Button
          type="link"
          style={{ height: 24, padding: 0 }}
          onClick={(ev) => {
            ev.stopPropagation();
            navigate(`/escalas/${e.id}`);
          }}
        >
          Gerenciar
        </Button>
      ),
    },
  ];

  function handleCreate(values: NewEscalaForm) {
    const [ini, fim] = values.periodo;
    const nova: Escala = {
      id: `${slugify(values.nome)}-${Date.now()}`,
      nome: values.nome.trim(),
      unidadeNome: values.unidade,
      setor: values.setor,
      inicio: ini.format("YYYY-MM-DD"),
      fim: fim.format("YYYY-MM-DD"),
      status: "rascunho",
      modificadoEm: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      modificadoPor: "Você",
    };
    setData((prev) => [nova, ...prev]);
    message.success("Escala criada com sucesso!");
    setModalOpen(false);
    form.resetFields();
  }

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
            <Button type="primary" icon={<PlusIcon />} onClick={() => setModalOpen(true)}>
              Nova escala
            </Button>
          </>
        }
      />
      <div style={styles.content}>
        <div style={styles.blocksA}>
          <section style={styles.block}>
            <div ref={tableScrollRef} style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <Table<Escala>
                rowKey="id"
                dataSource={filtered}
                columns={columns}
                pagination={false}
                size="middle"
                bordered={false}
                scroll={{ y: scrollY }}
                onRow={(record) => ({
                  onClick: () => navigate(`/escalas/${record.id}`),
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
                            Nenhuma escala encontrada
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
            </div>
          </section>
        </div>
      </div>

      <Modal
        title="Nova escala"
        centered
        open={modalOpen}
        width={440}
        okText="Criar escala"
        cancelText="Cancelar"
        onOk={() => form.submit()}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark
          onFinish={handleCreate}
          style={{ marginTop: 8 }}
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome da escala." }]}
          >
            <Input placeholder="Informe o nome da escala" maxLength={80} />
          </Form.Item>
          <Form.Item
            name="periodo"
            label="Período"
            rules={[{ required: true, message: "Selecione o período da escala." }]}
          >
            <RangePicker format="DD/MM/YY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="setor"
            label="Setor"
            rules={[{ required: true, message: "Selecione o setor." }]}
          >
            <Select
              placeholder="Selecione o setor"
              options={SETORES.map((s) => ({ value: s, label: s }))}
            />
          </Form.Item>
          <Form.Item
            name="unidade"
            label="Unidade"
            rules={[{ required: true, message: "Selecione a unidade." }]}
          >
            <Select
              placeholder="Selecione a unidade"
              options={UNIDADES.map((u) => ({ value: u, label: u }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AppShell>
  );
}
