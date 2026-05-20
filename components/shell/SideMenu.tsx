"use client";

import { Drawer, Empty, Segmented, Space } from "antd";
import {
  CalendarIcon,
  ClockIcon,
  MoonIcon,
  SettingsIcon,
  StarIcon,
  SunIcon,
  TableIconRe,
} from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const FAVORITOS = [
  { href: "/configuracoes", label: "Configurações", icon: <StarIcon /> },
];

const HISTORICO = [
  { href: "/configuracoes", label: "Configurações", icon: <ClockIcon /> },
  { href: "/escalas", label: "Lista de escalas", icon: <ClockIcon /> },
];

export function SideMenu({ active, onClose }: SideMenuProps) {
  const pathname = usePathname();
  const open = active !== null;
  const title = active ? TITLES[active] : "";

  return (
    <Drawer
      title={title}
      placement="left"
      open={open}
      onClose={onClose}
      size={284 + 56}
      mask
      maskClosable
      keyboard
      styles={{
        wrapper: { boxShadow: "var(--ant-box-shadow)" },
        body: { paddingLeft: 56, padding: 8 },
        header: { paddingLeft: 56 + 16 },
        mask: { left: 56 },
      }}
      rootStyle={{ left: 56 }}
      getContainer={false}
      classNames={{ wrapper: "gt-sidemenu-wrapper" }}
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
      return <MenuList items={FAVORITOS} pathname={pathname} onClose={onClose} />;
    case "historico":
      return <MenuList items={HISTORICO} pathname={pathname} onClose={onClose} />;
    case "notificacoes":
      return <EmptyState description="Sem notificações" />;
    case "tweaks":
      return <EmptyState description="Painel de tweaks (em breve)" />;
    case "solucoes":
      return <EmptyState description="Outras soluções Goapice" />;
    case "configuracoes":
      return <MenuList items={[{ href: "/configuracoes", label: "Abrir Configurações", icon: <SettingsIcon /> }]} pathname={pathname} onClose={onClose} />;
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
            href={href}
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

function UsuarioMenu() {
  const { mode, setMode } = useThemeMode();
  return (
    <div style={{ padding: 16 }}>
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        <div>
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 0.04,
              color: "var(--ant-color-text-tertiary)",
              marginBottom: 8,
            }}
          >
            Tema
          </div>
          <Segmented
            block
            value={mode}
            onChange={(v) => setMode(v as "light" | "dark")}
            options={[
              { value: "light", label: "Claro", icon: <SunIcon /> },
              { value: "dark", label: "Escuro", icon: <MoonIcon /> },
            ]}
          />
        </div>
        <div
          style={{
            color: "var(--ant-color-text-tertiary)",
            fontSize: 12,
          }}
        >
          renanborstel@goapice.com
        </div>
      </Space>
    </div>
  );
}
