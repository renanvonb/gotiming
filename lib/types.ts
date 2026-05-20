export type ID = string;

export type Unidade = {
  id: ID;
  nome: string;
  abreviacao?: string;
  hasWarning?: boolean;
};

export type Colaborador = {
  id: ID;
  unidadeId: ID;
  nome: string;
  cargo: string;
  matricula: string;
  avatarColor: string;
  ativoParaEscala: boolean;
};

export type PdvTipo = "Normal" | "Rápido" | "Preferencial";

export type Pdv = {
  id: ID;
  unidadeId: ID;
  nome: string;
  tipo: PdvTipo;
  ativoParaEscala: boolean;
  preferencial: boolean;
};

export type DiaSemana = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

export type HorarioRange = { inicio: string; fim: string };

export type HorarioDia = {
  dia: DiaSemana;
  fechado: boolean;
  ranges: HorarioRange[];
};

export type Feriado = {
  id: ID;
  unidadeId: ID;
  nome: string;
  data: string;
  tipo: "nacional" | "estadual" | "municipal" | "personalizado";
  abertura?: HorarioRange[];
};

export type PrevisaoDia = {
  data: string;
  valorPrevistoCentavos: number;
};

export type Parametros = {
  unidadeId: ID;
  jornada: {
    modelo: "6h" | "8h" | "44h-semanal" | "custom";
    customHoras?: number;
    minutosAntes: number;
    minutosDepois: number;
    acordoAtual?: {
      id: ID;
      nome: string;
      dataUpload: string;
      uploadPor: string;
    };
    acordosHistorico: {
      id: ID;
      nome: string;
      dataUpload: string;
      uploadPor: string;
    }[];
  };
  almoco: {
    duracaoTotalMin: number;
    duracaoMinimaMin: number;
    janelaInicioMin: string;
    janelaInicioMax: string;
  };
  folgas: {
    diasFechados: DiaSemana[];
    folgaDomingoFrequencia:
      | "1-em-4"
      | "1-em-5"
      | "1-em-6"
      | "1-em-7"
      | "1-em-8";
  };
  tolerancia: {
    pdvMinimo: number;
    nivelServicoPct: number;
    absenteismoPct: number;
  };
};

export type EscalaStatus = "rascunho" | "divulgada" | "em-revisao" | "encerrada";

export type EscalaSetor = "Caixa" | "Atendimento" | "Estoque";

export type Escala = {
  id: ID;
  nome: string;
  unidadeNome: string;
  setor: EscalaSetor;
  inicio: string;
  fim: string;
  status: EscalaStatus;
  modificadoEm: string;
  modificadoPor: string;
};

export type BlocoTipo = "trabalha" | "intervalo";

export type BlocoTimeline = {
  id: ID;
  inicioMin: number;
  fimMin: number;
  tipo: BlocoTipo;
};

export type LinhaTimeline = {
  id: ID;
  colaboradorNome: string;
  avatarColor: string;
  funcao: string;
  visualizadoEm?: string;
  blocos: BlocoTimeline[];
};

export type AreaConfig =
  | "colaboradores"
  | "pdv"
  | "horarios"
  | "feriados"
  | "previsoes"
  | "parametros";
