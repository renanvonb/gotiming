"use client";

import { Button, DatePicker, Drawer, Form, Space, Switch, App } from "antd";
import { useEffect, useMemo } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { getColaboradores } from "@/lib/mock/colaboradores";
import { initialsOf } from "@/lib/utils/format";

interface ColabDrawerProps {
  open: boolean;
  colabId?: string;
  unidadeId: string;
  onClose: () => void;
}

interface FormValues {
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
      ultimaFolgaSemana: dayjs().subtract(7, "day"),
      ultimaFolgaDomingo: dayjs().subtract(28, "day"),
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
        <div className="gt-colab-card">
          <span
            className="gt-user-cell__avatar gt-user-cell__avatar--lg"
            style={{ background: colab.avatarColor }}
          >
            {initialsOf(colab.nome)}
          </span>
          <div className="gt-colab-card__info">
            <span className="gt-colab-card__name">{colab.nome}</span>
            <span className="gt-colab-card__meta">
              <span>{colab.cargo}</span>
              <span className="gt-colab-card__sep">·</span>
              <span>{colab.matricula}</span>
            </span>
          </div>
        </div>
      )}

      <Form<FormValues> form={form} layout="vertical">
        <Form.Item label="Última folga (semana)" name="ultimaFolgaSemana">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Última folga (domingo)" name="ultimaFolgaDomingo">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Disponível para escala" name="ativoParaEscala" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
