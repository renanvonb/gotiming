import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Mede a altura disponível para o corpo de um <Table> do AntD, de modo que a
 * tabela ocupe todo o espaço vertical restante do seu contêiner (que deve ser
 * um flex item com `flex: 1; minHeight: 0`). Retorna o `ref` para envolver a
 * tabela e o valor de `scroll.y` em pixels.
 *
 * Converge em poucos renders: enquanto não há cabeçalho fixo (`scroll.y`
 * indefinido) a tabela é plana; ao receber um `y` o AntD separa o cabeçalho e
 * o segundo `measure()` desconta a altura dele.
 */
export function useFillTableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>();
  const scrollYRef = useRef<number | undefined>(undefined);
  scrollYRef.current = scrollY;

  const measure = useCallback(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    const header = wrapper.querySelector<HTMLElement>(".ant-table-header");
    const headerH = header?.offsetHeight ?? 0;
    const next = Math.max(80, Math.floor(wrapper.clientHeight - headerH));
    if (scrollYRef.current === undefined || Math.abs(next - scrollYRef.current) > 1) {
      setScrollY(next);
    }
    // Detecta se o corpo rola (conteúdo excede a área visível). Quando rola, a
    // classe `gt-has-scroll` remove a borda inferior da última linha para não
    // duplicar com a borda da moldura no fim da rolagem.
    const body = wrapper.querySelector<HTMLElement>(".ant-table-body");
    const overflowing = !!body && body.scrollHeight > body.clientHeight + 1;
    wrapper.classList.toggle("gt-has-scroll", overflowing);
  }, []);

  useLayoutEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [measure]);

  // Reexecuta após cada render para convergir quando o cabeçalho fixo aparece.
  useLayoutEffect(() => {
    measure();
  });

  return { ref, scrollY };
}
