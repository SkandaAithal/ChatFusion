export interface SidePanelProps {
  sheetTitle?: string;
  sheetDescription?: string;
  panelContent: JSX.Element;
  sheetCloseButton?: JSX.Element;
  side: "top" | "bottom" | "left" | "right";
  showPanel: React.Dispatch<boolean>;
  isPanelOpen?: boolean;
}
