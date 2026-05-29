import type { PrevisaoDia } from "@/lib/types";
import { defaultUnidadeId } from "@/lib/mock/unidades";

function seedRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function basePrevisoes(unidadeId: string, year: number, month: number): PrevisaoDia[] {
  const rng = seedRandom(unidadeId.length * 100 + year * 12 + month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 4200_00 : 6500_00;
    const variance = Math.round((rng() - 0.5) * 1200_00);
    return {
      data: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      valorPrevistoCentavos: Math.max(0, base + variance),
    };
  });
}

export function getPrevisoes(
  unidadeId: string,
  year: number,
  month: number
): PrevisaoDia[] {
  // Somente a unidade padrão (Acre) possui dados; as demais ficam vazias.
  if (unidadeId !== defaultUnidadeId) return [];
  return basePrevisoes(unidadeId, year, month);
}
