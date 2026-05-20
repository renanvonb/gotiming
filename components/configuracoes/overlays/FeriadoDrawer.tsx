"use client";

import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  TimePicker,
  App,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { getFeriados } from "@/lib/mock/feriados";

interface FeriadoDrawerProps {
  open: boolean;
  feriadoId?: string;
  unidadeId: string;
  onClose: () => void;
}

interface FormValues {
  nome: string;
  data: Dayjs;
  intervalo?: [Dayjs, Dayjs];
  fechadoDiaInteiro: boolean;
}

const FORMAT_TIME = "HH:mm";

export function FeriadoDrawer({ open, feriadoId, unidadeId, onClose }: FeriadoDrawerProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [fechado, setFechado] = useState(true);

  const editing = useMemo(() => {
    if (!feriadoId) return null;
    return getFeriados(unidadeId).find((f) => f.id === feriadoId) ?? null;
  }, [feriadoId, unidadeId]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const first = editing.abertura?.[0];
      form.setFieldsValue({
        nome: editing.nome,
        data: dayjs(editing.data),
        intervalo: first
          ? [dayjs(first.inicio, FORMAT_TIME), dayjs(first.fim, FORMAT_TIME)]
          : undefined,
        fechadoDiaInteiro: !first,
      });
      setFechado(!first);
    } else {
      form.resetFields();
      form.setFieldsValue({
        nome: "",
        data: dayjs(),
        fechadoDiaInteiro: true,
      });
      setFechado(true);
    }
  }, [open, editing, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(editing ? "Feriado atualizado" : "Feriado criado");
      onClose();
    } catch {
      // form
    }
  };

  return (
    <Drawer
      title={editing ? "Editar feriado" : "Adicionar feriado"}
      open={open}
      onClose={onClose}
      size={420}
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          {editing ? (
            <Popconfirm
              title="Excluir feriado?"
              description="Essa ação é permanente."
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
              onConfirm={() => {
                message.success("Feriado excluído");
                onClose();
              }}
            >
              <Button danger>Excluir</Button>
            </Popconfirm>
          ) : (
            <span />
          )}
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="primary" onClick={handleSave}>
              Salvar
            </Button>
          </Space>
        </Space>
      }
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onValuesChange={(changed) => {
          if ("fechadoDiaInteiro" in changed) setFechado(changed.fechadoDiaInteiro ?? true);
        }}
      >
        <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Nome obrigatório" }]}>
          <Input placeholder="Ex.: Aniversário da cidade" />
        </Form.Item>
        <Form.Item label="Data" name="data" rules={[{ required: true, message: "Data obrigatória" }]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="fechadoDiaInteiro" valuePropName="checked">
          <Checkbox>Fechado o dia inteiro</Checkbox>
        </Form.Item>
        {!fechado && (
          <Form.Item
            label="Horário de funcionamento"
            name="intervalo"
            rules={[{ required: true, message: "Defina o horário" }]}
          >
            <TimePicker.RangePicker format={FORMAT_TIME} style={{ width: "100%" }} />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
