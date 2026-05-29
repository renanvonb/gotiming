"use client";

import { Empty, Input, Tooltip } from "antd";
import {
  CircleChevronLeftIcon,
  ExclamationIcon,
  SearchIcon,
  StoreIcon,
} from "@/components/icons";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { Unidade } from "@/lib/types";
import { useHover } from "@/lib/hooks/useHover";
import { highlightMatch } from "@/lib/utils/highlight";
import { useThemeMode } from "@/components/providers/ThemeProvider";

interface UnitsPaneProps {
  unidades: Unidade[];
  ativaId: string;
  onAtivaChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  colapsada: boolean;
  onToggleColapsada: () => void;
}

const styles: Record<string, CSSProperties> = {
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
    flex: 1,
  },
  paneHead: {
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  title: {
    margin: 0,
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "24px",
    color: "var(--ant-color-text)",
  },
  collapseBase: {
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
  /* Estado recolhido (rail de 56px): o bloco inteiro é clicável; o ícone fica
     no topo respeitando o padding superior (16px, igual ao cabeçalho expandido)
     e o título vertical "Unidades" vem logo abaixo. */
  rail: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "16px 0",
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text-secondary)",
    cursor: "pointer",
    transition: "background var(--ant-motion-duration-fast)",
  },
  railIcon: {
    width: 28,
    height: 28,
    flex: "none",
    display: "grid",
    placeItems: "center",
    borderRadius: 4,
    color: "var(--ant-color-text-secondary)",
  },
  railTitle: {
    margin: 0,
    marginTop: 4,
    writingMode: "vertical-rl",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    color: "var(--ant-color-text)",
  },
  search: {
    padding: "0 16px 12px",
  },
  vtabs: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 16px 8px",
    flex: 1,
    overflowY: "auto",
  },
  vtabLabel: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  vtabsEmpty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "24px 16px",
  },
  vtabsEmptyText: {
    fontSize: 13,
    color: "var(--ant-color-text-tertiary)",
  },
};

function CollapseButton({ onClick }: { onClick: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title="Recolher">
      <button
        type="button"
        style={{
          ...styles.collapseBase,
          ...(hovered ? { color: "var(--ant-color-text)" } : null),
        }}
        aria-label="Recolher"
        onClick={onClick}
        {...handlers}
      >
        <CircleChevronLeftIcon size={18} />
      </button>
    </Tooltip>
  );
}

function CollapsedRail({ onClick }: { onClick: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <button
      type="button"
      aria-label="Expandir unidades"
      onClick={onClick}
      style={{
        ...styles.rail,
        ...(hovered ? { background: "var(--ant-color-fill-quaternary)" } : null),
      }}
      {...handlers}
    >
      <span style={styles.railIcon}>
        <CircleChevronLeftIcon size={18} style={{ transform: "rotate(180deg)" }} />
      </span>
      <span style={styles.railTitle}>Unidades</span>
    </button>
  );
}

interface VTabProps {
  unidade: Unidade;
  active: boolean;
  dark: boolean;
  term: string;
  onClick: () => void;
}

function VTab({ unidade, active, dark, term, onClick }: VTabProps) {
  const [hovered, handlers] = useHover();

  const activeBg = dark ? "rgba(22, 119, 255, 0.18)" : "var(--ant-color-primary-bg)";
  const hoverBg = dark ? "rgba(255, 255, 255, 0.06)" : "var(--ant-color-fill-tertiary)";

  const highlighted = active || hovered;
  const iconColor = highlighted
    ? "var(--ant-color-primary)"
    : "var(--ant-color-text-tertiary)";

  const tabStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    height: 40,
    flex: "none",
    padding: "0 12px",
    border: 0,
    background: active ? activeBg : hovered ? hoverBg : "transparent",
    font: "inherit",
    fontSize: 14,
    fontWeight: active ? 500 : 400,
    color: highlighted ? "var(--ant-color-primary)" : "var(--ant-color-text)",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    borderRadius: "var(--ant-border-radius)",
    transition:
      "background var(--ant-motion-duration-fast), color var(--ant-motion-duration-fast)",
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      style={tabStyle}
      onClick={onClick}
      {...handlers}
    >
      <StoreIcon size={16} style={{ color: iconColor, flex: "none" }} />
      <span style={styles.vtabLabel}>{highlightMatch(unidade.nome, term)}</span>
      {unidade.hasWarning && (
        <Tooltip
          title={
            <>
              Existem configurações
              <br />
              pendentes nesta unidade
            </>
          }
        >
          <span style={{ display: "inline-flex", flex: "none", color: "var(--ant-color-warning)" }}>
            <ExclamationIcon size={16} />
          </span>
        </Tooltip>
      )}
    </button>
  );
}

export function UnitsPane({
  unidades,
  ativaId,
  onAtivaChange,
  search,
  onSearchChange,
  colapsada,
  onToggleColapsada,
}: UnitsPaneProps) {
  const { mode } = useThemeMode();
  const dark = mode === "dark";

  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return unidades;
    return unidades.filter((u) =>
      u.nome.toLowerCase().includes(term) ||
      (u.abreviacao?.toLowerCase().includes(term) ?? false)
    );
  }, [unidades, search]);

  return (
    <section style={styles.block}>
      {colapsada ? (
        <CollapsedRail onClick={onToggleColapsada} />
      ) : (
        <>
          <div style={styles.paneHead}>
            <span style={styles.title}>Unidades</span>
            <CollapseButton onClick={onToggleColapsada} />
          </div>

          <div style={styles.search}>
            <Input
              size="middle"
              placeholder="Buscar"
              prefix={<SearchIcon />}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
          </div>

          {filtradas.length === 0 ? (
            <div style={styles.vtabsEmpty}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 60 }}
                description={<span style={styles.vtabsEmptyText}>Sem resultados</span>}
              />
            </div>
          ) : (
            <nav style={styles.vtabs} role="tablist" aria-orientation="vertical">
              {filtradas.map((u) => (
                <VTab
                  key={u.id}
                  unidade={u}
                  active={u.id === ativaId}
                  dark={dark}
                  term={search}
                  onClick={() => onAtivaChange(u.id)}
                />
              ))}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
