import type { Colaborador } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";
import { avatarColor } from "@/lib/utils/format";

const NOMES_POR_UNIDADE: Record<string, Array<{ nome: string; cargo: string; matricula: string; ativo?: boolean }>> = {
  acre: [
    { nome: "Marco Santana", cargo: "Operador de caixa", matricula: "MS-0142" },
    { nome: "Bruno Colato", cargo: "Operador de caixa", matricula: "BC-0233" },
    { nome: "Larissa Camargo", cargo: "Gerente de turno", matricula: "LC-0418" },
    { nome: "Hoberdan Engel", cargo: "Atendente", matricula: "HE-0512", ativo: false },
    { nome: "Patrícia Lemos", cargo: "Operadora de caixa", matricula: "PL-0617" },
    { nome: "Ricardo Tobias", cargo: "Atendente", matricula: "RT-0721" },
    { nome: "Juliana Reis", cargo: "Operadora de caixa", matricula: "JR-0824" },
    { nome: "Felipe Marques", cargo: "Estoquista", matricula: "FM-0907" },
  ],
};

function baseColaboradores(unidadeId: string): Colaborador[] {
  const list = NOMES_POR_UNIDADE[unidadeId] ?? [
    { nome: "Aline Pacheco", cargo: "Operadora de caixa", matricula: "AP-1001" },
    { nome: "Carlos Andrade", cargo: "Atendente", matricula: "CA-1014" },
    { nome: "Daniela Fonseca", cargo: "Operadora de caixa", matricula: "DF-1027" },
    { nome: "Eduardo Brito", cargo: "Estoquista", matricula: "EB-1033", ativo: false },
    { nome: "Fernanda Lima", cargo: "Gerente de turno", matricula: "FL-1041" },
  ];

  return list.map<Colaborador>((entry, index) => ({
    id: `${unidadeId}-colab-${index + 1}`,
    unidadeId,
    nome: entry.nome,
    cargo: entry.cargo,
    matricula: entry.matricula,
    avatarColor: avatarColor(entry.nome),
    ativoParaEscala: entry.ativo ?? true,
  }));
}

export const colaboradoresPorUnidade: Record<string, Colaborador[]> = Object.fromEntries(
  unidades.map((u) => [u.id, baseColaboradores(u.id)] as const)
);

export function getColaboradores(unidadeId: string): Colaborador[] {
  return colaboradoresPorUnidade[unidadeId] ?? [];
}
