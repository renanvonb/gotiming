/* Gotime — Scaffold padrão de tela */

const { useState, useRef, useEffect, useCallback } = React;

/* Tweakable defaults — host rewrites this JSON block on save */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "layout": "B",
  "showGuides": false,
  "showExample": true,
  "moduleName": "Administração de Escala",
  "pageTitle": "Nova escala",
  "primaryAction": "Divulgar",
  "secondaryAction": "Salvar",
  "tertiaryAction": "Excluir",
  "showContext": true,
  "showBack": true,
  "favorited": false
}/*EDITMODE-END*/;

// Read schedule name from URL (?name=...) to override the page title when
// the user arrived here from the Lista de escalas table.
const _urlName = (() => {
  try { return new URLSearchParams(window.location.search).get('name'); }
  catch (e) { return null; }
})();
if (_urlName) TWEAK_DEFAULTS.pageTitle = _urlName;

/* ============================================================================
   Sidebar
   ========================================================================= */
function Sidebar({ openMenu, setOpenMenu }) {
  const toggle = (key) => setOpenMenu(openMenu === key ? null : key);
  const isOpen = (key) => openMenu === key;
  return (
    <aside className="gt-sidebar" data-screen-label="Sidebar">
      <div className="gt-sidebar__logo" title="Goapice">
        <svg width="20" height="23" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.42652 16.4754C4.26556 15.5692 4.14483 14.6631 4.14483 13.6334C4.14483 7.61986 7.40436 3.70696 12.2735 3.70696C15.6135 3.70696 17.7866 4.94262 19.034 7.66105L23.0984 6.7961C21.3278 2.18299 17.6658 0 12.193 0C4.90941 0 0 5.47806 0 13.5922C0 14.9514 0.120723 16.1871 0.36217 17.3815L4.42652 16.4754Z" fill="#fff"/>
          <path d="M11.9571 12.6877V16.3511L17.1298 16.1865L17.6956 16.7628L9.00708 25.4068L11.553 28L20.0395 19.1502L20.5648 19.6853L20.4032 24.954H23.9998V12.6877H11.9571Z" fill="#fadb14"/>
        </svg>
      </div>

      <button
        className={'gt-sidebar__btn' + (isOpen('modulos') ? ' is-active' : '')}
        aria-label="Módulos" data-tooltip="Módulos" data-tooltip-pos="right"
        onClick={() => toggle('modulos')}
      >
        <Ic.Menu />
      </button>

      <div className="gt-sidebar__divider" />

      <div className="gt-sidebar__group">
        <button className={'gt-sidebar__btn' + (isOpen('favoritos') ? ' is-active' : '')} aria-label="Favoritos" data-tooltip="Favoritos" data-tooltip-pos="right" onClick={() => toggle('favoritos')}>
          <Ic.Star />
        </button>
        <button className={'gt-sidebar__btn' + (isOpen('historico') ? ' is-active' : '')} aria-label="Últimos acessos" data-tooltip="Últimos acessos" data-tooltip-pos="right" onClick={() => toggle('historico')}>
          <Ic.Clock />
        </button>
        <button className={'gt-sidebar__btn' + (isOpen('notificacoes') ? ' is-active' : '')} aria-label="Notificações" data-tooltip="Notificações" data-tooltip-pos="right" onClick={() => toggle('notificacoes')}>
          <Ic.Bell />
        </button>
      </div>

      <div className="gt-sidebar__spacer" />

      <div className="gt-sidebar__group">
        <button className="gt-sidebar__btn" id="tweaksSidebarBtn" aria-label="Tweaks" data-tooltip="Tweaks" data-tooltip-pos="right">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V14"/><path d="M4 10V3"/><path d="M12 21V12"/><path d="M12 8V3"/><path d="M20 21V16"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/></svg>
        </button>
        <button className={'gt-sidebar__btn' + (isOpen('solucoes') ? ' is-active' : '')} aria-label="Soluções" data-tooltip="Soluções" data-tooltip-pos="right" onClick={() => toggle('solucoes')}>
          <Ic.Grid />
        </button>
        <button className={'gt-sidebar__btn' + (isOpen('configuracoes') ? ' is-active' : '')} aria-label="Configurações" data-tooltip="Configurações" data-tooltip-pos="right" onClick={() => toggle('configuracoes')}>
          <Ic.Settings />
        </button>
        <button className={'gt-sidebar__avatar' + (isOpen('usuario') ? ' is-active' : '')} aria-label="Usuário" data-tooltip="Usuário" data-tooltip-pos="right" onClick={() => toggle('usuario')}>
          <Ic.User />
        </button>
      </div>
    </aside>
  );
}

/* ============================================================================
   Header
   ========================================================================= */
function Header({ t, setTweak }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(t.pageTitle);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(t.pageTitle); }, [t.pageTitle]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== t.pageTitle) setTweak('pageTitle', next);
    else setDraft(t.pageTitle);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(t.pageTitle);
    setEditing(false);
  };
  const startEdit = () => setEditing(true);

  const goHome = () => {
    window.location.href = 'Lista de escalas.html';
  };

  // Period: last 30 days in dd/mm/yy format
  const fmtShort = (d) =>
    String(d.getDate()).padStart(2, '0') + '/' +
    String(d.getMonth() + 1).padStart(2, '0') + '/' +
    String(d.getFullYear() % 100).padStart(2, '0');
  const _end = new Date();
  const _start = new Date();
  _start.setDate(_start.getDate() - 30);
  const periodLabel = fmtShort(_start) + ' à ' + fmtShort(_end);

  return (
    <header className="gt-header">
      <div className="gt-header__left">
        {t.showBack && (
          <button className="gt-header__back" aria-label="Voltar para tela inicial" data-tooltip="Voltar" onClick={goHome}>
            <Ic.ArrowLeft />
          </button>
        )}
        {editing ? (
          <input
            ref={inputRef}
            className="gt-header__title gt-header__title--input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
              else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
            }}
            spellCheck={false}
          />
        ) : (
          <span
            className="gt-header__title"
            onDoubleClick={startEdit}
            title="Clique duplo ou clique no lápis para renomear"
          >
            {t.pageTitle}
          </span>
        )}
        <button className="gt-header__title-edit" aria-label="Renomear" data-tooltip="Renomear" onClick={startEdit}>
          <Ic.Pencil />
        </button>
        <button
          className={'gt-header__fav' + (t.favorited ? ' is-active' : '')}
          aria-label={t.favorited ? 'Remover dos favoritos' : 'Favoritar'}
          data-tooltip={t.favorited ? 'Remover dos favoritos' : 'Favoritar'}
          onClick={() => setTweak('favorited', !t.favorited)}
        >
          <Ic.Star />
        </button>
      </div>

      <div className="gt-header__right">
        {t.showContext && (
          <div className="gt-header__context">
            <span className="gt-header__context-item" data-tooltip="Unidade">
              <Ic.Store />
              Goapice
            </span>
            <span className="gt-header__context-item" data-tooltip="Período">
              <Ic.Calendar />
              {periodLabel}
            </span>
          </div>
        )}
        {t.tertiaryAction && (
          <button className="gt-btn gt-btn--danger">{t.tertiaryAction}</button>
        )}
        {t.secondaryAction && (
          <button className="gt-btn">{t.secondaryAction}</button>
        )}
        {t.primaryAction && (
          <button className="gt-btn gt-btn--primary">{t.primaryAction}</button>
        )}
      </div>
    </header>
  );
}

/* ============================================================================
   Content blocks — generic & example flavours
   ========================================================================= */
function GenericBlock({ label, title, hint, width }) {
  return (
    <section className="gt-block" style={width ? { maxWidth: width } : null}>
      <div className="gt-block__label">{label}</div>
      <h3 className="gt-block__title">{title}</h3>
      <p className="gt-block__hint">{hint}</p>
      <div className="gt-block__placeholder">Conteúdo</div>
    </section>
  );
}

function ExampleColaboradoresBlock({
  onCollapse, listRef, hoveredId, setHoveredId,
  chartOpen, toggleChart, chartH, chartSeries, setChartSeries,
  chartAnalysis, setChartAnalysis,
  onChartResizeStart, onChartResizeDoubleClick, chartDragging,
  chartHandleHover, setChartHandleHover,
}) {
  const colabs = [
    { name: 'Bruno Colato',                 status: 'Visualizado 18/05/2026' },
    { name: 'Cláudio Fernando Maciel',      status: 'Visualizado 18/05/2026' },
    { name: 'Felipe Braga',                 status: 'Visualizado 17/05/2026' },
    { name: 'Genuir Casagrande',            status: 'Visualizado 17/05/2026' },
    { name: 'Gustavo Westhauser',           status: 'Visualizado 17/05/2026' },
    { name: 'Hoberdan Engel',               status: 'Não visualizado' },
    { name: 'Ivan Carlos Martello',         status: 'Visualizado 17/05/2026' },
    { name: 'Junior Martins',               status: 'Visualizado 17/05/2026' },
    { name: 'Leandro Hermes',               status: 'Visualizado 16/05/2026' },
    { name: 'Marcelo Almeida',              status: 'Visualizado 16/05/2026' },
    { name: 'Marco Santana',                status: 'Visualizado 16/05/2026' },
    { name: 'Mateus Ritter',                status: 'Visualizado 16/05/2026' },
    { name: 'Michel Henrique Chibechinski', status: 'Visualizado 15/05/2026' },
    { name: 'Renan Von Borstel',            status: 'Visualizado 15/05/2026' },
    { name: 'Roberto Perrotti Filho',       status: 'Visualizado 15/05/2026' },
    { name: 'Suzana de Oliveira',           status: 'Não visualizado' },
    { name: 'William Borba',                status: 'Visualizado 14/05/2026' },
  ];

  return (
    <section className="gt-block" style={{ padding: 0 }}>
      {/* Header + Search — fixed top-zone height so rows line up with the timeline */}
      <div style={{
        padding: 16,
        height: 'var(--gt-top-h)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 12,
        borderBottom: '1px solid var(--antd-color-border-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 className="gt-block__title" style={{ fontSize: 14, margin: 0, fontWeight: 600, flex: 1 }}>
            Colaboradores
          </h3>
          {onCollapse && (
            <button
              onClick={onCollapse}
              data-tooltip="Recolher"
              aria-label="Recolher bloco"
              style={{
                width: 24, height: 24, padding: 0, border: 0, background: 'transparent',
                display: 'grid', placeItems: 'center', cursor: 'pointer',
                color: 'var(--antd-color-text-secondary)',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--antd-color-fill-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Ic.CircleChevronLeft />
            </button>
          )}
        </div>

        <div style={{ display: 'flex' }}>
          <input
            className="gt-input"
            placeholder="Buscar"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0 }}
          />
          <button
            aria-label="Buscar"
            data-tooltip="Buscar"
            data-tooltip-pos="top"
            style={{
              width: 32, height: 32, padding: 0,
              border: '1px solid var(--antd-color-border)',
              background: 'var(--antd-color-fill-quaternary)',
              borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
              borderTopRightRadius: 'var(--antd-border-radius)',
              borderBottomRightRadius: 'var(--antd-border-radius)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              color: 'var(--antd-color-text-secondary)',
            }}
          >
            <Ic.Search />
          </button>
        </div>
      </div>

      {/* List */}
      <ul ref={listRef} style={{
        listStyle: 'none', margin: 0, padding: 0,
        flex: 1, overflow: 'auto',
      }}>
        {colabs.map((c, i) => (
          <li
            key={c.name}
            onMouseEnter={() => setHoveredId && setHoveredId(i)}
            onMouseLeave={() => setHoveredId && setHoveredId(null)}
            className={'gt-colab-row' + (hoveredId === i ? ' is-hovered' : '')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 16px',
              height: 'var(--gt-row-h)',
              boxSizing: 'border-box',
              borderBottom: '1px dashed var(--antd-color-border-secondary)',
              cursor: 'default',
            }}
          >
            <div className="gt-avatar">
              <Ic.User />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--antd-color-text)' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--antd-color-text-tertiary)' }}>{c.status}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {chartOpen && (
        <>
          <div
            className={'gt-chart-handle' + (chartDragging ? ' is-dragging' : '') + (chartHandleHover ? ' is-hovered' : '')}
            onMouseDown={onChartResizeStart}
            onDoubleClick={onChartResizeDoubleClick}
            onMouseEnter={() => setChartHandleHover && setChartHandleHover(true)}
            onMouseLeave={() => setChartHandleHover && setChartHandleHover(false)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--tip-x', (e.clientX - rect.left) + 'px');
            }}
            role="separator"
            aria-label="Redimensionar gráfico"
          >
            <span className="gt-chart-handle-tip">Arrastar para redimensionar · clique duplo para resetar</span>
          </div>
          <div className="gt-chart-legend" style={{ height: chartH }}>
            <div className="gt-chart-legend__head">
              <span className="gt-chart-legend__title">Modo análise</span>
              <button
                className="gt-chart-legend__close"
                onClick={toggleChart}
                aria-label="Fechar gráfico"
                data-tooltip="Fechar gráfico"
              >
                <Ic.X />
              </button>
            </div>
            <AntSelect
              value={chartAnalysis}
              onChange={setChartAnalysis}
              options={[
                { value: 'previsto-realizado', label: 'Previsto x Realizado' },
                { value: 'conversao',          label: 'Conversão por hora' },
                { value: 'ticket-medio',       label: 'Ticket médio' },
              ]}
            />
            <div className="gt-chart-legend__rows">
              <label className="gt-chart-legend__row">
                <span className="gt-chart-legend__dot" style={{ background: 'var(--antd-orange)' }} />
                <span className="gt-chart-legend__label">Vendas previstas</span>
                <input
                  type="checkbox"
                  checked={chartSeries.previstas}
                  onChange={(e) => setChartSeries(s => ({ ...s, previstas: e.target.checked }))}
                />
              </label>
              <label className="gt-chart-legend__row">
                <span className="gt-chart-legend__dot" style={{ background: 'var(--antd-cyan)' }} />
                <span className="gt-chart-legend__label">Vendas realizadas</span>
                <input
                  type="checkbox"
                  checked={chartSeries.realizadas}
                  onChange={(e) => setChartSeries(s => ({ ...s, realizadas: e.target.checked }))}
                />
              </label>
            </div>
          </div>
        </>
      )}

      {/* Footer — fixed height matched to the timeline totals row */}
      <div style={{
        height: 'var(--gt-footer-h)',
        boxSizing: 'border-box',
        padding: '12px 16px',
        borderTop: '1px solid var(--antd-color-border-secondary)',
        fontSize: 13, fontWeight: 600,
        color: 'var(--antd-color-text)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{ flex: 1 }}>Total de PDVs abertos</span>
        <button
          onClick={toggleChart}
          aria-label={chartOpen ? 'Ocultar gráfico' : 'Mostrar gráfico'}
          data-tooltip={chartOpen ? 'Ocultar gráfico' : 'Mostrar gráfico'}
          style={{
            width: 22, height: 22, padding: 0, border: 0, background: 'transparent',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            color: chartOpen ? 'var(--antd-color-primary)' : 'var(--antd-color-text-secondary)',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--antd-color-fill-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Ic.LineChart />
        </button>
      </div>
    </section>
  );
}

function ExampleTimelineBlock({
  bodyRef, hoveredId, setHoveredId,
  chartOpen, chartH, chartSeries,
  onChartResizeStart, onChartResizeDoubleClick, chartDragging,
  chartHandleHover, setChartHandleHover,
}) {
  const [viewMode, setViewMode] = useState('day');
  const [scrolled, setScrolled] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const innerRef = useRef(null);
  // Time domain — full 24-hour day
  const START = 0;
  const END   = 24;
  const HOUR_W = 80; // px per hour — drives the min-width of the inner track
  const hourLabels = Array.from({ length: END - START + 1 }, (_, i) => START + i); // 00..24

  const t = (h, m = 0) => h + m / 60;
  const fmt = (n) => {
    const h = Math.floor(n);
    const m = Math.round((n - h) * 60);
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  };

  // Day label — stateful so user can navigate days. Format "01 de nov. 2026".
  const [displayedDate, setDisplayedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const monthsAbbr = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dayLabel =
    weekdays[displayedDate.getDay()] + ', ' +
    String(displayedDate.getDate()).padStart(2, '0') +
    ' de ' + monthsAbbr[displayedDate.getMonth()] + '. ' + displayedDate.getFullYear();
  const goPrev = () => {
    const d = new Date(displayedDate);
    d.setDate(d.getDate() - 1);
    setDisplayedDate(d);
  };
  const goNext = () => {
    const d = new Date(displayedDate);
    d.setDate(d.getDate() + 1);
    setDisplayedDate(d);
  };
  const _today = new Date();
  const isToday =
    displayedDate.getDate() === _today.getDate() &&
    displayedDate.getMonth() === _today.getMonth() &&
    displayedDate.getFullYear() === _today.getFullYear();

  // 17 colaboradores mocked. Shift pattern: rotates start times among 8/9/10/14h
  // so the timeline shows a realistic blend of openings throughout the day.
  const rows = !isToday ? Array(17).fill({ blocks: [] }) : [
    { pdv: 'PDV 1',  start: 8 },
    { pdv: 'PDV 2',  start: 8 },
    { pdv: 'PDV 3',  start: 8 },
    { pdv: 'PDV 4',  start: 8 },
    { pdv: 'PDV 5',  start: 9 },
    { pdv: 'PDV 6',  start: 9 },
    { pdv: 'PDV 7',  start: 9 },
    { pdv: 'PDV 8',  start: 9 },
    { pdv: 'PDV 9',  start: 10 },
    { pdv: 'PDV 10', start: 10 },
    { pdv: 'PDV 11', start: 10 },
    { pdv: 'PDV 12', start: 10 },
    { pdv: 'PDV 13', start: 14 },
    { pdv: 'PDV 14', start: 14 },
    { pdv: 'PDV 15', start: 14 },
    null,
    null,
  ].map((r) => {
    if (!r) return { blocks: [] };
    const breakStart = r.start === 8 ? t(12, 0) : t(12, 20);
    const breakEnd   = r.start === 8 ? t(13, 20) : t(13, 40);
    return {
      blocks: [
        { type: 'trabalha',  start: r.start, end: breakStart, pdv: r.pdv, range: fmt(r.start) + ' às ' + fmt(breakStart) },
        { type: 'intervalo', start: breakStart, end: breakEnd, range: fmt(breakStart) + ' às ' + fmt(breakEnd) },
        { type: 'trabalha',  start: breakEnd, end: 18, pdv: r.pdv, range: fmt(breakEnd) + ' às 18:00' },
      ],
    };
  });

  // Totals per 30-min slot, positioned at each hour AND half-hour mark.
  // Counts how many "trabalha" bars are active during that slot. Zero when not today.
  const totalSlots = (END - START) * 2; // 48 slots (every 30 minutes)
  const totals = !isToday ? Array(totalSlots).fill(0) : Array.from({ length: totalSlots }, (_, i) => {
    const start = START + i * 0.5;
    const end = start + 0.5;
    let count = 0;
    rows.forEach(({ blocks }) => {
      blocks.forEach((b) => {
        if (b.type === 'trabalha' && b.start < end && b.end > start) count += 1;
      });
    });
    return count;
  });

  // "Now" marker — reads the real current time, ticks every minute
  const [nowTime, setNowTime] = useState(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNowTime(d.getHours() + d.getMinutes() / 60);
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  const NOW = nowTime;
  const showNow = isToday && NOW >= START && NOW <= END;

  const RANGE = END - START;
  const pct = (h) => ((h - START) / RANGE) * 100;

  // Row height — driven by --gt-row-h CSS var to stay in sync with the colaboradores list

  // Hover-over-timeline: show time + counts tooltip that follows the cursor,
  // plus a darker vertical line at that exact time.
  const onTimelineMouseMove = (e) => {
    const inner = innerRef.current;
    if (!inner) return;
    // Suppress the timeline hover when the cursor is over the chart area —
    // the chart shows its own series tooltip there.
    if (e.target.closest && e.target.closest('.tl__chart')) {
      if (hoverInfo) setHoverInfo(null);
      return;
    }
    const r = inner.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < 0 || x > r.width) return;
    const hourFloat = START + (x / r.width) * (END - START);
    if (hourFloat < START || hourFloat > END) return;
    // Snap to nearest hour increment
    const hourSnapped = Math.round(hourFloat);
    let working = 0;
    if (isToday) {
      rows.forEach(({ blocks }) => {
        blocks.forEach((b) => {
          if (b.type === 'trabalha' && hourSnapped >= b.start && hourSnapped < b.end) working += 1;
        });
      });
    }
    setHoverInfo({
      mouseX: e.clientX,
      mouseY: e.clientY,
      hourFloat: hourSnapped,
      time: fmt(hourSnapped),
      working,
    });
  };
  const onTimelineMouseLeave = () => setHoverInfo(null);

  // Scroll the timeline so the current time is centered on mount.
  // Show the left-edge shadow only WHILE the user is actively scrolling.
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const d = new Date();
    const hour = d.getHours() + d.getMinutes() / 60;
    const target = Math.max(0, hour * HOUR_W - el.clientWidth / 2);
    el.scrollLeft = target;
    let timer;
    const onScroll = () => {
      setScrolled(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolled(false), 600);
    };
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className={'gt-block tl' + (scrolled ? ' is-scrolled-x' : '')}>
      {/* Toolbar (3-col grid: empty | day-nav center | actions right) */}
      <div className="tl__toolbar">
        <div className="tl__toolbar-left">
          <AntSelect
            value={viewMode}
            onChange={setViewMode}
            variant="borderless"
            options={[
              { value: 'day',   label: 'Dia' },
              { value: 'week',  label: 'Semana' },
              { value: 'month', label: 'Mês' },
            ]}
          />
        </div>
        <div className="tl__toolbar-center">
          <button className="tl__nav-btn" aria-label="Dia anterior" data-tooltip="Dia anterior" onClick={goPrev}><Ic.ChevronLeft /></button>
          <span className="tl__date">{dayLabel}</span>
          <button className="tl__nav-btn" aria-label="Próximo dia" data-tooltip="Próximo dia" onClick={goNext}><Ic.ChevronRight /></button>
        </div>
        <div className="tl__toolbar-right">
          <button className="tl__icon-btn" aria-label="Imprimir" data-tooltip="Imprimir"><Ic.Printer /></button>
          <button className="tl__icon-btn" aria-label="Tela cheia" data-tooltip="Tela cheia"><Ic.Maximize /></button>
        </div>
      </div>

      {/* Horizontal scroll wrapper around ruler + body + totals */}
      <div className="tl__scroll-x" ref={scrollRef}>
        <div className="tl__inner" ref={innerRef} style={{ minWidth: (END - START) * HOUR_W }}
             onMouseMove={onTimelineMouseMove} onMouseLeave={onTimelineMouseLeave}>
          {/* Vertical gridlines at each hour — span from below the ruler
              through the body and into the totals footer, visually linking
              each totals cell to its hour in the ruler. */}
          <div className="tl__gridlines">
            {hourLabels.map((h) => (
              <span key={h} className="tl__gridline" style={{ left: `${pct(h)}%` }} />
            ))}
            {hoverInfo && (
              <span className="tl__gridline tl__gridline--hover" style={{ left: `${pct(hoverInfo.hourFloat)}%` }} />
            )}
          </div>
          {/* Time ruler */}
          <div className="tl__ruler">
            <div className="tl__ruler-track">
              {hourLabels.slice(0, -1).map((h, i) => (
                <div key={h} className="tl__ruler-cell" style={{ width: `${100 / RANGE}%` }}>
                  <span className="tl__ruler-label">{fmt(h)}</span>
                  <span className="tl__ruler-tick tl__ruler-tick--hour" />
                  <span className="tl__ruler-tick tl__ruler-tick--half" />
                </div>
              ))}
            </div>
          </div>

          {/* Now dot — in the inner track so it scrolls with the timeline */}
          {showNow && (
            <div className="tl__now-dot" style={{ left: `${pct(NOW)}%` }} />
          )}

          {/* Body */}
          <div className="tl__body" ref={bodyRef}>
            {showNow && (
              <div className="tl__now" style={{ left: `${pct(NOW)}%` }} />
            )}

            {/* Rows */}
            <div className="tl__rows">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={'tl__row' + (hoveredId === i ? ' is-hovered' : '')}
                  onMouseEnter={() => setHoveredId && setHoveredId(i)}
                  onMouseLeave={() => setHoveredId && setHoveredId(null)}
                >
                  {row.blocks.map((b, j) => (
                    <div
                      key={j}
                      className={'tl__bar tl__bar--' + b.type}
                      style={{ left: `${pct(b.start)}%`, width: `${pct(b.end) - pct(b.start)}%` }}
                    >
                      <strong>{b.type === 'trabalha' ? 'Trabalha' : 'Intervalo'}</strong>
                      <span>{b.range}</span>
                      {b.pdv && <span>{b.pdv}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {chartOpen && (
            <>
              <div
                className={'gt-chart-handle' + (chartDragging ? ' is-dragging' : '') + (chartHandleHover ? ' is-hovered' : '')}
                onMouseDown={onChartResizeStart}
                onDoubleClick={onChartResizeDoubleClick}
                onMouseEnter={() => setChartHandleHover && setChartHandleHover(true)}
                onMouseLeave={() => setChartHandleHover && setChartHandleHover(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--tip-x', (e.clientX - rect.left) + 'px');
                }}
                role="separator"
                aria-label="Redimensionar gráfico"
              >
                <span className="gt-chart-handle-tip">Arrastar para redimensionar · clique duplo para resetar</span>
              </div>
              <div className="tl__chart" style={{ height: chartH }}>
                <SalesChart
                width={(END - START) * HOUR_W}
                height={chartH}
                hours={hourLabels.length}
                showPredicted={chartSeries.previstas}
                showRealized={chartSeries.realizadas}
                  isToday={isToday}
                />
              </div>
            </>
          )}

          {/* Totals footer — one number per hour, positioned directly under
              the corresponding ruler hour label / gridline. Top edge has
              hour + half-hour ticks mirroring the ruler. */}
          <div className="tl__totals">
            <div className="tl__totals-track">
              {hourLabels.slice(0, -1).map((h) => (
                <React.Fragment key={'t' + h}>
                  <span className="tl__totals-tick tl__totals-tick--hour" style={{ left: `${pct(h)}%` }} />
                  <span className="tl__totals-tick tl__totals-tick--half" style={{ left: `${pct(h + 0.5)}%` }} />
                </React.Fragment>
              ))}
              {totals.map((n, i) => (
                <div key={i} className="tl__totals-cell" style={{ left: `${(i * 0.5 / RANGE) * 100}%` }}>
                  <span>{String(n).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {hoverInfo && ReactDOM.createPortal(
        <div className="tl__hover-tooltip"
             style={{ left: hoverInfo.mouseX + 14, top: hoverInfo.mouseY + 18 }}>
          <div className="tl__hover-tooltip-time">{hoverInfo.time}</div>
          <div>{hoverInfo.working} {hoverInfo.working === 1 ? 'colaborador' : 'colaboradores'}</div>
          <div>{hoverInfo.working} {hoverInfo.working === 1 ? 'PDV aberto' : 'PDVs abertos'}</div>
        </div>,
        document.body
      )}
    </section>
  );
}

/* ============================================================================
   Sales chart — Vendas previstas (orange) vs Vendas realizadas (cyan).
   Renders 24 hourly data points as smooth line series, scaled to the
   timeline's inner width so X positions align with the ruler / totals.
   ========================================================================= */
function SalesChart({ width, height, hours, showPredicted, showRealized, isToday }) {
  // Deterministic pseudo-random hourly data in R$ (1.500 – 5.500 range).
  // Hours 00:00 – 07:00 are zeroed (store closed).
  const seed = (n) => ((Math.sin(n * 12.9898 + 4.1414) * 43758.5453) % 1 + 1) % 1;
  const predicted = Array.from({ length: hours - 1 }, (_, i) =>
    i < 8 ? 0 : 1500 + Math.round(seed(i + 1) * 3500));
  const realized  = Array.from({ length: hours - 1 }, (_, i) =>
    i < 8 ? 0 : 1800 + Math.round(seed(i + 1 + 99) * 3800));
  // For non-today days we still show flat-zero series so the panel doesn't look empty
  const safe = (arr) => isToday ? arr : arr.map(() => 0);
  const series = [
    { key: 'previstas',   label: 'Vendas previstas',  color: 'var(--antd-orange)', data: safe(predicted), show: showPredicted },
    { key: 'realizadas',  label: 'Vendas realizadas', color: 'var(--antd-cyan)',   data: safe(realized),  show: showRealized  },
  ];

  const fmtBRL = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');

  const padX = 0;
  const padY = 12;
  const innerW = Math.max(1, width - padX * 2);
  const innerH = Math.max(1, height - padY * 2);
  const allValues = series.flatMap(s => s.show ? s.data : []);
  const maxV = allValues.length ? Math.max(1000, ...allValues) : 1000;
  const xAt = (i) => padX + (i / (hours - 1)) * innerW;
  const yAt = (v) => padY + innerH - (v / maxV) * innerH;

  const buildPath = (data) => {
    if (!data.length) return '';
    let d = `M ${xAt(0)} ${yAt(data[0])}`;
    for (let i = 0; i < data.length - 1; i++) {
      const x0 = xAt(i), y0 = yAt(data[i]);
      const x1 = xAt(i + 1), y1 = yAt(data[i + 1]);
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };

  const fmtTime = (i) => String(i).padStart(2, '0') + ':00';
  const [hover, setHover] = useState(null); // { i, mouseX, mouseY }

  // Wrap each x-index in a transparent hover zone half-hour wide on each side
  const zones = Array.from({ length: hours - 1 }, (_, i) => i);

  return (
    <div className="tl__chart-wrap"
         onMouseLeave={() => setHover(null)}>
      <svg
        className="tl__chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
      >
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={0} x2={width} y1={padY + innerH * p} y2={padY + innerH * p}
                stroke="var(--antd-color-border-secondary)" strokeWidth="1" />
        ))}
        {series.map((s, idx) => s.show && s.data.length > 0 && (
          <g key={idx}>
            <path d={buildPath(s.data)} fill="none" stroke={s.color} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(v)} r={hover && hover.i === i ? 4.5 : 3}
                      fill="var(--antd-color-bg-container)"
                      stroke={s.color} strokeWidth="1.5" />
            ))}
          </g>
        ))}
        {hover && (
          <line x1={xAt(hover.i)} x2={xAt(hover.i)} y1={padY} y2={padY + innerH}
                stroke="var(--antd-color-text-tertiary)"
                strokeDasharray="3 3" strokeWidth="1" />
        )}
      </svg>
      {/* Invisible hover-zones above the SVG for per-hour pointer interaction */}
      <div className="tl__chart-zones">
        {zones.map((i) => (
          <div
            key={i}
            className="tl__chart-zone"
            style={{ left: `${(i / (hours - 1)) * 100}%`, width: `${100 / (hours - 1)}%` }}
            onMouseEnter={(e) => setHover({ i, mouseX: e.clientX, mouseY: e.clientY })}
            onMouseMove={(e) => setHover({ i, mouseX: e.clientX, mouseY: e.clientY })}
          />
        ))}
      </div>
      {hover && ReactDOM.createPortal(
        <div className="tl__chart-tooltip"
             style={{ left: hover.mouseX + 14, top: hover.mouseY + 18 }}>
          <div className="tl__chart-tooltip-time">{fmtTime(hover.i)}</div>
          {series.filter(s => s.show).map((s) => (
            <div key={s.key} className="tl__chart-tooltip-row">
              <span className="tl__chart-tooltip-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
              <span className="tl__chart-tooltip-val">{fmtBRL(s.data[hover.i])}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ============================================================================
   Block layouts (A / B / C / D)
   ========================================================================= */
function CollapsedRail({ title, onExpand }) {
  return (
    <div
      className="gt-rail"
      onClick={onExpand}
      role="button"
      aria-label={`Expandir ${title}`}
      title="Expandir"
    >
      <button
        className="gt-rail__btn"
        onClick={(e) => { e.stopPropagation(); onExpand(); }}
        aria-label="Expandir"
        data-tooltip="Expandir"
        data-tooltip-pos="right"
      >
        <Ic.CircleChevronRight />
      </button>
      <span className="gt-rail__title">{title}</span>
    </div>
  );
}

function LayoutB({ showExample }) {
  const DEFAULT = 261;
  const containerRef = useRef(null);
  const [bLeft, setBLeft] = useState(DEFAULT);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Chart state (Vendas previstas vs realizadas)
  const [chartOpen, setChartOpen] = useState(false);
  const [chartH, setChartH] = useState(180);
  const [chartSeries, setChartSeries] = useState({ previstas: true, realizadas: true });
  const [chartAnalysis, setChartAnalysis] = useState('previsto-realizado');
  const [chartDragging, setChartDragging] = useState(false);
  const [chartHandleHover, setChartHandleHover] = useState(false);
  const toggleChart = () => setChartOpen(v => !v);
  // Max height = container height minus the colaboradores top-zone (100) and footer (44)
  // so the chart can grow up to the top of the rows area.
  const maxChartH = () => {
    const c = containerRef.current;
    if (!c) return 400;
    return Math.max(120, c.getBoundingClientRect().height - 100 - 44 - 12);
  };
  const onChartResizeStart = (e) => {
    e.preventDefault();
    setChartDragging(true);
    const startY = e.clientY;
    const startH = chartH;
    const onMove = (ev) => {
      const next = Math.min(Math.max(120, startH - (ev.clientY - startY)), maxChartH());
      setChartH(next);
    };
    const onUp = () => {
      setChartDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const onChartResizeDoubleClick = () => setChartH(180);

  // Vertical scroll sync between the colaboradores list and the timeline body
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  useEffect(() => {
    const a = leftScrollRef.current;
    const b = rightScrollRef.current;
    if (!a || !b) return;
    let syncing = false;
    const onA = () => {
      if (syncing) return;
      syncing = true;
      b.scrollTop = a.scrollTop;
      requestAnimationFrame(() => { syncing = false; });
    };
    const onB = () => {
      if (syncing) return;
      syncing = true;
      a.scrollTop = b.scrollTop;
      requestAnimationFrame(() => { syncing = false; });
    };
    a.addEventListener('scroll', onA);
    b.addEventListener('scroll', onB);
    return () => {
      a.removeEventListener('scroll', onA);
      b.removeEventListener('scroll', onB);
    };
  }, [collapsed, showExample]);

  const animate = useCallback((fn) => {
    setAnimating(true);
    fn();
    setTimeout(() => setAnimating(false), 360);
  }, []);

  const collapse = useCallback(() => animate(() => setCollapsed(true)), [animate]);
  const expand = useCallback(() => animate(() => setCollapsed(false)), [animate]);

  const onSplitterDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startW = bLeft;
    const onMove = (ev) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const max = rect ? rect.width / 2 : 800;
      const w = Math.max(DEFAULT, Math.min(max, startW + (ev.clientX - startX)));
      setBLeft(w);
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [bLeft]);

  const onSplitterDoubleClick = useCallback(() => {
    setAnimating(true);
    setBLeft(DEFAULT);
    setTimeout(() => setAnimating(false), 360);
  }, []);

  const leftWidth = collapsed ? 48 : bLeft;

  return (
    <div
      ref={containerRef}
      className={'gt-blocks gt-blocks--B' + (collapsed ? ' is-collapsed' : '')}
    >
      <div
        className={'gt-pane-left' + (animating ? ' is-animating' : '') + (collapsed ? ' is-collapsed' : '')}
        style={{ width: leftWidth }}
      >
        {collapsed
          ? <CollapsedRail title="Colaboradores" onExpand={expand} />
          : <ExampleColaboradoresBlock
              onCollapse={collapse}
              listRef={leftScrollRef}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              chartOpen={chartOpen}
              toggleChart={toggleChart}
              chartH={chartH}
              chartSeries={chartSeries}
              setChartSeries={setChartSeries}
              chartAnalysis={chartAnalysis}
              setChartAnalysis={setChartAnalysis}
              onChartResizeStart={onChartResizeStart}
              onChartResizeDoubleClick={onChartResizeDoubleClick}
              chartDragging={chartDragging}
              chartHandleHover={chartHandleHover}
              setChartHandleHover={setChartHandleHover}
            />
        }
      </div>
      {!collapsed && (
        <div
          className={'gt-splitter' + (dragging ? ' is-dragging' : '')}
          onMouseDown={onSplitterDown}
          onDoubleClick={onSplitterDoubleClick}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--tip-y', (e.clientY - rect.top) + 'px');
          }}
          role="separator"
          aria-orientation="vertical"
        >
          <span className="gt-splitter-tip">Arrastar para redimensionar · clique duplo para resetar</span>
        </div>
      )}
      <div className="gt-pane-right">
        {showExample
          ? <ExampleTimelineBlock
              bodyRef={rightScrollRef}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              chartOpen={chartOpen}
              chartH={chartH}
              chartSeries={chartSeries}
              onChartResizeStart={onChartResizeStart}
              onChartResizeDoubleClick={onChartResizeDoubleClick}
              chartDragging={chartDragging}
              chartHandleHover={chartHandleHover}
              setChartHandleHover={setChartHandleHover}
            />
          : <GenericBlock label="Bloco central · flexível" title="Conteúdo principal" hint="Cresce para preencher o espaço disponível. Use para a visualização principal da tela." />
        }
      </div>
    </div>
  );
}

function BlocksLayout({ layout, showExample }) {
  const dRef = useRef(null);
  const [dLeft, setDLeft] = useState(320);

  // Resize handler for layout D
  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = dLeft;
    const handle = e.currentTarget;
    handle.classList.add('is-active');
    const onMove = (ev) => {
      const next = Math.min(Math.max(160, startW + (ev.clientX - startX)), 800);
      setDLeft(next);
    };
    const onUp = () => {
      handle.classList.remove('is-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [dLeft]);

  if (layout === 'A') {
    return (
      <div className="gt-blocks gt-blocks--A">
        {showExample
          ? <ExampleTimelineBlock />
          : <GenericBlock label="Bloco único" title="Conteúdo de largura total" hint="Use para listagens, dashboards densos ou visualizações que precisam do máximo de horizontalidade." />
        }
      </div>
    );
  }
  if (layout === 'B') {
    return <LayoutB showExample={showExample} />;
  }
  if (layout === 'C') {
    return (
      <div className="gt-blocks gt-blocks--C">
        <GenericBlock label="Lateral esq · 261px" title="Navegação / Filtros" hint="Lista de itens, filtros, árvore de navegação." />
        {showExample
          ? <ExampleTimelineBlock />
          : <GenericBlock label="Bloco central · flexível" title="Conteúdo principal" hint="Visualização principal entre os dois painéis." />
        }
        <GenericBlock label="Lateral dir · 261px" title="Detalhes / Inspector" hint="Detalhes do item selecionado, ações contextuais, propriedades." />
      </div>
    );
  }
  // D — glued resizable
  return (
    <div
      ref={dRef}
      className="gt-blocks gt-blocks--D"
      style={{ '--d-left': dLeft + 'px' }}
    >
      <GenericBlock label="Bloco esquerdo" title="Lista / Origem" hint="Lado esquerdo colado ao divisor. Arraste a handle para redimensionar." />
      <div className="gt-resize-handle" onMouseDown={onResizeStart} role="separator" aria-label="Redimensionar" />
      <GenericBlock label="Bloco direito" title="Detalhe / Destino" hint="Lado direito colado ao divisor — sem espaçamento entre os blocos." />
    </div>
  );
}

/* ============================================================================
   Spacing guides overlay
   ========================================================================= */
function SpacingGuides() {
  return (
    <div className="gt-guides">
      {/* Top (0 — content meets the header) */}
      <div className="gt-guides__line gt-guides__line--h" style={{ top: 0 }} />
      <div className="gt-guides__chip" style={{ left: '50%', top: 4, transform: 'translateX(-50%)' }}>0</div>

      {/* Left (24) */}
      <div className="gt-guides__line gt-guides__line--v" style={{ left: 0 }} />
      <div className="gt-guides__chip" style={{ left: 4, top: '50%' }}>24</div>
      <div className="gt-guides__line gt-guides__line--v" style={{ left: 24 }} />

      {/* Right (24) */}
      <div className="gt-guides__line gt-guides__line--v" style={{ right: 0 }} />
      <div className="gt-guides__chip" style={{ right: 4, top: '50%' }}>24</div>
      <div className="gt-guides__line gt-guides__line--v" style={{ right: 24 }} />

      {/* Bottom (24) */}
      <div className="gt-guides__line gt-guides__line--h" style={{ bottom: 0 }} />
      <div className="gt-guides__chip" style={{ left: '50%', bottom: 4, transform: 'translateX(-50%)' }}>24</div>
      <div className="gt-guides__line gt-guides__line--h" style={{ bottom: 24 }} />
    </div>
  );
}

/* ============================================================================
   Global tooltips — portal-rendered so they escape overflow:hidden ancestors.
   ========================================================================= */
function GlobalTooltips() {
  const [state, setState] = useState(null);
  const timerRef = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    const show = (target) => {
      const text = target.getAttribute('data-tooltip');
      if (!text) return;
      const pos = target.getAttribute('data-tooltip-pos') || 'top';
      elRef.current = target;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const r = target.getBoundingClientRect();
        setState({ text, pos, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height } });
      }, 100);
    };
    const hide = () => {
      clearTimeout(timerRef.current);
      elRef.current = null;
      setState(null);
    };
    const onOver = (e) => {
      const el = e.target.closest && e.target.closest('[data-tooltip]');
      if (!el || el === elRef.current) return;
      show(el);
    };
    const onOut = (e) => {
      const el = e.target.closest && e.target.closest('[data-tooltip]');
      if (!el) return;
      const next = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-tooltip]');
      if (next === el) return;
      hide();
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('scroll', hide, true);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('scroll', hide, true);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!state) return null;
  const { text, pos, rect } = state;
  const style = { position: 'fixed' };
  switch (pos) {
    case 'bottom':
      style.left = rect.left + rect.width / 2;
      style.top = rect.bottom + 8;
      style.transform = 'translate(-50%, 0)';
      break;
    case 'left':
      style.left = rect.left - 8;
      style.top = rect.top + rect.height / 2;
      style.transform = 'translate(-100%, -50%)';
      break;
    case 'right':
      style.left = rect.right + 20;
      style.top = rect.top + rect.height / 2;
      style.transform = 'translate(0, -50%)';
      break;
    case 'top':
    default:
      style.left = rect.left + rect.width / 2;
      style.top = rect.top - 8;
      style.transform = 'translate(-50%, -100%)';
      break;
  }
  return ReactDOM.createPortal(
    <div className={'gt-tooltip gt-tooltip--' + pos + ' is-visible'} style={style}>
      {text}
    </div>,
    document.body
  );
}

/* ============================================================================
   Side menu drawer — opens from the sidebar's hamburger button
   ========================================================================= */
const MENUS = {
  modulos: {
    title: 'Módulos',
    content: (
      <nav className="gt-sidemenu__nav">
        <a className="gt-sidemenu__item" href="Lista de escalas.html">
          <Ic.List />
          <span>Lista de escalas</span>
        </a>
        <a className="gt-sidemenu__item" href="Administração de escala.html">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          <span>Administração de escala</span>
        </a>
        <a className="gt-sidemenu__item" href="Configurações.html">
          <Ic.Settings2 />
          <span>Configurações</span>
        </a>
      </nav>
    ),
  },
  favoritos:    { title: 'Favoritos',         content: <div className="gt-sidemenu__body" /> },
  historico:    { title: 'Últimos acessos',   content: <div className="gt-sidemenu__body" /> },
  notificacoes: { title: 'Notificações',      content: <div className="gt-sidemenu__body" /> },
  solucoes:     { title: 'Soluções',          content: <div className="gt-sidemenu__body" /> },
  configuracoes:{ title: 'Configurações',     content: <div className="gt-sidemenu__body" /> },
  usuario:      { title: 'Usuário',           content: <div className="gt-sidemenu__body" /> },
};


function SideMenu({ openMenu, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [renderedMenu, setRenderedMenu] = useState(null);

  useEffect(() => {
    if (openMenu) {
      setRenderedMenu(openMenu);
      setMounted(true);
      let id2;
      const id = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(id);
        if (id2) cancelAnimationFrame(id2);
      };
    } else {
      setVisible(false);
      const t = setTimeout(() => { setMounted(false); setRenderedMenu(null); }, 320);
      return () => clearTimeout(t);
    }
  }, [openMenu]);

  if (!mounted || !renderedMenu) return null;
  const cfg = MENUS[renderedMenu] || { title: '', content: null };

  return (
    <>
      <div className={'gt-sidemenu-mask' + (visible ? ' is-open' : '')} onClick={onClose} />
      <aside className={'gt-sidemenu' + (visible ? ' is-open' : '')} aria-hidden={!visible}>
        <div className="gt-sidemenu__head">
          <span className="gt-sidemenu__title">{cfg.title}</span>
          <button
            className="gt-sidemenu__close"
            onClick={onClose}
            aria-label="Fechar menu"
            data-tooltip="Fechar"
          >
            <Ic.X />
          </button>
        </div>
        {cfg.content || <div className="gt-sidemenu__body" />}
      </aside>
    </>
  );
}

/* ============================================================================
   App
   ========================================================================= */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openMenu, setOpenMenu] = useState(null);

  // Apply theme to <html> (sidebar stays black via its own hardcoded styles)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme === 'dark' ? 'dark' : 'light');
    return () => document.documentElement.removeAttribute('data-theme');
  }, [t.theme]);

  return (
    <div className="gt-app" data-guides={t.showGuides ? '1' : '0'}>
      <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <SideMenu openMenu={openMenu} onClose={() => setOpenMenu(null)} />
      <div className="gt-main">
        <Header t={t} setTweak={setTweak} />
        <div className="gt-content" data-screen-label="Content">
          <BlocksLayout layout={t.layout} showExample={t.showExample} />
          {t.showGuides && <SpacingGuides />}
        </div>
      </div>

      <GlobalTooltips />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
