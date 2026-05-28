"use client";

import { Drawer, Empty, Segmented } from "antd";
import type { CSSProperties } from "react";
import {
  CalendarIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  TableIconRe,
} from "@/components/icons";
import { Link, useLocation } from "react-router-dom";
import type { SidebarMenuKey } from "@/components/shell/Sidebar";
import { useThemeMode } from "@/components/providers/ThemeProvider";

interface SideMenuProps {
  active: SidebarMenuKey | null;
  onClose: () => void;
}

const TITLES: Record<SidebarMenuKey, string> = {
  modulos: "Módulos",
  favoritos: "Favoritos",
  historico: "Últimos acessos",
  notificacoes: "Notificações",
  tweaks: "Tweaks",
  solucoes: "Soluções",
  configuracoes: "Configurações",
  usuario: "Usuário",
};

const MODULOS = [
  { href: "/escalas", label: "Lista de escalas", icon: <TableIconRe /> },
  { href: "/escalas/escala-de-novembro", label: "Administração de escala", icon: <CalendarIcon /> },
  { href: "/configuracoes", label: "Configurações", icon: <SettingsIcon /> },
];

export function SideMenu({ active, onClose }: SideMenuProps) {
  const pathname = useLocation().pathname;
  const open = active !== null;
  const title = active ? TITLES[active] : "";

  return (
    <Drawer
      title={title}
      placement="left"
      open={open}
      onClose={onClose}
      rootClassName="gt-sidemenu"
      width={56 + 284}
      zIndex={99}
      mask
      maskClosable
      keyboard
      styles={{
        wrapper: { boxShadow: "var(--ant-box-shadow)" },
        body: { padding: 8, paddingLeft: 56 + 8 },
        header: { paddingLeft: 56 + 16, paddingRight: 16 },
        mask: { left: 56 },
      }}
      getContainer={false}
    >
      <MenuBody active={active} pathname={pathname} onClose={onClose} />
    </Drawer>
  );
}

interface MenuBodyProps {
  active: SidebarMenuKey | null;
  pathname: string | null;
  onClose: () => void;
}

function MenuBody({ active, pathname, onClose }: MenuBodyProps) {
  if (!active) return null;

  switch (active) {
    case "modulos":
      return <MenuList items={MODULOS} pathname={pathname} onClose={onClose} />;
    case "favoritos":
      return <EmptyState description="Nenhum favorito ainda" />;
    case "historico":
      return <EmptyState description="Nenhum acesso recente" />;
    case "notificacoes":
      return <EmptyState description="Nenhuma notificação" />;
    case "tweaks":
      return <TweaksMenu />;
    case "solucoes":
      return <EmptyState description="Nenhuma solução disponível" />;
    case "configuracoes":
      return <EmptyState description="Sem itens" />;
    case "usuario":
      return <UsuarioMenu />;
    default:
      return null;
  }
}

interface MenuListItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function MenuList({ items, pathname, onClose }: { items: MenuListItem[]; pathname: string | null; onClose: () => void }) {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href + label}
            to={href}
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 6,
              color: isActive ? "var(--ant-color-primary)" : "var(--ant-color-text)",
              background: isActive ? "var(--ant-color-primary-bg)" : "transparent",
              textDecoration: "none",
              fontWeight: isActive ? 500 : 400,
            }}
          >
            <span style={{ display: "inline-flex", color: "var(--ant-color-text-secondary)" }}>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function EmptyState({ description }: { description: string }) {
  return (
    <div style={{ display: "grid", placeItems: "center", padding: 24 }}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
    </div>
  );
}

const tweaksStyles: Record<string, CSSProperties> = {
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 16px",
  },
  label: {
    fontSize: 14,
    color: "var(--ant-color-text)",
  },
};

function TweaksMenu() {
  const { mode, setMode } = useThemeMode();
  return (
    <div style={tweaksStyles.row}>
      <span style={tweaksStyles.label}>Aparência</span>
      <Segmented
        value={mode}
        onChange={(v) => setMode(v as "light" | "dark")}
        options={[
          { value: "light", label: "Claro", icon: <SunIcon /> },
          { value: "dark", label: "Escuro", icon: <MoonIcon /> },
        ]}
      />
    </div>
  );
}

function UsuarioMenu() {
  return (
    <div
      style={{
        padding: 16,
        color: "var(--ant-color-text-tertiary)",
        fontSize: 13,
      }}
    >
      renanborstel@goapice.com
    </div>
  );
}
