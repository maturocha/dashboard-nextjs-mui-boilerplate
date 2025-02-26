"use client";
import { AppContextType, ModalState, ModalType } from "@/types/app";
import { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";
import { AlertColor } from '@mui/material';

// Crear el contexto con el tipo correcto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook personalizado
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
};

// Propiedades del Provider
interface AppProviderProps {
  children: ReactNode;
}

// Proveedor del Contexto
export function AppProvider({ children }: AppProviderProps) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: ModalType.INFO,
    title: "",
    message: "",
  });

  // Nuevo estado para el toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as AlertColor,
  });

  const openModal = (
    type: ModalState["type"],
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: ModalType.INFO,
      title: "",
      message: "",
    });
  };

  const showToast = (message: string, severity: AlertColor = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <AppContext.Provider value={{ 
      modal, 
      openModal, 
      closeModal,
      showToast,
    }}>
      {children}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={2500} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}
