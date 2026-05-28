import { Tooltip } from "antd";
import {
  AppsIcon,
  BellIcon,
  ClockIcon,
  ControlIcon,
  MenuIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from "@/components/icons";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useHover } from "@/lib/hooks/useHover";

export type SidebarMenuKey =
  | "modulos"
  | "favoritos"
  | "historico"
  | "notificacoes"
  | "tweaks"
  | "solucoes"
  | "configuracoes"
  | "usuario";

export interface SidebarProps {
  activeMenu: SidebarMenuKey | null;
  onMenuChange: (key: SidebarMenuKey | null) => void;
}

interface BtnConfig {
  key: SidebarMenuKey;
  label: string;
  icon: ReactNode;
}

const grupoTopo: BtnConfig[] = [
  { key: "favoritos", label: "Favoritos", icon: <StarIcon size={20} /> },
  { key: "historico", label: "Últimos acessos", icon: <ClockIcon size={20} /> },
  { key: "notificacoes", label: "Notificações", icon: <BellIcon size={20} /> },
];

const grupoBase: BtnConfig[] = [
  { key: "tweaks", label: "Tweaks", icon: <ControlIcon size={20} /> },
  { key: "solucoes", label: "Soluções", icon: <AppsIcon size={20} /> },
  { key: "configuracoes", label: "Configurações", icon: <SettingsIcon size={20} /> },
];

const styles: Record<string, CSSProperties> = {
  sidebar: {
    position: "fixed",
    inset: "0 auto 0 0",
    width: "var(--sidebar-width)",
    background: "#000",
    color: "rgba(255, 255, 255, 0.65)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 100,
    padding: "16px 0",
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
  },
  divider: {
    width: 20,
    height: 1,
    background: "rgba(255, 255, 255, 0.18)",
    flex: "none",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  btnBase: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    background: "transparent",
    border: 0,
    color: "rgba(255, 255, 255, 0.65)",
    borderRadius: 6,
    transition:
      "background var(--ant-motion-duration-fast), color var(--ant-motion-duration-fast)",
  },
  btnHover: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
  },
  btnActive: {
    color: "var(--goapice-brand-blue)",
    background: "rgba(19, 117, 250, 0.12)",
  },
  avatarBase: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#bfbfbf",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    border: 0,
    cursor: "pointer",
    padding: 0,
    marginTop: 12,
  },
  avatarActive: {
    outline: "2px solid var(--goapice-brand-blue)",
    outlineOffset: 2,
  },
};

interface SidebarButtonProps {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

function SidebarButton({ label, icon, active, onClick }: SidebarButtonProps) {
  const [hovered, hoverHandlers] = useHover();
  return (
    <Tooltip title={label} placement="right">
      <button
        type="button"
        style={{
          ...styles.btnBase,
          ...(hovered && !active ? styles.btnHover : null),
          ...(active ? styles.btnActive : null),
        }}
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        {...hoverHandlers}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

interface AvatarButtonProps {
  active: boolean;
  onClick: () => void;
}

function AvatarButton({ active, onClick }: AvatarButtonProps) {
  const [hovered, hoverHandlers] = useHover();
  return (
    <Tooltip title="Usuário" placement="right">
      <button
        type="button"
        style={{
          ...styles.avatarBase,
          ...(active ? styles.avatarActive : null),
          ...(hovered ? { background: "#a6a6a6" } : null),
        }}
        aria-label="Usuário"
        aria-pressed={active}
        onClick={onClick}
      >
        <UserIcon size={18} />
      </button>
    </Tooltip>
  );
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const handle = (key: SidebarMenuKey) => () => {
    onMenuChange(activeMenu === key ? null : key);
  };

  return (
    <aside style={styles.sidebar} aria-label="Navegação principal">
      <Link to="/" style={styles.logo} title="Goapice" aria-label="Goapice">
        <svg width="20" height="23" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path
            d="M4.42652 16.4754C4.26556 15.5692 4.14483 14.6631 4.14483 13.6334C4.14483 7.61986 7.40436 3.70696 12.2735 3.70696C15.6135 3.70696 17.7866 4.94262 19.034 7.66105L23.0984 6.7961C21.3278 2.18299 17.6658 0 12.193 0C4.90941 0 0 5.47806 0 13.5922C0 14.9514 0.120723 16.1871 0.36217 17.3815L4.42652 16.4754Z"
            fill="#fff"
          />
          <path
            d="M11.9571 12.6877V16.3511L17.1298 16.1865L17.6956 16.7628L9.00708 25.4068L11.553 28L20.0395 19.1502L20.5648 19.6853L20.4032 24.954H23.9998V12.6877H11.9571Z"
            fill="#fadb14"
          />
        </svg>
      </Link>

      <SidebarButton
        label="Módulos"
        icon={<MenuIcon size={20} />}
        active={activeMenu === "modulos"}
        onClick={handle("modulos")}
      />

      <div style={styles.divider} />

      <div style={styles.group}>
        {grupoTopo.map(({ key, label, icon }) => (
          <SidebarButton
            key={key}
            label={label}
            icon={icon}
            active={activeMenu === key}
            onClick={handle(key)}
          />
        ))}
      </div>

      <div style={styles.spacer} />

      <div style={styles.group}>
        {grupoBase.map(({ key, label, icon }) => (
          <SidebarButton
            key={key}
            label={label}
            icon={icon}
            active={activeMenu === key}
            onClick={handle(key)}
          />
        ))}

        <AvatarButton
          active={activeMenu === "usuario"}
          onClick={handle("usuario")}
        />
      </div>
    </aside>
  );
}
