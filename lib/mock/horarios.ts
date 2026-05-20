import type { DiaSemana, HorarioDia } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

const DIAS: DiaSemana[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

function baseHorarios(): HorarioDia[] {
  return DIAS.map<HorarioDia>((dia) => {
    if (dia === "dom") {
      return { dia, fechado: true, ranges: [] };
    }
    if (dia === "sab") {
      return {
        dia,
        fechado: false,
        ranges: [{ inicio: "09:00", fim: "13:00" }],
      };
    }
    return {
      dia,
      fechado: false,
      ranges: [{ inicio: "08:00", fim: "18:00" }],
    };
  });
}

export const horariosPorUnidade: Record<string, HorarioDia[]> = Object.fromEntries(
  unidades.map((u) => [u.id, baseHorarios()] as const)
);

export function getHorarios(unidadeId: string): HorarioDia[] {
  return horariosPorUnidade[unidadeId] ?? baseHorarios();
}

export const diasLabels: Record<DiaSemana, string> = {
  dom: "Domingo",
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
};
