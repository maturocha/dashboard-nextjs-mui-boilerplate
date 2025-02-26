import { AlertColor } from "@mui/material";

// Asegúrate de que este enum esté definido en tu archivo de tipos
export enum ModalType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  CONFIRM = 'CONFIRM'
}

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export type AppContextType = {
  modal: ModalState;
  openModal: (type: ModalState["type"], title: string, message: string, onConfirm?: () => void) => void;
  closeModal: () => void;
  showToast: (message: string, severity?: AlertColor) => void;
};
  