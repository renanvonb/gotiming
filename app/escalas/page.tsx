import { Suspense } from "react";
import { Spin } from "antd";
import { ListaEscalasContent } from "@/components/escalas/ListaEscalasContent";

export default function EscalasPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <Spin size="large" />
        </div>
      }
    >
      <ListaEscalasContent />
    </Suspense>
  );
}
