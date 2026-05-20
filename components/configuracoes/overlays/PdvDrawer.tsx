"use client";

import { Alert, Button, Drawer, Form, Input, InputNumber, Select, Space, Switch, App } from "antd";
import { useEffect, useMemo } from "react";
import type { PdvTipo } from "@/lib/types";
import { getPdvs } from "@/lib/mock/pdvs";

interface PdvDrawerProps {
  open: boolean;
  pdvId?: string;
  unidadeId: string;
  onClose: () => void;
}

interface FormValues {
  posicao: number;
  ordem: number;
  codigoInterno: string;
  tipo: PdvTipo;
  orientacao: "horario" | "anti-horario";
  ativoParaEscala: boolean;
}

export function PdvDrawer({ open, pdvId, unidadeId, onClose }: PdvDrawerProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const editing = useMemo(() => {
    if (!pdvId) return null;
    return getPdvs(unidadeId).find((p) => p.id === pdvId) ?? null;
  }, [pdvId, unidadeId]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        posicao: Number(editing.nome.replace(/\D/g, "")) || 1,
        ordem: Number(editing.nome.replace(/\D/g, "")) || 1,
        codigoInterno: editing.id.toUpperCase(),
        tipo: editing.tipo,
        orientacao: "horario",
        ativoParaEscala: editing.ativoParaEscala,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        posicao: 1,
        ordem: 1,
        codigoInterno: "",
        tipo: "Normal",
        orientacao: "horario",
        ativoParaEscala: true,
      });
    }
  }, [open, editing, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(editing ? "PDV atualizado" : "PDV criado");
      onClose();
    } catch {
      // validation handled by form
    }
  };

  return (
    <Drawer
      title={editing ? `Gerenciar ${editing.nome}` : "Novo PDV"}
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
      <Alert
        type="info"
        showIcon
        title="Para alterar o nome do PDV use o sistema de checkout."
        style={{ marginBottom: 16 }}
      />
      <Form<FormValues> form={form} layout="vertical">
        <Form.Item label="Posição" name="posicao" rules={[{ required: true }]}>
          <InputNumber min={1} max={999} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ordem" name="ordem" rules={[{ required: true }]}>
          <InputNumber min={1} max={999} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Código interno" name="codigoInterno">
          <Input placeholder="Ex.: PDV-001" />
        </Form.Item>
        <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "Normal", label: "Normal" },
              { value: "Rápido", label: "Rápido" },
              { value: "Preferencial", label: "Preferencial" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Orientação" name="orientacao" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "horario", label: "Sentido horário" },
              { value: "anti-horario", label: "Sentido anti-horário" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Ativo para escala" name="ativoParaEscala" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
