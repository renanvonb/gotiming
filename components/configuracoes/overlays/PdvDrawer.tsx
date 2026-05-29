"use client";

import { Alert, Button, Divider, Drawer, Form, Input, InputNumber, Select, Space, Switch, App } from "antd";
import { useEffect, useMemo } from "react";
import type { PdvOrientacao, PdvTipo } from "@/lib/types";
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
  orientacao: PdvOrientacao;
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
        posicao: editing.posicao,
        ordem: editing.ordemAbertura,
        codigoInterno: editing.codigoInterno,
        tipo: editing.tipo,
        orientacao: editing.orientacao,
        ativoParaEscala: editing.ativoParaEscala,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        posicao: 1,
        ordem: 1,
        codigoInterno: "",
        tipo: "Normal",
        orientacao: "Direita",
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
      title={editing ? `Gerenciar PDV ${String(editing.posicao).padStart(2, "0")}` : "Novo PDV"}
      open={open}
      onClose={onClose}
      size={420}
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleSave}>
            {editing ? "Salvar" : "Cadastrar"}
          </Button>
        </Space>
      }
    >
      <Form<FormValues> form={form} layout="vertical">
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            label="Posição"
            name="posicao"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={1} max={999} placeholder="Informe a posição" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Ordem de abertura"
            name="ordem"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={1} max={999} placeholder="Informe a ordem" style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Form.Item label="Código interno" name="codigoInterno">
          <Input placeholder="Informe o código" />
        </Form.Item>
        <Alert
          type="info"
          showIcon
          title="Certifique-se de que o código interno do PDV seja igual ao ERP."
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select
              placeholder="Selecione o tipo"
              options={[
                { value: "Normal", label: "Normal" },
                { value: "Rápido", label: "Rápido" },
                { value: "Preferencial", label: "Preferencial" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Orientação"
            name="orientacao"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="Selecione a orientação"
              options={[
                { value: "Direita", label: "Direita" },
                { value: "Esquerda", label: "Esquerda" },
              ]}
            />
          </Form.Item>
        </div>
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
