import { useMemo, useState } from "react";

interface HoverHandlers {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function useHover(): [boolean, HoverHandlers] {
  const [hovered, setHovered] = useState(false);
  const handlers = useMemo<HoverHandlers>(
    () => ({
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    }),
    []
  );
  return [hovered, handlers];
}
