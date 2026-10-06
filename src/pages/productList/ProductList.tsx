import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { productPut } from "../../features/api/productManagerApi";
import { toastMessages, useToast } from "../../shared/lib";
import type { ProductType } from "../../types/types";
import { ProductCardsList } from "./ProductCardsList";
import styles from "./ProductList.module.scss";

export default function ProductList() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState("1");

  const quantityMutation = useMutation({
    mutationFn: () => {
      if (!selectedProduct?.id) {
        throw new Error("Product id is required");
      }

      const amount = Number(quantityToAdd);
      const currentQuantity = selectedProduct.quantity ?? { alls: 0, rentals: 0 };

      return productPut(selectedProduct.id, {
        ...selectedProduct,
        quantity: {
          alls: currentQuantity.alls + amount,
          rentals: currentQuantity.rentals,
        },
      });
    },
    onSuccess: () => {
      toast.success(toastMessages.updated ?? "Количество обновлено");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      handleCloseQuantityDialog();
    },
    onError: () => {
      toast.error(toastMessages.error);
    },
  });

  const handleOpenQuantityDialog = (product: ProductType) => {
    setSelectedProduct(product);
    setQuantityToAdd("1");
  };

  const handleCloseQuantityDialog = () => {
    setSelectedProduct(null);
    setQuantityToAdd("1");
  };

  const handleAddQuantity = () => {
    const amount = Number(quantityToAdd);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.warning("Введите количество больше нуля");
      return;
    }

    quantityMutation.mutate();
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Каталог</span>
          <h1 className={styles.title}>Список материалов</h1>
          <p className={styles.subtitle}>
            Быстрый просмотр материалов, цен и доступного количества. Найдите нужную
            позицию по названию и пополните склад прямо из карточки.
          </p>
        </div>

        <div className={styles.searchPanel}>
          <label className={styles.searchLabel} htmlFor="product-search">
            Поиск по названию
          </label>
          <TextField
            className={styles.searchInput}
            id="product-search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Например: леса"
            size="small"
            slotProps={{
              input: {
                startAdornment: <SearchIcon fontSize="small" />,
              },
            }}
          />
        </div>
      </header>

      <div className={styles.content}>
        <ProductCardsList
          searchQuery={searchQuery}
          onAddQuantity={handleOpenQuantityDialog}
        />
      </div>

      <Dialog
        open={selectedProduct !== null}
        onClose={handleCloseQuantityDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Добавить количество</DialogTitle>
        <DialogContent>
          <div className={styles.quantityDialog}>
            {selectedProduct && (
              <div className={styles.quantityProduct}>
                <img
                  src={selectedProduct.image || "/favicon.svg"}
                  alt={selectedProduct.title}
                />
                <div>
                  <h3>{selectedProduct.title}</h3>
                  <span>Сейчас: {selectedProduct.quantity?.alls ?? 0} шт.</span>
                </div>
              </div>
            )}

            <TextField
              label="Количество"
              value={quantityToAdd}
              onChange={(event) => setQuantityToAdd(event.target.value)}
              type="number"
              fullWidth
              size="small"
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={handleCloseQuantityDialog}
            disabled={quantityMutation.isPending}
            startIcon={<CloseIcon />}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleAddQuantity}
            disabled={quantityMutation.isPending}
            startIcon={<AddIcon />}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
