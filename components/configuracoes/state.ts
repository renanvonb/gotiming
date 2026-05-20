import type { AreaConfig, ID } from "@/lib/types";

export type Overlay =
  | { kind: "none" }
  | { kind: "pdv-drawer"; pdvId?: ID }
  | { kind: "import-pdv-modal" }
  | { kind: "colab-drawer"; colabId?: ID }
  | { kind: "folgas-modal" }
  | { kind: "previsoes-import-modal" }
  | { kind: "feriado-drawer"; feriadoId?: ID }
  | { kind: "feriado-import-drawer" };

export interface ConfigState {
  unidadeAtivaId: ID;
  unidadeSearch: string;
  unidadesColapsadas: boolean;
  areaAtiva: AreaConfig;
  overlay: Overlay;
}

export type ConfigAction =
  | { type: "set-unidade"; id: ID }
  | { type: "set-unidade-search"; value: string }
  | { type: "toggle-unidades-colapsadas" }
  | { type: "set-area"; area: AreaConfig }
  | { type: "open-overlay"; overlay: Overlay }
  | { type: "close-overlay" };

export function configReducer(
  state: ConfigState,
  action: ConfigAction
): ConfigState {
  switch (action.type) {
    case "set-unidade":
      return { ...state, unidadeAtivaId: action.id };
    case "set-unidade-search":
      return { ...state, unidadeSearch: action.value };
    case "toggle-unidades-colapsadas":
      return { ...state, unidadesColapsadas: !state.unidadesColapsadas };
    case "set-area":
      return { ...state, areaAtiva: action.area };
    case "open-overlay":
      return { ...state, overlay: action.overlay };
    case "close-overlay":
      return { ...state, overlay: { kind: "none" } };
    default:
      return state;
  }
}

export function makeInitialState(
  unidadeId: ID,
  area: AreaConfig = "colaboradores"
): ConfigState {
  return {
    unidadeAtivaId: unidadeId,
    unidadeSearch: "",
    unidadesColapsadas: false,
    areaAtiva: area,
    overlay: { kind: "none" },
  };
}

export const AREAS: { key: AreaConfig; label: string }[] = [
  { key: "colaboradores", label: "Colaboradores" },
  { key: "pdv", label: "PDV" },
  { key: "horarios", label: "Horários de funcionamento" },
  { key: "feriados", label: "Feriados e dias especiais" },
  { key: "previsoes", label: "Previsões de venda" },
  { key: "parametros", label: "Parâmetros" },
];

export function parseArea(value: string | null | undefined): AreaConfig | null {
  if (!value) return null;
  if (AREAS.some((a) => a.key === value)) return value as AreaConfig;
  return null;
}
