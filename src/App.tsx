import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ConfiguracoesContent } from "@/components/configuracoes/ConfiguracoesContent";
import { ListaEscalasContent } from "@/components/escalas/ListaEscalasContent";
import { AdminEscalaContent } from "@/components/escalas/AdminEscalaContent";

function AdminEscalaRoute() {
  const { id } = useParams<{ id: string }>();
  return <AdminEscalaContent escalaId={id ?? ""} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/configuracoes" replace />} />
      <Route path="/configuracoes" element={<ConfiguracoesContent />} />
      <Route path="/escalas" element={<ListaEscalasContent />} />
      <Route path="/escalas/:id" element={<AdminEscalaRoute />} />
    </Routes>
  );
}
