import type { Parametros } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

function baseParametros(unidadeId: string): Parametros {
  return {
    unidadeId,
    jornada: {
      modelo: "8h",
      minutosAntes: 20,
      minutosDepois: 20,
      acordoAtual: {
        id: `${unidadeId}-acordo-2026`,
        nome: "Acordo Coletivo 2026 - Sindicato dos Comerciários.pdf",
        dataUpload: "2026-01-18",
        uploadPor: "Marco Santana",
      },
      acordosHistorico: [
        {
          id: `${unidadeId}-acordo-2025`,
          nome: "Acordo Coletivo 2025.pdf",
          dataUpload: "2025-02-04",
          uploadPor: "Marco Santana",
        },
        {
          id: `${unidadeId}-acordo-2024`,
          nome: "Acordo Coletivo 2024.pdf",
          dataUpload: "2024-02-10",
          uploadPor: "Larissa Camargo",
        },
      ],
    },
    almoco: {
      duracaoTotalMin: 60,
      duracaoMinimaMin: 30,
      janelaInicioMin: "11:30",
      janelaInicioMax: "14:00",
    },
    folgas: {
      diasFechados: ["dom"],
      folgaDomingoFrequencia: "1-em-4",
    },
    tolerancia: {
      pdvMinimo: 3,
      nivelServicoPct: 92,
      absenteismoPct: 6,
    },
  };
}

export const parametrosPorUnidade: Record<string, Parametros> = Object.fromEntries(
  unidades.map((u) => [u.id, baseParametros(u.id)] as const)
);

export function getParametros(unidadeId: string): Parametros {
  return parametrosPorUnidade[unidadeId] ?? baseParametros(unidadeId);
}
