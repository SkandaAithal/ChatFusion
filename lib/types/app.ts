export interface AppContextProps {
  isMobile: boolean;
  isClient: boolean;
  isAuthLoading: boolean;
  setIsAuthLoading: React.Dispatch<boolean>;
}
