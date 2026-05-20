"use client";

import { Empty, Input, Tooltip } from "antd";
import {
  CircleChevronLeftIcon,
  ExclamationIcon,
  HomeIcon,
  SearchIcon,
} from "@/components/icons";
import { useMemo } from "react";
import type { Unidade } from "@/lib/types";

interface UnitsPaneProps {
  unidades: Unidade[];
  ativaId: string;
  onAtivaChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  colapsada: boolean;
  onToggleColapsada: () => void;
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
  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return unidades;
    return unidades.filter((u) =>
      u.nome.toLowerCase().includes(term) ||
      (u.abreviacao?.toLowerCase().includes(term) ?? false)
    );
  }, [unidades, search]);

  return (
    <section className="gt-block" style={{ padding: 0 }}>
      <div className="cfg__pane-head">
        <span className="cfg__title">Unidades</span>
        {!colapsada && (
          <Tooltip title="Recolher">
            <button
              type="button"
              className="cfg__pane-collapse"
              aria-label="Recolher"
              onClick={onToggleColapsada}
            >
              <CircleChevronLeftIcon size={18} />
            </button>
          </Tooltip>
        )}
      </div>

      {colapsada ? (
        <button
          type="button"
          aria-label="Expandir unidades"
          onClick={onToggleColapsada}
          style={{
            display: "block",
            background: "transparent",
            border: 0,
            padding: 8,
            color: "var(--ant-color-text-secondary)",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          <CircleChevronLeftIcon size={18} style={{ transform: "rotate(180deg)" }} />
        </button>
      ) : (
        <>
          <div className="cfg__pane-search">
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
            <div className="gt-vtabs-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 60 }}
                description={<span className="gt-vtabs-empty__text">Nenhuma unidade</span>}
              />
            </div>
          ) : (
            <nav className="gt-vtabs" role="tablist" aria-orientation="vertical">
              {filtradas.map((u) => {
                const isActive = u.id === ativaId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`gt-vtab${isActive ? " is-active" : ""}`}
                    onClick={() => onAtivaChange(u.id)}
                  >
                    <HomeIcon size={16} />
                    <span className="gt-vtab__label">{u.nome}</span>
                    {u.hasWarning && (
                      <Tooltip title="Configuração pendente">
                        <span className="gt-vtab__warn" aria-label="Alerta">
                          <ExclamationIcon fill="currentColor" stroke="white" />
                        </span>
                      </Tooltip>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
