import type { ThemeConfig } from "antd";

export const brandFontFamily =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const lightTheme: ThemeConfig = {
  cssVar: { key: "gt" },
  hashed: true,
  token: {
    colorPrimary: "#1375FA",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1375FA",
    colorLink: "#1375FA",
    fontFamily: brandFontFamily,
    borderRadius: 6,
    fontSize: 14,
  },
  components: {
    // gt-table--md fidelity: 48px rows, 12px inline padding (prototype)
    Table: {
      cellPaddingBlockMD: 13,
      cellPaddingInlineMD: 12,
    },
  },
};
