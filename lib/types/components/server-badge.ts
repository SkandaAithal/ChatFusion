export interface ServerBadgeProps {
  isCreateServer?: boolean;
  handleClick?: () => void;
  className?: string;
  icon?: JSX.Element;
  serverImage?: string;
  lazyLoadServerImage?: boolean;
}
