export interface PromptModalProps {
  isModalOpen: boolean;
  showModal: () => void;
  modalTitle: string;
  handlePrimaryAction?: () => void;
  handleCloseModalAction?: () => void;
  showLogo?: boolean;
  primaryBtnText?: string;
  closeBtnText?: string;
  modalDescription?: string;
  customModalElement?: JSX.Element;
  isPrimaryBtnLoading?: boolean;
}
