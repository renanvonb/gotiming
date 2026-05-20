const currencyBR = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(centavos: number): string {
  return currencyBR.format(centavos / 100);
}

export function formatCurrencyShort(centavos: number): string {
  const reais = centavos / 100;
  return reais.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const avatarPalette = [
  "#722ed1",
  "#13c2c2",
  "#fa8c16",
  "#52c41a",
  "#eb2f96",
  "#1677ff",
  "#fa541c",
  "#2f54eb",
  "#a0d911",
  "#faad14",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length] as string;
}

export function initialsOf(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}
