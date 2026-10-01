import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { productDelete } from "../../api/productManagerApi";
import { toastMessages, useToast, useToastMessageByStatus } from "../../../shared/lib";
import type { ProductType } from "../../../types/types";
import styles from "./DeleteProductModal.module.scss";

type DeleteProductModalProps = {
  product: ProductType | null;
  open: boolean;
  onClose: () => void;
};

export function DeleteProductModal({ product, open, onClose }: DeleteProductModalProps) {
  const toast = useToast();
  const getToastMessage = useToastMessageByStatus();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (!product?.id) {
        throw new Error("Product id is required");
      }

      return productDelete(product.id);
    },
    onSuccess: () => {
      toast.success(toastMessages.deleted);
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      onClose();
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { status?: number }, date?: { message?: string } };

      if (apiError?.response?.status) {
        toast.error(getToastMessage(apiError.response.status));
        return;
      }

      if (apiError?.date?.message) {
        toast.error(apiError.date.message);
        return;
      }

      toast.error(toastMessages.error);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <div className={styles.modal}>
        <DialogTitle className={styles.modal__title}>Удалить продукт?</DialogTitle>

        <DialogContent className={styles.modal__content}>
          <p>
            Вы действительно хотите удалить
            {" "}
            <strong>{product?.title}</strong>
            ?
          </p>
        </DialogContent>

        <DialogActions className={styles.modal__actions}>
          <Button type="button" onClick={onClose} disabled={mutation.isPending} startIcon={<CloseIcon />}>
            Отмена
          </Button>
          <Button
            type="button"
            color="error"
            variant="contained"
            disabled={mutation.isPending || !product?.id}
            onClick={() => mutation.mutate()}
            startIcon={<DeleteIcon />}
          >
            Удалить
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
