import type { Colaborador } from "@/lib/types";
import { defaultUnidadeId } from "@/lib/mock/unidades";

type Seed = {
  nome: string;
  codigoOperador: number;
  funcao: string;
  ultimaFolgaSemana: string;
  ultimaFolgaDomingo: string;
  avatarColor: string;
  ativo?: boolean;
};

const SEED: Seed[] = [
  { nome: "Bruno Colato", codigoOperador: 641, funcao: "Designer de produto", ultimaFolgaSemana: "2026-05-18", ultimaFolgaDomingo: "2026-05-12", avatarColor: "var(--gt-avatar-bg-orange)" },
  { nome: "Cláudio Fernando Maciel", codigoOperador: 375, funcao: "Gestor de desenvolvimento", ultimaFolgaSemana: "2026-05-15", ultimaFolgaDomingo: "2026-05-05", avatarColor: "var(--gt-avatar-bg-green)" },
  { nome: "Felipe Braga", codigoOperador: 9446, funcao: "Desenvolvedor front-end", ultimaFolgaSemana: "2026-05-12", ultimaFolgaDomingo: "2026-04-28", avatarColor: "var(--gt-avatar-bg-blue)" },
  { nome: "Genuir Casagrande", codigoOperador: 9214, funcao: "Gestor de integrações", ultimaFolgaSemana: "2026-05-16", ultimaFolgaDomingo: "2026-04-21", avatarColor: "var(--gt-avatar-bg-magenta)" },
  { nome: "Gustavo Westhauser", codigoOperador: 3791, funcao: "Designer de produto", ultimaFolgaSemana: "2026-05-13", ultimaFolgaDomingo: "2026-05-12", avatarColor: "var(--gt-avatar-bg-gold)" },
  { nome: "Hoberdan Engel", codigoOperador: 9334, funcao: "Diretor de tecnologia", ultimaFolgaSemana: "2026-05-17", ultimaFolgaDomingo: "2026-05-05", avatarColor: "var(--gt-avatar-bg-gray)", ativo: false },
  { nome: "Ivan Carlos Martello", codigoOperador: 5589, funcao: "Desenvolvedor back-end", ultimaFolgaSemana: "2026-05-14", ultimaFolgaDomingo: "2026-04-28", avatarColor: "var(--gt-avatar-bg-cyan)" },
  { nome: "Junior Martins", codigoOperador: 7124, funcao: "Desenvolvedor front-end", ultimaFolgaSemana: "2026-05-18", ultimaFolgaDomingo: "2026-04-21", avatarColor: "var(--gt-avatar-bg-purple)" },
  { nome: "Leandro Hermes", codigoOperador: 805, funcao: "Tech lead", ultimaFolgaSemana: "2026-05-15", ultimaFolgaDomingo: "2026-05-12", avatarColor: "var(--gt-avatar-bg-red)" },
  { nome: "Marcelo Almeida", codigoOperador: 1532, funcao: "Desenvolvedor back-end", ultimaFolgaSemana: "2026-05-12", ultimaFolgaDomingo: "2026-05-05", avatarColor: "var(--gt-avatar-bg-orange)" },
  { nome: "Marco Santana", codigoOperador: 891, funcao: "Desenvolvedor front-end", ultimaFolgaSemana: "2026-05-16", ultimaFolgaDomingo: "2026-04-28", avatarColor: "var(--gt-avatar-bg-green)" },
  { nome: "Mateus Ritter", codigoOperador: 631, funcao: "Qualidade", ultimaFolgaSemana: "2026-05-13", ultimaFolgaDomingo: "2026-04-21", avatarColor: "var(--gt-avatar-bg-blue)" },
  { nome: "Michel Henrique Chibechinski", codigoOperador: 5841, funcao: "Qualidade", ultimaFolgaSemana: "2026-05-17", ultimaFolgaDomingo: "2026-05-12", avatarColor: "var(--gt-avatar-bg-magenta)" },
  { nome: "Renan Von Borstel", codigoOperador: 2938, funcao: "Designer de produto", ultimaFolgaSemana: "2026-05-14", ultimaFolgaDomingo: "2026-05-05", avatarColor: "var(--gt-avatar-bg-gold)" },
  { nome: "Roberto Perrotti Filho", codigoOperador: 4179, funcao: "Devops", ultimaFolgaSemana: "2026-05-18", ultimaFolgaDomingo: "2026-04-28", avatarColor: "var(--gt-avatar-bg-gray)", ativo: false },
  { nome: "Suzana de Oliveira", codigoOperador: 1693, funcao: "Suporte técnico", ultimaFolgaSemana: "2026-05-15", ultimaFolgaDomingo: "2026-04-21", avatarColor: "var(--gt-avatar-bg-cyan)" },
  { nome: "William Borba", codigoOperador: 6336, funcao: "Desenvolvedor mobile", ultimaFolgaSemana: "2026-05-12", ultimaFolgaDomingo: "2026-05-12", avatarColor: "var(--gt-avatar-bg-purple)" },
];

// Modelos de contrato: tipo (jornada diária) + horas semanais correspondentes.
export const MODELOS_CONTRATO = [
  { tipo: "7:20", horasSemana: 36 },
  { tipo: "6:00", horasSemana: 30 },
  { tipo: "5:00", horasSemana: 25 },
  { tipo: "4:00", horasSemana: 20 },
] as const;

export function horasDoModelo(tipo: string): number | undefined {
  return MODELOS_CONTRATO.find((m) => m.tipo === tipo)?.horasSemana;
}

function build(unidadeId: string): Colaborador[] {
  return SEED.map<Colaborador>((s, index) => ({
    id: `${unidadeId}-colab-${index + 1}`,
    unidadeId,
    nome: s.nome,
    codigoOperador: s.codigoOperador,
    funcao: s.funcao,
    modeloContrato: MODELOS_CONTRATO[index % MODELOS_CONTRATO.length]!.tipo,
    ultimaFolgaSemana: s.ultimaFolgaSemana,
    ultimaFolgaDomingo: s.ultimaFolgaDomingo,
    avatarColor: s.avatarColor,
    ativoParaEscala: s.ativo ?? true,
  }));
}

// Somente a unidade padrão (Acre) possui dados; as demais ficam vazias.
export const colaboradoresPorUnidade: Record<string, Colaborador[]> = {
  [defaultUnidadeId]: build(defaultUnidadeId),
};

export function getColaboradores(unidadeId: string): Colaborador[] {
  return colaboradoresPorUnidade[unidadeId] ?? [];
}
