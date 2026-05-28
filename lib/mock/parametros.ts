import type { Parametros } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

function baseParametros(unidadeId: string): Parametros {
  return {
    unidadeId,
    jornada: {
      contratoMode: "combinado",
      contratos: [
        { tipo: "7:20", horasSemana: 36, habilitado: true, pct: 30 },
        { tipo: "6:00", horasSemana: 30, habilitado: true, pct: 40 },
        { tipo: "5:00", horasSemana: 25, habilitado: true, pct: 30 },
        { tipo: "4:00", horasSemana: 20, habilitado: false, pct: 0 },
      ],
      intervaloPre: true,
      intervaloPos: false,
      acordoAtual: {
        id: `${unidadeId}-acordo-2025`,
        nome: "acordo-2025.pdf",
        dataUpload: "2025-03-12",
        uploadPor: "Marco Santana",
      },
      acordosHistorico: [
        {
          id: `${unidadeId}-acordo-2024`,
          nome: "acordo-2024.pdf",
          dataUpload: "2024-03-10",
          uploadPor: "Bruno Colato",
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
      diasFolga: ["dom"],
      aosDomingos: "1x1",
    },
    tolerancia: {
      pdvMinimo: 2,
      nivelServicoPct: 90,
      absenteismoPct: 5,
    },
  };
}

export const parametrosPorUnidade: Record<string, Parametros> = Object.fromEntries(
  unidades.map((u) => [u.id, baseParametros(u.id)] as const)
);

export function getParametros(unidadeId: string): Parametros {
  return parametrosPorUnidade[unidadeId] ?? baseParametros(unidadeId);
}
