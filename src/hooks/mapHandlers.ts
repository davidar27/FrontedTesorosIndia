import React from "react";

export function handleMouseEnter(
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) {
  setShowTooltip(true);
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    setShowTooltip(false);
  }, 4000);
}

export function handleMouseLeave(
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  setShowTooltip(false);
}
