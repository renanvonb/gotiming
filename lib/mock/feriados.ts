import type { Feriado, HorarioRange } from "@/lib/types";
import { defaultUnidadeId } from "@/lib/mock/unidades";

type Seed = {
  slug: string;
  nome: string;
  data: string;
  abertura?: HorarioRange[];
};

const SEED: Seed[] = [
  { slug: "ano-novo", nome: "Ano Novo", data: "2026-01-01" },
  { slug: "carnaval", nome: "Carnaval", data: "2026-02-17", abertura: [{ inicio: "10:00", fim: "18:00" }] },
  { slug: "sexta-santa", nome: "Sexta-feira Santa", data: "2026-04-03", abertura: [{ inicio: "08:00", fim: "20:00" }] },
  { slug: "tiradentes", nome: "Tiradentes", data: "2026-04-21", abertura: [{ inicio: "08:00", fim: "22:00" }] },
  { slug: "trabalho", nome: "Dia do Trabalho", data: "2026-05-01", abertura: [{ inicio: "10:00", fim: "16:00" }] },
  { slug: "corpus", nome: "Corpus Christi", data: "2026-06-04", abertura: [{ inicio: "10:00", fim: "18:00" }] },
  { slug: "independencia", nome: "Independência", data: "2026-09-07", abertura: [{ inicio: "08:00", fim: "22:00" }] },
  { slug: "aparecida", nome: "Nossa Sra Aparecida", data: "2026-10-12" },
  { slug: "finados", nome: "Finados", data: "2026-11-02", abertura: [{ inicio: "10:00", fim: "18:00" }] },
  { slug: "proclamacao", nome: "Proclamação", data: "2026-11-15", abertura: [{ inicio: "08:00", fim: "22:00" }] },
  { slug: "natal", nome: "Natal", data: "2026-12-25" },
];

function baseFeriados(unidadeId: string): Feriado[] {
  return SEED.map<Feriado>((s) => ({
    id: `${unidadeId}-fer-${s.slug}`,
    unidadeId,
    nome: s.nome,
    data: s.data,
    tipo: "nacional",
    abertura: s.abertura,
  }));
}

// Somente a unidade padrão (Acre) possui dados; as demais ficam vazias.
export const feriadosPorUnidade: Record<string, Feriado[]> = {
  [defaultUnidadeId]: baseFeriados(defaultUnidadeId),
};

export function getFeriados(unidadeId: string): Feriado[] {
  return feriadosPorUnidade[unidadeId] ?? [];
}

export type FeriadoNacionalKind =
  | "Feriado Nacional"
  | "Ponto Facultativo"
  | "Data Comemorativa"
  | "Jogo da Seleção Brasileira";

export type FeriadoNacionalImport = {
  id: string;
  nome: string;
  data: string; // ISO date
  kind: FeriadoNacionalKind;
};

export const feriadosNacionais2026: FeriadoNacionalImport[] = [
  { id: "ano-novo-2026", nome: "Confraternização Universal", data: "2026-01-01", kind: "Feriado Nacional" },
  { id: "carnaval-2026", nome: "Carnaval", data: "2026-02-17", kind: "Ponto Facultativo" },
  { id: "sexta-santa-2026", nome: "Sexta-feira Santa", data: "2026-04-03", kind: "Feriado Nacional" },
  { id: "pascoa-2026", nome: "Páscoa", data: "2026-04-05", kind: "Data Comemorativa" },
  { id: "tiradentes-2026", nome: "Tiradentes", data: "2026-04-21", kind: "Feriado Nacional" },
  { id: "trabalho-2026", nome: "Dia do Trabalho", data: "2026-05-01", kind: "Feriado Nacional" },
  { id: "corpus-2026", nome: "Corpus Christi", data: "2026-06-04", kind: "Ponto Facultativo" },
  { id: "fifa-marrocos-2026", nome: "Jogo Brasil × Marrocos — Copa do Mundo FIFA 2026", data: "2026-06-13", kind: "Jogo da Seleção Brasileira" },
  { id: "fifa-haiti-2026", nome: "Jogo Brasil × Haiti — Copa do Mundo FIFA 2026", data: "2026-06-19", kind: "Jogo da Seleção Brasileira" },
  { id: "fifa-escocia-2026", nome: "Jogo Brasil × Escócia — Copa do Mundo FIFA 2026", data: "2026-06-24", kind: "Jogo da Seleção Brasileira" },
  { id: "independencia-2026", nome: "Independência do Brasil", data: "2026-09-07", kind: "Feriado Nacional" },
  { id: "aparecida-2026", nome: "Nossa Senhora Aparecida", data: "2026-10-12", kind: "Feriado Nacional" },
  { id: "finados-2026", nome: "Finados", data: "2026-11-02", kind: "Feriado Nacional" },
  { id: "proclamacao-2026", nome: "Proclamação da República", data: "2026-11-15", kind: "Feriado Nacional" },
  { id: "consciencia-2026", nome: "Dia Nacional de Zumbi e da Consciência Negra", data: "2026-11-20", kind: "Feriado Nacional" },
  { id: "natal-2026", nome: "Natal", data: "2026-12-25", kind: "Feriado Nacional" },
];
