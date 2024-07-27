export interface SidePanelProps {
  sheetTrigger: JSX.Element;
  sheetTitle?: string;
  sheetDescription?: string;
  panelContent: JSX.Element;
  sheetCloseButton?: JSX.Element;
  side: "top" | "bottom" | "left" | "right";
}
