import { useState } from "react";
import type { CSSProperties } from "react";
import { Sidebar, type SidebarMenuKey } from "@/components/shell/Sidebar";
import { SideMenu } from "@/components/shell/SideMenu";

interface AppShellProps {
  children: React.ReactNode;
}

const appStyle: CSSProperties = {
  height: "100vh",
  display: "flex",
  background: "var(--ant-color-bg-container)",
  overflow: "hidden",
};

const mainStyle: CSSProperties = {
  flex: 1,
  marginLeft: "var(--sidebar-width)",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  height: "100%",
};

export function AppShell({ children }: AppShellProps) {
  const [activeMenu, setActiveMenu] = useState<SidebarMenuKey | null>(null);

  return (
    <div style={appStyle}>
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <SideMenu active={activeMenu} onClose={() => setActiveMenu(null)} />
      <div style={mainStyle}>{children}</div>
    </div>
  );
}
