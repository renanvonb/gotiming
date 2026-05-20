"use client";

import { Button, Checkbox, Drawer, Input, Space, Tag, App } from "antd";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { feriadosNacionais2026 } from "@/lib/mock/feriados";

interface FeriadoImportDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function FeriadoImportDrawer({ open, onClose }: FeriadoImportDrawerProps) {
  const { message } = App.useApp();
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState("");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return feriadosNacionais2026.filter((f) => {
      const matchYear = dayjs(f.data).year() === year;
      const matchSearch = term ? f.nome.toLowerCase().includes(term) : true;
      return matchYear && matchSearch;
    });
  }, [year, search]);

  const allSelected = filtered.length > 0 && filtered.every((f) => selecionados.has(f.id));

  const toggleAll = () => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (allSelected) filtered.forEach((f) => next.delete(f.id));
      else filtered.forEach((f) => next.add(f.id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    if (selecionados.size === 0) {
      message.warning("Selecione ao menos um feriado");
      return;
    }
    message.success(`${selecionados.size} feriado(s) importado(s)`);
    setSelecionados(new Set());
    onClose();
  };

  return (
    <Drawer
      title="Feriados nacionais"
      open={open}
      onClose={onClose}
      size={480}
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleSave}>
            Importar ({selecionados.size})
          </Button>
        </Space>
      }
    >
      <p className="cfg__feriado-import-desc">
        Selecione os feriados que deseja adicionar à unidade ativa.
      </p>

      <div className="cfg__feriado-import-yearnav">
        <Button icon={<ChevronLeftIcon />} onClick={() => setYear((y) => y - 1)} aria-label="Ano anterior" />
        <span className="cfg__feriado-import-year">{year}</span>
        <Button icon={<ChevronRightIcon />} onClick={() => setYear((y) => y + 1)} aria-label="Próximo ano" />
      </div>

      <div className="cfg__feriado-import-toolbar">
        <Input
          placeholder="Buscar"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <div className="cfg__feriado-import-allrow">
        <span className="cfg__feriado-import-allrow__label">Selecionar todos</span>
        <Checkbox checked={allSelected} onChange={toggleAll} />
      </div>

      <ul
        className="cfg__feriado-import-list"
        style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "55vh", overflowY: "auto" }}
      >
        {filtered.map((f) => {
          const checked = selecionados.has(f.id);
          return (
            <li key={f.id} className="cfg__feriado-import-item">
              <Checkbox checked={checked} onChange={() => toggleOne(f.id)} />
              <div className="cfg__feriado-import-item__info">
                <span className="cfg__feriado-import-item__name">{f.nome}</span>
                <span className="cfg__feriado-import-item__sub">
                  {dayjs(f.data).format("DD/MM/YYYY · dddd")}
                </span>
              </div>
              <span className="cfg__feriado-import-item__kind">
                {f.tipo === "evento" ? <Tag color="purple">Evento</Tag> : <Tag color="red">Nacional</Tag>}
              </span>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "var(--ant-color-text-tertiary)",
            }}
          >
            Nenhum resultado
          </li>
        )}
      </ul>
    </Drawer>
  );
}
