"use client";

import { Button, Input, Popconfirm, Segmented, Tag, Tooltip, App } from "antd";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleChevronLeftIcon,
  DeleteIcon,
  ExpandIcon,
  PrinterIcon,
  SaveIcon,
  SearchIcon,
} from "@/components/icons";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { Header, HeaderContextItem } from "@/components/shell/Header";
import { TimelineGrid } from "@/components/escalas/TimelineGrid";
import { getEscala, getLinhasTimeline, STATUS_COLOR, STATUS_LABEL } from "@/lib/mock/escalas";
import { initialsOf } from "@/lib/utils/format";

interface AdminEscalaContentProps {
  escalaId: string;
}

type ViewMode = "day" | "week" | "month";

export function AdminEscalaContent({ escalaId }: AdminEscalaContentProps) {
  const { message, modal } = App.useApp();
  const escala = useMemo(() => getEscala(escalaId), [escalaId]);
  const todasLinhas = useMemo(() => getLinhasTimeline(), []);

  const [paneCollapsed, setPaneCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(() => dayjs("2026-05-20"));
  const [view, setView] = useState<ViewMode>("day");

  const linhas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return todasLinhas;
    return todasLinhas.filter(
      (l) =>
        l.colaboradorNome.toLowerCase().includes(term) ||
        l.funcao.toLowerCase().includes(term)
    );
  }, [todasLinhas, search]);

  if (!escala) {
    return (
      <AppShell>
        <Header title="Escala não encontrada" showBack />
        <div className="gt-content">
          <div className="gt-blocks gt-blocks--A">
            <section className="gt-block">
              <p>Essa escala não existe.</p>
              <Link href="/escalas">Voltar para a lista</Link>
            </section>
          </div>
        </div>
      </AppShell>
    );
  }

  const periodo = `${dayjs(escala.inicio).format("DD/MM/YY")} a ${dayjs(escala.fim).format("DD/MM/YY")}`;

  return (
    <AppShell>
      <Header
        title={escala.nome}
        showBack
        showEdit
        context={
          <>
            <HeaderContextItem>{escala.unidadeNome}</HeaderContextItem>
            <span style={{ opacity: 0.3 }}>·</span>
            <HeaderContextItem>{periodo}</HeaderContextItem>
            <Tag color={STATUS_COLOR[escala.status]}>{STATUS_LABEL[escala.status]}</Tag>
          </>
        }
        actions={
          <>
            <Popconfirm
              title="Excluir escala"
              description="Essa ação é permanente."
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
              onConfirm={() => message.success("Escala excluída (mock)")}
            >
              <Button danger icon={<DeleteIcon />}>
                Excluir
              </Button>
            </Popconfirm>
            <Button icon={<SaveIcon />} onClick={() => message.success("Rascunho salvo")}>
              Salvar
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleIcon />}
              onClick={() =>
                modal.success({
                  title: "Escala divulgada",
                  content: "Os colaboradores foram notificados.",
                })
              }
            >
              Divulgar
            </Button>
          </>
        }
      />

      <div className="gt-content">
        <div className="gt-blocks gt-blocks--B">
          {/* Pane esquerda: colaboradores */}
          <div className={`gt-pane-left${paneCollapsed ? " is-collapsed" : ""}`}>
            {paneCollapsed ? (
              <div className="gt-rail" onClick={() => setPaneCollapsed(false)}>
                <Tooltip title="Expandir colaboradores" placement="right">
                  <button type="button" className="gt-rail__btn" aria-label="Expandir">
                    <CircleChevronLeftIcon size={18} style={{ transform: "rotate(180deg)" }} />
                  </button>
                </Tooltip>
                <span className="gt-rail__title">Colaboradores</span>
              </div>
            ) : (
              <section className="gt-block" style={{ padding: 0 }}>
                <div className="cfg__pane-head">
                  <span className="cfg__title">Colaboradores ({linhas.length})</span>
                  <Tooltip title="Recolher">
                    <button
                      type="button"
                      className="cfg__pane-collapse"
                      onClick={() => setPaneCollapsed(true)}
                      aria-label="Recolher"
                    >
                      <CircleChevronLeftIcon size={18} />
                    </button>
                  </Tooltip>
                </div>
                <div className="cfg__pane-search">
                  <Input
                    placeholder="Buscar colaborador"
                    prefix={<SearchIcon />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,
                  }}
                >
                  {linhas.map((l) => (
                    <div key={l.id} className="gt-colab-row">
                      <span
                        className="gt-user-cell__avatar"
                        style={{ background: l.avatarColor }}
                      >
                        {initialsOf(l.colaboradorNome)}
                      </span>
                      <div className="gt-colab-row__info">
                        <span className="gt-colab-row__name">{l.colaboradorNome}</span>
                        <span className="gt-colab-row__meta">{l.funcao}</span>
                      </div>
                      <span className="gt-colab-row__status">
                        {l.visualizadoEm
                          ? `Visto ${dayjs(l.visualizadoEm).format("DD/MM")}`
                          : "Não visto"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Pane direita: timeline */}
          <div className="gt-pane-right">
            <section
              className="gt-block"
              style={{ padding: 0, display: "flex", flexDirection: "column" }}
            >
              <div className="tl__toolbar">
                <div className="tl__toolbar-left">
                  <Segmented
                    value={view}
                    onChange={(v) => setView(v as ViewMode)}
                    options={[
                      { label: "Dia", value: "day" },
                      { label: "Semana", value: "week" },
                      { label: "Mês", value: "month" },
                    ]}
                  />
                </div>
                <div className="tl__toolbar-center">
                  <Tooltip title="Dia anterior">
                    <Button
                      icon={<ChevronLeftIcon />}
                      type="text"
                      onClick={() => setDate((d) => d.subtract(1, "day"))}
                    />
                  </Tooltip>
                  <span className="tl__date">{date.format("dddd, DD [de] MMM. YYYY")}</span>
                  <Tooltip title="Próximo dia">
                    <Button
                      icon={<ChevronRightIcon />}
                      type="text"
                      onClick={() => setDate((d) => d.add(1, "day"))}
                    />
                  </Tooltip>
                  <Button
                    size="small"
                    type="default"
                    onClick={() => setDate(dayjs())}
                    style={{ marginLeft: 8 }}
                  >
                    Hoje
                  </Button>
                </div>
                <div className="tl__toolbar-right">
                  <Tooltip title="Imprimir">
                    <Button
                      icon={<PrinterIcon />}
                      type="text"
                      onClick={() => window.print()}
                    />
                  </Tooltip>
                  <Tooltip title="Tela cheia">
                    <Button
                      icon={<ExpandIcon />}
                      type="text"
                      onClick={() => message.info("Em breve")}
                    />
                  </Tooltip>
                </div>
              </div>

              <TimelineGrid linhas={linhas} />
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
