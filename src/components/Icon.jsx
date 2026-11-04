// Small line-icon set for the home page (Lucide-style 24px paths).
const PATHS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></>,
  templates: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  designs: <><rect x="3" y="4" width="14" height="16" rx="2" /><path d="M21 7v10" /><path d="M7 9h6M7 13h4" /></>,
  layouts: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 12h18M12 3v18" /></>,
  stickers: <><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9.5L21 14.5V5a2 2 0 0 0-2-2h-3.5" /><path d="M14 21v-5a2 2 0 0 1 2-2h5" /><path d="M8 13s1.5 2 4 2" /><path d="M9 9h.01M15 9h.01" /></>,
  explore: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  flame: <path d="M12 21c-3.9 0-7-2.8-7-6.6 0-2.6 1.5-4.4 3-5.9.3 1.6 1.2 2.7 2.3 3.1C10 8.6 11.3 5.4 14 3c.4 3 2 4.6 3.4 6.3C18.6 10.8 19 12.3 19 14.4 19 18.2 15.9 21 12 21Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  close: <path d="m7 7 10 10M17 7 7 17" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.8 8.5 8.5 0 1 0 20.5 14.5Z" />,
  sparkles: <><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  photo: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
}

export default function Icon({ name, size = 20, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
      {PATHS[name]}
    </svg>
  )
}
