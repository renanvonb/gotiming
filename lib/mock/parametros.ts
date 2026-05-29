import type { Parametros } from "@/lib/types";
import { defaultUnidadeId } from "@/lib/mock/unidades";

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

// Parâmetros padrão/vazios para unidades ainda não configuradas.
function defaultParametros(unidadeId: string): Parametros {
  return {
    unidadeId,
    jornada: {
      contratoMode: "combinado",
      contratos: [
        { tipo: "7:20", horasSemana: 36, habilitado: false, pct: 0 },
        { tipo: "6:00", horasSemana: 30, habilitado: false, pct: 0 },
        { tipo: "5:00", horasSemana: 25, habilitado: false, pct: 0 },
        { tipo: "4:00", horasSemana: 20, habilitado: false, pct: 0 },
      ],
      intervaloPre: false,
      intervaloPos: false,
      acordoAtual: undefined,
      acordosHistorico: [],
    },
    almoco: {
      duracaoTotalMin: 60,
      duracaoMinimaMin: 30,
      janelaInicioMin: "11:30",
      janelaInicioMax: "14:00",
    },
    folgas: {
      diasFolga: [],
      aosDomingos: "1x1",
    },
    tolerancia: {
      pdvMinimo: 0,
      nivelServicoPct: 0,
      absenteismoPct: 0,
    },
  };
}

// Somente a unidade padrão (Acre) possui dados; as demais usam o padrão.
export const parametrosPorUnidade: Record<string, Parametros> = {
  [defaultUnidadeId]: baseParametros(defaultUnidadeId),
};

export function getParametros(unidadeId: string): Parametros {
  return parametrosPorUnidade[unidadeId] ?? defaultParametros(unidadeId);
}
