"use client";

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
import type { ReactNode } from "react";
import Link from "next/link";

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
  { key: "favoritos", label: "Favoritos", icon: <StarIcon /> },
  { key: "historico", label: "Últimos acessos", icon: <ClockIcon /> },
  { key: "notificacoes", label: "Notificações", icon: <BellIcon /> },
];

const grupoBase: BtnConfig[] = [
  { key: "tweaks", label: "Tweaks", icon: <ControlIcon /> },
  { key: "solucoes", label: "Soluções", icon: <AppsIcon /> },
  { key: "configuracoes", label: "Configurações", icon: <SettingsIcon /> },
];

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const handle = (key: SidebarMenuKey) => () => {
    onMenuChange(activeMenu === key ? null : key);
  };

  return (
    <aside className="gt-sidebar" aria-label="Navegação principal">
      <Link href="/" className="gt-sidebar__logo" title="Goapice" aria-label="Goapice">
        <svg width="20" height="23" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <Tooltip title="Módulos" placement="right">
        <button
          type="button"
          className={`gt-sidebar__btn${activeMenu === "modulos" ? " is-active" : ""}`}
          aria-label="Módulos"
          aria-pressed={activeMenu === "modulos"}
          onClick={handle("modulos")}
        >
          <MenuIcon />
        </button>
      </Tooltip>

      <div className="gt-sidebar__divider" />

      <div className="gt-sidebar__group">
        {grupoTopo.map(({ key, label, icon }) => (
          <Tooltip key={key} title={label} placement="right">
            <button
              type="button"
              className={`gt-sidebar__btn${activeMenu === key ? " is-active" : ""}`}
              aria-label={label}
              aria-pressed={activeMenu === key}
              onClick={handle(key)}
            >
              {icon}
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="gt-sidebar__spacer" />

      <div className="gt-sidebar__group">
        {grupoBase.map(({ key, label, icon }) => (
          <Tooltip key={key} title={label} placement="right">
            <button
              type="button"
              className={`gt-sidebar__btn${activeMenu === key ? " is-active" : ""}`}
              aria-label={label}
              aria-pressed={activeMenu === key}
              onClick={handle(key)}
            >
              {icon}
            </button>
          </Tooltip>
        ))}

        <Tooltip title="Usuário" placement="right">
          <button
            type="button"
            className={`gt-sidebar__avatar${activeMenu === "usuario" ? " is-active" : ""}`}
            aria-label="Usuário"
            aria-pressed={activeMenu === "usuario"}
            onClick={handle("usuario")}
          >
            <UserIcon />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
