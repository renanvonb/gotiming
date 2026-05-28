import { Button, Tooltip } from "antd";
import { ArrowLeftIcon, EditIcon, StarIcon } from "@/components/icons";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useHover } from "@/lib/hooks/useHover";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

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

const styles: Record<string, CSSProperties> = {
  header: {
    height: "var(--header-height)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 var(--content-pad-right) 0 var(--content-pad-left)",
    background: "var(--ant-color-bg-container)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    flex: "1 1 auto",
    overflow: "hidden",
  },
  backBase: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    borderRadius: 6,
    color: "var(--ant-color-text-secondary)",
    marginLeft: -6,
  },
  moduleIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "rgba(19, 117, 250, 0.1)",
    color: "var(--goapice-brand-blue)",
    display: "grid",
    placeItems: "center",
    flex: "none",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: "var(--ant-color-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0,
    flex: "0 1 auto",
    margin: 0,
  },
  iconBtnBase: {
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text-tertiary)",
    borderRadius: 6,
    transition:
      "color var(--ant-motion-duration-fast), background var(--ant-motion-duration-fast)",
  },
  iconBtnHover: {
    background: "var(--ant-color-fill-tertiary)",
    color: "var(--ant-color-text-secondary)",
  },
  favActive: {
    color: "var(--ant-gold)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
  },
  context: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    fontSize: "var(--ant-font-size)",
    color: "var(--ant-color-text-secondary)",
    marginRight: 8,
  },
  contextItem: {
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
};

function BackButton({ onClick }: { onClick: () => void }) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title="Voltar">
      <button
        type="button"
        style={{
          ...styles.backBase,
          ...(hovered ? { background: "var(--ant-color-fill-tertiary)" } : null),
        }}
        onClick={onClick}
        aria-label="Voltar"
        {...handlers}
      >
        <ArrowLeftIcon size={18} />
      </button>
    </Tooltip>
  );
}

function EditButton() {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title="Renomear">
      <button
        type="button"
        style={{ ...styles.iconBtnBase, ...(hovered ? styles.iconBtnHover : null) }}
        aria-label="Renomear"
        {...handlers}
      >
        <EditIcon size={16} />
      </button>
    </Tooltip>
  );
}

function FavButton({
  favorited,
  onToggle,
}: {
  favorited: boolean;
  onToggle: () => void;
}) {
  const [hovered, handlers] = useHover();
  return (
    <Tooltip title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
      <button
        type="button"
        style={{
          ...styles.iconBtnBase,
          ...(hovered ? styles.iconBtnHover : null),
          ...(favorited ? styles.favActive : null),
        }}
        onClick={onToggle}
        aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={favorited}
        {...handlers}
      >
        <StarIcon
          size={16}
          fill={favorited ? "var(--ant-gold)" : "none"}
        />
      </button>
    </Tooltip>
  );
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
  const navigate = useNavigate();
  const showContext = useMediaQuery("(min-width: 1280px)");

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {showBack && <BackButton onClick={() => navigate(-1)} />}
        {moduleIcon && <span style={styles.moduleIcon}>{moduleIcon}</span>}
        <h1 style={styles.title}>{title}</h1>
        {showEdit && <EditButton />}
        {onToggleFavorite && (
          <FavButton favorited={favorited} onToggle={onToggleFavorite} />
        )}
      </div>
      {context && showContext && <div style={styles.context}>{context}</div>}
      {actions && <div style={styles.right}>{actions}</div>}
    </header>
  );
}

export function HeaderContextItem({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span style={styles.contextItem}>
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
