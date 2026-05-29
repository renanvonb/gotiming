import { Tooltip } from "antd";
import {
  BellIcon,
  ClockIcon,
  MenuIcon,
  SettingsIcon,
  SolutionsIcon,
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
  { key: "solucoes", label: "Soluções", icon: <SolutionsIcon size={20} /> },
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
    <Tooltip title={label} placement="right" align={{ offset: [22, 0] }}>
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
    <Tooltip title="Usuário" placement="right" align={{ offset: [22, 0] }}>
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
      <Tooltip title="Gotime" placement="right" align={{ offset: [22, 0] }}>
        <Link to="/escalas" style={styles.logo} aria-label="Gotime">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path
            d="M4.00172 5.75823C4.00172 4.55851 4.97429 3.58594 6.17401 3.58594H25.8277C27.0274 3.58594 28 4.55851 28 5.75823C28 6.95796 27.0274 7.93053 25.8277 7.93053H6.17402C4.97429 7.93053 4.00172 6.95796 4.00172 5.75823Z"
            fill="#FFD666"
          />
          <path
            d="M27.9992 26.2399C27.9992 27.4396 27.0266 28.4122 25.8269 28.4122L6.17319 28.4122C4.97346 28.4122 4.00089 27.4396 4.00089 26.2399C4.00089 25.0402 4.97346 24.0676 6.17319 24.0676L25.8269 24.0676C27.0266 24.0676 27.9992 25.0402 27.9992 26.2399Z"
            fill="#FAAD14"
          />
          <path
            d="M6.17226 3.58594C7.37196 3.58594 8.34452 4.55849 8.34452 5.7582L8.34452 12.5855C8.34452 13.7852 7.37196 14.7577 6.17226 14.7577C4.97255 14.7577 4 13.7852 4 12.5855L4 5.75819C4 4.55849 4.97255 3.58594 6.17226 3.58594Z"
            fill="#FFD666"
          />
          <path
            d="M25.8269 28.4122C24.6272 28.4122 23.6547 27.4396 23.6547 26.2399L23.6547 19.4126C23.6547 18.2129 24.6273 17.2404 25.827 17.2404C27.0267 17.2404 27.9993 18.2129 27.9993 19.4126L27.9992 26.2399C27.9992 27.4396 27.0266 28.4122 25.8269 28.4122Z"
            fill="#FAAD14"
          />
          <path
            d="M20.9646 12.5856C20.9646 13.7853 19.9921 14.7579 18.7923 14.7579H12.9997C11.8 14.7579 10.8274 13.7853 10.8274 12.5856C10.8274 11.3859 11.8 10.4133 12.9997 10.4133L18.7923 10.4133C19.9921 10.4133 20.9646 11.3859 20.9646 12.5856Z"
            fill="#FFD666"
          />
          <path
            d="M11.0363 19.4125C11.0363 18.2128 12.0088 17.2402 13.2086 17.2402L19.0012 17.2402C20.2009 17.2402 21.1735 18.2128 21.1735 19.4125C21.1735 20.6122 20.2009 21.5848 19.0012 21.5848H13.2086C12.0088 21.5848 11.0363 20.6122 11.0363 19.4125Z"
            fill="#FAAD14"
          />
          </svg>
        </Link>
      </Tooltip>

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
