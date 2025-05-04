"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useAppContext } from "@/context/AppContext";
import { ModalType } from "@/types/app";
import CustomButton from "./CustomButton";

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
            <CustomButton
              label="Cancelar"
              onClick={closeModal} 
              variant="outlined" 
              color="primary"
            />
            <CustomButton 
              label="Confirmar"
              onClick={handleConfirm} 
              variant="contained" 
              color="primary" 
              autoFocus
            />
          </>
        ) : (
          <CustomButton 
            label="Cerrar"
            onClick={closeModal} 
            variant="contained" 
            color="primary" 
            autoFocus
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
