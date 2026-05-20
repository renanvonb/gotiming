"use client";

import {
  Button,
  Checkbox,
  InputNumber,
  Radio,
  TimePicker,
  Tooltip,
  Upload,
  App,
  Popconfirm,
} from "antd";
import type { CheckboxProps, RadioChangeEvent } from "antd";
import {
  CircleChevronLeftIcon,
  DeleteIcon,
  DownloadIcon,
  FilePdfIcon,
  InboxIcon,
  InfoIcon,
} from "@/components/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { DiaSemana, Parametros } from "@/lib/types";
import { diasLabels } from "@/lib/mock/horarios";
import { getParametros } from "@/lib/mock/parametros";

interface ParametrosPanelProps {
  unidadeId: string;
  onOpenFolgas: () => void;
}

const FORMAT_TIME = "HH:mm";
const DIAS: DiaSemana[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export function ParametrosPanel({ unidadeId, onOpenFolgas }: ParametrosPanelProps) {
  const { message } = App.useApp();
  const [data, setData] = useState<Parametros>(() => getParametros(unidadeId));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setData(getParametros(unidadeId));
  }, [unidadeId]);

  const isCollapsed = (key: string) => collapsed[key] ?? false;
  const toggle = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const handleDiaChange = (dia: DiaSemana): CheckboxProps["onChange"] => (e) => {
    const checked = e.target.checked;
    setData((d) => ({
      ...d,
      folgas: {
        ...d.folgas,
        diasFechados: checked
          ? Array.from(new Set([...d.folgas.diasFechados, dia]))
          : d.folgas.diasFechados.filter((x) => x !== dia),
      },
    }));
  };

  return (
    <div className="cfg__params" style={{ padding: 16 }}>
      <div className="cfg__params-grid">
        <Section
          id="jornada"
          title="Jornada de trabalho"
          collapsed={isCollapsed("jornada")}
          onToggle={() => toggle("jornada")}
        >
          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">
              Modelo de jornada
              <Tooltip title="Modelo padrão aplicado aos colaboradores desta unidade.">
                <span className="cfg__params-info">
                  <InfoIcon />
                </span>
              </Tooltip>
            </h3>
            <Radio.Group
              value={data.jornada.modelo}
              onChange={(e: RadioChangeEvent) =>
                setData((d) => ({ ...d, jornada: { ...d.jornada, modelo: e.target.value } }))
              }
            >
              <div className="cfg__params-stack">
                <Radio value="6h">6h diárias</Radio>
                <Radio value="8h">8h diárias</Radio>
                <Radio value="44h-semanal">44h semanais</Radio>
                <Radio value="custom">Personalizado</Radio>
              </div>
            </Radio.Group>
          </div>

          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Pré e pós-jornada</h3>
            <div className="cfg__params-grid2">
              <div className="cfg__params-field">
                <label className="cfg__params-label">Antes (min)</label>
                <InputNumber
                  min={0}
                  max={120}
                  value={data.jornada.minutosAntes}
                  onChange={(v) =>
                    setData((d) => ({ ...d, jornada: { ...d.jornada, minutosAntes: v ?? 0 } }))
                  }
                />
              </div>
              <div className="cfg__params-field">
                <label className="cfg__params-label">Depois (min)</label>
                <InputNumber
                  min={0}
                  max={120}
                  value={data.jornada.minutosDepois}
                  onChange={(v) =>
                    setData((d) => ({ ...d, jornada: { ...d.jornada, minutosDepois: v ?? 0 } }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Acordo coletivo</h3>
            <Upload.Dragger
              multiple={false}
              accept=".pdf,.doc,.docx"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => {
                message.success("Acordo enviado (mock)");
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxIcon />
              </p>
              <p className="ant-upload-text">Arraste o PDF ou clique para enviar</p>
              <p className="ant-upload-hint">PDF, DOC ou DOCX, até 10MB.</p>
            </Upload.Dragger>

            {data.jornada.acordoAtual && (
              <ul className="cfg__params-history">
                <li className="cfg__params-history__item">
                  <span className="cfg__params-history__icon">
                    <FilePdfIcon />
                  </span>
                  <div className="cfg__params-history__info">
                    <span className="cfg__params-history__name">
                      {data.jornada.acordoAtual.nome}
                      <span style={{ color: "var(--ant-color-success)", fontSize: 12, fontWeight: 500 }}>
                        Vigente
                      </span>
                    </span>
                    <span className="cfg__params-history__meta">
                      {dayjs(data.jornada.acordoAtual.dataUpload).format("DD/MM/YYYY")} —{" "}
                      {data.jornada.acordoAtual.uploadPor}
                    </span>
                  </div>
                  <div className="cfg__params-history__actions">
                    <Tooltip title="Baixar">
                      <Button type="text" icon={<DownloadIcon />} size="small" />
                    </Tooltip>
                  </div>
                </li>
                {data.jornada.acordosHistorico.map((a) => (
                  <li key={a.id} className="cfg__params-history__item">
                    <span className="cfg__params-history__icon">
                      <FilePdfIcon />
                    </span>
                    <div className="cfg__params-history__info">
                      <span className="cfg__params-history__name">{a.nome}</span>
                      <span className="cfg__params-history__meta">
                        {dayjs(a.dataUpload).format("DD/MM/YYYY")} — {a.uploadPor}
                      </span>
                    </div>
                    <div className="cfg__params-history__actions">
                      <Tooltip title="Baixar">
                        <Button type="text" icon={<DownloadIcon />} size="small" />
                      </Tooltip>
                      <Popconfirm
                        title="Excluir acordo"
                        description="Essa ação é permanente."
                        okText="Excluir"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" icon={<DeleteIcon />} size="small" danger />
                      </Popconfirm>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <Section
          id="almoco"
          title="Almoço"
          collapsed={isCollapsed("almoco")}
          onToggle={() => toggle("almoco")}
        >
          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Duração</h3>
            <div className="cfg__params-grid2">
              <div className="cfg__params-field">
                <label className="cfg__params-label">Duração total</label>
                <TimePicker
                  value={dayjs()
                    .startOf("day")
                    .add(data.almoco.duracaoTotalMin, "minute")}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: {
                        ...d.almoco,
                        duracaoTotalMin: v.hour() * 60 + v.minute(),
                      },
                    }))
                  }
                />
              </div>
              <div className="cfg__params-field">
                <label className="cfg__params-label">Duração mínima</label>
                <TimePicker
                  value={dayjs()
                    .startOf("day")
                    .add(data.almoco.duracaoMinimaMin, "minute")}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: {
                        ...d.almoco,
                        duracaoMinimaMin: v.hour() * 60 + v.minute(),
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Janela de início</h3>
            <div className="cfg__params-grid2">
              <div className="cfg__params-field">
                <label className="cfg__params-label">Mínimo</label>
                <TimePicker
                  value={dayjs(data.almoco.janelaInicioMin, FORMAT_TIME)}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, janelaInicioMin: v.format(FORMAT_TIME) },
                    }))
                  }
                />
              </div>
              <div className="cfg__params-field">
                <label className="cfg__params-label">Máximo</label>
                <TimePicker
                  value={dayjs(data.almoco.janelaInicioMax, FORMAT_TIME)}
                  format={FORMAT_TIME}
                  showNow={false}
                  allowClear={false}
                  onChange={(v) =>
                    v &&
                    setData((d) => ({
                      ...d,
                      almoco: { ...d.almoco, janelaInicioMax: v.format(FORMAT_TIME) },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="folgas"
          title="Folgas"
          collapsed={isCollapsed("folgas")}
          onToggle={() => toggle("folgas")}
        >
          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Dias fechados</h3>
            <div className="cfg__params-checks">
              {DIAS.map((d) => (
                <Checkbox
                  key={d}
                  checked={data.folgas.diasFechados.includes(d)}
                  onChange={handleDiaChange(d)}
                >
                  {diasLabels[d]}
                </Checkbox>
              ))}
            </div>
          </div>

          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Folga aos domingos</h3>
            <Radio.Group
              value={data.folgas.folgaDomingoFrequencia}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  folgas: { ...d.folgas, folgaDomingoFrequencia: e.target.value },
                }))
              }
            >
              <div className="cfg__params-stack">
                <Radio value="1-em-4">1 a cada 4 semanas</Radio>
                <Radio value="1-em-5">1 a cada 5 semanas</Radio>
                <Radio value="1-em-6">1 a cada 6 semanas</Radio>
                <Radio value="1-em-7">1 a cada 7 semanas</Radio>
                <Radio value="1-em-8">1 a cada 8 semanas</Radio>
              </div>
            </Radio.Group>
          </div>

          <div className="cfg__params-foot">
            <Button type="link" onClick={onOpenFolgas}>
              Editar folgas individuais…
            </Button>
          </div>
        </Section>

        <Section
          id="tolerancia"
          title="Tolerância"
          collapsed={isCollapsed("tolerancia")}
          onToggle={() => toggle("tolerancia")}
        >
          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Indicadores atuais</h3>
            <div className="cfg__params-statgrid">
              <div className="cfg__params-statcard">
                <span className="cfg__params-statcard__value cfg__params-statcard__value--blue">
                  {data.tolerancia.pdvMinimo}
                </span>
                <span className="cfg__params-statcard__label">PDVs mínimos</span>
              </div>
              <div className="cfg__params-statcard">
                <span className="cfg__params-statcard__value cfg__params-statcard__value--gold">
                  {data.tolerancia.nivelServicoPct}%
                </span>
                <span className="cfg__params-statcard__label">Nível de serviço</span>
              </div>
              <div className="cfg__params-statcard">
                <span className="cfg__params-statcard__value cfg__params-statcard__value--magenta">
                  {data.tolerancia.absenteismoPct}%
                </span>
                <span className="cfg__params-statcard__label">Absenteísmo</span>
              </div>
            </div>
          </div>

          <div className="cfg__params-subsection">
            <h3 className="cfg__params-subtitle">Ajustes</h3>
            <div className="cfg__params-field">
              <label className="cfg__params-label">PDV mínimo aberto</label>
              <InputNumber
                value={data.tolerancia.pdvMinimo}
                min={0}
                max={20}
                onChange={(v) =>
                  setData((d) => ({ ...d, tolerancia: { ...d.tolerancia, pdvMinimo: v ?? 0 } }))
                }
              />
            </div>
            <div className="cfg__params-field">
              <label className="cfg__params-label">Nível de serviço (%)</label>
              <InputNumber
                value={data.tolerancia.nivelServicoPct}
                min={0}
                max={100}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    tolerancia: { ...d.tolerancia, nivelServicoPct: v ?? 0 },
                  }))
                }
              />
            </div>
            <div className="cfg__params-field">
              <label className="cfg__params-label">Absenteísmo (%)</label>
              <InputNumber
                value={data.tolerancia.absenteismoPct}
                min={0}
                max={100}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    tolerancia: { ...d.tolerancia, absenteismoPct: v ?? 0 },
                  }))
                }
              />
            </div>
          </div>
        </Section>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button type="primary" onClick={() => message.success("Parâmetros salvos")}>
          Salvar parâmetros
        </Button>
      </div>
    </div>
  );
}

interface SectionProps {
  id: string;
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ id, title, collapsed, onToggle, children }: SectionProps) {
  return (
    <section
      id={`params-${id}`}
      className={`cfg__params-section${collapsed ? " is-collapsed" : ""}`}
      onClick={collapsed ? onToggle : undefined}
    >
      <header className="cfg__params-head">
        <h2 className="cfg__params-title">{title}</h2>
        <Tooltip title={collapsed ? "Expandir" : "Recolher"}>
          <button
            type="button"
            className="cfg__params-collapse"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={collapsed ? "Expandir" : "Recolher"}
          >
            <CircleChevronLeftIcon size={18} />
          </button>
        </Tooltip>
      </header>
      <div className="cfg__params-body">{children}</div>
    </section>
  );
}
