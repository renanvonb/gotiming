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
  codigoOperador: number;
  funcao: string;
  modeloContrato: string; // ex.: "7:20 · 36h semanais"
  ultimaFolgaSemana: string; // ISO date
  ultimaFolgaDomingo: string; // ISO date
  avatarColor: string; // pastel token, e.g. "var(--gt-avatar-bg-orange)"
  ativoParaEscala: boolean;
};

export type PdvTipo = "Normal" | "Rápido" | "Preferencial";

export type PdvOrientacao = "Direita" | "Esquerda";

export type Pdv = {
  id: ID;
  unidadeId: ID;
  posicao: number; // 1..N, exibido como "01"
  codigoInterno: string; // "482", "095"
  tipo: PdvTipo;
  ordemAbertura: number; // 1..N, exibido como "1º"
  orientacao: PdvOrientacao;
  ativoParaEscala: boolean;
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

export type ContratoTipo = "7:20" | "6:00" | "5:00" | "4:00";

export type ContratoDistribuicao = {
  tipo: ContratoTipo;
  horasSemana: number; // 36, 30, 25, 20
  habilitado: boolean;
  pct: number;
};

export type AcordoDoc = {
  id: ID;
  nome: string;
  dataUpload: string; // ISO date
  uploadPor: string;
};

export type Parametros = {
  unidadeId: ID;
  jornada: {
    contratoMode: "unico" | "combinado";
    contratos: ContratoDistribuicao[];
    intervaloPre: boolean; // "Considerar 20 minutos pré-jornada"
    intervaloPos: boolean; // "Considerar 20 minutos pós-jornada"
    acordoAtual?: AcordoDoc;
    acordosHistorico: AcordoDoc[];
  };
  almoco: {
    duracaoTotalMin: number;
    duracaoMinimaMin: number;
    janelaInicioMin: string;
    janelaInicioMax: string;
  };
  folgas: {
    diasFolga: DiaSemana[];
    aosDomingos: "todo" | "1x1" | "2x1" | "3x1";
  };
  tolerancia: {
    pdvMinimo: number;
    nivelServicoPct: number;
    absenteismoPct: number;
  };
};

export type EscalaStatus = "rascunho" | "divulgada" | "em-revisao" | "encerrada";

export type EscalaSetor = "Caixa" | "Atendimento" | "Estoque" | "Cozinha";

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
