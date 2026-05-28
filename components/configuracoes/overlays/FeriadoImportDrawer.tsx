"use client";

import { Button, DatePicker, Drawer, Input, Space, Switch, App } from "antd";
import { SearchIcon } from "@/components/icons";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import dayjs from "dayjs";
import { feriadosNacionais2026 } from "@/lib/mock/feriados";

const styles: Record<string, CSSProperties> = {
  desc: {
    margin: "0 0 12px",
    fontSize: 14,
    color: "var(--ant-color-text-secondary)",
    lineHeight: 1.5,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  toolbarInput: {
    flex: 1,
    minWidth: 0,
  },
  allrow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    marginTop: 12,
    borderTop: "1px solid var(--ant-color-border-secondary)",
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  allrowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ant-color-text)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    margin: 0,
    borderBottom: "1px solid var(--ant-color-border-secondary)",
  },
  itemLast: {
    borderBottom: 0,
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },
  itemName: {
    fontSize: 14,
    color: "var(--ant-color-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemSub: {
    fontSize: 12,
    color: "var(--ant-color-text-tertiary)",
    fontVariantNumeric: "tabular-nums",
  },
  itemKind: {
    fontSize: 11,
    color: "var(--ant-color-text-secondary)",
    background: "var(--ant-color-fill-tertiary)",
    padding: "2px 8px",
    borderRadius: 4,
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  },
  empty: {
    padding: "32px 0",
    textAlign: "center",
    color: "var(--ant-color-text-tertiary)",
  },
};

interface FeriadoImportDrawerProps {
  open: boolean;
  onClose: () => void;
}

function monthAbbr(d: dayjs.Dayjs): string {
  const m = d.format("MMM").replace(".", "");
  return m.charAt(0).toUpperCase() + m.slice(1);
}

export function FeriadoImportDrawer({ open, onClose }: FeriadoImportDrawerProps) {
  const { message } = App.useApp();
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState("");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return feriadosNacionais2026
      .map((f) => ({ ...f, dataAno: dayjs(f.data).year(year) }))
      .filter((f) => {
        if (!term) return true;
        return f.nome.toLowerCase().includes(term) || f.kind.toLowerCase().includes(term);
      });
  }, [year, search]);

  const allSelected = filtered.length > 0 && filtered.every((f) => selecionados.has(f.id));

  const toggleAll = (checked: boolean) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      filtered.forEach((f) => (checked ? next.add(f.id) : next.delete(f.id)));
      return next;
    });
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
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
            Salvar
          </Button>
        </Space>
      }
    >
      <p style={styles.desc}>Selecione os feriados aplicáveis a esta unidade.</p>

      <div style={styles.toolbar}>
        <Input
          placeholder="Buscar feriado"
          prefix={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={styles.toolbarInput}
        />
        <DatePicker
          picker="year"
          value={dayjs().year(year)}
          onChange={(d) => d && setYear(d.year())}
          allowClear={false}
          inputReadOnly
          style={{ width: 110 }}
        />
      </div>

      <div style={styles.allrow}>
        <span style={styles.allrowLabel}>Selecionar todos</span>
        <Switch size="small" checked={allSelected} onChange={toggleAll} />
      </div>

      <ul style={styles.list}>
        {filtered.map((f, index) => {
          const isLast = index === filtered.length - 1;
          return (
            <li key={f.id} style={{ ...styles.item, ...(isLast ? styles.itemLast : null) }}>
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{f.nome}</span>
                <span style={styles.itemSub}>
                  {monthAbbr(f.dataAno)} - {f.dataAno.format("DD/MM/YYYY")}
                </span>
              </div>
              <span style={styles.itemKind}>{f.kind}</span>
              <Switch
                size="small"
                checked={selecionados.has(f.id)}
                onChange={(checked) => toggleOne(f.id, checked)}
              />
            </li>
          );
        })}
        {filtered.length === 0 && <li style={styles.empty}>Nenhum resultado</li>}
      </ul>
    </Drawer>
  );
}
