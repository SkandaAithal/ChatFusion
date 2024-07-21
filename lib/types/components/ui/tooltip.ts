export interface TooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  className?: string;
  placement?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}
