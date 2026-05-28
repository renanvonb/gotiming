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
import { DeleteIcon } from "@/components/icons";

interface FeriadoDrawerProps {
  open: boolean;
  feriadoId?: string;
  unidadeId: string;
  onClose: () => void;
}

interface FormValues {
  nome: string;
  data: Dayjs;
  horaInicial?: Dayjs;
  horaFinal?: Dayjs;
  fechadoDiaInteiro: boolean;
}

const FORMAT_TIME = "HH:mm";

export function FeriadoDrawer({ open, feriadoId, unidadeId, onClose }: FeriadoDrawerProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [fechado, setFechado] = useState(false);

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
        horaInicial: first ? dayjs(first.inicio, FORMAT_TIME) : undefined,
        horaFinal: first ? dayjs(first.fim, FORMAT_TIME) : undefined,
        fechadoDiaInteiro: !first,
      });
      setFechado(!first);
    } else {
      form.resetFields();
      form.setFieldsValue({ nome: "", fechadoDiaInteiro: false });
      setFechado(false);
    }
  }, [open, editing, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(editing ? "Feriado atualizado com sucesso!" : "Feriado adicionado com sucesso!");
      onClose();
    } catch {
      // form
    }
  };

  return (
    <Drawer
      title={editing ? "Gerenciar feriado" : "Adicionar"}
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
              <Button type="link" danger icon={<DeleteIcon />} style={{ paddingLeft: 0 }}>
                Excluir
              </Button>
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
          if ("fechadoDiaInteiro" in changed) setFechado(changed.fechadoDiaInteiro ?? false);
        }}
      >
        <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Nome obrigatório" }]}>
          <Input placeholder="Informe o nome do feriado" />
        </Form.Item>
        <Form.Item label="Data" name="data" rules={[{ required: true, message: "Data obrigatória" }]}>
          <DatePicker format="DD/MM/YYYY" placeholder="Selecione a data" style={{ width: "100%" }} />
        </Form.Item>
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            label="Hora inicial"
            name="horaInicial"
            rules={[{ required: !fechado, message: "Obrigatório" }]}
            style={{ flex: 1 }}
          >
            <TimePicker
              format={FORMAT_TIME}
              disabled={fechado}
              placeholder="00:00"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Hora final"
            name="horaFinal"
            rules={[{ required: !fechado, message: "Obrigatório" }]}
            style={{ flex: 1 }}
          >
            <TimePicker
              format={FORMAT_TIME}
              disabled={fechado}
              placeholder="00:00"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
        <Form.Item name="fechadoDiaInteiro" valuePropName="checked" style={{ marginBottom: 0 }}>
          <Checkbox>Fechado o dia inteiro</Checkbox>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
