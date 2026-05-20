"use client";

import { useState } from "react";
import { Sidebar, type SidebarMenuKey } from "@/components/shell/Sidebar";
import { SideMenu } from "@/components/shell/SideMenu";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [activeMenu, setActiveMenu] = useState<SidebarMenuKey | null>(null);

  return (
    <div className="gt-app">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <SideMenu active={activeMenu} onClose={() => setActiveMenu(null)} />
      <div className="gt-main">{children}</div>
    </div>
  );
}
