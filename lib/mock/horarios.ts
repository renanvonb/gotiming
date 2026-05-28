import type { DiaSemana, HorarioDia } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

const DIAS: DiaSemana[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

function baseHorarios(): HorarioDia[] {
  return DIAS.map<HorarioDia>((dia) => ({
    dia,
    fechado: true,
    ranges: [{ inicio: "", fim: "" }],
  }));
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
