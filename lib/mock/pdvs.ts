import type { Pdv, PdvTipo } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

const TIPOS: PdvTipo[] = ["Normal", "Normal", "Normal", "Rápido", "Preferencial", "Normal", "Normal"];

function basePdvs(unidadeId: string): Pdv[] {
  return Array.from({ length: 7 }).map<Pdv>((_, i) => {
    const tipo = TIPOS[i] ?? "Normal";
    return {
      id: `${unidadeId}-pdv-${i + 1}`,
      unidadeId,
      nome: `PDV ${i + 1}`,
      tipo,
      ativoParaEscala: i !== 5,
      preferencial: tipo === "Preferencial",
    };
  });
}

export const pdvsPorUnidade: Record<string, Pdv[]> = Object.fromEntries(
  unidades.map((u) => [u.id, basePdvs(u.id)] as const)
);

export function getPdvs(unidadeId: string): Pdv[] {
  return pdvsPorUnidade[unidadeId] ?? [];
}
