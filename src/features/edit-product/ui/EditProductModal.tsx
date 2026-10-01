import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { productFetchById, productPut } from "../../api/productManagerApi";
import type { ProductType } from "../../../types/types";
import type { SetBox } from "../../../types/SetBoxType";
import { toastMessages, useToast, useToastMessageByStatus } from "../../../shared/lib";
import styles from "./EditProductModal.module.scss";

type EditProductModalProps = {
  productId: number | null;
  open: boolean;
  onClose: () => void;
};

const emptyValues: ProductType = {
  title: "",
  desc: "",
  set: null,
  image: "",
  price: "",
};

export function EditProductModal({ productId, open, onClose }: EditProductModalProps) {
  const toast = useToast();
  const getToastMessage = useToastMessageByStatus();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ProductType>(emptyValues);
  const [hasSet, setHasSet] = useState(false);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productFetchById(productId as number),
    enabled: open && Boolean(productId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!productQuery.data) {
      return;
    }

    setValues({
      id: productQuery.data.id,
      title: productQuery.data.title ?? "",
      desc: productQuery.data.desc ?? "",
      set: productQuery.data.set ?? null,
      image: productQuery.data.image ?? "",
      price: productQuery.data.price ?? "",
    });
    setHasSet(Boolean(productQuery.data.set));
  }, [productQuery.data]);

  const mutation = useMutation({
    mutationFn: () => {
      if (!productId) {
        throw new Error("Product id is required");
      }

      return productPut(productId, {
        title: values.title,
        desc: values.desc,
        set: hasSet ? values.set : null,
        image: values.image,
        price: values.price,
      });
    },
    onSuccess: () => {
      toast.success(toastMessages.updated ?? "Продукт обновлен");
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

  const handleValueChange = (field: keyof ProductType, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSetChange = (field: keyof SetBox, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      set: {
        title: currentValues.set?.title ?? "",
        box: currentValues.set?.box ?? "",
        [field]: value,
      },
    }));
  };

  const handleSetToggle = (checked: boolean) => {
    setHasSet(checked);

    if (checked) {
      setValues((currentValues) => ({
        ...currentValues,
        set: currentValues.set ?? { title: "", box: "" },
      }));
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      set: null,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.title.trim() || !values.price.trim()) {
      toast.warning("Заполните название и цену");
      return;
    }

    mutation.mutate();
  };

  const isLoading = productQuery.isLoading || productQuery.isFetching;
  const isDisabled = isLoading || mutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form className={styles.modal} onSubmit={handleSubmit}>
        <DialogTitle className={styles.modal__title}>Редактировать продукт</DialogTitle>

        <DialogContent className={styles.modal__content}>
          {isLoading && (
            <div className={styles.modal__loading}>
              <CircularProgress size={28} />
            </div>
          )}

          {productQuery.isError && (
            <Alert severity="error">Не удалось загрузить продукт для редактирования</Alert>
          )}

          {!isLoading && !productQuery.isError && (
            <div className={styles.modal__grid}>
              <div className={styles.modal__main}>
                <TextField
                  label="Название"
                  value={values.title}
                  onChange={(event) => handleValueChange("title", event.target.value)}
                  required
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Описание"
                  value={values.desc ?? ""}
                  onChange={(event) => handleValueChange("desc", event.target.value)}
                  multiline
                  minRows={4}
                  fullWidth
                />

                <TextField
                  label="Ссылка на фото"
                  value={values.image ?? ""}
                  onChange={(event) => handleValueChange("image", event.target.value)}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Цена"
                  value={values.price}
                  onChange={(event) => handleValueChange("price", event.target.value)}
                  required
                  fullWidth
                  size="small"
                  type="number"
                />
              </div>

              <div className={styles.modal__side}>
                <div className={styles.modal__preview}>
                  {values.image ? (
                    <img src={values.image} alt={values.title} />
                  ) : (
                    <span>Нет фото</span>
                  )}
                </div>

                <div className={styles.modal__setHeader}>
                  <span>Комплектация</span>
                  <Switch
                    checked={hasSet}
                    onChange={(event) => handleSetToggle(event.target.checked)}
                    slotProps={{ input: { "aria-label": "Комплектация" } }}
                  />
                </div>

                {hasSet && (
                  <div className={styles.modal__setFields}>
                    <TextField
                      label="Название комплекта"
                      value={values.set?.title ?? ""}
                      onChange={(event) => handleSetChange("title", event.target.value)}
                      fullWidth
                      size="small"
                    />

                    <TextField
                      label="Количество"
                      value={values.set?.box ?? ""}
                      onChange={(event) => handleSetChange("box", event.target.value)}
                      fullWidth
                      size="small"
                      type="number"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions className={styles.modal__actions}>
          <Button type="button" onClick={onClose} disabled={mutation.isPending} startIcon={<CloseIcon />}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isDisabled || productQuery.isError} startIcon={<SaveIcon />}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
