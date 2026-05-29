"use client";

import { Button, Input, Popconfirm, Select, Tooltip, App } from "antd";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleChevronLeftIcon,
  ExpandIcon,
  PrinterIcon,
  SearchIcon,
  StoreIcon,
} from "@/components/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/shell/AppShell";
import { Header, HeaderContextItem } from "@/components/shell/Header";
import { TimelineGrid } from "@/components/escalas/TimelineGrid";
import { getEscala, getLinhasTimeline } from "@/lib/mock/escalas";
import { initialsOf } from "@/lib/utils/format";
import { useHover } from "@/lib/hooks/useHover";

interface AdminEscalaContentProps {
  escalaId: string;
}

type ViewMode = "day" | "week" | "month";

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
  // .gt-blocks--B (flex variant overrides the grid base)
  blocksB: {
    display: "flex",
    alignItems: "stretch",
    gap: 0,
    height: "100%",
    minHeight: 0,
  },
  block: {
    background: "var(--ant-color-bg-container)",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: "var(--ant-border-radius)",
    padding: 16,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  // .gt-pane-left + .gt-pane-right share these
  paneBase: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
  },
  paneLeft: {
    flex: "0 0 auto",
  },
  paneLeftCollapsed: {
    width: 56,
    flex: "0 0 56px",
  },
  paneRight: {
    flex: "1 1 auto",
  },
  splitter: {
    position: "relative",
    width: 6,
    flexShrink: 0,
    margin: "0 -3px",
    cursor: "col-resize",
    background: "transparent",
    zIndex: 5,
  },
  splitterLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: "var(--gt-footer-h)",
    width: 1,
    transform: "translateX(-50%)",
    background: "var(--ant-color-border-secondary)",
    transition:
      "background var(--ant-motion-duration-mid) var(--ant-motion-ease-out), width var(--ant-motion-duration-fast)",
  },
  splitterLineActive: {
    background: "var(--ant-color-primary)",
    width: 2,
  },
  // .gt-pane-left > .gt-block
  paneLeftBlock: {
    flex: 1,
    minWidth: 0,
    borderRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  // .gt-pane-right > .gt-block
  paneRightBlock: {
    flex: 1,
    minWidth: 0,
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  rail: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
    gap: 8,
    cursor: "pointer",
    background: "var(--ant-color-bg-container)",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRight: 0,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  railBtn: {
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text-secondary)",
    borderRadius: 4,
    cursor: "pointer",
  },
  railTitle: {
    writingMode: "vertical-rl",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    marginTop: 4,
  },
  paneHeadZone: {
    height: "var(--gt-top-h)",
    boxSizing: "border-box",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
    borderBottom: "1px solid var(--ant-color-border-secondary)",
    flexShrink: 0,
  },
  paneHeadRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  paneCollapseBase: {
    width: 24,
    height: 24,
    padding: 0,
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text-secondary)",
    borderRadius: 4,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition:
      "background var(--ant-motion-duration-fast), color var(--ant-motion-duration-fast)",
  },
  paneFooter: {
    height: "var(--gt-footer-h)",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderTop: "1px solid var(--ant-color-border-secondary)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  // .cfg__title (also gets flex:1 from .cfg__pane-head .cfg__title)
  title: {
    margin: 0,
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "24px",
    color: "var(--ant-color-text)",
  },
  colabList: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
  },
  colabRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    height: "var(--gt-row-h)",
    boxSizing: "border-box",
    padding: "0 16px",
    borderBottom: "1px dashed var(--ant-color-border-secondary)",
    cursor: "default",
    transition: "background var(--ant-motion-duration-fast)",
  },
  colabRowHovered: {
    background: "var(--ant-color-fill-quaternary)",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    flex: "none",
    fontSize: 12,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    textTransform: "uppercase",
    color: "#fff",
  },
  colabInfo: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  colabName: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  colabMeta: {
    fontSize: 12,
    color: "var(--ant-color-text-tertiary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tlBlock: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    height: 52,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "0 16px",
    flexShrink: 0,
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    justifySelf: "start",
  },
  toolbarCenter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "center",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    justifySelf: "end",
  },
  date: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    minWidth: 175,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
  },
};

function PaneCollapseButton({ onClick }: { onClick: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title="Recolher">
      <button
        type="button"
        style={{
          ...styles.paneCollapseBase,
          ...(hovered ? { color: "var(--ant-color-text)" } : null),
        }}
        onClick={onClick}
        aria-label="Recolher"
        {...handlers}
      >
        <CircleChevronLeftIcon size={18} />
      </button>
    </Tooltip>
  );
}

export function AdminEscalaContent({ escalaId }: AdminEscalaContentProps) {
  const { message, modal } = App.useApp();
  const escala = useMemo(() => getEscala(escalaId), [escalaId]);
  const todasLinhas = useMemo(() => getLinhasTimeline(), []);

  const [paneCollapsed, setPaneCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(() => dayjs("2026-05-20"));
  const [view, setView] = useState<ViewMode>("day");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [paneWidth, setPaneWidth] = useState(261);
  const [dragging, setDragging] = useState(false);
  const [splitterHovered, splitterHandlers] = useHover();

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const linhas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return todasLinhas;
    return todasLinhas.filter(
      (l) =>
        l.colaboradorNome.toLowerCase().includes(term) ||
        l.funcao.toLowerCase().includes(term)
    );
  }, [todasLinhas, search]);

  // Sincroniza o scroll vertical entre a lista de colaboradores e o corpo da timeline.
  useEffect(() => {
    const a = listRef.current;
    const b = bodyRef.current;
    if (!a || !b) return;
    let syncing = false;
    const onA = () => {
      if (syncing) return;
      syncing = true;
      b.scrollTop = a.scrollTop;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };
    const onB = () => {
      if (syncing) return;
      syncing = true;
      a.scrollTop = b.scrollTop;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };
    a.addEventListener("scroll", onA);
    b.addEventListener("scroll", onB);
    return () => {
      a.removeEventListener("scroll", onA);
      b.removeEventListener("scroll", onB);
    };
  }, [paneCollapsed, linhas]);

  const onSplitterDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      const startX = e.clientX;
      const startW = paneWidth;
      const onMove = (ev: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const max = rect ? rect.width / 2 : 800;
        const w = Math.max(261, Math.min(max, startW + (ev.clientX - startX)));
        setPaneWidth(w);
      };
      const onUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [paneWidth]
  );

  if (!escala) {
    return (
      <AppShell>
        <Header title="Escala não encontrada" showBack />
        <div style={styles.content}>
          <div style={styles.blocksA}>
            <section style={styles.block}>
              <p>Essa escala não existe.</p>
              <Link to="/escalas">Voltar para a lista</Link>
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
            <HeaderContextItem icon={<StoreIcon />}>{escala.unidadeNome}</HeaderContextItem>
            <HeaderContextItem icon={<CalendarIcon />}>{periodo}</HeaderContextItem>
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
              <Button danger>Excluir</Button>
            </Popconfirm>
            <Button onClick={() => message.success("Rascunho salvo")}>Salvar</Button>
            <Button
              type="primary"
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

      <div style={styles.content}>
        <div ref={containerRef} style={styles.blocksB}>
          {/* Pane esquerda: colaboradores */}
          <div
            style={{
              ...styles.paneBase,
              ...styles.paneLeft,
              ...(paneCollapsed ? styles.paneLeftCollapsed : { width: paneWidth }),
            }}
          >
            {paneCollapsed ? (
              <div style={styles.rail} onClick={() => setPaneCollapsed(false)}>
                <Tooltip title="Expandir colaboradores" placement="right">
                  <button type="button" style={styles.railBtn} aria-label="Expandir">
                    <CircleChevronLeftIcon size={18} style={{ transform: "rotate(180deg)" }} />
                  </button>
                </Tooltip>
                <span style={styles.railTitle}>Colaboradores</span>
              </div>
            ) : (
              <section style={{ ...styles.block, ...styles.paneLeftBlock, padding: 0 }}>
                <div style={styles.paneHeadZone}>
                  <div style={styles.paneHeadRow}>
                    <span style={styles.title}>Colaboradores ({linhas.length})</span>
                    <PaneCollapseButton onClick={() => setPaneCollapsed(true)} />
                  </div>
                  <Input
                    placeholder="Buscar colaborador"
                    prefix={<SearchIcon />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                  />
                </div>
                <div ref={listRef} className="gt-no-scrollbar" style={styles.colabList}>
                  {linhas.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        ...styles.colabRow,
                        ...(hoveredId === l.id ? styles.colabRowHovered : null),
                      }}
                      onMouseEnter={() => setHoveredId(l.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <span style={{ ...styles.avatar, background: l.avatarColor }}>
                        {initialsOf(l.colaboradorNome)}
                      </span>
                      <div style={styles.colabInfo}>
                        <span style={styles.colabName}>{l.colaboradorNome}</span>
                        <span style={styles.colabMeta}>
                          {l.visualizadoEm
                            ? `Visualizado ${dayjs(l.visualizadoEm).format("DD/MM/YYYY")}`
                            : "Não visualizado"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.paneFooter}>
                  <span>Total de PDVs abertos</span>
                </div>
              </section>
            )}
          </div>

          {/* Splitter arrastável */}
          {!paneCollapsed && (
            <div
              style={styles.splitter}
              onMouseDown={onSplitterDown}
              onDoubleClick={() => setPaneWidth(261)}
              role="separator"
              aria-orientation="vertical"
              {...splitterHandlers}
            >
              <span
                style={{
                  ...styles.splitterLine,
                  ...(dragging || splitterHovered ? styles.splitterLineActive : null),
                }}
              />
            </div>
          )}

          {/* Pane direita: timeline */}
          <div style={{ ...styles.paneBase, ...styles.paneRight }}>
            <section style={{ ...styles.block, ...styles.paneRightBlock, ...styles.tlBlock }}>
              <div style={styles.toolbar}>
                <div style={styles.toolbarLeft}>
                  <Select
                    variant="borderless"
                    value={view}
                    onChange={(v) => setView(v as ViewMode)}
                    style={{ width: 104 }}
                    options={[
                      { label: "Dia", value: "day" },
                      { label: "Semana", value: "week" },
                      { label: "Mês", value: "month" },
                    ]}
                  />
                </div>
                <div style={styles.toolbarCenter}>
                  <Tooltip title="Dia anterior">
                    <Button
                      icon={<ChevronLeftIcon />}
                      type="text"
                      onClick={() => setDate((d) => d.subtract(1, "day"))}
                    />
                  </Tooltip>
                  <span style={styles.date}>{date.format("dddd, DD [de] MMM. YYYY")}</span>
                  <Tooltip title="Próximo dia">
                    <Button
                      icon={<ChevronRightIcon />}
                      type="text"
                      onClick={() => setDate((d) => d.add(1, "day"))}
                    />
                  </Tooltip>
                </div>
                <div style={styles.toolbarRight}>
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

              <TimelineGrid
                linhas={linhas}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                bodyRef={bodyRef}
              />
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
