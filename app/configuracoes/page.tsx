import { Suspense } from "react";
import { Spin } from "antd";
import { ConfiguracoesContent } from "@/components/configuracoes/ConfiguracoesContent";

export default function ConfiguracoesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <Spin size="large" />
        </div>
      }
    >
      <ConfiguracoesContent />
    </Suspense>
  );
}
