import type { Colaborador } from "@/lib/types";
import { unidades } from "@/lib/mock/unidades";

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

function build(unidadeId: string): Colaborador[] {
  return SEED.map<Colaborador>((s, index) => ({
    id: `${unidadeId}-colab-${index + 1}`,
    unidadeId,
    nome: s.nome,
    codigoOperador: s.codigoOperador,
    funcao: s.funcao,
    ultimaFolgaSemana: s.ultimaFolgaSemana,
    ultimaFolgaDomingo: s.ultimaFolgaDomingo,
    avatarColor: s.avatarColor,
    ativoParaEscala: s.ativo ?? true,
  }));
}

export const colaboradoresPorUnidade: Record<string, Colaborador[]> = Object.fromEntries(
  unidades.map((u) => [u.id, build(u.id)] as const)
);

export function getColaboradores(unidadeId: string): Colaborador[] {
  return colaboradoresPorUnidade[unidadeId] ?? [];
}
