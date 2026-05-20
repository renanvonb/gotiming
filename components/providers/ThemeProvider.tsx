"use client";

import { App, ConfigProvider, theme as antdTheme } from "antd";
import ptBR from "antd/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { lightTheme } from "@/lib/theme";

dayjs.locale("pt-br");

type Mode = "light" | "dark";

interface ThemeModeContextValue {
  mode: Mode;
  toggle: () => void;
  setMode: (mode: Mode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const STORAGE_KEY = "gotime-theme-mode";

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("light");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (stored === "light" || stored === "dark") {
        setModeState(stored);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const theme = useMemo(
    () => ({
      ...lightTheme,
      algorithm:
        mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    }),
    [mode]
  );

  const value = useMemo(
    () => ({ mode, toggle, setMode }),
    [mode, toggle, setMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider locale={ptBR} theme={theme}>
        <App>{children}</App>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}
