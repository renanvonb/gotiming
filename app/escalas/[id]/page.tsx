import { AdminEscalaContent } from "@/components/escalas/AdminEscalaContent";

export default async function AdminEscalaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminEscalaContent escalaId={id} />;
}
