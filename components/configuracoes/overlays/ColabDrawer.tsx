"use client";

import { Button, DatePicker, Divider, Drawer, Form, Select, Space, Switch, App } from "antd";
import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { getColaboradores, MODELOS_CONTRATO } from "@/lib/mock/colaboradores";
import { initialsOf } from "@/lib/utils/format";

const styles: Record<string, CSSProperties> = {
  colabCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    flex: "none",
    fontSize: 14,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    textTransform: "uppercase",
    color: "var(--ant-color-text-secondary)",
  },
  colabCardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  colabCardName: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ant-color-text)",
  },
  colabCardMeta: {
    fontSize: 13,
    color: "var(--ant-color-text-tertiary)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  colabCardSep: {
    color: "var(--ant-color-text-quaternary)",
  },
};

interface ColabDrawerProps {
  open: boolean;
  colabId?: string;
  unidadeId: string;
  onClose: () => void;
}

interface FormValues {
  modeloContrato?: string;
  ultimaFolgaSemana?: Dayjs;
  ultimaFolgaDomingo?: Dayjs;
  ativoParaEscala: boolean;
}

export function ColabDrawer({ open, colabId, unidadeId, onClose }: ColabDrawerProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const colab = useMemo(() => {
    if (!colabId) return null;
    return getColaboradores(unidadeId).find((c) => c.id === colabId) ?? null;
  }, [colabId, unidadeId]);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      modeloContrato: colab?.modeloContrato,
      ultimaFolgaSemana: colab ? dayjs(colab.ultimaFolgaSemana) : undefined,
      ultimaFolgaDomingo: colab ? dayjs(colab.ultimaFolgaDomingo) : undefined,
      ativoParaEscala: colab?.ativoParaEscala ?? true,
    });
  }, [open, colab, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success("Colaborador atualizado");
      onClose();
    } catch {
      // form handles errors
    }
  };

  return (
    <Drawer
      title="Colaborador"
      open={open}
      onClose={onClose}
      size={420}
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Space>
      }
    >
      {colab && (
        <div style={styles.colabCard}>
          <span
            style={{ ...styles.avatar, background: colab.avatarColor }}
          >
            {initialsOf(colab.nome)}
          </span>
          <div style={styles.colabCardInfo}>
            <span style={styles.colabCardName}>{colab.nome}</span>
            <span style={styles.colabCardMeta}>
              <span>{colab.codigoOperador}</span>
              <span style={styles.colabCardSep}>·</span>
              <span>{colab.funcao}</span>
            </span>
          </div>
        </div>
      )}

      <Divider />

      <Form<FormValues> form={form} layout="vertical">
        <Form.Item label="Modelo de contrato" name="modeloContrato">
          <Select
            placeholder="Selecione o modelo de contrato"
            options={MODELOS_CONTRATO.map((m) => ({
              value: m.tipo,
              label: `${m.tipo} · ${m.horasSemana}h semanais`,
            }))}
          />
        </Form.Item>
        <Form.Item label="Última folga semana" name="ultimaFolgaSemana">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Última folga domingo" name="ultimaFolgaDomingo">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span>Disponível na próxima geração de escala</span>
          <Form.Item name="ativoParaEscala" valuePropName="checked" noStyle>
            <Switch size="small" />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}
