import type { Unidade } from "@/lib/types";
import { slugify } from "@/lib/utils/format";

const ESTADOS: Array<{ nome: string; uf: string; hasWarning?: boolean }> = [
  { nome: "Acre", uf: "AC", hasWarning: true },
  { nome: "Alagoas", uf: "AL" },
  { nome: "Amapá", uf: "AP" },
  { nome: "Amazonas", uf: "AM" },
  { nome: "Bahia", uf: "BA" },
  { nome: "Ceará", uf: "CE" },
  { nome: "Distrito Federal", uf: "DF" },
  { nome: "Espírito Santo", uf: "ES" },
  { nome: "Goiás", uf: "GO" },
  { nome: "Maranhão", uf: "MA" },
  { nome: "Mato Grosso", uf: "MT" },
  { nome: "Mato Grosso do Sul", uf: "MS" },
  { nome: "Minas Gerais", uf: "MG", hasWarning: true },
  { nome: "Pará", uf: "PA" },
  { nome: "Paraíba", uf: "PB" },
  { nome: "Paraná", uf: "PR" },
  { nome: "Pernambuco", uf: "PE" },
  { nome: "Piauí", uf: "PI" },
  { nome: "Rio de Janeiro", uf: "RJ" },
  { nome: "Rio Grande do Norte", uf: "RN" },
  { nome: "Rio Grande do Sul", uf: "RS" },
  { nome: "Rondônia", uf: "RO" },
  { nome: "Roraima", uf: "RR" },
  { nome: "Santa Catarina", uf: "SC" },
  { nome: "São Paulo", uf: "SP" },
  { nome: "Sergipe", uf: "SE" },
  { nome: "Tocantins", uf: "TO" },
];

export const unidades: Unidade[] = ESTADOS.map(({ nome, uf, hasWarning }) => ({
  id: slugify(nome),
  nome,
  abreviacao: uf,
  ...(hasWarning ? { hasWarning } : {}),
}));

export const defaultUnidadeId = unidades[0]!.id;
