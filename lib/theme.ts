import type { ThemeConfig } from "antd";

export const brandFontFamily =
  'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const lightTheme: ThemeConfig = {
  cssVar: { key: "gt" },
  hashed: true,
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorLink: "#1677ff",
    fontFamily: brandFontFamily,
    borderRadius: 6,
    fontSize: 14,
  },
};
