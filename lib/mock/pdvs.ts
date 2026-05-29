import type { Pdv, PdvOrientacao, PdvTipo } from "@/lib/types";
import { defaultUnidadeId } from "@/lib/mock/unidades";

type Seed = {
  codigoInterno: string;
  tipo: PdvTipo;
  orientacao: PdvOrientacao;
  ativo?: boolean;
};

const SEED: Seed[] = [
  { codigoInterno: "482", tipo: "Normal", orientacao: "Direita" },
  { codigoInterno: "317", tipo: "Normal", orientacao: "Direita" },
  { codigoInterno: "906", tipo: "Normal", orientacao: "Direita" },
  { codigoInterno: "154", tipo: "Rápido", orientacao: "Esquerda" },
  { codigoInterno: "273", tipo: "Rápido", orientacao: "Esquerda", ativo: false },
  { codigoInterno: "628", tipo: "Preferencial", orientacao: "Direita" },
  { codigoInterno: "741", tipo: "Normal", orientacao: "Esquerda" },
  { codigoInterno: "095", tipo: "Normal", orientacao: "Esquerda", ativo: false },
];

function build(unidadeId: string): Pdv[] {
  return SEED.map<Pdv>((s, i) => ({
    id: `${unidadeId}-pdv-${i + 1}`,
    unidadeId,
    posicao: i + 1,
    codigoInterno: s.codigoInterno,
    tipo: s.tipo,
    ordemAbertura: i + 1,
    orientacao: s.orientacao,
    ativoParaEscala: s.ativo ?? true,
  }));
}

// Somente a unidade padrão (Acre) possui dados; as demais ficam vazias.
export const pdvsPorUnidade: Record<string, Pdv[]> = {
  [defaultUnidadeId]: build(defaultUnidadeId),
};

export function getPdvs(unidadeId: string): Pdv[] {
  return pdvsPorUnidade[unidadeId] ?? [];
}
