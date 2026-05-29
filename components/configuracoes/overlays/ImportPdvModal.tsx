"use client";

import { Button, Modal, Space, Upload, App } from "antd";
import { useState } from "react";
import { DownloadIcon, ImportIcon } from "@/components/icons";

interface ImportPdvModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportPdvModal({ open, onClose }: ImportPdvModalProps) {
  const { message } = App.useApp();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClose = () => {
    setFileName(null);
    onClose();
  };

  const handleImport = () => {
    message.success("PDV importado com sucesso!");
    handleClose();
  };

  return (
    <Modal
      title="Importar PDV"
      centered
      open={open}
      onCancel={handleClose}
      destroyOnHidden
      footer={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="link"
            icon={<DownloadIcon />}
            style={{ paddingLeft: 0 }}
            onClick={() => message.info("Template baixado (mock)")}
          >
            Baixar template
          </Button>
          <Space style={{ marginLeft: "auto" }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="primary" disabled={!fileName} onClick={handleImport}>
              Importar
            </Button>
          </Space>
        </div>
      }
    >
      <Upload.Dragger
        multiple={false}
        accept=".csv,.xlsx"
        maxCount={1}
        showUploadList={false}
        beforeUpload={(file) => {
          setFileName(file.name);
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <ImportIcon size={48} strokeWidth={1.5} />
        </p>
        <p className="ant-upload-text">
          {fileName ?? "Clique ou arraste o arquivo para esta área"}
        </p>
        <p className="ant-upload-hint">Suporta arquivos .csv ou .xlsx — máximo 5MB</p>
      </Upload.Dragger>
    </Modal>
  );
}
