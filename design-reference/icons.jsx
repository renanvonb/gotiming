/* Lucide icons used by the Gotime scaffold (inline SVG paths, 24-unit viewBox, 2px stroke).
   Exported to window for cross-script use. */

const SVGProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  xmlns: 'http://www.w3.org/2000/svg',
};

const Ic = {
  Menu:    (p) => <svg {...SVGProps} {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  Star:    (p) => <svg {...SVGProps} {...p}><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>,
  Clock:   (p) => <svg {...SVGProps} {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Bell:    (p) => <svg {...SVGProps} {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Grid:    (p) => <svg {...SVGProps} {...p}><circle cx="5" cy="5" r="1.2"/><circle cx="12" cy="5" r="1.2"/><circle cx="19" cy="5" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="19" r="1.2"/><circle cx="12" cy="19" r="1.2"/><circle cx="19" cy="19" r="1.2"/></svg>,
  Settings:(p) => <svg {...SVGProps} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  ArrowLeft:(p)=> <svg {...SVGProps} {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Pencil:  (p) => <svg {...SVGProps} {...p}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>,
  Search:  (p) => <svg {...SVGProps} {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Calendar:(p) => <svg {...SVGProps} {...p}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
  Plus:    (p) => <svg {...SVGProps} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Download:(p) => <svg {...SVGProps} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Filter:  (p) => <svg {...SVGProps} {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Layers:  (p) => <svg {...SVGProps} {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  CircleChevronLeft:  (p) => <svg {...SVGProps} {...p}><circle cx="12" cy="12" r="10"/><path d="m14 16-4-4 4-4"/></svg>,
  CircleChevronRight: (p) => <svg {...SVGProps} {...p}><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/></svg>,
  ChevronLeft:  (p) => <svg {...SVGProps} {...p}><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: (p) => <svg {...SVGProps} {...p}><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronDown:  (p) => <svg {...SVGProps} {...p}><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp:    (p) => <svg {...SVGProps} {...p}><polyline points="18 15 12 9 6 15"/></svg>,
  X:            (p) => <svg {...SVGProps} {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  LineChart:    (p) => <svg {...SVGProps} {...p}><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  List:         (p) => <svg {...SVGProps} {...p}><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>,
  Settings2:    (p) => <svg {...SVGProps} {...p}><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>,
  Users:        (p) => <svg {...SVGProps} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Printer:      (p) => <svg {...SVGProps} {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Maximize:     (p) => <svg {...SVGProps} {...p}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Store:        (p) => <svg {...SVGProps} {...p}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63l-.41-.37l-.41.37A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63l-.41-.37l-.41.37A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63L10 11l-.41.37A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63L6 11l-.41.37A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>,
  User:         (p) => <svg {...SVGProps} {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

Object.assign(window, { Ic });
