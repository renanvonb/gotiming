"use client";

import { Drawer, Empty, Form, Radio } from "antd";
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
import { useHover } from "@/lib/hooks/useHover";

interface SideMenuProps {
  active: SidebarMenuKey | null;
  onClose: () => void;
}

const TITLES: Record<SidebarMenuKey, string> = {
  modulos: "Módulos",
  favoritos: "Favoritos",
  historico: "Últimos acessos",
  notificacoes: "Notificações",
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
      title={<span style={{ fontSize: 18, fontWeight: 600 }}>{title}</span>}
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
        body: { padding: 12, paddingLeft: 56 + 12 },
        header: {
          minHeight: "var(--header-height)",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 56 + 16,
          paddingRight: 16,
        },
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
  const { mode } = useThemeMode();
  const dark = mode === "dark";
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <MenuLink
          key={item.href + item.label}
          item={item}
          isActive={pathname === item.href}
          dark={dark}
          onClose={onClose}
        />
      ))}
    </nav>
  );
}

function MenuLink({
  item,
  isActive,
  dark,
  onClose,
}: {
  item: MenuListItem;
  isActive: boolean;
  dark: boolean;
  onClose: () => void;
}) {
  const [hovered, handlers] = useHover();

  const activeBg = dark ? "rgba(22, 119, 255, 0.18)" : "var(--ant-color-primary-bg)";
  const hoverBg = dark ? "rgba(255, 255, 255, 0.06)" : "var(--ant-color-fill-tertiary)";
  const highlighted = isActive || hovered;
  const iconColor = highlighted ? "var(--ant-color-primary)" : "var(--ant-color-text-tertiary)";

  return (
    <Link
      to={item.href}
      onClick={onClose}
      {...handlers}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 40,
        padding: "0 12px",
        borderRadius: "var(--ant-border-radius)",
        background: isActive ? activeBg : hovered ? hoverBg : "transparent",
        color: highlighted ? "var(--ant-color-primary)" : "var(--ant-color-text)",
        fontWeight: isActive ? 500 : 400,
        textDecoration: "none",
        transition:
          "background var(--ant-motion-duration-fast), color var(--ant-motion-duration-fast)",
      }}
    >
      <span style={{ display: "inline-flex", color: iconColor, flex: "none" }}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

function EmptyState({ description }: { description: string }) {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
    </div>
  );
}

function UsuarioMenu() {
  const { mode, setMode } = useThemeMode();
  return (
    <Form layout="vertical">
      <Form.Item label="Aparência" style={{ marginBottom: 0 }}>
        <Radio.Group
          value={mode}
          onChange={(e) => setMode(e.target.value as "light" | "dark")}
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              value: "light",
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <SunIcon /> Claro
                </span>
              ),
            },
            {
              value: "dark",
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <MoonIcon /> Escuro
                </span>
              ),
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
