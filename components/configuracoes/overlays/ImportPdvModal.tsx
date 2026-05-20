"use client";

import { Alert, Button, Modal, Upload, App } from "antd";
import { InboxIcon } from "@/components/icons";

interface ImportPdvModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportPdvModal({ open, onClose }: ImportPdvModalProps) {
  const { message } = App.useApp();

  return (
    <Modal
      title="Importar PDVs"
      open={open}
      onCancel={onClose}
      okText="Importar"
      cancelText="Cancelar"
      onOk={() => {
        message.success("Arquivo recebido (mock)");
        onClose();
      }}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        title="Use um arquivo CSV com as colunas: nome, tipo, código_interno."
        style={{ marginBottom: 16 }}
      />
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
        <p className="ant-upload-text">Arraste o arquivo CSV/XLSX ou clique para enviar</p>
        <p className="ant-upload-hint">Até 5MB.</p>
      </Upload.Dragger>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-start" }}>
        <Button type="link" onClick={() => message.info("Modelo baixado (mock)")}>
          Baixar modelo de planilha
        </Button>
      </div>
    </Modal>
  );
}
