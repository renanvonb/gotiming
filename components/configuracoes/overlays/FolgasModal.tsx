"use client";

import { Button, DatePicker, Modal, Table, type TableColumnsType, App } from "antd";
import { PlusIcon } from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getColaboradores } from "@/lib/mock/colaboradores";

interface FolgasModalProps {
  open: boolean;
  unidadeId: string;
  onClose: () => void;
}

interface RowData {
  id: string;
  nome: string;
  cargo: string;
  ultimaSemana?: Dayjs;
  ultimaDomingo?: Dayjs;
}

export function FolgasModal({ open, unidadeId, onClose }: FolgasModalProps) {
  const { message } = App.useApp();
  const [rows, setRows] = useState<RowData[]>([]);

  const colabs = useMemo(() => getColaboradores(unidadeId), [unidadeId]);

  useEffect(() => {
    if (!open) return;
    setRows(
      colabs.map((c) => ({
        id: c.id,
        nome: c.nome,
        cargo: c.cargo,
        ultimaSemana: dayjs().subtract(7, "day"),
        ultimaDomingo: dayjs().subtract(28, "day"),
      }))
    );
  }, [open, colabs]);

  const columns: TableColumnsType<RowData> = [
    { title: "Colaborador", dataIndex: "nome", key: "nome" },
    { title: "Cargo", dataIndex: "cargo", key: "cargo", width: 200 },
    {
      title: "Última folga (semana)",
      dataIndex: "ultimaSemana",
      key: "semana",
      width: 200,
      render: (v: Dayjs | undefined, r) => (
        <DatePicker
          value={v}
          format="DD/MM/YYYY"
          onChange={(val) =>
            setRows((prev) =>
              prev.map((row) => (row.id === r.id ? { ...row, ultimaSemana: val ?? undefined } : row))
            )
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Última folga (domingo)",
      dataIndex: "ultimaDomingo",
      key: "domingo",
      width: 200,
      render: (v: Dayjs | undefined, r) => (
        <DatePicker
          value={v}
          format="DD/MM/YYYY"
          onChange={(val) =>
            setRows((prev) =>
              prev.map((row) => (row.id === r.id ? { ...row, ultimaDomingo: val ?? undefined } : row))
            )
          }
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Folgas individuais"
      open={open}
      onCancel={onClose}
      width={840}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => {
            message.success("Folgas atualizadas");
            onClose();
          }}
        >
          Salvar
        </Button>,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button icon={<PlusIcon />} type="dashed">
          Marcar folga em lote
        </Button>
      </div>
      <Table<RowData>
        rowKey="id"
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="middle"
        bordered
        scroll={{ y: 400 }}
      />
    </Modal>
  );
}
