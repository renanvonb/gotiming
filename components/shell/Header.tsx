"use client";

import { Button, Tooltip } from "antd";
import { ArrowLeftIcon, EditIcon, StarIcon } from "@/components/icons";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface HeaderProps {
  title: string;
  moduleIcon?: ReactNode;
  showBack?: boolean;
  showEdit?: boolean;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  actions?: ReactNode;
  context?: ReactNode;
}

export function Header({
  title,
  moduleIcon,
  showBack = false,
  showEdit = false,
  favorited = false,
  onToggleFavorite,
  actions,
  context,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="gt-header">
      <div className="gt-header__left">
        {showBack && (
          <Tooltip title="Voltar">
            <button
              type="button"
              className="gt-header__back"
              onClick={() => router.back()}
              aria-label="Voltar"
            >
              <ArrowLeftIcon />
            </button>
          </Tooltip>
        )}
        {moduleIcon && <span className="gt-header__module-icon">{moduleIcon}</span>}
        <h1 className="gt-header__title">{title}</h1>
        {showEdit && (
          <Tooltip title="Renomear">
            <button type="button" className="gt-header__title-edit" aria-label="Renomear">
              <EditIcon />
            </button>
          </Tooltip>
        )}
        {onToggleFavorite && (
          <Tooltip title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <button
              type="button"
              className={`gt-header__fav${favorited ? " is-active" : ""}`}
              onClick={onToggleFavorite}
              aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              aria-pressed={favorited}
            >
              <StarIcon fill={favorited ? "currentColor" : "none"} />
            </button>
          </Tooltip>
        )}
      </div>
      {context && <div className="gt-header__context">{context}</div>}
      {actions && <div className="gt-header__right">{actions}</div>}
    </header>
  );
}

export function HeaderContextItem({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="gt-header__context-item">
      {icon}
      {children}
    </span>
  );
}

export function HeaderAvatarButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button type="text" size="small" onClick={onClick}>
      {label}
    </Button>
  );
}
