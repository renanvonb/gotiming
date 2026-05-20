import type { Escala, LinhaTimeline } from "@/lib/types";
import { avatarColor } from "@/lib/utils/format";

export const escalas: Escala[] = [
  {
    id: "escala-de-novembro",
    nome: "Escala de novembro",
    unidadeNome: "Goapice",
    setor: "Caixa",
    inicio: "2026-11-01",
    fim: "2026-11-30",
    status: "divulgada",
    modificadoEm: "2026-05-15T09:42:00",
    modificadoPor: "Ana Souza",
  },
  {
    id: "escala-de-dezembro",
    nome: "Escala de dezembro",
    unidadeNome: "Goapice",
    setor: "Caixa",
    inicio: "2026-12-01",
    fim: "2026-12-31",
    status: "rascunho",
    modificadoEm: "2026-05-14T16:18:00",
    modificadoPor: "Bruno Lima",
  },
  {
    id: "escala-feriado-prolongado",
    nome: "Escala feriado prolongado",
    unidadeNome: "Goapice · Unidade Sul",
    setor: "Atendimento",
    inicio: "2026-04-20",
    fim: "2026-04-24",
    status: "encerrada",
    modificadoEm: "2026-05-10T11:05:00",
    modificadoPor: "Camila Pires",
  },
  {
    id: "escala-de-outubro",
    nome: "Escala de outubro",
    unidadeNome: "Goapice",
    setor: "Caixa",
    inicio: "2026-10-01",
    fim: "2026-10-31",
    status: "encerrada",
    modificadoEm: "2026-05-05T14:30:00",
    modificadoPor: "Diego Castro",
  },
  {
    id: "escala-janeiro-2027",
    nome: "Escala janeiro 2027",
    unidadeNome: "Goapice",
    setor: "Estoque",
    inicio: "2027-01-01",
    fim: "2027-01-31",
    status: "rascunho",
    modificadoEm: "2026-05-02T08:22:00",
    modificadoPor: "Eduarda Rocha",
  },
  {
    id: "escala-semana-santa",
    nome: "Escala semana santa",
    unidadeNome: "Goapice · Unidade Sul",
    setor: "Atendimento",
    inicio: "2026-03-30",
    fim: "2026-04-05",
    status: "encerrada",
    modificadoEm: "2026-04-28T17:55:00",
    modificadoPor: "Felipe Nunes",
  },
  {
    id: "escala-black-friday",
    nome: "Escala black friday",
    unidadeNome: "Goapice",
    setor: "Caixa",
    inicio: "2026-11-27",
    fim: "2026-11-30",
    status: "em-revisao",
    modificadoEm: "2026-04-25T10:14:00",
    modificadoPor: "Gabriela Mota",
  },
];

export function getEscala(id: string): Escala | undefined {
  return escalas.find((e) => e.id === id);
}

const NOMES_TIMELINE = [
  { nome: "Bruno Colato", funcao: "Operador caixa", visualizado: "2026-05-18" },
  { nome: "Cláudio Fernando Maciel", funcao: "Operador caixa", visualizado: "2026-05-18" },
  { nome: "Felipe Braga", funcao: "Operador caixa", visualizado: "2026-05-17" },
  { nome: "Larissa Camargo", funcao: "Gerente de turno", visualizado: "2026-05-18" },
  { nome: "Marco Santana", funcao: "Operador caixa", visualizado: "2026-05-18" },
  { nome: "Patrícia Lemos", funcao: "Operadora caixa", visualizado: "2026-05-16" },
  { nome: "Ricardo Tobias", funcao: "Atendente", visualizado: "2026-05-18" },
  { nome: "Juliana Reis", funcao: "Operadora caixa", visualizado: "2026-05-17" },
  { nome: "Felipe Marques", funcao: "Estoquista", visualizado: "2026-05-15" },
  { nome: "Hoberdan Engel", funcao: "Atendente", visualizado: "2026-05-13" },
  { nome: "Suzana de Oliveira", funcao: "Operadora caixa" },
  { nome: "Aline Pacheco", funcao: "Operadora caixa", visualizado: "2026-05-18" },
  { nome: "Carlos Andrade", funcao: "Atendente", visualizado: "2026-05-18" },
  { nome: "Daniela Fonseca", funcao: "Operadora caixa", visualizado: "2026-05-17" },
  { nome: "Eduardo Brito", funcao: "Estoquista", visualizado: "2026-05-12" },
  { nome: "Fernanda Lima", funcao: "Gerente de turno", visualizado: "2026-05-18" },
  { nome: "Gabriel Tavares", funcao: "Operador caixa", visualizado: "2026-05-18" },
];

const PADROES: Array<{ inicio: number; fim: number; intervaloInicio: number; intervaloFim: number }> = [
  { inicio: 8 * 60, fim: 18 * 60, intervaloInicio: 12 * 60, intervaloFim: 13 * 60 + 20 },
  { inicio: 8 * 60, fim: 18 * 60, intervaloInicio: 12 * 60 + 20, intervaloFim: 13 * 60 + 40 },
  { inicio: 9 * 60, fim: 18 * 60, intervaloInicio: 12 * 60, intervaloFim: 13 * 60 },
  { inicio: 9 * 60, fim: 19 * 60, intervaloInicio: 13 * 60, intervaloFim: 14 * 60 },
  { inicio: 10 * 60, fim: 20 * 60, intervaloInicio: 13 * 60, intervaloFim: 14 * 60 },
  { inicio: 14 * 60, fim: 22 * 60, intervaloInicio: 17 * 60, intervaloFim: 18 * 60 },
];

export function getLinhasTimeline(): LinhaTimeline[] {
  return NOMES_TIMELINE.map((entry, i) => {
    const padrao = PADROES[i % PADROES.length]!;
    return {
      id: `timeline-${i}`,
      colaboradorNome: entry.nome,
      avatarColor: avatarColor(entry.nome),
      funcao: entry.funcao,
      ...(entry.visualizado ? { visualizadoEm: entry.visualizado } : {}),
      blocos: [
        {
          id: `${i}-t1`,
          inicioMin: padrao.inicio,
          fimMin: padrao.intervaloInicio,
          tipo: "trabalha",
        },
        {
          id: `${i}-int`,
          inicioMin: padrao.intervaloInicio,
          fimMin: padrao.intervaloFim,
          tipo: "intervalo",
        },
        {
          id: `${i}-t2`,
          inicioMin: padrao.intervaloFim,
          fimMin: padrao.fim,
          tipo: "trabalha",
        },
      ],
    };
  });
}

export const STATUS_LABEL: Record<Escala["status"], string> = {
  rascunho: "Rascunho",
  divulgada: "Divulgada",
  "em-revisao": "Em revisão",
  encerrada: "Encerrada",
};

export const STATUS_COLOR: Record<Escala["status"], string> = {
  rascunho: "processing",
  divulgada: "success",
  "em-revisao": "warning",
  encerrada: "default",
};
