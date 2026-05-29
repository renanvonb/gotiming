"use client";

import {
  Button,
  Calendar,
  Popconfirm,
  Radio,
  Table,
  type TableColumnsType,
  Tooltip,
  App,
  Empty,
} from "antd";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EraserIcon,
  ImportIcon,
  WandIcon,
} from "@/components/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PrevisaoDia } from "@/lib/types";
import { getPrevisoes } from "@/lib/mock/previsoes";
import { formatCurrency } from "@/lib/utils/format";
import { useFillTableScroll } from "@/lib/hooks/useFillTableScroll";

interface PrevisoesPanelProps {
  unidadeId: string;
  onImport: () => void;
}

type ViewMode = "calendario" | "tabela";

const styles: Record<string, CSSProperties> = {
  forecast: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    position: "relative",
    gap: 16,
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 8,
  },
  toolbarLeft: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "start",
  },
  toolbarRight: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "end",
  },
  month: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "center",
  },
  monthLabel: {
    minWidth: 150,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ant-color-text)",
  },
  monthPickerAnchor: {
    position: "relative",
    display: "inline-flex",
  },
  mpDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    zIndex: 30,
    width: 240,
    background: "var(--ant-color-bg-elevated)",
    border: "1px solid var(--ant-color-border-secondary)",
    borderRadius: 8,
    boxShadow: "var(--ant-box-shadow-secondary)",
    padding: 8,
  },
  mpHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  mpYear: {
    fontWeight: 600,
    fontSize: 14,
    color: "var(--ant-color-text)",
  },
  mpGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 4,
  },
  mpMonth: {
    padding: "8px 0",
    textAlign: "center",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    border: 0,
    background: "transparent",
    color: "var(--ant-color-text)",
  },
  mpMonthActive: {
    background: "var(--ant-color-primary)",
    color: "#fff",
    fontWeight: 500,
  },
  mpFooter: {
    marginTop: 6,
    textAlign: "center",
  },
  hiddenPicker: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
    border: 0,
    opacity: 0,
    pointerEvents: "none",
  },
  body: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  calCell: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    height: "100%",
    fontSize: 13,
    padding: "8px 12px",
    overflow: "hidden",
    position: "relative",
    userSelect: "none",
    transition: "background var(--ant-motion-duration-fast)",
  },
  calCellDim: {
    cursor: "default",
  },
  calDay: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
  },
  calDayDim: {
    color: "var(--ant-color-text-quaternary)",
  },
  calDayToday: {
    color: "var(--ant-color-primary)",
  },
  calValue: {
    marginTop: "auto",
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: 13,
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
  },
  calValuePlaceholder: {
    color: "var(--ant-color-text-quaternary)",
  },
  // Edição inline: input sem moldura, idêntico ao texto do valor, ancorado na
  // base esquerda — não abre caixa nem altera o tamanho do quadrado.
  calInputEl: {
    marginTop: "auto",
    width: "100%",
    textAlign: "left",
    border: 0,
    outline: "none",
    background: "transparent",
    padding: 0,
    fontSize: "inherit",
    fontFamily: "inherit",
    fontVariantNumeric: "tabular-nums",
    color: "var(--ant-color-text)",
    caretColor: "var(--ant-color-primary)",
  },
  totals: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 0,
    margin: 0,
    fontSize: 13,
    color: "var(--ant-color-text-secondary)",
  },
  total: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  totalRight: {
    marginLeft: "auto",
  },
  totalLabel: {
    color: "var(--ant-color-text-secondary)",
  },
  totalValue: {
    fontWeight: 600,
    color: "var(--ant-color-text)",
    fontVariantNumeric: "tabular-nums",
  },
  totalValueBlue: {
    color: "var(--ant-color-primary)",
  },
  totalDivider: {
    width: 1,
    height: 16,
    background: "var(--ant-color-border-secondary)",
  },
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS_ABBR = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Aceita valores em pt-BR ("1.234,56" / "1234,56") ou com ponto decimal ("1234.56").
function parseValor(s: string): number | null {
  let str = s.trim().replace(/[^0-9.,]/g, "");
  if (!str) return null;
  if (str.includes(",")) str = str.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(str);
  return Number.isNaN(n) ? null : n;
}

// Formata uma string de dígitos como moeda tratando os 2 últimos como centavos
// ("150000" → "1.500,00"), sem o prefixo "R$". Opera sobre string para não
// estourar a precisão de ponto flutuante em valores grandes. Vazio/zero → "".
function fmtCentavos(digits: string): string {
  const d = digits.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (d === "" || d === "0") return "";
  const padded = d.padStart(3, "0");
  const intPart = padded.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const centPart = padded.slice(-2);
  return `${intPart},${centPart}`;
}

export function PrevisoesPanel({ unidadeId, onImport }: PrevisoesPanelProps) {
  const { message } = App.useApp();
  const { ref: tableScrollRef, scrollY } = useFillTableScroll();
  const [mes, setMes] = useState<Dayjs>(() => dayjs());
  const [mode, setMode] = useState<ViewMode>("calendario");
  const [previsoes, setPrevisoes] = useState<PrevisaoDia[]>([]);
  const [editing, setEditing] = useState(false);
  const [selection, setSelection] = useState<Set<string>>(() => new Set());
  const [origin, setOrigin] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => dayjs().year());
  const [loading, setLoading] = useState(false);
  // Loader transitório do estado vazio (evita spinner infinito em unidade sem dados).
  const [emptyLoading, setEmptyLoading] = useState(true);
  const [flashing, setFlashing] = useState(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const originRef = useRef<string | null>(null);
  const editRawRef = useRef<string | null>(null);
  const selectionRef = useRef<Set<string>>(selection);
  const editingRef = useRef(false);
  const byDateRef = useRef<Map<string, PrevisaoDia>>(new Map());
  const multiBufferRef = useRef("");
  const copyBufferRef = useRef<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Histórico para desfazer (Ctrl+Z) / refazer (Ctrl+Shift+Z). snapshot() guarda
  // o estado atual antes de cada ação que altera os valores.
  const previsoesRef = useRef(previsoes);
  previsoesRef.current = previsoes;
  const pastRef = useRef<PrevisaoDia[][]>([]);
  const futureRef = useRef<PrevisaoDia[][]>([]);
  const snapshot = () => {
    pastRef.current = [...pastRef.current.slice(-49), previsoesRef.current];
    futureRef.current = [];
  };

  const storageKey = `gotime:forecast:${unidadeId}:${mes.format("YYYY-MM")}`;

  // Carrega o mock e sobrepõe os valores persistidos (localStorage) por unidade+mês.
  useEffect(() => {
    let list = getPrevisoes(unidadeId, mes.year(), mes.month());
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, number>;
        list = list.map((p) => {
          const day = String(dayjs(p.data).date());
          return saved[day] != null ? { ...p, valorPrevistoCentavos: saved[day] } : p;
        });
      }
    } catch {
      /* ignora JSON inválido */
    }
    setPrevisoes(list);
    // Novo contexto (unidade/mês) → zera o histórico de desfazer/refazer.
    pastRef.current = [];
    futureRef.current = [];
    // Loader transitório do estado vazio.
    setEmptyLoading(true);
    const t = window.setTimeout(() => setEmptyLoading(false), 700);
    return () => window.clearTimeout(t);
  }, [unidadeId, mes, storageKey]);

  // Persiste (debounce 50ms) apenas os dias com valor > 0, por unidade+mês.
  useEffect(() => {
    if (previsoes.length === 0) return;
    const id = window.setTimeout(() => {
      const obj: Record<string, number> = {};
      previsoes.forEach((p) => {
        if (p.valorPrevistoCentavos > 0) obj[String(dayjs(p.data).date())] = p.valorPrevistoCentavos;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(obj));
      } catch {
        /* storage indisponível */
      }
    }, 50);
    return () => window.clearTimeout(id);
  }, [previsoes, storageKey]);

  // Salva também ao fechar/recarregar a página.
  useEffect(() => {
    const flush = () => {
      const obj: Record<string, number> = {};
      previsoes.forEach((p) => {
        if (p.valorPrevistoCentavos > 0) obj[String(dayjs(p.data).date())] = p.valorPrevistoCentavos;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(obj));
      } catch {
        /* storage indisponível */
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [previsoes, storageKey]);

  // Remove o tooltip nativo (title="YYYY-MM-DD") que o AntD coloca nas células;
  // os tooltips ricos são renderizados por nós.
  useEffect(() => {
    if (mode !== "calendario") return;
    document.querySelectorAll(".gt-cal-fill td[title]").forEach((el) => el.removeAttribute("title"));
  });

  const byDate = useMemo(() => {
    const map = new Map<string, PrevisaoDia>();
    for (const p of previsoes) map.set(p.data, p);
    return map;
  }, [previsoes]);

  // Refs espelham o estado para os listeners globais (mouseup/keydown) lerem
  // sempre o valor atual sem reanexar.
  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);
  useEffect(() => {
    byDateRef.current = byDate;
  }, [byDate]);

  const fillSelected = (cents: number) => {
    const sel = selectionRef.current;
    setPrevisoes((prev) =>
      prev.map((p) => (sel.has(p.data) ? { ...p, valorPrevistoCentavos: cents } : p))
    );
  };

  const applyPaste = (cents: number) => {
    let changed = 0;
    selectionRef.current.forEach((k) => {
      if ((byDateRef.current.get(k)?.valorPrevistoCentavos ?? 0) !== cents) changed++;
    });
    if (changed > 0) snapshot();
    fillSelected(cents);
    if (changed > 0) {
      message.success(
        `${changed} ${changed === 1 ? "previsão atualizada" : "previsões atualizadas"} com sucesso!`
      );
    }
  };

  const total = useMemo(
    () => previsoes.reduce((sum, p) => sum + p.valorPrevistoCentavos, 0),
    [previsoes]
  );
  const media = previsoes.length > 0 ? Math.round(total / previsoes.length) : 0;
  const semPrevisao = previsoes.filter((p) => p.valorPrevistoCentavos === 0).length;

  const today = dayjs();

  const rangeKeys = (aKey: string, bKey: string): string[] => {
    let a = dayjs(aKey);
    let b = dayjs(bKey);
    if (a.isAfter(b)) [a, b] = [b, a];
    const keys: string[] = [];
    for (let cur = a; !cur.isAfter(b, "day"); cur = cur.add(1, "day")) {
      keys.push(cur.format("YYYY-MM-DD"));
    }
    return keys;
  };

  // Atualiza a seleção no estado E no ref ao mesmo tempo, para que os listeners
  // globais (mouseup/keydown) leiam o valor atual sem depender do re-render —
  // senão um clique rápido não abre a edição (mouseup roda antes do ref atualizar).
  const setSel = (next: Set<string>) => {
    selectionRef.current = next;
    setSelection(next);
  };

  // Shift+Click: adiciona/remove a célula da seleção (não-contígua), mantendo ao
  // menos uma. Se a origem sair, a próxima selecionada assume.
  const toggleSelect = (key: string) => {
    setEditing(false);
    editRawRef.current = null;
    multiBufferRef.current = "";
    const next = new Set(selectionRef.current);
    if (next.has(key)) {
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    if (!originRef.current || !next.has(originRef.current)) {
      const first = next.values().next().value ?? null;
      originRef.current = first;
      setOrigin(first);
    }
    setSel(next);
  };

  const beginSelect = (key: string, shift: boolean) => {
    if (shift) {
      toggleSelect(key);
      return;
    }
    editRawRef.current = null;
    multiBufferRef.current = "";
    originRef.current = key;
    setOrigin(key);
    setSel(new Set([key]));
    setEditing(false);
    draggingRef.current = true;
    movedRef.current = false;
  };

  const extendSelect = (key: string) => {
    if (draggingRef.current && originRef.current) {
      movedRef.current = true;
      setSel(new Set(rangeKeys(originRef.current, key)));
    }
  };

  const clearSelection = () => {
    originRef.current = null;
    setSel(new Set());
    setOrigin(null);
    setEditing(false);
    editRawRef.current = null;
  };

  const undo = () => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current[pastRef.current.length - 1]!;
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [previsoesRef.current, ...futureRef.current];
    multiBufferRef.current = "";
    clearSelection();
    setPrevisoes(prev);
    message.success("Ação desfeita");
  };

  const redo = () => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[0]!;
    futureRef.current = futureRef.current.slice(1);
    pastRef.current = [...pastRef.current, previsoesRef.current];
    multiBufferRef.current = "";
    clearSelection();
    setPrevisoes(next);
    message.success("Ação refeita");
  };

  // Confirma o valor digitado em todos os dias selecionados. Mantém a seleção
  // (só fecha o input) para que Shift possa estender a partir da origem; a
  // seleção é zerada só no Esc ou clique fora.
  const commitBatch = () => {
    // editRawRef guarda a string de dígitos (centavos) digitada, ou null se não
    // houve digitação (mantém os valores). String vazia → o dia foi apagado → 0.
    const raw = editRawRef.current;
    if (raw !== null && selection.size > 0) {
      const cents = parseInt(raw || "0", 10) || 0;
      const changed = previsoes.filter(
        (p) => selection.has(p.data) && p.valorPrevistoCentavos !== cents
      ).length;
      if (changed > 0) {
        snapshot();
        setPrevisoes((prev) =>
          prev.map((p) => (selection.has(p.data) ? { ...p, valorPrevistoCentavos: cents } : p))
        );
        message.success(
          selection.size === 1
            ? "Previsão atualizada com sucesso!"
            : `${selection.size} previsões atualizadas com sucesso!`
        );
      }
    }
    setEditing(false);
    editRawRef.current = null;
  };

  // Solta o mouse: clique simples (1 célula, sem arrasto) → edição inline;
  // arrasto que selecionou 2+ dias → sessão de digitação em lote (sem input).
  useEffect(() => {
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (selectionRef.current.size === 1) setEditing(true);
      else multiBufferRef.current = "";
      movedRef.current = false;
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  // Clicar fora da área do calendário/tabela limpa a seleção.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!bodyRef.current || !t || !bodyRef.current.contains(t)) clearSelection();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Teclado em multi-seleção (sem input): digitar preenche todas ao vivo (centavos),
  // Backspace remove dígito, Delete zera, Enter confirma, Esc encerra. Ctrl+C copia
  // o valor da origem; Ctrl+V cola priorizando origem > buffer > clipboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editingRef.current) return;
      const sel = selectionRef.current;
      if (sel.size === 0) return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === "c") {
        e.preventDefault();
        const cents = byDateRef.current.get(originRef.current ?? "")?.valorPrevistoCentavos ?? 0;
        copyBufferRef.current = cents;
        navigator.clipboard?.writeText?.(formatCurrency(cents)).catch(() => {});
        message.success(`Valor copiado: ${formatCurrency(cents)}`);
        return;
      }
      if (mod && e.key.toLowerCase() === "v") {
        e.preventDefault();
        const originCents = byDateRef.current.get(originRef.current ?? "")?.valorPrevistoCentavos ?? 0;
        if (originCents > 0) applyPaste(originCents);
        else if (copyBufferRef.current != null) applyPaste(copyBufferRef.current);
        else
          navigator.clipboard
            ?.readText?.()
            .then((txt) => {
              const c = txt.includes(",")
                ? Math.round((parseValor(txt) ?? 0) * 100)
                : parseInt(txt.replace(/\D/g, "") || "0", 10) || 0;
              applyPaste(c);
            })
            .catch(() => {});
        return;
      }

      if (sel.size < 2) return;
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        // Início da sessão de digitação → registra um único ponto de desfazer.
        if (multiBufferRef.current === "") snapshot();
        if (multiBufferRef.current.length < 12) multiBufferRef.current += e.key;
        fillSelected(parseInt(multiBufferRef.current || "0", 10) || 0);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        multiBufferRef.current = multiBufferRef.current.slice(0, -1);
        fillSelected(parseInt(multiBufferRef.current || "0", 10) || 0);
      } else if (e.key === "Delete") {
        e.preventDefault();
        snapshot();
        fillSelected(0);
        message.success(`${sel.size} previsões limpas com sucesso!`);
        multiBufferRef.current = "";
        clearSelection();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (multiBufferRef.current !== "")
          message.success(`${sel.size} previsões atualizadas com sucesso!`);
        multiBufferRef.current = "";
        clearSelection();
      } else if (e.key === "Escape") {
        e.preventDefault();
        multiBufferRef.current = "";
        clearSelection();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Desfazer/refazer: Ctrl+Z (ou ⌘Z) e Ctrl+Shift+Z. Ignora quando o foco está
  // num input (deixa o desfazer nativo do campo agir).
  useEffect(() => {
    const onUndoRedo = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod || e.key.toLowerCase() !== "z") return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    document.addEventListener("keydown", onUndoRedo);
    return () => document.removeEventListener("keydown", onUndoRedo);
  }, []);

  // Input de edição inline compartilhado por calendário e tabela: máscara de
  // centavos ao vivo, sem moldura, sem prefixo R$ durante a digitação.
  const editInput = (cents: number) => (
    <input
      className="gt-cal-input"
      autoFocus
      defaultValue={cents === 0 ? "" : fmtCentavos(String(cents))}
      inputMode="numeric"
      onMouseDown={(e) => e.stopPropagation()}
      onFocus={(e) => {
        editRawRef.current = e.target.value.replace(/\D/g, "");
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
      }}
      onBeforeInput={(e) => {
        const data = (e.nativeEvent as InputEvent).data;
        if (data && /\D/.test(data)) e.preventDefault();
      }}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        editRawRef.current = digits;
        e.target.value = fmtCentavos(digits);
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        const c = text.includes(",")
          ? Math.round((parseValor(text) ?? 0) * 100)
          : parseInt(text.replace(/\D/g, "") || "0", 10) || 0;
        editRawRef.current = String(c);
        e.currentTarget.value = fmtCentavos(String(c));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") commitBatch();
        else if (e.key === "Escape") clearSelection();
      }}
      onBlur={commitBatch}
      style={styles.calInputEl}
    />
  );

  const renderCell = (date: Dayjs) => {
    const inMonth = date.month() === mes.month() && date.year() === mes.year();
    const key = date.format("YYYY-MM-DD");
    const isToday = date.isSame(today, "day");
    const p = byDate.get(key);
    const cents = p?.valorPrevistoCentavos ?? 0;
    const empty = cents === 0;
    const selected = selection.has(key);
    const isOrigin = origin === key;
    const showInput = editing && isOrigin && selection.size === 1;

    const shadows: string[] = [];
    if (showInput) shadows.push("inset 0 -2px 0 0 var(--ant-color-primary)");
    else if (isOrigin && selection.size > 1) shadows.push("inset 0 0 0 2px var(--ant-color-primary)");
    if (isToday && inMonth && !selected) shadows.push("inset 0 2px 0 0 var(--ant-color-primary)");

    const cellEl = (
      <div
        className="gt-cal-cell"
        style={{
          ...styles.calCell,
          ...(inMonth ? null : styles.calCellDim),
          cursor: inMonth ? "pointer" : "default",
          backgroundColor: selected
            ? "var(--ant-color-primary-bg)"
            : inMonth
            ? undefined
            : "var(--ant-color-fill-quaternary)",
          boxShadow: shadows.length ? shadows.join(", ") : undefined,
          zIndex: selected || isOrigin ? 1 : undefined,
        }}
        onMouseDown={
          inMonth
            ? (e) => {
                if ((e.target as HTMLElement).closest(".gt-cal-input")) return;
                e.preventDefault();
                beginSelect(key, e.shiftKey);
              }
            : (e) => {
                // Dias de outro mês não são clicáveis e não trocam o mês.
                e.preventDefault();
                e.stopPropagation();
              }
        }
        onMouseEnter={inMonth ? () => extendSelect(key) : undefined}
        onClick={(e) => e.stopPropagation()}
        title={
          inMonth && !selected && !showInput
            ? `${capitalize(date.format("dddd, DD [de] MMMM [de] YYYY"))} — ${formatCurrency(cents)}`
            : undefined
        }
      >
        <span
          className={inMonth ? "gt-cal-day" : undefined}
          style={{
            ...styles.calDay,
            ...(inMonth ? null : styles.calDayDim),
            ...(isToday && inMonth ? styles.calDayToday : null),
          }}
        >
          {date.date()}
        </span>
        {inMonth &&
          (showInput ? (
            editInput(cents)
          ) : (
            <span
              className="gt-cal-value"
              style={{
                ...styles.calValue,
                ...(empty ? styles.calValuePlaceholder : null),
                ...(flashing && !empty ? { animation: "gtCalFlash 700ms ease" } : null),
              }}
            >
              {formatCurrency(cents)}
            </span>
          ))}
      </div>
    );

    return cellEl;
  };

  const columns: TableColumnsType<PrevisaoDia> = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 120,
      render: (d: string) => dayjs(d).format("DD/MM/YY"),
    },
    {
      title: "Dia da semana",
      dataIndex: "data",
      key: "diaSemana",
      width: 180,
      render: (d: string) => capitalize(dayjs(d).format("dddd")),
    },
    {
      title: "Previsão de venda",
      dataIndex: "valorPrevistoCentavos",
      key: "valor",
      // Paridade com o calendário: a coluna de valor é selecionável/editável e
      // reusa o mesmo estado (seleção, lote por teclado, edição inline).
      onCell: (p) => ({
        onMouseDown: (e) => {
          if ((e.target as HTMLElement).closest(".gt-cal-input")) return;
          e.preventDefault();
          beginSelect(p.data, e.shiftKey);
        },
        onMouseEnter: () => extendSelect(p.data),
        onClick: (e) => e.stopPropagation(),
        style: {
          cursor: "pointer",
          userSelect: "none",
          ...(selection.has(p.data) ? { background: "var(--ant-color-primary-bg)" } : null),
        },
      }),
      render: (v: number, p) => {
        if (editing && origin === p.data && selection.size === 1) return editInput(v);
        return (
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              color: v === 0 ? "var(--ant-color-text-quaternary)" : "var(--ant-color-text)",
            }}
          >
            {formatCurrency(v)}
          </span>
        );
      },
    },
  ];

  const handleClear = () => {
    snapshot();
    setPrevisoes((prev) => prev.map((p) => ({ ...p, valorPrevistoCentavos: 0 })));
    message.success("Previsões do mês foram limpas");
  };

  // Troca de mês com skeleton de 500ms.
  const goMonth = (next: Dayjs) => {
    clearSelection();
    setLoading(true);
    setMes(next);
    window.setTimeout(() => setLoading(false), 500);
  };

  // Troca de visualização com skeleton de 400ms.
  const changeMode = (m: ViewMode) => {
    if (m === mode) return;
    clearSelection();
    setLoading(true);
    setMode(m);
    window.setTimeout(() => setLoading(false), 400);
  };

  // Preenchimento inteligente (mock): toast de loading 2s, preenche o mês com
  // valores aleatórios entre R$ 100.000 e R$ 500.000 e dispara o flash verde.
  const handleAiFill = () => {
    const hide = message.loading("Analisando dados históricos…", 0);
    window.setTimeout(() => {
      hide();
      snapshot();
      setPrevisoes((prev) =>
        prev.map((p) => ({
          ...p,
          valorPrevistoCentavos:
            (100000 + Math.floor(Math.random() * 400001)) * 100 + Math.floor(Math.random() * 100),
        }))
      );
      setFlashing(true);
      window.setTimeout(() => setFlashing(false), 750);
      message.success("Previsões preenchidas automaticamente para o mês");
    }, 2000);
  };

  // Fecha o month picker ao clicar fora.
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(".gt-mp-anchor")) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  const monthLabel = capitalize(mes.format("MMMM [de] YYYY"));
  // Quantas semanas o mês ocupa (4, 5 ou 6). Linhas finais só com dias de outro
  // mês são escondidas via CSS para não sobrar uma faixa vazia embaixo.
  const weeksNeeded = Math.ceil((mes.startOf("month").day() + mes.daysInMonth()) / 7);

  return (
    <div style={{ ...styles.forecast, padding: 16 }}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <Radio.Group
            value={mode}
            onChange={(e) => changeMode(e.target.value as ViewMode)}
            optionType="button"
            options={[
              { label: "Calendário", value: "calendario" },
              { label: "Tabela", value: "tabela" },
            ]}
          />
          <span style={styles.monthPickerAnchor} className="gt-mp-anchor">
            <Tooltip title="Selecionar mês e ano">
              <Button
                icon={<CalendarIcon />}
                aria-label="Selecionar mês e ano"
                onClick={() => {
                  setPickerYear(mes.year());
                  setPickerOpen((o) => !o);
                }}
              />
            </Tooltip>
            {pickerOpen && (
              <div style={styles.mpDropdown}>
                <div style={styles.mpHead}>
                  <Button
                    type="text"
                    size="small"
                    icon={<ChevronLeftIcon />}
                    aria-label="Ano anterior"
                    onClick={() => setPickerYear((y) => y - 1)}
                  />
                  <span style={styles.mpYear}>{pickerYear}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<ChevronRightIcon />}
                    aria-label="Próximo ano"
                    onClick={() => setPickerYear((y) => y + 1)}
                  />
                </div>
                <div style={styles.mpGrid}>
                  {MONTHS_ABBR.map((m, i) => {
                    const active = mes.year() === pickerYear && mes.month() === i;
                    return (
                      <button
                        key={m}
                        type="button"
                        style={{ ...styles.mpMonth, ...(active ? styles.mpMonthActive : null) }}
                        onClick={() => {
                          goMonth(dayjs(new Date(pickerYear, i, 1)));
                          setPickerOpen(false);
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
                <div style={styles.mpFooter}>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      goMonth(dayjs().date(1));
                      setPickerOpen(false);
                    }}
                  >
                    Mês atual
                  </Button>
                </div>
              </div>
            )}
          </span>
        </div>
        <div style={styles.month}>
          <Button
            type="text"
            icon={<ChevronLeftIcon />}
            aria-label="Mês anterior"
            onClick={() => goMonth(mes.subtract(1, "month"))}
          />
          <span style={styles.monthLabel}>{monthLabel}</span>
          <Button
            type="text"
            icon={<ChevronRightIcon />}
            aria-label="Próximo mês"
            onClick={() => goMonth(mes.add(1, "month"))}
          />
        </div>
        <div style={styles.toolbarRight}>
          <Popconfirm
            title="Preenchimento inteligente"
            description="Esta ação irá substituir os valores previstos para todos os dias do mês. Deseja continuar?"
            okText="Confirmar"
            cancelText="Cancelar"
            placement="bottomRight"
            onConfirm={handleAiFill}
          >
            <Tooltip title="Preenchimento inteligente">
              <Button icon={<WandIcon />} aria-label="Preenchimento inteligente" />
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Limpar previsões do mês"
            description="Essa ação zera todos os valores previstos deste mês."
            okText="Limpar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={handleClear}
          >
            <Tooltip title="Limpar previsões do mês">
              <Button icon={<EraserIcon />} aria-label="Limpar previsões do mês" />
            </Tooltip>
          </Popconfirm>
          <Button icon={<ImportIcon />} onClick={onImport}>
            Importar previsões
          </Button>
        </div>
      </div>

      <div ref={bodyRef} style={styles.body} className={loading ? "is-loading" : undefined}>
        {mode === "calendario" ? (
          <div className={`gt-cal-frame gt-cal-weeks-${weeksNeeded}`}>
            <div className="gt-cal-weekhead" aria-hidden>
              {WEEKDAYS.map((d) => (
                <div key={d} className="gt-cal-weekhead__cell">
                  {d}
                </div>
              ))}
            </div>
            <Calendar
              className="gt-cal-fill"
              value={mes}
              fullscreen
              fullCellRender={(date, info) =>
                info.type === "date" ? renderCell(date as Dayjs) : info.originNode
              }
              headerRender={() => null}
            />
          </div>
        ) : (
          <div ref={tableScrollRef} className="gt-table-frame" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Table<PrevisaoDia>
              rowKey="data"
              dataSource={previsoes}
              columns={columns}
              pagination={false}
              size="middle"
              bordered
              scroll={{ y: scrollY }}
              loading={emptyLoading && previsoes.length === 0}
              locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem previsões" />,
              }}
            />
          </div>
        )}
      </div>

      <div style={styles.totals}>
        <span style={styles.total}>
          <span style={styles.totalLabel}>Valor total previsto no mês</span>
          <span style={{ ...styles.totalValue, ...styles.totalValueBlue }}>{formatCurrency(total)}</span>
        </span>
        <span style={styles.totalDivider} />
        <span style={styles.total}>
          <span style={styles.totalLabel}>Valor médio diário no mês</span>
          <span style={styles.totalValue}>{formatCurrency(media)}</span>
        </span>
        {semPrevisao > 0 && (
          <span style={{ ...styles.total, ...styles.totalRight }}>
            <span style={styles.totalLabel}>
              {semPrevisao === 1 ? "Existe " : "Existem "}
              <span style={styles.totalValue}>{semPrevisao}</span>
              {semPrevisao === 1
                ? " dia sem previsão informada neste mês"
                : " dias sem previsão informada neste mês"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
