// AntD-style Select with custom dropdown menu (portal to body).
const { useState: useSel, useRef: useRSel, useEffect: useESel } = React;

function AntSelect({ value, options, onChange, width, variant = 'outlined' }) {
  const [open, setOpen] = useSel(false);
  const [pos, setPos] = useSel({ left: 0, top: 0, width: 140 });
  const triggerRef = useRSel(null);
  const menuRef = useRSel(null);

  const opts = options.map(o => typeof o === 'object' ? o : { value: o, label: o });
  const current = opts.find(o => o.value === value);

  const measure = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 4, width: r.width });
  };

  const toggle = () => {
    if (!open) measure();
    setOpen(o => !o);
  };

  useESel(() => {
    if (!open) return;
    const onScrollOrResize = () => measure();
    const onMouseDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <React.Fragment>
      <div
        ref={triggerRef}
        className={'ant-select' + (variant === 'borderless' ? ' borderless' : '') + (open ? ' open' : '')}
        style={width != null ? { width } : undefined}
        onClick={toggle}
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        }}
      >
        <span className="ant-select-selection-item">{current ? current.label : ''}</span>
        <span className="ant-select-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </div>
      {open && ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="ant-select-dropdown"
          style={{ left: pos.left, top: pos.top, minWidth: pos.width }}
        >
          <div className="ant-select-item-list" role="listbox">
            {opts.map(o => (
              <div
                key={o.value}
                role="option"
                aria-selected={value === o.value}
                className={
                  'ant-select-item ant-select-item-option' +
                  (value === o.value ? ' ant-select-item-option-selected' : '')
                }
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                <span className="ant-select-item-option-content">{o.label}</span>
                {value === o.value && (
                  <span className="ant-select-item-option-state" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </React.Fragment>
  );
}

window.AntSelect = AntSelect;
