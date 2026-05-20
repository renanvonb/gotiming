import type { Feriado } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

function baseFeriados(unidadeId: string): Feriado[] {
  return [
    {
      id: `${unidadeId}-fer-natal`,
      unidadeId,
      nome: "Natal",
      data: "2026-12-25",
      tipo: "nacional",
    },
    {
      id: `${unidadeId}-fer-ano-novo`,
      unidadeId,
      nome: "Confraternização Universal",
      data: "2026-01-01",
      tipo: "nacional",
    },
    {
      id: `${unidadeId}-fer-corpus`,
      unidadeId,
      nome: "Corpus Christi",
      data: "2026-06-04",
      tipo: "nacional",
      abertura: [{ inicio: "10:00", fim: "16:00" }],
    },
  ];
}

export const feriadosPorUnidade: Record<string, Feriado[]> = Object.fromEntries(
  unidades.map((u) => [u.id, baseFeriados(u.id)] as const)
);

export function getFeriados(unidadeId: string): Feriado[] {
  return feriadosPorUnidade[unidadeId] ?? [];
}

export type FeriadoNacionalImport = {
  id: string;
  nome: string;
  data: string;
  tipo: "nacional" | "estadual" | "municipal" | "evento";
};

export const feriadosNacionais2026: FeriadoNacionalImport[] = [
  { id: "ano-novo-2026", nome: "Confraternização Universal", data: "2026-01-01", tipo: "nacional" },
  { id: "carnaval-2026-1", nome: "Carnaval (segunda)", data: "2026-02-16", tipo: "nacional" },
  { id: "carnaval-2026-2", nome: "Carnaval (terça)", data: "2026-02-17", tipo: "nacional" },
  { id: "sexta-santa-2026", nome: "Sexta-feira Santa", data: "2026-04-03", tipo: "nacional" },
  { id: "pascoa-2026", nome: "Páscoa", data: "2026-04-05", tipo: "evento" },
  { id: "tiradentes-2026", nome: "Tiradentes", data: "2026-04-21", tipo: "nacional" },
  { id: "trabalho-2026", nome: "Dia do Trabalhador", data: "2026-05-01", tipo: "nacional" },
  { id: "maes-2026", nome: "Dia das Mães", data: "2026-05-10", tipo: "evento" },
  { id: "corpus-2026", nome: "Corpus Christi", data: "2026-06-04", tipo: "nacional" },
  { id: "namorados-2026", nome: "Dia dos Namorados", data: "2026-06-12", tipo: "evento" },
  { id: "copa-2026-abertura", nome: "Copa FIFA — abertura", data: "2026-06-11", tipo: "evento" },
  { id: "copa-2026-final", nome: "Copa FIFA — final", data: "2026-07-19", tipo: "evento" },
  { id: "independencia-2026", nome: "Independência", data: "2026-09-07", tipo: "nacional" },
  { id: "aparecida-2026", nome: "Nossa Senhora Aparecida", data: "2026-10-12", tipo: "nacional" },
  { id: "finados-2026", nome: "Finados", data: "2026-11-02", tipo: "nacional" },
  { id: "proclamacao-2026", nome: "Proclamação da República", data: "2026-11-15", tipo: "nacional" },
  { id: "natal-2026", nome: "Natal", data: "2026-12-25", tipo: "nacional" },
];
