"use client";

import { Alert, Button, DatePicker, Modal, Upload, App, Form } from "antd";
import { InboxIcon } from "@/components/icons";
import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";

interface PrevisoesImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrevisoesImportModal({ open, onClose }: PrevisoesImportModalProps) {
  const { message } = App.useApp();
  const [mes, setMes] = useState<Dayjs>(() => dayjs());

  return (
    <Modal
      title="Importar previsões de venda"
      open={open}
      onCancel={onClose}
      okText="Importar"
      cancelText="Cancelar"
      onOk={() => {
        message.success(`Previsões de ${mes.format("MMMM [de] YYYY")} importadas (mock)`);
        onClose();
      }}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        title="Os valores existentes serão substituídos pelos do arquivo."
        style={{ marginBottom: 16 }}
      />
      <Form layout="vertical">
        <Form.Item label="Mês de referência">
          <DatePicker
            picker="month"
            value={mes}
            onChange={(d) => d && setMes(d)}
            format="MMMM [de] YYYY"
            allowClear={false}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Arquivo">
          <Upload.Dragger
            multiple={false}
            accept=".csv,.xlsx"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              message.success(`Arquivo "${file.name}" carregado`);
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxIcon />
            </p>
            <p className="ant-upload-text">Arraste o CSV/XLSX ou clique</p>
            <p className="ant-upload-hint">Colunas esperadas: data, valor.</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button type="link" onClick={() => message.info("Modelo baixado (mock)")}>
          Baixar modelo
        </Button>
      </div>
    </Modal>
  );
}
