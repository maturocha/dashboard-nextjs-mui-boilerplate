"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from "@mui/material";
import { useAppContext } from "@/context/AppContext";
import { ModalType } from "@/types/app";

export default function GlobalModal() {
  const { modal, closeModal } = useAppContext();

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    closeModal();
  };

  return (
    <Dialog 
      open={modal.isOpen} 
      onClose={closeModal}
      PaperProps={{
        elevation: 3
      }}
    >
      <DialogTitle sx={{ color: 'primary.main' }}>{modal.title}</DialogTitle>
      <DialogContent>
        {modal.message}
      </DialogContent>
      <DialogActions>
        {modal.type === ModalType.CONFIRM ? (
          <>
            <Button 
              onClick={closeModal} 
              variant="outlined" 
              color="primary"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              variant="contained" 
              color="primary" 
              autoFocus
            >
              Confirmar
            </Button>
          </>
        ) : (
          <Button 
            onClick={closeModal} 
            variant="contained" 
            color="primary" 
            autoFocus
          >
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
